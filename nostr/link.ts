import { KeyManager } from "./keys"
import { DEFAULT_RELAYS } from "./nostr"
import { Buffer } from "buffer"
import pako from "pako"
import { hexToBytes, bytesToHex } from 'nostr-tools/utils';
import { encode, decode } from '@msgpack/msgpack';
import { jsVersion } from "react-native-reanimated/lib/typescript/platform-specific/jsVersion";

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
        const compressed = pako.deflate(JSON.stringify({...payload, sig}));
        // Base64
        const finalEncodedPayload = Buffer.from(compressed).toString("base64"); // base64url = sans +/=
        
        return `exp://c?p=${finalEncodedPayload}`
    }
}