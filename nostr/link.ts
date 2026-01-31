import { KeyManager } from "./keys"
import { DEFAULT_RELAYS } from "@/store/nostr"
import { Buffer } from "buffer"
import { encode, decode } from "@msgpack/msgpack"

type WirePayload = [
    1, //Version
    string, // privateKey
    string[], //relays
    number, //expiration
]
const SUPPORTED_LINK_VERSION = 1

export const linkManager = {
    async makeLink() {
        const payload: WirePayload = [
            1,
            KeyManager.getPublicKey(),
            DEFAULT_RELAYS,
            Math.floor(Date.now() / 1000) + 60 * 10
        ]
        
        const sig = await KeyManager.signPayload(encode(payload))
        
        
        const msgpackPayload = encode({payload: payload, sig});
        // Base64
        const finalEncodedPayload = this.toBase64Url(Buffer.from(msgpackPayload)); 
        
        return `saveyourrights://c?p=${finalEncodedPayload}`
    },
    decodePayload(base64Payload: string) {
        try{
            const compressedPayload = this.fromBase64Url(base64Payload)
            const { payload, sig } = decode(compressedPayload) as {payload: WirePayload, sig: Uint8Array}

            if (!this.isWirePayload(payload)) throw new Error("The payload has a bad structure");
            if (payload[0]>SUPPORTED_LINK_VERSION) throw new Error("The link version is too hight. May update the app?")

            return {payload: payload as WirePayload, sig: sig, originalPayload: encode(payload)}
        } catch (err) {
            throw new Error("Invalid payload structure: " + String(err))
        }
    },
    async checkSigValidity(sig: Uint8Array, pk: string, expiration: number, payload: Uint8Array){
        if (this.isSigExpired(expiration)) return false
        return await KeyManager.verifySig(sig, pk, payload)
    },
    isSigExpired(expiration: number){
        return expiration < Math.floor(Date.now() / 1000)
    },
    toBase64Url(buffer: Uint8Array | Buffer): string {
        return Buffer.from(buffer)
            .toString("base64")      // base64 standard
            .replace(/\+/g, "-")     // + → -
            .replace(/\//g, "_")     // / → _
            .replace(/=+$/, "")      // supprime padding =
    },
    fromBase64Url(base64url: string): Buffer {
        const base64 = base64url
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            // ajoute le padding si nécessaire
            + "=".repeat((4 - (base64url.length % 4)) % 4)

        return Buffer.from(base64, "base64")
    },
    isWirePayload(payload: any): payload is WirePayload {
        return Array.isArray(payload) &&
            payload.length === 4 &&
            typeof payload[0] === "number" &&
            typeof payload[1] === "string" &&
            Array.isArray(payload[2]) &&
            typeof payload[3] === "number"
    },
    isValidWssUrl(url: string): boolean {
        try {
            const parsed = new URL(url)
            return parsed.protocol == "wss:"
        } catch (e) {
            console.log(e)
            return false
        }
    }
}