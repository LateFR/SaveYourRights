import { ErrorPopup } from "@/components/ErrorPopup";
import { NewContactPopup } from "@/components/NewContactPopup";
import { useDeepLink } from "@/hooks/useDeepLink";
import { contactManager } from "@/nostr/contact";
import { KeyManager } from "@/nostr/keys";
import { nostrManager } from "@/nostr/nostr";
import { useNostrStore } from "@/store/nostr";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { Platform } from "react-native";

export function NostrProvider({ children }: { children: ReactNode}){
    const isNostrStoreReady = useNostrStore((state) => state._hasHydrated)

    const [nostrError, setNostrError] = useState<{error: string, details: null | string} | null>(null)
    const [showNewContactPopup, setShowNewContactPopup] = useState<boolean>(false)
    const [onPopupContinue, setOnPopupContinue] = useState<((name: string) => void) | null>(null)
    const [onCanceledPopup, setOnCanceledPopup] = useState<(() => void) | null>(null)

    const waitForPopupContinue = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            setOnCanceledPopup(() => () => {
                setShowNewContactPopup(false);
                setOnCanceledPopup(null);
                setOnPopupContinue(null);
                reject(new Error("Popup canceled"))
            })
            setOnPopupContinue(() => (name: string) => {
                // DON'T close the popup here
                setOnCanceledPopup(null);
                setOnPopupContinue(null);
                resolve(name)
            })
            setShowNewContactPopup(true)
        })
    }
    useEffect(() => {
        if (!KeyManager.hasKey()) return
        if (!isNostrStoreReady) return
        const listen = async () => {
            await nostrManager.startListening()
        }

        listen()

        return () => nostrManager.stopListening()
    }, [isNostrStoreReady])
    useDeepLink({
        onNewExchange: (pk: string, relays: string[]) => {
            if (router.canDismiss()) router.dismiss()
                
            waitForPopupContinue().then((name) => {
                try{
                    contactManager.addNewContact(pk, name, relays)
                    setShowNewContactPopup(false)
                } catch (err) {
                    setNostrError({ error: "The contact can't be reached. Please check you're internet connection", details: (err as Error)?.message })
                }
            }).catch()
        }, 
        onError: (error: string, details?: Error) => {
            if (Platform.OS == "ios"){
                if (router.canDismiss()) router.dismissAll()
                else router.replace("/(tabs)")
            }
            setNostrError({error, details: details?.message ?? null})
        }
    })

    return (
        <>
            {children}
            {nostrError && (
                <ErrorPopup message={nostrError.error} details={nostrError.details ?? undefined}  onClose={() => setNostrError(null)} />
            )}
            
            <NewContactPopup 
                visible={showNewContactPopup} 
                onClose={() => setShowNewContactPopup(false)} 
                onCanceled={() => onCanceledPopup?.()} 
                onContinue={(name) => onPopupContinue?.(name)}
            />
            
        </>
    )
}