import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { useAppPages } from '@/store/app.store'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { IArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'

interface SongsProps {
  songs: ISong[]
  artist: IArtist
  caption?: string
  viewAllRoute?: string,
  maxSongs?: number
}

export default function ArtistSongs({ songs, artist, caption, viewAllRoute, maxSongs = 10 }: SongsProps) {
  const { t } = useTranslation()
  const { setSongList } = usePlayerActions()
  const { hideRating } = useAppPages()
  const columns = songsColumns(hideRating)
  const limitedSongs = songs.length > maxSongs ? songs.slice(0, maxSongs) : songs

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
        { !!caption && (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {caption}
        </h3>
        )}

        { !!viewAllRoute && (
        <Link
          to={viewAllRoute}
          className="h-full"
          data-testid="view-all-tracks-link"
        >
          <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
            {t('generic.viewAll')}
          </p>
        </Link>
        )}
      </div>

      <DataTable
        columns={columns}
        data={limitedSongs}
        handlePlaySong={(row) => setSongList(limitedSongs, row.index)}
        columnFilter={columnsToShow}
        variant="modern"
      />
    </div>
  )
}
