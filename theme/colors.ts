// theme/colors.ts
export type ShadeSet = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export type Colors = {
  gray: ShadeSet
  primary: ShadeSet
  success: ShadeSet
  danger: ShadeSet
  warning: ShadeSet
  info: ShadeSet
  accent: ShadeSet
  neutrals: {
    white: string
    black: string
    transparent: string
    backdrop: string // overlay/backdrop
    border: string
    muted: string
  }
}

/**
 * Palette recommandée — valeurs choisies pour contraste et cohérence.
 * Utilise colors.gray[...], colors.primary[500] etc.
 */
export const colors: Colors = {
  gray: {
    50:  '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#0F1724',
  },

  primary: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#172554',
  },

  success: {
    50:  '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  danger: {
    50:  '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  warning: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  info: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#172554',
  },

  accent: {
    50:  '#FFF8F1',
    100: '#FFF0E0',
    200: '#FFDEB3',
    300: '#FFC680',
    400: '#FFB24D',
    500: '#FFA200', // ton chaud utile (tu avais #ffa200ff)
    600: '#C57A08',
    700: '#8F5606',
    800: '#6B3F04',
    900: '#4C2E03',
  },

  neutrals: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    backdrop: 'rgba(0,0,0,0.5)', // overlay
    border: '#E5E7EB', // gris clair par défaut
    muted: '#9CA3AF', // texte secondaire / hint
  },
}
