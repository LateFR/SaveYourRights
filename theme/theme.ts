// theme/theme.ts
export type Theme = {
  isDark: boolean
  background: string
  text: string
  tabBar: {
    background: string
    border: string
    active: string
  }
}

export const lightTheme: Theme = {
  isDark: false,
  background: '#ffffff',
  text: '#000000',
  tabBar: {
    background: '#ffffff',
    border: '#e5e5e5',
    active: '#007AFF',
  },
}

export const darkTheme: Theme = {
  isDark: true,
  background: '#000000',
  text: '#ffffff',
  tabBar: {
    background: '#000000',
    border: '#333333',
    active: '#0A84FF',
  },
}
