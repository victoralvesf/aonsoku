import { subsonic } from "@/service/subsonic";

export function useSongList() {
  async function getArtistSongCount(id: string) {
    const response = await subsonic.artists.getOne(id);
    let count = 0

    if (!response) return count

    response.album.forEach(item => {
      count += item.songCount
    })

    return count
  }

  async function getArtistAllSongs(name: string, id: string) {
    const artistSongCount = await getArtistSongCount(id)

    const response = await subsonic.search.get({
      query: name,
      songCount: artistSongCount,
      albumCount: 0,
      artistCount: 0
    })

    if (response?.song) return response.song
  }

  async function getAlbumSongs(albumId: string) {
    const songs = await subsonic.albums.getOne(albumId)

    if (songs?.song) return songs.song
  }

  return {
    getArtistSongCount,
    getArtistAllSongs,
    getAlbumSongs
  }
}