<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/victoralvesf/aonsoku">
    <img src="./src-tauri/icons/128x128.png" alt="Aonsoku" width="80" height="80">
  </a>

  <h3 align="center">Aonsoku</h3>
  <p align="center">
    A modern desktop client for Navidrome/Subsonic servers built with React and Rust.
    <br />
    <br />
    <a href="https://aonsoku.vercel.app">Web App</a>
    ·
    <a href="https://github.com/victoralvesf/aonsoku/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/victoralvesf/aonsoku/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>

  [![React][React.js]][React-url] [![Tauri][Tauri]][Tauri-url] [![Rust][Rust]][Rust-url]
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#screenshots">Screenshots</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running">Running</a></li>
        <li><a href="#recommended-ide-setup">Recommended IDE Setup</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## Features

- **Subsonic Integration:** Aonsoku integrates with your Navidrome or Subsonic server, providing you with easy access to your music collection. 
- **Intuitive UI:** Modern, clean and user-friendly interface designed to enhance your music listening experience.
- **Unsynchronized lyrics**: If your songs have embedded unsynchronized lyrics, Aonsoku is able to show them on full screen mode.
- **Radio:** If your server supports it, listen to radio shows directly within Aonsoku.
- **Scrobble:** Sync played songs with your server.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Screenshots

<a href="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/home.jpg"><img src="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/home.jpg" width="49.5%"/></a> <a href="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/album.jpg"><img src="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/album.jpg" width="49.5%"/></a>

<a href="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/playlist.jpg"><img src="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/playlist.jpg" width="49.5%"/></a> <a href="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/albums.jpg"><img src="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/albums.jpg" width="49.5%"/></a>

<a href="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/player.jpeg"><img src="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/player.jpeg" width="49.5%"/></a> <a href="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/lyrics.jpg"><img src="https://raw.githubusercontent.com/victoralvesf/aonsoku/main/media/lyrics.jpg" width="49.5%"/></a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

As Aonsoku is currently in early development, to use the desktop app you need to build it yourself.

### Prerequisites

* Node.js
* Rust
* pnpm, npm or yarn

### Installation

1. Clone the repo
```sh
git clone https://github.com/victoralvesf/aonsoku.git
```
2. Install NPM packages
```sh
pnpm install
```

### Running

* Web App
```sh
pnpm dev
```

* Desktop App
```sh
pnpm tauri dev
```

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- Downloads:
  - [x] Playlist
  - [x] Album
  - [x] Artist
  - [ ] Song
- [ ] Queue page
- [ ] Playlist editor
- [ ] Synced lyrics
- [ ] Podcast support

Feel free to request more cool features [here](https://github.com/victoralvesf/aonsoku/issues/new?labels=enhancement&template=feature-request---.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Rust]: https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=F74C00
[Rust-url]: https://www.rust-lang.org
[Tauri]: https://img.shields.io/badge/Tauri-000000?style=for-the-badge&logo=tauri&logoColor=24C8DB
[Tauri-url]: https://tauri.app