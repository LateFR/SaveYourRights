import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";

type Message = { pk: string; content: string; created_at: number; id: string }

type NostrState = {
    lastSubCheck: number,
    setLastSubCheck: (lastSubCheck: number) => void,
    messages: Message[],
    addMessage: (message: Message) => void,
    clearMessages: () => void
    _hasHydrated: boolean,
    setHasHydrated: (state: boolean) => void,
    relaysToListen: string[],
    addRelaysToListen: (relays: string[]) => void,
    removeRelaysToListen: (relays: string[]) => void
}

export const DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://nos.lol"]

export const useNostrStore = create(
    persist<NostrState>(
        (set)=>({
            lastSubCheck: Date.now(),
            setLastSubCheck: (lastSubCheck) => set({ lastSubCheck }), 
            messages: [],
            addMessage: (message) => {
                set((state) => {
                    if (state.messages.some(m => m.id === message.id)) {
                        return state //deduplicate
                    }
                    return {
                        lastSubCheck: Date.now(),
                        messages: [...state.messages, message]
                    }
                })
            },
            clearMessages: () => { set({ messages:  []})},
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state}),
            relaysToListen: DEFAULT_RELAYS,
            addRelaysToListen: (relays: string[]) => {set(state => {
                    const filteredRelays = relays.filter(relay => !state.relaysToListen.includes(relay))
                    return { relaysToListen: [...state.relaysToListen, ...filteredRelays ]}
                })
            },
            removeRelaysToListen: (relays: string[]) => {set(state => {
                return {relaysToListen : state.relaysToListen.filter(r => !relays.includes(r)) }
            })}
        }), {
            name: "nostr-storage",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)