import { KeyManager } from "@/nostr/keys";
import { nostrManager } from "@/nostr/nostr";
import { useNostrStore } from "@/store/nostr";
import { useEffect } from "react";
import { ReactNode } from "react";
export function NostrProvider({ children }: { children: ReactNode}){
    const isNostrStoreReady = useNostrStore((state) => state._hasHydrated)

    useEffect(() => {
        if (!KeyManager.hasKey()) return
        if (!isNostrStoreReady) return
        const listen = async () => {
            await nostrManager.startListening()
        }

        listen()

        return () => nostrManager.stopListening()
    }, [isNostrStoreReady])

    return (
        <>
            {children}
        </>
    )
}