export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Black = 'black',
  OneDark = 'one-dark',
  NightOwlLight = 'night-owl-light',
  MarmaladeBeaver = 'marmalade-beaver',
  NoctisLilac = 'noctis-lilac',
  MaterialTheme = 'material-theme',
  MonokaiPro = 'monokai-pro',
  GithubDark = 'github-dark',
  ShadesOfPurple = 'shades-of-purple',
  BeardedSolarized = 'bearded-solarized',
  CatppuccinMocha = 'catppuccin-mocha',
  NuclearDark = 'nuclear-dark',
  Achiever = 'achiever',
  Cool = 'cool',
  Discord = 'discord',
  HuacatPink = 'huacat-pink',
  VueDark = 'vue-dark',
  VimDarkSoft = 'vim-dark-soft',
}

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
