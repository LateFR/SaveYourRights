import * as Linking from 'expo-linking'
import { EmitterSubscription } from 'react-native';
import { linkManager } from '@/nostr/link';
import { DEFAULT_RELAYS } from '@/store/nostr';
export type Handlers = {
    onNewExchange: (pk: string, name: string, relays: string[]) => void,
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
    private lastProcessedUrl: string | null = null

    async initialize(){
        if (this.isInitialized) return
        
        const url = await Linking.getInitialURL()
        if (url) await this.handleURL(url)
        
        this.isInitialized = true

        this.subscription = Linking.addEventListener("url", async (event) => {
            if (this.lastProcessedUrl) return
            await this.handleURL(event.url)
        })
    }

    async handleURL(url: string){
        if (this.lastProcessedUrl == url) return

        this.lastProcessedUrl = url

        try{
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
                    "Error, the QRCode/link is malformed. Please retry.",
                    err as Error
                )
                return
            }
            const [_ , pk, name, relays, expiration] = payload
            try{
                if (linkManager.isSigExpired(expiration)){
                    throw new Error()
                }
            } catch {
                this.handlers.onError("The link as expired. Please retry with a new one")
                return
            }
            
            try {
                if (!await linkManager.checkSigValidity(sig, pk, expiration, ogPayload)){
                    throw new Error()
                }
            } catch {
                this.handlers.onError("The signature is incorect. Someone might be trying to deceive you.")
                return
            }
            const filteredRelays = relays.filter((relay) => linkManager.isValidWssUrl(relay))
            const finalRelays = filteredRelays.length ? filteredRelays : DEFAULT_RELAYS
            
            this.handlers.onNewExchange(pk, name, finalRelays)
        } finally {
            this.lastProcessedUrl = null
        }   
    }

    cleanup(){
        this.subscription?.remove()
    }
}

class DeepLinkSingleton {
    private instance: DeepLink | null = null

    async initialize(handlers: Handlers){
        this.instance = new DeepLink(handlers)
        await this.instance.initialize()
    }

    getInstance(): DeepLink | null {
        return this.instance
    }

    cleanup() {
        this.instance?.cleanup()
    }
}

export const deepLinkService = new DeepLinkSingleton()