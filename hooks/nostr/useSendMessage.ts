import { KeyManager } from "@/nostr/keys";
import { nostrManager } from "@/nostr/nostr";
import { useCallback, useState } from "react";
import { Payload } from "@/nostr/nostr";
export function useSendMessage(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const sendMessage = useCallback(
        async (to: string, message: string, createdAt?: number) => {
            try {
                setLoading(true)
                setError(null)
                const toPkHex = to.startsWith('npub') ? KeyManager.decodeFromNip19(to) : to
                const payload: Payload = {
                    action: "message",
                    info: {message: message, live: true}
                }
                return await nostrManager.send(payload, toPkHex, undefined, createdAt)
            } catch(error){
                setError(error as Error)
                throw error
            } finally {
                setLoading(false)
            }
        }, []
    )

    return { sendMessage, loading, error}
}