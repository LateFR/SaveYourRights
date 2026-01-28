import { KeyManager } from "@/nostr/keys";
import { nostrManager } from "@/nostr/nostr";
import { useCallback, useState } from "react";

export function useSendMessage(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const sendMessage = useCallback(
        async (to: string, message: string) => {
            try {
                setLoading(true)
                setError(null)
                const toPkHex = to.startsWith('npub') ? KeyManager.decodeFromNip19(to) : to
                return await nostrManager.send(message, toPkHex)
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