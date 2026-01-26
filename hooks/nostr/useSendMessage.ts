import { eventManager } from "@/nostr/event";
import { useCallback, useState } from "react";

export function useSendMessage(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const sendMessage = useCallback(
        async (to: string, message: string) => {
            try {
                setLoading(true)
                setError(null)
                return await eventManager.send(message, 4, [["p", to]])
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