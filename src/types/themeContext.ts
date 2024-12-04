export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Black = 'black',
  OneDark = 'one-dark',
  GruvboxLightHard = 'gruvbox-light',
  MarmaladeBeaver = 'marmalade-beaver',
  GreenVelvetSkink = 'green-velvet-skink',
  MaterialTheme = 'material-theme',
  MonokaiPro = 'monokai-pro',
  GithubDark = 'github-dark',
  ShadesOfPurple = 'shades-of-purple',
  BeardedThemeSolarized = 'bearded-theme-solarized',
  CatppuccinMocha = 'catppuccin-mocha',
  NuclearDark = 'nuclear-dark',
}

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
