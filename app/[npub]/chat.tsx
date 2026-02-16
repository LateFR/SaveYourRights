import ChatInput from "@/components/chat/ChatInput"
import { Header } from "@/components/chat/Header"
import { MessagesSections } from "@/components/chat/MessagesSection"
import { PendingContact } from "@/components/chat/PendingContact"
import { useSendMessage } from "@/hooks/nostr/useSendMessage"
import { useTheme } from "@/hooks/useTheme"
import { KeyManager } from "@/nostr/keys"
import { useMessagesStore } from "@/store/messages"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

export default function Chat(){
    const theme = useTheme()
    const { npub } = useLocalSearchParams<{npub: string}>()
    const contactPubkey = KeyManager.decodeFromNip19(npub)
    const [ inputValue, setInputValue ] = useState("")
    const { sendMessage } = useSendMessage()
    const addMessage = useMessagesStore(s => s.addMessage)
    const myPk = KeyManager.getPublicKey()
    const messages = useMessagesStore((s) => {
        const contact = s.contacts.find((c) => c.pk === contactPubkey)
        return contact ? contact.messages : undefined
    })
    
    const setRead = useMessagesStore(s => s.setRead)

    useEffect(() => {
        messages?.forEach(m => {
            setRead(contactPubkey, m.id, true) //set has read all new message
        });
    }, [messages?.length])
    const contact = useMessagesStore((s) => s.contacts.find((c) => c.pk === contactPubkey))
    return (
            <SafeAreaView style={[{ flex: 1, backgroundColor: theme.interface.paleBackround}]}>
                <Header name={useMessagesStore.getState().getNameWithPk(contactPubkey)} onPressName={() => router.push(`/${npub}/profile`)} />
                <KeyboardAvoidingView
                    behavior={"height"}
                    style={{flex:1}}
                >
                    {contact?.status == "PROPOSED" && <PendingContact />}
                    {messages && <MessagesSections messages={messages} />}
                    <ChatInput
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={( message ) => {
                            const tempId = `temp-${Date.now()}-${Math.random()}`
                            const timestamp = Math.floor(Date.now() / 1000)
                            setInputValue("")
                            addMessage(contactPubkey, { from_pk: myPk, message: message, read: true, timestamp: timestamp, id: tempId})
                            sendMessage(contactPubkey, message, timestamp)
                        }}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
            
    )
}

