import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { nip44, nip19 } from "nostr-tools";
import * as SecureStore from 'expo-secure-store'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

export const SK_KEY = 'sk_key'
export const KeyManager = {
    async _getSecretHex(): Promise<string> {
        const sk = await SecureStore.getItemAsync(SK_KEY)
        if (!sk) throw new Error("No Secret Key stored")
        return sk
    },
    async _getSecretBytes(): Promise<Uint8Array> {
        const skHex = await this._getSecretHex()
        return hexToBytes(skHex)
    },
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
        console.log("Pk: ", this.encodeToNip19(await this.getPublicKey()))
    },
    async signEvent(event: {kind: number, tags: string[][], content: string}){
        return finalizeEvent({
            ...event,
            created_at: Math.floor(Date.now()/1000)
        }, await this._getSecretBytes())
    },
    async getPublicKey(){
        return getPublicKey(await this._getSecretBytes())
    },
    encodeToNip19(hexKey: string){
        return nip19.npubEncode(hexKey)
    },
    decodeFromNip19(npub: string){
        return nip19.decode(npub).data as string
    },
    async encryptToNip44(toPk: string, content:string){
        const convKey = nip44.getConversationKey(await this._getSecretBytes(), toPk)
        return nip44.encrypt(content, convKey)
    },
    async decryptFromNip44(fromPk: string, content:string){
        const convKey = nip44.getConversationKey(await this._getSecretBytes(), fromPk)
        return nip44.decrypt(content, convKey)
    }
}
