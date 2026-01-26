import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View, Text } from "react-native";
import { useAppStore } from "@/store/app";
import { KeyManager } from "@/nostr/keys";
export default function networkTab() {
    const theme = useTheme()
    const publicKey = KeyManager.encodeToNip19(KeyManager.getPublicKey())
    return (
        <View style={style.container}>
            <Text style={[{color: theme.text}]}> { publicKey } </Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})