import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router'; // Ajout de Redirect
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app'; // Ajout de l'import
import 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

// On retire le "export default" ici car il y en a déjà un au-dessus
function RootLayoutNav() {
  const theme = useTheme()
  const firstLaunch = useAppStore((state) => state.firstLaunch);
  const hasHydrated = useAppStore((state) => state._hasHydrated)

  return (
    <Stack 
      initialRouteName={firstLaunch? "(setup)/loading" : "(tabs)"}
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.background }
      }}
    >
      <Stack.Screen name="(setup)/loading" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

