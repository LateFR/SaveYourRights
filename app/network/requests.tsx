import { useTheme } from "@/hooks/useTheme";
import { KeyManager } from "@/nostr/keys";
import { useMessagesStore } from "@/store/messages";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Requests(){
    const theme = useTheme()
    const getContactsByStatus = useMessagesStore(s => s.getContactsByStatus)
    return (
        <SafeAreaView style={[style.container, { backgroundColor: theme.background}]}>
            { getContactsByStatus("RECEIVED").length > 0 && (
            <FlatList
                data={getContactsByStatus("RECEIVED")}
                keyExtractor={item => item.pk}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/${KeyManager.encodeToNip19(item.pk)}/chat`)} 
                    >
                        <Text style={[{ color: theme.text }]}> {item.name} </Text>
                    </Pressable>
                )}
            /> 
            )}
            
            { (getContactsByStatus("RECEIVED").length == 0) && (
                <Text style={[style.emptyText, { color: theme.interface.secondary }]}> You don't have any add requests yet </Text>
            )}
        </SafeAreaView>
    )
}

const style=StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
})