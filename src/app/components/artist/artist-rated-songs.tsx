import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TopSongsTableFallback } from '@/app/components/fallbacks/table-fallbacks'
import { DataTable } from '@/app/components/ui/data-table'
import { useGetArtistRatedSongs } from '@/app/hooks/use-artist'
import { songsColumns } from '@/app/tables/songs-columns'
import { ROUTES } from '@/routes/routesList'
import { useAppPages } from '@/store/app.store'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { IArtist } from '@/types/responses/artist'

interface RatedSongsProps {
  artist: IArtist
}

export default function ArtistRatedSongs({ artist }: RatedSongsProps) {
  const { t } = useTranslation()
  const { setSongList } = usePlayerActions()
  const { hideRating } = useAppPages()
  const { id, name } = artist
  const { data, isLoading } = useGetArtistRatedSongs(id)

  if (isLoading) return <TopSongsTableFallback />

  const ratedSongs = data?.songs ?? []
  if (ratedSongs.length === 0) return null

  const columns = songsColumns(hideRating)
  const topTenSongs =
    ratedSongs.length > 10 ? ratedSongs.slice(0, 10) : ratedSongs

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'album',
    'year',
    'duration',
    'playCount',
    'played',
    'contentType',
    'userRating',
    'select',
  ]

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t('artist.ratedSongs')}
        </h3>

        <Link
          to={ROUTES.SONGS.ARTIST_RATED_TRACKS(id, name)}
          className="h-full"
          data-testid="view-all-rated-tracks-link"
        >
          <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
            {t('generic.viewAll')}
          </p>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={topTenSongs}
        handlePlaySong={(row) => setSongList(topTenSongs, row.index)}
        columnFilter={columnsToShow}
        variant="modern"
      />
    </div>
  )
}
