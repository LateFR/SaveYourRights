import { useNostrStore } from "@/store/nostr";
import { KeyManager } from "./keys";
import { SimplePool, SubCloser } from 'nostr-tools/pool'
import { DEFAULT_RELAYS } from "@/store/nostr";
import { useMessagesStore } from "@/store/messages";
import { NostrEvent } from "nostr-tools";

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
    processedEventIds: new Set<string>(),
    tempSubs: new Map<string, SubCloser>(),

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
                    await nostrManager.handleOnEvent(event)
                },
            }
        )
    },
    async addRelaysToListen(newRelays: string[]){
        const lastSubCheck = useNostrStore.getState().lastSubCheck
        const currentRelays = useNostrStore.getState().relaysToListen

        const filter = {
            kinds: [APP_KIND],
            "#p": [KeyManager.getPublicKey()],
            since: Math.floor(lastSubCheck/1000)
        }

        for (const relay of newRelays){
            if (this.tempSubs.has(relay) || currentRelays.includes(relay)) continue

            const sub = this.pool.subscribe([relay], filter, {
                async onevent(event){
                    await nostrManager.handleOnEvent(event)
                },
            })

            this.tempSubs.set(relay, sub)
        }
        useNostrStore.getState().addRelaysToListen(newRelays)

    },
    stopListening(){
        this.activeSub?.close()
        this.activeSub = null
        
        for (const sub of this.tempSubs.values()){
            sub.close()
        }

        this.tempSubs.clear()
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
    },
    async handleOnEvent(event: NostrEvent){
        if (nostrManager.processedEventIds.has(event.id)) return
        nostrManager.processedEventIds.add(event.id)

        useNostrStore.getState().setLastSubCheck(Date.now())

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
                read: false,
                timestamp: event.created_at,
                id: event.id
            })
        } 

        if (decrypted.action == "connect_request"){
            if (useMessagesStore.getState().contacts.some(c => c.pk == event.pubkey)){
                useMessagesStore.getState().setStatus(event.pubkey, "ESTABLISHED")
                const payload: Payload = {
                    action: "accept_request",
                    info: {},
                    v: VERSION
                }

                await nostrManager.send(payload, event.pubkey)
                return
            }
            useMessagesStore.getState().addContact({
                name: decrypted.info.name as string,
                pk: event.pubkey,
                status: "RECEIVED",
                messages: []
            })
            const relays: string[] = decrypted.info.relays as string[];
            const reachableRelays = await Promise.all(
                relays.map(async r => ({
                    relay: r,
                    reachable: await nostrManager.isRelayReachable(r)
                }))
            ).then(results => results.filter(r => r.reachable).map(r => r.relay))
            
            console.log("reachable relay: ", reachableRelays)
            this.addRelaysToListen(reachableRelays);
        }

        if (decrypted.action == "accept_request"){
            if (!useMessagesStore.getState().contacts.some(c => c.pk == event.pubkey)){
                const payload: Payload = {
                    action: "removed_contact",
                    info: {},
                    v: VERSION
                }
                await nostrManager.send(payload, event.pubkey)
            }
            useMessagesStore.getState().setStatus(event.pubkey, "ESTABLISHED")
        }

        if (decrypted.action == "removed_contact"){
            useMessagesStore.getState().setStatus(event.pubkey, "PROPOSED")
        }
    }
}