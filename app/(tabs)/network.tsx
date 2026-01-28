import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { useNostrStore } from "@/store/nostr";
import { useSendMessage } from "@/hooks/nostr/useSendMessage";
import { useEffect } from "react";
import { router } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function NetworkTab() {
    const theme = useTheme();
    const messages = useNostrStore((state) => state.messages);
    const { error } = useSendMessage();

    return (
        <View style={[style.container, { backgroundColor: theme.background }]}>
            {/* Zone de contenu (Messages/Inbox) */}
            <View style={style.content}>
                {messages.length === 0 ? (
                    <Text style={[style.emptyText, { color: theme.interface.secondary }]}>
                        Aucune alerte reçue pour le moment.
                    </Text>
                ) : (
                    messages.map((msg, i) => (
                        <Text key={i} style={{ color: theme.text }}>{msg.content}</Text>
                    ))
                )}
                {error && <Text style={{ color: theme.interface.danger }}>{String(error)}</Text>}
            </View>

            {/* Le Bouton d'Action (Floating Action Button) */}
            <View style={style.buttonWrapper}>
                <Pressable
                    onPress={() => router.push('/exchange')}
                    style={({ pressed }) => [
                        style.circle,
                        { 
                            backgroundColor: theme.interface.primary,
                            opacity: pressed ? 0.8 : 1,
                            transform: [{ scale: pressed ? 0.95 : 1 }]
                        },
                        style.shadow
                    ]}
                >
                    <FontAwesome6 name="add" size={30} color="white" />
                </Pressable>
                <Text style={[style.buttonLabel, { color: theme.text }]}>Ajouter un contact</Text>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 40,
        right: 30,
        alignItems: 'center',
    },
    circle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLabel: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});