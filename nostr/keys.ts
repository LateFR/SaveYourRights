import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { nip44, nip19 } from "nostr-tools";
import * as SecureStore from 'expo-secure-store'
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';
import * as Crypto from 'expo-crypto';
import * as ecc from '@bitcoinerlab/secp256k1';
import { sha256 } from '@noble/hashes/sha2.js'
export const SK_KEY = 'sk_key'

export const KeyManager = {
    _getSecretHex(){
        const sk = SecureStore.getItem(SK_KEY)
        if (!sk) throw new Error("No Secret Key stored")
        return sk
    },
    
    _getSecretBytes(){
        const skHex = this._getSecretHex()
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
            await this.generateAndSaveKeys()
            return true
        } catch (e) {
            console.error("Error while ensuring the identity: ", e)
            return false
        }
    },
    
    async generateAndSaveKeys(){
        let sk = generateSecretKey()
        await SecureStore.setItemAsync(SK_KEY, bytesToHex(sk))
        console.log("Pk: ", this.encodeToNip19(this.getPublicKey()))
    },
    
    async signEvent(event: {kind: number, tags: string[][], content: string}){
        return finalizeEvent({
            ...event,
            created_at: Math.floor(Date.now()/1000)
        }, this._getSecretBytes())
    },
    
    getPublicKey(){
        return getPublicKey(this._getSecretBytes())
    },
    
    encodeToNip19(hexKey: string){
        return nip19.npubEncode(hexKey)
    },
    
    decodeFromNip19(npub: string){
        return nip19.decode(npub).data as string
    },
    
    async encryptToNip44(toPk: string, content:string){
        const convKey = nip44.getConversationKey(this._getSecretBytes(), toPk)
        return nip44.encrypt(content, convKey)
    },
    
    async decryptFromNip44(fromPk: string, content:string){
        const convKey = nip44.getConversationKey(this._getSecretBytes(), fromPk)
        return nip44.decrypt(content, convKey)
    },
    
    async signPayload(payload: Uint8Array<ArrayBuffer>): Promise<Uint8Array>{
        // Hash avec expo-crypto
        const hash = sha256(payload);
        
        // Convertir en Uint8Array (pas Buffer, @bitcoinerlab préfère Uint8Array)
        const privKeyBytes = this._getSecretBytes();
        
        // Signer avec Schnorr
        const sig = ecc.signSchnorr(hash, privKeyBytes);
        
        return sig;
    },
    
    async verifySig(sig: Uint8Array, pk: string, payload: Uint8Array){
        const hash = sha256(payload)
        
        const pubKeyBytes = hexToBytes(pk);
        
        return ecc.verifySchnorr(hash, pubKeyBytes, sig);
    }
}