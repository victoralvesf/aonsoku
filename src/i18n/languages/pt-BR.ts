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
      miniSearch: 'Pesquisar',
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
      seeMore: 'Ver mais',
    },
    theme: {
      label: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      system: 'Sistema',
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
      form: {
        labels: {
          name: 'Nome',
          comment: 'Comentário',
          commentDescription: 'Escreva uma breve descrição desta playlist',
          isPublic: 'Pública',
          isPublicDescription:
            'Selecione esta opção para tornar a playlist pública. Isso permitirá que outros usuários vejam e acessem sua playlist.',
        },
        create: {
          title: 'Criar Playlist',
          button: 'Criar',
          toast: {
            success: 'Playlist criada com sucesso!',
            error: 'Falha ao criar a playlist!',
          },
        },
        edit: {
          title: 'Editar Playlist',
          button: 'Atualizar',
          toast: {
            success: 'Playlist atualizada com sucesso!',
            error: 'Falha ao atualizar a playlist!',
          },
        },
        delete: {
          title: 'Você tem certeza de que deseja excluir esta playlist?',
          description: 'Essa ação não poderá ser desfeita.',
          toast: {
            success: 'Playlist excluída com sucesso!',
            error: 'Falha ao excluir esta playlist!',
          },
        },
        validations: {
          nameLength: 'O nome da playlist deve conter pelo menos 2 caracteres.',
        },
        removeSong: {
          title_one:
            'Você tem certeza de que deseja remover a música selecionada?',
          title_other:
            'Você tem certeza de que deseja remover as músicas selecionadas?',
          description: 'Essa ação não poderá ser desfeita.',
          toast: {
            success_one: 'Música removida com sucesso!',
            success_other: 'Músicas removidas com sucesso!',
            error_one: 'Falha ao remover a música!',
            error_other: 'Falha ao remover as músicas!',
          },
        },
      },
    },
    album: {
      headline: 'Álbum',
      buttons: {
        like: 'Curtir {{name}}',
        dislike: 'Remover curtida de {{name}}',
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
        header: {
          albumsByArtist: 'Álbuns por {{artist}}',
        },
        empty: {
          title: 'Nenhum resultado encontrado!',
          info: 'Não conseguimos encontrar álbuns que correspondam ao seu filtro.',
          action: 'Modifique os filtros e tente novamente.',
        },
        genre: {
          label: 'Selecione um gênero...',
          search: 'Procurar um gênero...',
          loading: 'Carregando gêneros...',
          notFound: 'Nenhum gênero encontrado.',
        },
        filter: {
          artist: 'Artista',
          genre: 'Gênero',
          favorites: 'Favoritos',
          mostPlayed: 'Mais reproduzidos',
          name: 'Nome',
          random: 'Aleatório',
          recentlyAdded: 'Adicionados recentemente',
          recentlyPlayed: 'Reproduzidos recentemente',
          releaseYear: 'Ano de lançamento',
          discography: 'Discografia',
        },
      },
      table: {
        discNumber: 'Disco {{number}}',
      },
    },
    artist: {
      headline: 'Artista',
      buttons: {
        play: 'Tocar a rádio de {{artist}}',
        shuffle: 'Tocar a rádio de {{artist}} no modo aleatório',
        options: 'Mais opções para {{artist}}',
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
        name: 'Nome',
        albumCount: 'Álbuns',
        songCount: 'Músicas',
        comment: 'Comentário',
        public: 'Pública',
        track: 'Faixa',
        genres: 'Gêneros',
        size: 'Tamanho',
        codec: 'Codec',
        path: 'Caminho',
        favorite: 'Curtida',
        discNumber: 'Número do disco',
        trackGain: 'Ganho da faixa',
        trackPeak: 'Pico da faixa',
        albumPeak: 'Pico do álbum',
      },
      buttons: {
        play: 'Tocar {{title}} por {{artist}}',
        pause: 'Pausar {{title}} por {{artist}}',
      },
      lastPlayed: '{{date}} atrás',
      pagination: {
        rowsPerPage: 'Linhas por página',
        currentPage: 'Página {{currentPage}} de {{totalPages}}',
        screenReader: {
          firstPage: 'Ir para a primeira página',
          previousPage: 'Ir para a página anterior',
          nextPage: 'Ir para a próxima página',
          lastPage: 'Ir para a última página',
        },
      },
      sort: {
        asc: 'Crescente',
        desc: 'Decrescente',
        reset: 'Restaurar',
      },
      menu: {
        selectedCount_one: '{{count}} selecionado',
        selectedCount_other: '{{count}} selecionados',
      },
    },
    fullscreen: {
      noLyrics: 'Letra não encontrada',
      loadingLyrics: 'Procurando a letra...',
      queue: 'Fila',
      playing: 'Tocando agora',
      lyrics: 'Letra',
      switchButton: 'Mudar para tela cheia',
    },
    logout: {
      dialog: {
        title: 'Pronto para se despedir por enquanto?',
        description: 'Confirme para se desconectar.',
        cancel: 'Cancelar',
        confirm: 'Continuar',
      },
    },
    login: {
      form: {
        server: 'Servidor',
        description: 'Conecte-se ao seu servidor Subsonic.',
        url: 'URL',
        urlDescription: 'Esta é a URL do seu servidor',
        username: 'Nome de usuário',
        usernamePlaceholder: 'Seu usuário',
        password: 'Senha',
        connect: 'Conectar',
        connecting: 'Conectando...',
        validations: {
          url: 'Por favor, insira uma URL válida.',
          protocol: 'A URL deve começar com http:// ou https://',
          username: 'Por favor, forneça um nome de usuário',
          usernameLength:
            'O nome de usuário deve conter pelo menos 2 caracteres.',
          password: 'Por favor, forneça uma senha',
          passwordLength: 'A senha deve conter pelo menos 2 caracteres.',
        },
      },
    },
    toast: {
      server: {
        success: 'Servidor foi salvo com sucesso!',
        error: 'Não foi possível se comunicar com o servidor!',
      },
    },
    command: {
      inputPlaceholder: 'Pesquisar por álbum, artista ou música',
      noResults: 'Nenhum resultado encontrado.',
      commands: {
        heading: 'Comandos',
        pages: 'Ir para página',
        theme: 'Mudar tema',
      },
      pages: 'Páginas',
    },
    player: {
      noSongPlaying: 'Nenhuma música tocando',
      noRadioPlaying: 'Nenhum rádio tocando',
      tooltips: {
        shuffle: {
          enable: 'Ativar aleatório',
          disable: 'Desativar aleatório',
        },
        previous: 'Voltar',
        play: 'Play',
        pause: 'Pausar',
        next: 'Avançar',
        repeat: {
          enable: 'Repetir',
          disable: 'Não repetir',
        },
        like: 'Curtir {{song}} por {{artist}}',
        dislike: 'Remover curtida de {{song}} por {{artist}}',
      },
    },
    options: {
      play: 'Reproduzir',
      playNext: 'Tocar a seguir',
      addLast: 'Adicionar ao final',
      download: 'Download',
      playlist: {
        add: 'Adicionar à playlist',
        edit: 'Editar playlist',
        delete: 'Excluir playlist',
        search: 'Procurar uma playlist',
        create: 'Nova playlist',
        notFound: 'Nenhuma playlist encontrada',
        removeSong: 'Remover da playlist',
      },
      info: 'Mais informações',
    },
    radios: {
      label: 'Rádio',
      addRadio: 'Adicionar Rádio',
      table: {
        name: 'Nome',
        homepage: 'URL da página inicial',
        stream: 'URL de transmissão',
        actions: {
          edit: 'Editar rádio',
          delete: 'Excluir rádio',
        },
        playTooltip: 'Tocar rádio {{name}}',
        pauseTooltip: 'Pausar rádio {{name}}',
      },
      empty: {
        title: 'Nenhuma rádio disponível',
        info: 'Você ainda não configurou nenhuma rádio.',
      },
      form: {
        create: {
          title: 'Adicionar Rádio',
          button: 'Salvar',
          toast: {
            success: 'Rádio criado com sucesso!',
            error: 'Falha ao criar este rádio!',
          },
        },
        edit: {
          title: 'Editar Rádio',
          button: 'Atualizar',
          toast: {
            success: 'Rádio atualizado com sucesso!',
            error: 'Falha ao atualizar este rádio!',
          },
        },
        delete: {
          title: 'Você tem certeza de que deseja excluir este rádio?',
          description: 'Essa ação não poderá ser desfeita.',
          toast: {
            success: 'Rádio excluído com sucesso!',
            error: 'Falha ao excluir este rádio!',
          },
        },
        validations: {
          name: 'O nome do rádio deve conter pelo menos 3 caracteres.',
          url: 'Por favor, forneça uma URL válida.',
          homepageUrlLength:
            'A URL da página inicial deve conter pelo menos 10 caracteres.',
          streamUrlLength:
            'A URL de transmissão deve conter pelo menos 10 caracteres.',
        },
      },
    },
    time: {
      days_one: '{{days}} dia',
      days_other: '{{days}} dias',
      hour: '{{hour}}h',
      minutes: '{{minutes}}min',
      seconds: '{{seconds}}s',
    },
    server: {
      songCount_zero: '{{count}} músicas',
      songCount_one: '{{count}} música',
      songCount_other: '{{count}} músicas',
      folderCount_zero: '{{count}} diretórios',
      folderCount_one: '{{count}} diretório',
      folderCount_other: '{{count}} diretórios',
      lastScan: 'Última varredura: {{date}}',
      status: 'Status',
      management: 'Gerenciamento do servidor',
      buttons: {
        refresh: 'Atualizar status',
        startScan: 'Varredura rápida',
      },
    },
    downloads: {
      started: 'Download iniciado.',
      failed: 'Ocorreu um erro ao baixar o arquivo.',
      completed: 'Download concluído com sucesso.',
    },
    queue: {
      title: 'Fila de reprodução',
      clear: 'Limpar fila',
    },
    shortcuts: {
      modal: {
        title: 'Atalhos de teclado',
        description: {
          first: 'Pressione',
          last: 'para abrir/fechar esta janela.',
        },
      },
      playback: {
        label: 'Reprodução',
        play: 'Play / Pausar',
        shuffle: 'Ordem aleatória',
        repeat: 'Repetir',
        previous: 'Voltar à faixa anterior',
        next: 'Pular para a próxima faixa',
      },
    },
    songInfo: {
      title: 'Informações da música',
      error:
        'Não foi possível obter as informações da música. Por favor, tente novamente mais tarde!',
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
        yy: '%d anos',
      },
    },
  },
}
