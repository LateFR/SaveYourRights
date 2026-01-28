// theme/theme.ts
export type Theme = {
  isDark: boolean
  background: string
  text: string,
  interface: {
    primary: string,
    secondary: string,
    tertiary: string,
    danger: string,
  }
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
  interface: {
    primary: '#2563EB',   // Blue 600 (Action principale)
    secondary: '#475569',    // gris ardoise
    tertiary: '#E2E8F0',     // fond de cartes 
    danger: '#DC2626',
  },
  tabBar: {
    background: '#ffffff',
    border: '#e5e5e5',
    active: '#007AFF',
  },
}

export const darkTheme: Theme = {
  isDark: true,
  background: '#1A1A1B',
  text: '#ffffff',
  interface: {
    primary: '#3B82F6',   // Blue 500
    secondary: '#94A3B8', // Slate 400
    tertiary: '#1E293B',  // Slate 800 (Fonds de cartes sombres)
    danger: '#EF4444',
  },
  tabBar: {
    background: '#1A1A1B',
    border: '#333333',
    active: '#0A84FF',
  },
}
