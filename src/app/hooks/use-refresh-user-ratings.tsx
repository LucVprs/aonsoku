import { useRefreshSongLists } from '@/app/hooks/use-refresh-song-lists'

export function useRefreshUserRatings() {
  const { refreshSongLists } = useRefreshSongLists()

  const refreshUserRatings = () => {
    refreshSongLists()
  }

  return { refreshUserRatings }
}
