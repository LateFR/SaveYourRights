import * as Linking from 'expo-linking'
import { EmitterSubscription } from 'react-native';
import { linkManager } from '@/nostr/link';
export type Handlers = {
    onNewExchange: (pk: string) => void,
    onError: (message: string, details?: Error) => void
}
class DeepLink{
    readonly handlers: Handlers
    isInitialized: boolean
    subscription: EmitterSubscription | undefined
    constructor(handlers: Handlers){
        this.handlers = handlers
        this.isInitialized = false
    }

    initialize(){
        if (this.isInitialized) return
        
        Linking.getInitialURL().then((url) => {
            if (url) this.handleURL(url)
        })
        this.isInitialized = true

        this.subscription = Linking.addEventListener("url", (event) => {
            this.handleURL(event.url)
        })
    }

    handleURL(url: string){
        const parsed = Linking.parse(url)
        let payload
        let sig
        let ogPayload
        if (parsed.scheme !== "saveyourrights" || parsed.hostname?.replace("/", "") !== "c"){
            //this.handlers.onError("The link isn't valid", new Error(`Invalid scheme or path. Scheme: ${parsed.scheme}\n Path: ${parsed.path}`)) 
            return // We don't throw an error because the link may not concern us
        }
        const encodedPayload = parsed.queryParams?.p
        if (typeof encodedPayload !== "string"){
            this.handlers.onError(
                "Malformed link",
                new Error ("The params 'p' is missing or invalid " + String(encodedPayload))
            )
            return
        }
        try{
            ({payload, sig, originalPayload: ogPayload} = linkManager.decodePayload(encodedPayload))
        } catch(err) {
            this.handlers.onError(
                "Error, the contact is malformed. Please retry.",
                err as Error
            )
            return
        }
        
        if (linkManager.isSigExpired(payload.e)){
            this.handlers.onError("The link as expired. Please retry with a new one")
            return
        }

        if (!linkManager.checkSigValidity(sig, payload.p, payload.e, ogPayload)){
            this.handlers.onError("The signature is incorect. Someone might be trying to deceive you.")
            return
        }

        this.handlers.onNewExchange(payload.p)
        
    }

    cleanup(){
        this.subscription?.remove()
    }
}

class DeepLinkSingleton {
    private instance: DeepLink | null = null

    initialize(handlers: Handlers){
        this.instance = new DeepLink(handlers)
        this.instance.initialize()
    }

    getInstance(): DeepLink | null {
        return this.instance
    }

    cleanup() {
        this.instance?.cleanup()
    }
}

export const deepLinkService = new DeepLinkSingleton()