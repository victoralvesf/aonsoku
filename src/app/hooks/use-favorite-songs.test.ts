import { describe, expect, it } from 'vitest'
import type { ISong } from '@/types/responses/song'
import { buildArtistIdIndex, lookupSongsByArtist } from './use-favorite-songs'

function song(partial: Partial<ISong> & Pick<ISong, 'id'>): ISong {
  return {
    id: partial.id,
    artist: partial.artist ?? '',
    artistId: partial.artistId,
    title: partial.title ?? '',
    album: partial.album ?? '',
    parent: '',
    isDir: false,
    track: 0,
    year: 0,
    coverArt: '',
    size: 0,
    contentType: '',
    suffix: '',
    duration: 0,
    bitRate: 0,
    path: '',
    discNumber: 0,
    created: '',
    albumId: '',
    type: '',
    isVideo: false,
    bpm: 0,
    starred: undefined,
    comment: '',
    sortName: '',
    mediaType: '',
    musicBrainzId: '',
    genres: [],
    replayGain: { trackGain: 0, trackPeak: 0, albumGain: 0, albumPeak: 0 },
  }
}

const radiohead = (id: string): ISong =>
  song({ id, artist: 'Radiohead', artistId: 'ar-1', title: `RH-${id}` })
const muse = (id: string): ISong =>
  song({ id, artist: 'Muse', artistId: 'ar-2', title: `Muse-${id}` })
const noId = (id: string, name = 'VARIOUS'): ISong =>
  song({ id, artist: name, artistId: undefined })

describe('buildArtistIdIndex', () => {
  it('returns an empty map for an empty input', () => {
    const index = buildArtistIdIndex([])
    expect(index.size).toBe(0)
  })

  it('groups multiple songs under the same artistId in insertion order', () => {
    const songs = [radiohead('1'), radiohead('2'), radiohead('3')]
    const index = buildArtistIdIndex(songs)
    expect(index.size).toBe(1)
    expect(index.get('ar-1')).toEqual(songs)
    expect(index.get('ar-1')?.map((s) => s.id)).toEqual(['1', '2', '3'])
  })

  it('keeps different artistIds in distinct buckets', () => {
    const songs = [radiohead('1'), muse('2'), radiohead('3'), muse('4')]
    const index = buildArtistIdIndex(songs)
    expect(index.size).toBe(2)
    expect(index.get('ar-1')?.map((s) => s.id)).toEqual(['1', '3'])
    expect(index.get('ar-2')?.map((s) => s.id)).toEqual(['2', '4'])
  })

  it('skips songs without an artistId', () => {
    const songs = [radiohead('1'), noId('9'), muse('2')]
    const index = buildArtistIdIndex(songs)
    expect(index.size).toBe(2)
    expect(index.get('ar-1')?.map((s) => s.id)).toEqual(['1'])
    expect(index.get('ar-2')?.map((s) => s.id)).toEqual(['2'])
  })

  it('does not mutate the input array', () => {
    const songs = [radiohead('1'), muse('2')]
    const snapshot = [...songs]
    buildArtistIdIndex(songs)
    expect(songs).toEqual(snapshot)
  })

  it('keeps duplicate entries as-is', () => {
    const shared = radiohead('1')
    const songs = [shared, radiohead('2'), shared]
    const index = buildArtistIdIndex(songs)
    expect(index.get('ar-1')?.length).toBe(3)
  })
})

describe('lookupSongsByArtist', () => {
  const songs: ISong[] = [
    radiohead('rh-1'),
    radiohead('rh-2'),
    muse('m-1'),
    noId('v-1', 'Various Artists'),
  ]
  const index = buildArtistIdIndex(songs)

  it('returns the full list when neither artistId nor artistName is given', () => {
    expect(lookupSongsByArtist(songs, index)).toBe(songs)
    expect(lookupSongsByArtist(songs, index, undefined, undefined)).toBe(songs)
  })

  it('returns the bucket for a matching artistId', () => {
    const found = lookupSongsByArtist(songs, index, 'ar-1')
    expect(found.map((s) => s.id)).toEqual(['rh-1', 'rh-2'])
  })

  it('returns an empty array for an unknown artistId with no name fallback', () => {
    expect(lookupSongsByArtist(songs, index, 'ar-does-not-exist')).toEqual([])
  })

  it('falls back to the name when the artistId bucket is empty', () => {
    const found = lookupSongsByArtist(songs, index, 'ar-9', 'Various Artists')
    expect(found.map((s) => s.id)).toEqual(['v-1'])
  })

  it('uses the name alone when only artistName is given', () => {
    const found = lookupSongsByArtist(songs, index, undefined, 'Muse')
    expect(found.map((s) => s.id)).toEqual(['m-1'])
  })

  it('matches names case-insensitively', () => {
    expect(
      lookupSongsByArtist(songs, index, undefined, 'radioHEAD').map(
        (s) => s.id,
      ),
    ).toEqual(['rh-1', 'rh-2'])
  })

  it('matches names ignoring surrounding whitespace', () => {
    expect(
      lookupSongsByArtist(songs, index, undefined, '  Muse  ').map((s) => s.id),
    ).toEqual(['m-1'])
  })

  it('does not match when the name is close-but-wrong', () => {
    expect(lookupSongsByArtist(songs, index, undefined, 'Muse X')).toEqual([])
  })

  it('treats empty-string id and name as "no filter"', () => {
    expect(lookupSongsByArtist(songs, index, '', '')).toBe(songs)
  })

  it('adds name matches without an artistId to the artistId matches', () => {
    const list = [
      radiohead('rh-1'),
      noId('rh-x', 'Radiohead'),
      radiohead('rh-2'),
    ]
    const found = lookupSongsByArtist(
      list,
      buildArtistIdIndex(list),
      'ar-1',
      'Radiohead',
    )
    expect(found.map((s) => s.id)).toEqual(['rh-1', 'rh-x', 'rh-2'])
  })

  it('never matches a namesake artist that has a different artistId', () => {
    const namesake = song({
      id: 'other',
      artist: 'Radiohead',
      artistId: 'ar-7',
    })
    const list = [radiohead('rh-1'), namesake]
    const found = lookupSongsByArtist(
      list,
      buildArtistIdIndex(list),
      'ar-1',
      'Radiohead',
    )
    expect(found.map((s) => s.id)).toEqual(['rh-1'])
  })

  it('returns an empty array when the artist has no songs, even with a namesake', () => {
    const namesake = song({
      id: 'other',
      artist: 'Radiohead',
      artistId: 'ar-7',
    })
    const list = [namesake]
    expect(
      lookupSongsByArtist(list, buildArtistIdIndex(list), 'ar-1', 'Radiohead'),
    ).toEqual([])
  })

  it('does not mutate the index map', () => {
    const snapshot = new Map(index)
    lookupSongsByArtist(songs, index, 'ar-1')
    expect(index).toEqual(snapshot)
  })
})
