import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/utils/queryKeys'

export function useRefreshSongLists() {
  const queryClient = useQueryClient()

  const refreshSongLists = () => {
    const songListKeys = [
      queryKeys.song.all,
      queryKeys.favorites.songs,
      queryKeys.album.single,
      queryKeys.playlist.single,
      queryKeys.artist.topSongs,
    ]

    songListKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    })
  }

  return { refreshSongLists }
}
