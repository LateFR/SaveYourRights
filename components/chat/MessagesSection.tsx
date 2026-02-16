import { useTheme } from "@/hooks/useTheme";
import { KeyManager } from "@/nostr/keys";
import { useAppStore } from "@/store/app";
import { Message, useMessagesStore } from "@/store/messages";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

export function MessagesSections({ messages }: { messages: Message[]}){
    const theme = useTheme()
    const myPk = KeyManager.getPublicKey()
    const getNameWithPk = useMessagesStore(s => s.getNameWithPk)
    const myName = useAppStore(s => s.username)
    const flatRef = useRef<FlatList>(null)
    const reversedMessages = [...messages].reverse()

    useEffect(() => {
        if (messages.length > 0 && (messages && messages[messages.length - 1].from_pk == myPk)){
            flatRef.current?.scrollToOffset({offset: 0, animated: true })
        }
    }, [messages.length])
    //console.log(messages.length)
    return (
        <View style={style.container}>
            <FlatList
                ref={ flatRef }
                data={reversedMessages}  
                inverted
                ListFooterComponent={<View style={{ height: 14 }} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => {
                    const isMe = item.from_pk == myPk
                    const next = reversedMessages[index - 1]
                    const isSameNext = next ? item.from_pk == next.from_pk : false
                    return (
                    <>
                    {!isSameNext && (
                        <Text style={[ style.userText, {
                            color: theme.interface.secondary,
                            alignSelf: isMe? "flex-end" : "flex-start",
                        }]}> {isMe ? myName : getNameWithPk(item.from_pk)} </Text>
                    )} 
                    <View style={[ style.bubble, isMe? style.bubbleRight : style.bubbleLeft, { 
                        backgroundColor: isMe ? theme.interface.primary : theme.interface.secondary, 
                        borderBottomRightRadius: (!isSameNext && isMe) ? 0: 30,
                        borderBottomLeftRadius: (!isSameNext && !isMe) ? 0: 30,
                        borderTopRightRadius: (!isSameNext && isMe)  ? 22 : 30,
                        borderTopLeftRadius: (!isSameNext && !isMe) ? 22: 30,
                        
                    }]}>
                        <Text style={[ { color: theme.colors.neutrals.white } ]}> {item.message} </Text>
                    </View>
                    </>   
                    )
                }}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        marginHorizontal: 5
    },
    bubble: {
        padding: 10,
        maxWidth: 260,
        borderRadius: 30,
        marginRight: 3,
        marginLeft: 3,
        marginTop: 1
    },
    bubbleRight: {
        alignSelf: "flex-end"
    },
    bubbleLeft: {
        alignSelf: "flex-start"
    },
    userText: {
        marginBottom: 5,
        marginRight: 3,
        marginLeft: 3,
        fontSize: 14
    },
})