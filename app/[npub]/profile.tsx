import { Header } from "@/components/chat/Header";
import { useTheme } from "@/hooks/useTheme";
import { KeyManager } from "@/nostr/keys";
import { useMessagesStore } from "@/store/messages";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile(){
    const theme = useTheme()
    const { npub } = useLocalSearchParams<{ npub: string }>()
    const contactPubkey = KeyManager.decodeFromNip19(npub)
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: theme.interface.paleBackround}]}>
            <Header name={useMessagesStore.getState().getNameWithPk(contactPubkey)} />
        </SafeAreaView>
    )
}