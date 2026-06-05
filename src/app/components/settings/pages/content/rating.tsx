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
import { useAppPages } from '@/store/app.store'

const hideRatingEnv = window.HIDE_RATING ?? false

export function RatingContent() {
  const { t } = useTranslation()
  const { hideRating, setHideRating } = useAppPages()

  return (
    <Root>
      <Header>
        <HeaderTitle>{t('settings.content.rating.group')}</HeaderTitle>
        <HeaderDescription>
          {t('settings.content.rating.description')}
        </HeaderDescription>
      </Header>
      <Content>
        <ContentItem>
          <ContentItemTitle info={t('settings.content.rating.show.info')}>
            {t('settings.content.rating.show.label')}
          </ContentItemTitle>
          <ContentItemForm>
            <Switch
              checked={!hideRating}
              onCheckedChange={(val) => setHideRating(!val)}
              disabled={hideRatingEnv}
            />
          </ContentItemForm>
        </ContentItem>
      </Content>
      <ContentSeparator />
    </Root>
  )
}
