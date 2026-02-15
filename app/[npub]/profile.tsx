import { Header } from "@/components/chat/Header";
import { ErrorPopup } from "@/components/ErrorPopup";
import { useTheme } from "@/hooks/useTheme";
import { contactManager } from "@/nostr/contact";
import { KeyManager } from "@/nostr/keys";
import { useMessagesStore } from "@/store/messages";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile(){
    const theme = useTheme()
    const { npub } = useLocalSearchParams<{ npub: string }>()
    const contactPubkey = KeyManager.decodeFromNip19(npub)
    const [error, setError] = useState<Error | null>(null)
    const handleDelete = async () => {
        try {
            await contactManager.deleteContact(contactPubkey)

            router.replace("/(tabs)/network")
        } catch (e) {
            setError(e as Error)
        }
    }
    return (
        <SafeAreaView style={[{ flex: 1, alignItems: "center", backgroundColor: theme.interface.paleBackround}]}>
            <Header name={useMessagesStore.getState().getNameWithPk(contactPubkey)} />
            <TouchableOpacity style={[style.removeContact, {backgroundColor: theme.interface.danger}]}onPress={() => handleDelete()}>
                <Text> Remove contact </Text>
            </TouchableOpacity>
            { error && (
                <ErrorPopup message="An error is occured" details={error?.message} onClose={() => {}}/>
            )}
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    removeContact: {
        width: "70%",
        height: 30,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    }
})