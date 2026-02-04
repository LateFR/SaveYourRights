import { useAppStore } from "@/store/app"
import { nostrManager, Payload } from "./nostr"
import { useNostrStore } from "@/store/nostr"
import { useMessagesStore, Contact } from "@/store/messages"

export const contactManager = {
    async addNewContact(pk: string , name: string = "USER", relays: string[]){

        const results = await Promise.all(
            relays.map(async (relay) => {
                const reachable = await nostrManager.isRelayReachable(relay)
                return { relay, reachable}
            })
        )
        const reachableRelays = results.filter(r => r.reachable).map(r => r.relay)

        console.log(relays, reachableRelays, results)
        if (reachableRelays.length === 0) throw new Error("The contact "+pk+" doesn't have reachable relays")
        
        await this.initHandcheck(pk, relays)
        
        const newContact: Contact = {
            pk,
            name,
            status: "PROPOSED",
            messages: []
        }
        useMessagesStore.getState().addContact(newContact)
    },
    async initHandcheck(pk: string, relays: string[]){
        const payload: Payload = {
            action: "connect_request",
            info: {name: useAppStore.getState().username, relays: useNostrStore.getState().relaysToListen.slice(0, 5)}
        }

        await nostrManager.send(payload, pk, relays)
    }
}