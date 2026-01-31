import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Contact = { pk: string, name: string }
type messagesState = {
    contacts: Contact[] | [],
    addContact: ( contact:  Contact) => void
    removeContact: ( pk: string ) => void
    getPkWithName: ( name: string) => string | undefined
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
            return contact?.pk
        }
    }), {
        name: "messages-storage",
        storage: createJSONStorage(() => AsyncStorage)
    }
    )
)