import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Contact = { pk: string, name: string, status: "PROPOSED" | "RECEIVED" | "ETABLISHED" }
type messagesState = {
    contacts: Contact[] | [],
    addContact: ( contact:  Contact) => void
    removeContact: ( pk: string ) => void
    getPkWithName: ( name: string) => string
    getNameWithPk: ( pk: string ) => string  
}

export const useMessagesStore = create(
    persist<messagesState>((set, get) => ({
        contacts: [],
        addContact: (contact) => {set((state) => {
            if (state.contacts.some(( c ) => c.pk === contact.pk)){
                return state
            }
            return {
                contacts: [...state.contacts, contact]
            }
        })},
        removeContact: ( pk ) => {
            set((state) => ({
                contacts: state.contacts.filter((c) => c.pk !== pk)
            }))
        },
        getPkWithName: ( name ) => {
            const contact = get().contacts.find((c) => c.name === name)
            if (!contact) {
                throw new Error(`Contact not found for name: ${name}`)
            }
            return contact.pk
        },
        getNameWithPk: ( pk ) => {
            const contact = get().contacts.find((c) => c.pk === pk)
            if (!contact) {
                throw new Error(`Contact not found for pk: ${pk}`)
            }
            return contact.name
        }
    }), {
        name: "messages-storage",
        storage: createJSONStorage(() => AsyncStorage)
    }
    )
)