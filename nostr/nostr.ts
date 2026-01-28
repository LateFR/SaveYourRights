import { useNostrStore } from "@/store/nostr";
import { KeyManager } from "./keys";
import { SimplePool, SubCloser } from 'nostr-tools/pool'

const DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://relay.nostr.band", "wss://nos.lol"]
const APP_KIND = 30473
export const nostrManager = {
    pool: new SimplePool(),
    activeSub: null as SubCloser | null,
    async send(content: string, toPk: string , relays: string[] = []){
        if (!KeyManager.hasKey()) throw new Error("Keys aren't generated")
        
        const ciphertext = await KeyManager.encryptToNip44(toPk, content)

        const event = {
            content: ciphertext, 
            kind: APP_KIND,
            tags: [["p", toPk]]
        }

        const signedEvent = await KeyManager.signEvent(event) 
        const pubs = this.pool.publish([...DEFAULT_RELAYS, ...relays], signedEvent)

        await Promise.allSettled(pubs)
    } ,
    async startListening(relays: string[] = []){
        const lastSubCheck = useNostrStore.getState().lastSubCheck
        this.activeSub = this.pool.subscribe([...relays, ...DEFAULT_RELAYS],
            {
                kinds: [APP_KIND],
                "#p": [await KeyManager.getPublicKey()],
                since: Math.floor(lastSubCheck/1000),
            }, {
                async onevent(event) {
                    const decrypted = await KeyManager.decryptFromNip44(event.pubkey, event.content)
                    console.log("Event receveid: ", decrypted)
                    useNostrStore.getState().addMessage({
                        pk: event.pubkey,
                        content: decrypted,
                        created_at: event.created_at
                    })
                },
            }
        )
    },
    stopListening(){
        if(this.activeSub){
            this.activeSub.close()
            this.activeSub = null
        }
    }
}