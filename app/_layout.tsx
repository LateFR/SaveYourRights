import 'react-native-get-random-values';
import 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router'; // Ajout de Redirect
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAppStore } from '@/store/app'; // Ajout de l'import
import { useTheme } from '@/hooks/useTheme';
import { NostrProvider } from '@/context/NostrProvider';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

function RootLayoutNav() {
  const theme = useTheme()
  const firstLaunch = useAppStore((state) => state.firstLaunch);
  const hasHydrated = useAppStore((state) => state._hasHydrated)

  if (!hasHydrated) {
    return (
      <View style={
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }
      }>
        <ActivityIndicator size={ 90 }/>
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1, backgroundColor:theme.background}}>
    <NostrProvider>
      <Stack 
        initialRouteName={firstLaunch? "(setup)" : "(tabs)"}
        screenOptions={{ 
          headerShown: false
        }}
      >
        <Stack.Screen name="(setup)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="exchange" options={{ presentation: 'modal' }} />
      </Stack>
      {firstLaunch ? <Redirect href="/(setup)/setup" /> : null}
    </NostrProvider>
    </View>
    
  );
}

