export const brazilianPortuguese = {
  translation: {
    home: {
      recentlyPlayed: 'Reproduzidos recentemente',
      mostPlayed: 'Mais reproduzidos',
      recentlyAdded: 'Adicionados recentemente',
      explore: 'Explorar',
    },
    sidebar: {
      home: 'Início',
      search: 'Pesquisar...',
      library: 'Biblioteca',
      artists: 'Artistas',
      songs: 'Músicas',
      albums: 'Álbuns',
      playlists: 'Playlists',
      radios: 'Rádios',
      emptyPlaylist: 'Nenhuma playlist criada ainda',
    },
    menu: {
      language: 'Linguagem',
      server: 'Servidor',
      serverLogout: 'Desconectar',
    },
    generic: {
      seeMore: 'Ver mais'
    },
    theme: {
      label: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      system: 'Sistema'
    },
    playlist: {
      headline: 'Playlist',
      songCount_zero: '{{count}} músicas',
      songCount_one: '{{count}} música',
      songCount_other: '{{count}} músicas',
      duration: 'cerca de {{duration}}',
      refresh: 'Atualizar playlists',
      buttons: {
        play: 'Tocar {{name}}',
        shuffle: 'Tocar {{name}} no modo aleatório',
        options: 'Mais opções para {{name}}',
      },
      noSongList: 'Esta playlist não possui nenhuma música!',
      removeDialog: {
        title: 'Você tem certeza de que deseja excluir esta playlist?',
        description: 'Essa ação não poderá ser desfeita.',
        toast: {
          success: 'Playlist excluída com sucesso!',
          error: 'Falha ao excluir esta playlist!'
        }
      },
      createDialog: {
        title: 'Criar uma playlist',
        nameLabel: 'Nome',
        commentLabel: 'Comentário',
        isPublicLabel: 'Pública',
        saveButton: 'Criar',
        toast: {
          success: 'Playlist criada com sucesso!',
          error: 'Falha ao criar a playlist!'
        }
      }
    },
    album: {
      headline: 'Álbum',
      buttons: {
        like: 'Curtir {{name}}',
        dislike: 'Remover curtida de {{name}}'
      },
      info: {
        about: 'Sobre {{name}}',
        lastfm: 'Abrir no Last.fm',
        musicbrainz: 'Abrir no MusicBrainz',
      },
      more: {
        listTitle: 'Mais deste artista',
        discography: 'Discografia do artista',
        genreTitle: 'Mais de {{genre}}',
      },
      list: {
        filter: {
          artist: 'Artista',
          genre: 'Gênero',
          highest: 'Mais altos',
          favorites: 'Favoritos',
          mostPlayed: 'Mais reproduzidos',
          name: 'Nome',
          random: 'Aleatório',
          recentlyAdded: 'Adicionados recentemente',
          recentlyPlayed: 'Reproduzidos recentemente',
          releaseYear: 'Ano de lançamento',
        }
      }
    },
    artist: {
      headline: 'Artista',
      buttons: {
        play: 'Tocar a rádio de {{artist}}',
        shuffle: 'Tocar a rádio de {{artist}} no modo aleatório',
        options: 'Mais opções para {{artist}}'
      },
      info: {
        albumsCount_zero: '{{count}} álbuns',
        albumsCount_one: '{{count}} álbum',
        albumsCount_other: '{{count}} álbuns',
      },
      topSongs: 'Músicas mais populares',
      recentAlbums: 'Álbuns recentes',
      relatedArtists: 'Artistas relacionados',
    },
    table: {
      columns: {
        title: 'Título',
        artist: 'Artista',
        album: 'Álbum',
        year: 'Ano',
        duration: 'Duração',
        plays: 'Reproduções',
        lastPlayed: 'Última reprodução',
        bpm: 'BPM',
        bitrate: 'Taxa de bits',
        quality: 'Qualidade',
      },
      buttons: {
        play: 'Tocar {{title}} por {{artist}}',
        pause: 'Pausar {{title}} por {{artist}}',
      },
      lastPlayed: '{{date}} atrás'
    },
    fullscreen: {
      noLyrics: 'Letra não encontrada',
      queue: 'Fila',
      lyrics: 'Letra',
      switchButton: 'Switch to Fullscreen',
    },
    logout: {
      dialog: {
        title: 'Pronto para se despedir por enquanto?',
        description: 'Confirme para se desconectar.',
        cancel: 'Cancelar',
        confirm: 'Continuar',
      }
    },
    login: {
      form: {
        server: 'Servidor',
        description: 'Conecte-se ao seu servidor Subsonic.',
        url: 'URL',
        urlPlaceholder: 'URL do seu servidor',
        username: 'Nome de usuário',
        usernamePlaceholder: 'Seu usuário',
        password: 'Senha',
        connect: 'Conectar',
      }
    },
    toast: {
      server: {
        success: 'Servidor foi salvo com sucesso!',
        error: 'Não foi possível se comunicar com o servidor!',
      }
    },
    command: {
      inputPlaceholder: 'Pesquisar por álbum, artista ou música',
      noResults: 'Nenhum resultado encontrado.',
      commands: {
        heading: 'Comandos',
        pages: 'Ir para página',
        theme: 'Mudar tema'
      },
      pages: 'Páginas',
    },
    player: {
      noSongPlaying: 'Nenhuma música tocando',
    },
    options: {
      playNext: 'Tocar a seguir',
      addLast: 'Adicionar ao final',
      download: 'Download',
      playlist: {
        edit: 'Editar playlist',
        delete: 'Excluir playlist'
      }
    },
    dayjs: {
      relativeTime: {
        future: 'em %s',
        past: '%s atrás',
        s: 'alguns segundos',
        m: '1 minuto',
        mm: '%d minutos',
        h: '1 hora',
        hh: '%d horas',
        d: '1 dia',
        dd: '%d dias',
        M: '1 mês',
        MM: '%d meses',
        y: '1 ano',
        yy: '%d anos'
      }
    }
  }
}