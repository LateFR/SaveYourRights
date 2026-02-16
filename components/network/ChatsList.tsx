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
                renderItem={({ item }) => {
                    const lastMessage = item.messages[item.messages.length-1] || null
                    const unreadMessages = item.messages.filter(m => !m.read).length

                    return (<TouchableOpacity
                        style = {[ style.chatCard ]}
                        onPress={() => router.push(`/${KeyManager.encodeToNip19(item.pk)}/chat`)} 
                    >
                        <Ionicons name="person-circle-outline" size={50} color={theme.text} />
                        <View style={{ flexDirection: "column", flex: 1 }}>
                            <Text style={[{ color: theme.text, fontSize: 18 }]}> {item.name} </Text>
                            {lastMessage && (
                                <View style={style.messagesInfo}>
                                    <Text 
                                        style={[ style.lastMessageText, !lastMessage.read && style.notReadMessage,  { color: theme.text } ]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    > { lastMessage.message }</Text>
                                    { unreadMessages > 0 && (<View style={[style.notReadBadge, { backgroundColor: theme.isDark ? theme.interface.secondary : theme.interface.paleBackround}]}>
                                        <Text style={{ color: theme.text, fontWeight: "bold" }}> {unreadMessages <= 9 ? String(unreadMessages) : "9+"} </Text>
                                    </View> )}
                                </ View>
                            )}
                        </View>
                        
                    </TouchableOpacity>)
                }}
            /> 
        </View>
    )
}

const style = StyleSheet.create({
    chatCard: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 2
    },
    messagesInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    lastMessageText: {
        flex: 1
    },
    notReadMessage: {
        fontWeight: "600"
    },
    notReadBadge: {
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        paddingHorizontal: 6,
    }

})