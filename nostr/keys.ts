import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { nip44, nip19 } from "nostr-tools";
import * as SecureStore from 'expo-secure-store'
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';
import * as Crypto from 'expo-crypto';
import * as ecc from '@bitcoinerlab/secp256k1';
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
    
    async signPayload(payload: string){
        // Hash avec expo-crypto
        const hashHex = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            payload
        );
        
        // Convertir en Uint8Array (pas Buffer, @bitcoinerlab préfère Uint8Array)
        const hashBytes = hexToBytes(hashHex);
        const privKeyBytes = this._getSecretBytes();
        
        // Signer avec Schnorr
        const sig = ecc.signSchnorr(hashBytes, privKeyBytes);
        
        // Retourner en hex
        return bytesToHex(sig);
    },
    
    async verifySig(sigHex: string, pk: string, payload: string){
        const hashHex = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            payload
        );
        
        const hashBytes = hexToBytes(hashHex);
        const sigBytes = hexToBytes(sigHex);
        const pubKeyBytes = hexToBytes(pk);
        
        return ecc.verifySchnorr(hashBytes, pubKeyBytes, sigBytes);
    }
}