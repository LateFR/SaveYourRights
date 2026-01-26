// theme/useTheme.ts
import { useColorScheme } from 'react-native'
import { lightTheme, darkTheme } from '@/theme/theme'

export function useTheme() {
  const scheme = useColorScheme()
  return scheme === 'dark' ? darkTheme : lightTheme
}
