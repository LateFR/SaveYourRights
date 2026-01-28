import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";

type NostrState = {
    lastSubCheck: number,
    setLastSubCheck: (lastSubCheck: number) => void,
    messages: {pk: string, content: string, created_at: number}[],
    addMessage: (message: {pk: string, content: string, created_at: number}) => void,
    clearMessages: () => void
    _hasHydrated: boolean,
    setHasHydrated: (state: boolean) => void
}


export const useNostrStore = create(
    persist<NostrState>(
        (set)=>({
            lastSubCheck: Date.now(),
            setLastSubCheck: (lastSubCheck) => set({ lastSubCheck }), 
            messages: [],
            addMessage: (message) => {
                set((state) => ({messages: [...state.messages, message]}))
            },
            clearMessages: () => { set({ messages:  []})},
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state})
        }), {
            name: "nostr-storage",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)