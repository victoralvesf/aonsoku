export const english = {
  translation: {
    home: {
      recentlyPlayed: 'Recently played',
      mostPlayed: 'Most played',
      recentlyAdded: 'Recently added',
      explore: 'Explore',
    },
    sidebar: {
      home: 'Home',
      search: 'Search...',
      library: 'Library',
      artists: 'Artists',
      songs: 'Songs',
      albums: 'Albums',
      playlists: 'Playlists',
      radios: 'Radios',
      emptyPlaylist: 'No playlists created yet',
    },
    menu: {
      language: 'Language',
      server: 'Server',
      serverLogout: 'Logout',
    },
    generic: {
      seeMore: 'See more',
    },
    theme: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    playlist: {
      headline: 'Playlist',
      songCount_zero: '{{count}} songs',
      songCount_one: '{{count}} song',
      songCount_other: '{{count}} songs',
      duration: 'about {{duration}}',
      refresh: 'Refresh playlists',
      buttons: {
        play: 'Play {{name}}',
        shuffle: 'Play {{name}} in shuffle mode',
        options: 'More options for {{name}}',
      },
      noSongList: 'This playlist does not have any songs!',
      removeDialog: {
        title: 'Are you sure you want to delete this playlist?',
        description: 'This action cannot be undone.',
        toast: {
          success: 'Playlist removed successfully!',
          error: 'Failed to remove playlist!',
        },
      },
      createDialog: {
        title: 'Create a new playlist',
        nameLabel: 'Name',
        commentLabel: 'Comment',
        isPublicLabel: 'Public',
        saveButton: 'Create',
        toast: {
          success: 'Playlist created successfully!',
          error: 'Failed to create playlist!',
        },
      },
    },
    album: {
      headline: 'Album',
      buttons: {
        like: 'Like {{name}}',
        dislike: 'Remove like from {{name}}',
      },
      info: {
        about: 'About {{name}}',
        lastfm: 'Open in Last.fm',
        musicbrainz: 'Open in MusicBrainz',
      },
      more: {
        listTitle: 'More from this artist',
        discography: 'Artist Discography',
        genreTitle: 'More from {{genre}}',
      },
      list: {
        filter: {
          artist: 'Artist',
          genre: 'Genre',
          highest: 'Highest',
          favorites: 'Favorites',
          mostPlayed: 'Most Played',
          name: 'Name',
          random: 'Random',
          recentlyAdded: 'Recently Added',
          recentlyPlayed: 'Recently Played',
          releaseYear: 'Release Year',
        },
      },
    },
    artist: {
      headline: 'Artist',
      buttons: {
        play: 'Play {{artist}} radio',
        shuffle: 'Play {{artist}} radio in shuffle mode',
        options: 'More options for {{artist}}',
      },
      info: {
        albumsCount_zero: '{{count}} albums',
        albumsCount_one: '{{count}} album',
        albumsCount_other: '{{count}} albums',
      },
      topSongs: 'Top songs',
      recentAlbums: 'Recent albums',
      relatedArtists: 'Related artists',
    },
    table: {
      columns: {
        title: 'Title',
        artist: 'Artist',
        album: 'Album',
        year: 'Year',
        duration: 'Duration',
        plays: 'Plays',
        lastPlayed: 'Last played',
        bpm: 'BPM',
        bitrate: 'Bitrate',
        quality: 'Quality',
        name: 'Name',
        albumCount: 'Album count',
      },
      buttons: {
        play: 'Play {{title}} by {{artist}}',
        pause: 'Pause {{title}} by {{artist}}',
      },
      lastPlayed: '{{date}} ago',
      pagination: {
        rowsPerPage: 'Rows per page',
        currentPage: 'Page {{currentPage}} of {{totalPages}}',
        screenReader: {
          firstPage: 'Go to first page',
          previousPage: 'Go to previous page',
          nextPage: 'Go to next page',
          lastPage: 'Go to last page',
        },
      },
    },
    fullscreen: {
      noLyrics: 'No lyrics found',
      queue: 'Queue',
      lyrics: 'Lyrics',
      switchButton: 'Switch to Fullscreen',
    },
    logout: {
      dialog: {
        title: 'Ready to say goodbye for now?',
        description: 'Confirm to logout.',
        cancel: 'Cancel',
        confirm: 'Continue',
      },
    },
    login: {
      form: {
        server: 'Server',
        description: 'Connect to your Subsonic Server.',
        url: 'URL',
        urlPlaceholder: 'Your server URL',
        username: 'Username',
        usernamePlaceholder: 'Your username',
        password: 'Password',
        connect: 'Connect',
      },
    },
    toast: {
      server: {
        success: 'Server was saved successfully!',
        error: 'Server communication failed!',
      },
    },
    command: {
      inputPlaceholder: 'Search for an album, artist or song',
      noResults: 'No results found.',
      commands: {
        heading: 'Commands',
        pages: 'Go to page',
        theme: 'Change theme',
      },
      pages: 'Pages',
    },
    player: {
      noSongPlaying: 'No song playing',
      noRadioPlaying: 'No radio playing',
    },
    options: {
      playNext: 'Play next',
      addLast: 'Add last',
      download: 'Download',
      playlist: {
        edit: 'Edit playlist',
        delete: 'Delete playlist',
      },
    },
    radios: {
      label: 'Radio',
      addRadio: 'Add Radio',
      table: {
        name: 'Name',
        homepage: 'Homepage URL',
        stream: 'Stream URL',
        actions: {
          edit: 'Edit radio',
          delete: 'Delete radio',
        },
        playTooltip: 'Play {{name}} radio',
        pauseTooltip: 'Pause {{name}} radio',
      },
      form: {
        create: {
          title: 'Add Radio',
          button: 'Save',
          toast: {
            success: 'Radio created successfully!',
            error: 'Failed to create radio!',
          },
        },
        edit: {
          title: 'Edit Radio',
          button: 'Update',
          toast: {
            success: 'Radio updated successfully!',
            error: 'Failed to update radio!',
          },
        },
        delete: {
          title: 'Are you sure you want to delete this radio station?',
          description: 'This action cannot be undone.',
          toast: {
            success: 'Radio removed successfully!',
            error: 'Failed to remove radio!',
          },
        },
      },
    },
    dayjs: {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: '1 minute',
        mm: '%d minutes',
        h: '1 hour',
        hh: '%d hours',
        d: '1 day',
        dd: '%d days',
        M: '1 month',
        MM: '%d months',
        y: '1 year',
        yy: '%d years',
      },
    },
  },
}
