import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View, Text, Pressable, Platform, TouchableOpacity } from "react-native";
import { useNostrStore } from "@/store/nostr";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useMessagesStore } from "@/store/messages";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import { ChatsList } from "@/components/network/ChatsList";

export default function NetworkTab() {
    const theme = useTheme();
    const messages = useNostrStore((state) => state.messages);
    const contacts = useMessagesStore(s => s.contacts)
    const getContactsByStatus = useMessagesStore((s) => s.getContactsByStatus)
    const clearMessages = useNostrStore((state) => state.clearMessages)
    const getContacts = () => [...getContactsByStatus("ESTABLISHED"), ...getContactsByStatus("PROPOSED")]
    useEffect(() => {
        clearMessages()
    }, [])
    return (
        <SafeAreaView style={[style.container, { backgroundColor: theme.background }]}>
            
            <View style={style.content}>
                <TouchableOpacity style={style.newContactButton} onPress={() => router.push("/network/requests")}>
                    <AntDesign name="user-add" size={30} color={theme.interface.primary} />
                    {contacts.filter(c => c.status === "RECEIVED").length > 0 && <View style={[ style.notificationBadge, { backgroundColor: theme.interface.auxiliary}]} />}
                </TouchableOpacity>
                { getContacts().length > 0 && (
                    <ChatsList contacts={getContacts()}/>
                )}
                
                { (getContacts().length == 0) && (
                    <Text style={[style.emptyText, { color: theme.interface.secondary }]}> You have no contacts yet </Text>
                )}

            </View>
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
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
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
    notificationBadge: {
        position: 'absolute', 
        top: -2,               
        right: 0,  
        width: 12,
        height: 12,
        borderRadius: 6,         // cercle
        borderWidth: 0.7,
        borderColor: 'white',    // bord blanc pour se détacher du bouton
    },
    newContactButton: {
        position: "absolute",
        right: 30,
        top: 17,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    }
});