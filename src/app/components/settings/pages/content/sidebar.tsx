import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  type Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVerticalIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Content,
  ContentItem,
  ContentItemForm,
  ContentItemTitle,
  ContentSeparator,
  Header,
  HeaderDescription,
  HeaderTitle,
  Root,
} from '@/app/components/settings/section'
import { Switch } from '@/app/components/ui/switch'
import {
  applyVisibleSectionsOrder,
  orderLibraryItems,
  SidebarItems,
} from '@/app/layout/sidebar'
import { cn } from '@/lib/utils'
import { useAppPages, useAppStore } from '@/store/app.store'

const hideArtistsSectionConfig = window.HIDE_ARTISTS_SECTION ?? false
const hideSongsSectionConfig = window.HIDE_SONGS_SECTION ?? false
const hideAlbumsSectionConfig = window.HIDE_ALBUMS_SECTION ?? false
const hideGenresSectionConfig = window.HIDE_GENRES_SECTION ?? false
const hideRadiosSectionConfig = window.HIDE_RADIOS_SECTION ?? false

// Keep the drag preview constrained to the vertical axis.
const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
})

interface SectionToggle {
  checked: boolean
  onChange: (value: boolean) => void
  disabled: boolean
}

interface SortableSectionRowProps {
  id: string
  title: string
  toggle?: SectionToggle
}

function SortableSectionRow({ id, title, toggle }: SortableSectionRowProps) {
  const { t } = useTranslation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-md',
        isDragging && 'relative z-10 bg-accent/60 shadow-sm',
      )}
    >
      <ContentItem>
        <ContentItemTitle>{t(title)}</ContentItemTitle>
        <ContentItemForm className="gap-2">
          {toggle && (
            <Switch
              checked={toggle.checked}
              onCheckedChange={toggle.onChange}
              disabled={toggle.disabled}
            />
          )}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground cursor-grab touch-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            aria-label={t('settings.content.sidebar.reorder')}
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="h-4 w-4" />
          </button>
        </ContentItemForm>
      </ContentItem>
    </div>
  )
}

export function SidebarContent() {
  const { t } = useTranslation()
  const {
    hideArtistsSection,
    setHideArtistsSection,
    hideSongsSection,
    setHideSongsSection,
    hideAlbumsSection,
    setHideAlbumsSection,
    hideGenresSection,
    setHideGenresSection,
    hideRadiosSection,
    setHideRadiosSection,
    hideFavoritesSection,
    hidePlaylistsSection,
    librarySectionsOrder,
    setLibrarySectionsOrder,
  } = useAppPages()
  const isPodcastsActive = useAppStore().podcasts.active

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Only these sections expose a hide switch here. The others are managed
  // elsewhere (Favorites/Playlists in Features, Podcasts in the integration).
  const toggles: Partial<Record<SidebarItems, SectionToggle>> = {
    [SidebarItems.Artists]: {
      checked: !hideArtistsSection,
      onChange: (value) => setHideArtistsSection(!value),
      disabled: hideArtistsSectionConfig,
    },
    [SidebarItems.Songs]: {
      checked: !hideSongsSection,
      onChange: (value) => setHideSongsSection(!value),
      disabled: hideSongsSectionConfig,
    },
    [SidebarItems.Albums]: {
      checked: !hideAlbumsSection,
      onChange: (value) => setHideAlbumsSection(!value),
      disabled: hideAlbumsSectionConfig,
    },
    [SidebarItems.Genres]: {
      checked: !hideGenresSection,
      onChange: (value) => setHideGenresSection(!value),
      disabled: hideGenresSectionConfig,
    },
    [SidebarItems.Radios]: {
      checked: !hideRadiosSection,
      onChange: (value) => setHideRadiosSection(!value),
      disabled: hideRadiosSectionConfig,
    },
  }

  // A section is listed (and thus reorderable) when it can appear in the
  // sidebar. Sections with a toggle are always listed so they can be toggled
  // back on; the optional ones only show up when their feature is enabled.
  function isListed(id: string) {
    if (id === SidebarItems.Favorites) return !hideFavoritesSection
    if (id === SidebarItems.Playlists) return !hidePlaylistsSection
    if (id === SidebarItems.Podcasts) return isPodcastsActive
    return Boolean(toggles[id as SidebarItems])
  }

  const orderedItems = orderLibraryItems(librarySectionsOrder)
  const items = orderedItems.filter((item) => isListed(item.id))
  const itemIds = items.map((item) => item.id)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = itemIds.indexOf(active.id as string)
    const newIndex = itemIds.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(itemIds, oldIndex, newIndex)
    const fullOrder = orderedItems.map((item) => item.id)

    setLibrarySectionsOrder(applyVisibleSectionsOrder(fullOrder, reordered))
  }

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.sidebar.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.sidebar.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableSectionRow
                key={item.id}
                id={item.id}
                title={item.title}
                toggle={toggles[item.id as SidebarItems]}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
