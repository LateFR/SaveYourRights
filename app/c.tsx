// app/c.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function DeepLinkRedirect() {
    const params = useLocalSearchParams();
    
    useEffect(() => {
        // Redirige vers l'index, le DeepLink service va gérer l'URL
        const timer = setTimeout(() => {
            router.replace('/(tabs)/network')
        }, 50)
        
        return () => clearTimeout(timer)
    }, [])
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    )
}