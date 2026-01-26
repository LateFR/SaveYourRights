import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { nip19 } from "nostr-tools";
import * as SecureStore from 'expo-secure-store'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

export const SK_KEY = 'sk_key'
export const KeyManager = {
    hasKey(){
        const key = SecureStore.getItem(SK_KEY)
        return key !== null
    },
    async ensureIdentity(){
        const existingKey = await SecureStore.getItemAsync(SK_KEY)
        if (existingKey){ return true }
        try {
            generateSecretKey()
            return true
        } catch (e) {
            console.error("Error while ensuring the identity: ", e)
            return false
        }
    },
    async generateAndSaveKeys(){
        let sk = generateSecretKey()
        await SecureStore.setItemAsync(SK_KEY, bytesToHex(sk))
        console.log("Pk: ", this.getPublicKey())
    },
    async signEvent(event: {kind: number, tags: string[][], content: string}){
        const skHex = await SecureStore.getItemAsync(SK_KEY)
        if (!skHex) throw new Error("No Secret Key stored")
        const sk = hexToBytes(skHex)
        
        return finalizeEvent({
            ...event,
            created_at: Math.floor(Date.now()/1000)
        }, sk)
    },
    getPublicKey(){
        const skHex = SecureStore.getItem(SK_KEY)
        if (!skHex) throw new Error("No Secret Key stored")
        return getPublicKey(hexToBytes(skHex))
    },
    encodeToNip19(hexKey: string){
        return nip19.npubEncode(hexKey)
    },
    decodeFromNip19(npub: string){
        return nip19.decode(npub)
    }
}
