import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ArtistSongs from '@/app/components/artist/artist-songs'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { ROUTES } from '@/routes/routesList'
import { useAppPages } from '@/store/app.store'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'

enum SongsTab {
  Top = 'top',
  Rated = 'rated',
}

const triggerStyles =
  'px-0 py-0 scroll-m-20 text-2xl font-semibold tracking-tight text-muted-foreground hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none'

interface ArtistSongsTabsProps {
  topSongs?: ISong[]
  ratedSongs?: ISong[]
  artist: IArtist
}

export default function ArtistSongsTabs({
  topSongs,
  ratedSongs,
  artist,
}: ArtistSongsTabsProps) {
  const { t } = useTranslation()
  const { hideRating } = useAppPages()
  const [tab, setTab] = useState<SongsTab>(SongsTab.Rated)
  const { id, name } = artist

  const hasTopSongs = !!topSongs && topSongs.length > 0
  const hasRatedSongs = !hideRating && !!ratedSongs && ratedSongs.length > 0

  if ( !hasRatedSongs && !hasTopSongs )
    return null;

  const activeTab = hasRatedSongs ? tab : SongsTab.Top
  const viewAllRoute =
    activeTab === SongsTab.Top
      ? ROUTES.SONGS.ARTIST_TOP_TRACKS(id, name)
      : ROUTES.SONGS.ARTIST_RATED_TRACKS(id, name)

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setTab(value as SongsTab)}
      className="w-full mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <TabsList className="h-auto p-0 gap-6 bg-transparent">
          {hasRatedSongs && (
          <TabsTrigger value={SongsTab.Rated} className={triggerStyles}>
            {t('artist.ratedSongs')}
          </TabsTrigger>
          )}
          {hasTopSongs && (
            <TabsTrigger value={SongsTab.Top} className={triggerStyles}>
              {t('artist.topSongs')}
            </TabsTrigger>
          )}
        </TabsList>

        <Link
          to={viewAllRoute}
          className="h-full"
          data-testid="view-all-tracks-link"
        >
          <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
            {t('generic.viewAll')}
          </p>
        </Link>
      </div>

      {hasRatedSongs && (
      <TabsContent value={SongsTab.Rated} className="mt-0">
        <ArtistSongs songs={ratedSongs} artist={artist} />
      </TabsContent>
      )}
      {hasTopSongs && (
        <TabsContent value={SongsTab.Top} className="mt-0">
          <ArtistSongs songs={topSongs} artist={artist} />
        </TabsContent>
      )}
    </Tabs>
  )
}
