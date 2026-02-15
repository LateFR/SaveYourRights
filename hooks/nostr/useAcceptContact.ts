import { contactManager } from "@/nostr/contact";
import { useCallback, useState } from "react";

export function useAcceptContact(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const acceptContact = useCallback(async (pk: string) => {
        try{
            setLoading(true)
            await contactManager.acceptContact(pk)
        } catch (e){
            setError(e as Error)
        } finally {
            setLoading(false)
        }
    }, [])

    return { acceptContact, loading, error }
}