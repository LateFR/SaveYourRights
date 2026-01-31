import { nostrManager } from "./nostr"

export const contactManager = {
    async addNewContact(pk: string , name: string = "USER", relays: string[]){

        const results = await Promise.all(
            relays.map(async (relay) => {
                const reachable = await nostrManager.isRelayReachable(relay)
                return { relay, reachable}
            })
        )
        const reachableRelays = results.filter(r => r.reachable).map(r => r.relay)

        console.log("Reachable relays: ", relays)

        if (!reachableRelays) throw new Error("The contact "+pk+" doesn't have reachable relays")
    },
}