import { useNostrStore } from "@/store/nostr";
import { KeyManager } from "./keys";
import { SimplePool, SubCloser } from 'nostr-tools/pool'
import { DEFAULT_RELAYS } from "@/store/nostr";
import { useMessagesStore } from "@/store/messages";

const APP_KIND = 30473
export const ACCEPTED_VERSION = 1.0
export const VERSION = 1.0
export type Payload = {
    action: "message" | "connect_request" | "accept_request" | "removed_contact",
    info: Record<string, unknown>,
    v: number
}
export const nostrManager = {
    pool: new SimplePool(),
    activeSub: null as SubCloser | null,
    async send(payload: Payload, toPk: string , relays: string[] = DEFAULT_RELAYS, createdAt?: number){
        if (!KeyManager.hasKey()) throw new Error("Keys aren't generated")
        
        const stringPayload = JSON.stringify(payload) 
        const ciphertext = await KeyManager.encryptToNip44(toPk, stringPayload)

        const event = {
            content: ciphertext, 
            kind: APP_KIND,
            tags: [["p", toPk]],
            created_at: createdAt ?? Math.floor(Date.now() / 1000)
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
                    const decrypted: Payload = JSON.parse(await KeyManager.decryptFromNip44(event.pubkey, event.content))
                    console.log("Event receveid: ", decrypted)
                    if (decrypted.v < ACCEPTED_VERSION ){
                        console.error("Version unaccepted: ", decrypted)
                        return
                    }
                    if (decrypted.action == "message"){
                        
                        useMessagesStore.getState().addMessage(event.pubkey, {
                            from_pk: event.pubkey,
                            message: decrypted.info.message as string,
                            timestamp: event.created_at,
                            id: event.id
                        })
                    } 

                    if (decrypted.action == "connect_request"){
                        useMessagesStore.getState().addContact({
                            name: decrypted.info.name as string,
                            pk: event.pubkey,
                            status: "RECEIVED",
                            messages: []
                        })
                        const relays: string[] = decrypted.info.relays as string[];
                        const reachableRelays = [];

                        for (const r of relays) {
                            if (await nostrManager.isRelayReachable(r)) {
                                reachableRelays.push(r);
                            }
                        }
                        console.log("reachable relay: ", reachableRelays)
                        useNostrStore.getState().addRelaysToListen(reachableRelays);
                    }

                    if (decrypted.action == "accept_request"){
                        useMessagesStore.getState().setStatus(event.pubkey, "ESTABLISHED")
                    }

                    if (decrypted.action == "removed_contact"){
                        useMessagesStore.getState().setStatus(event.pubkey, "PROPOSED")
                    }
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
            }, timeout)

            ws.onopen = () => {
                clearTimeout(timer)
                ws.close()
                resolve(true)
            }

            ws.onclose = () => {
                clearTimeout(timer)
                ws.close()
                resolve(false)
            }
        })
    } 
}