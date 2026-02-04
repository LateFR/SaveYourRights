import ChatInput from "@/components/chat/ChatInput"
import { MessagesSections } from "@/components/chat/MessagesSection"
import { useSendMessage } from "@/hooks/nostr/useSendMessage"
import { useTheme } from "@/hooks/useTheme"
import { KeyManager } from "@/nostr/keys"
import { useMessagesStore } from "@/store/messages"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"

export default function Chat(){
    const theme = useTheme()
    const { npub } = useLocalSearchParams<{npub: string}>()
    const pubkey = KeyManager.decodeFromNip19(npub)
    const name = useMessagesStore.getState().getNameWithPk(pubkey)
    const [ inputValue, setInputValue ] = useState("")
    const { sendMessage } = useSendMessage()
    
    return (
        
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex:1}}
                keyboardVerticalOffset={0}
            >
                <MessagesSections />
                <ChatInput 
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleSendMessage={( message ) => {
                        sendMessage(pubkey, message)
                        setInputValue("")
                    }}
                />
            </KeyboardAvoidingView>
            
    )
}

const style=StyleSheet.create({
    container: {
        flex: 1,
    } 
})