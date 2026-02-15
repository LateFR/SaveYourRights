import { useTheme } from "@/hooks/useTheme";
import { KeyManager } from "@/nostr/keys";
import { Contact } from "@/store/messages";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, View, Text, TouchableOpacity  } from "react-native";

export function ChatsList({contacts} : { contacts: Contact[]}){
    const theme = useTheme()
    return (
        <View style={{flex: 1, marginTop: 45}}>
            <FlatList
                data={contacts}
                keyExtractor={item => item.pk}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style = {[ style.chatCard ]}
                        onPress={() => router.push(`/${KeyManager.encodeToNip19(item.pk)}/chat`)} 
                    >
                        <Ionicons name="person-circle-outline" size={50} color={theme.text} />
                        <Text style={[{ color: theme.text }]}> {item.name} </Text>
                    </TouchableOpacity>
                )}
            /> 
        </View>
    )
}

const style = StyleSheet.create({
    chatCard: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        flexDirection: "row"
    }
})