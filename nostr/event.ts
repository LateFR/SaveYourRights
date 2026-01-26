import { KeyManager } from "./keys";
import { SimplePool } from 'nostr-tools/pool'

const DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://relay.nostr.band", "wss://nos.lol"]

export const eventManager = {
    pool: new SimplePool(),
    async send(content: string, kind: number, tags: string[][] = [], relays: string[] = []){
        if (!KeyManager.hasKey()) throw new Error("Keys aren't generated")
        const event = {
            content, 
            kind,
            tags
        }

        const signedEvent = await KeyManager.signEvent(event) 
        this.pool.publish([...DEFAULT_RELAYS, ...relays], signedEvent)
        return signedEvent
    } 
}