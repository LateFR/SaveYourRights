import { useNostrStore } from "@/store/nostr";
import { KeyManager } from "./keys";
import { SimplePool, SubCloser } from 'nostr-tools/pool'
import { DEFAULT_RELAYS } from "@/store/nostr";

const APP_KIND = 30473
export const nostrManager = {
    pool: new SimplePool(),
    activeSub: null as SubCloser | null,
    async send(content: string, toPk: string , relays: string[] = DEFAULT_RELAYS){
        if (!KeyManager.hasKey()) throw new Error("Keys aren't generated")
        
        const ciphertext = await KeyManager.encryptToNip44(toPk, content)

        const event = {
            content: ciphertext, 
            kind: APP_KIND,
            tags: [["p", toPk]]
        }

        const signedEvent = await KeyManager.signEvent(event) 
        const pubs = this.pool.publish(relays, signedEvent)

        await Promise.allSettled(pubs)
    } ,
    async startListening(relays: string[] = []){
        const lastSubCheck = useNostrStore.getState().lastSubCheck
        this.activeSub = this.pool.subscribe(relays,
            {
                kinds: [APP_KIND],
                "#p": [KeyManager.getPublicKey()],
                since: Math.floor(lastSubCheck/1000),
            }, {
                async onevent(event) {
                    const decrypted = await KeyManager.decryptFromNip44(event.pubkey, event.content)
                    console.log("Event receveid: ", decrypted)
                    useNostrStore.getState().addMessage({
                        pk: event.pubkey,
                        content: decrypted,
                        created_at: event.created_at,
                        id: event.id
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
    },
    isRelayReachable(url: string, timeout = 5000): Promise<boolean> {
        return new Promise((resolve) => {
            const ws = new WebSocket(url)

            const timer = setTimeout(() => {
                ws.close();
                resolve(false)
            })

            ws.onopen = () => {
                clearTimeout(timer)
                ws.close()
                resolve(true)
            }

            ws.onerror = () => {
                clearTimeout(timer)
                ws.close()
                resolve(false)
            }
        })
    } 
}