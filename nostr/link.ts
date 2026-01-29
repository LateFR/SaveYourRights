import { KeyManager } from "./keys"
import { DEFAULT_RELAYS } from "./nostr"
import { Buffer } from "buffer"
import pako from "pako"

type ContactPayload = {
    p: string,
    r: string[]
    e: number
}

export const linkManager = {
    async makeLink() {
        const payload: ContactPayload = {
            p: KeyManager.getPublicKey(),
            r: DEFAULT_RELAYS,
            e: Math.floor(Date.now() / 1000) + 60 * 10
        }
        
        const sig = await KeyManager.signPayload(JSON.stringify(payload))
        
        
        // Compresser (pako)
        const compressed = pako.deflate(JSON.stringify({payload: payload, sig}));
        // Base64
        const finalEncodedPayload = Buffer.from(compressed).toString("base64"); 
        
        return `saveyourrights://c?p=${finalEncodedPayload}`
    },
    decodePayload(base64Payload: string) {
        try{
            const compressedPayload = Buffer.from(base64Payload, "base64")
            const { payload, sig } = JSON.parse(pako.inflate(compressedPayload, { to: "string"}))
            console.log(payload, sig)
            if (
                !payload.p || !payload.r || !payload.e ||
                typeof payload.p !== "string" ||
                !Array.isArray(payload.r) ||
                typeof payload.e !== "number" ||
                typeof sig !== "string"
            ) {
                throw new Error("The payload has a bad structure");
            }


            return {payload: payload as ContactPayload, sig: sig as string, originalPayload: JSON.stringify(payload)}
        } catch (err) {
            throw new Error("Invalid payload structure: " + String(err))
        }
    },
    async checkSigValidity(sig: string, pk: string, expiration: number, payload: string){
        if (this.isSigExpired(expiration)) return false
        return await KeyManager.verifySig(sig, pk, payload)
    },
    isSigExpired(expiration: number){
        return expiration < Math.floor(Date.now() / 1000)
    }
}