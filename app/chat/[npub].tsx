import ChatInput from "@/components/chat/ChatInput"
import { MessagesSections } from "@/components/chat/MessagesSection"
import { useSendMessage } from "@/hooks/nostr/useSendMessage"
import { useTheme } from "@/hooks/useTheme"
import { KeyManager } from "@/nostr/keys"
import { useMessagesStore } from "@/store/messages"
import { useNostrStore } from "@/store/nostr"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

export default function Chat(){
    const theme = useTheme()
    const insets = useSafeAreaInsets()
    const { npub } = useLocalSearchParams<{npub: string}>()
    const contactPubkey = KeyManager.decodeFromNip19(npub)
    const contactName = useMessagesStore.getState().getNameWithPk(contactPubkey)
    const [ inputValue, setInputValue ] = useState("")
    const { sendMessage } = useSendMessage()
    const addMessage = useMessagesStore(s => s.addMessage)
    const myPk = KeyManager.getPublicKey()
    const messages = useMessagesStore((s) => s.contacts.find((c) => c.pk == contactPubkey)?.messages ?? []) 
    return (
            <SafeAreaView style={[{ flex: 1, backgroundColor: theme.interface.paleBackround}]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex:1}}
                    keyboardVerticalOffset={0}
                >
                    <MessagesSections messages={messages} />
                    <ChatInput
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={( message ) => {
                            const tempId = `temp-${Date.now()}-${Math.random()}`
                            const timestamp = Math.floor(Date.now() / 1000)
                            sendMessage(contactPubkey, message, timestamp)
                            setInputValue("")
                            addMessage(contactPubkey, { from_pk: myPk, message: message, timestamp: timestamp, id: tempId})
                        }}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
            
    )
}

const style =StyleSheet.create({
    container: {
        flex: 1,
    } ,
})