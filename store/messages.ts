import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ContactStatus = "PROPOSED" | "RECEIVED" | "ESTABLISHED"
export type Contact = { pk: string, name: string, status: ContactStatus, messages: Message[] }
export type Message = {from_pk: string, message: string, read: boolean, timestamp: number, id: string}

type messagesState = {
    contacts: Contact[],
    addContact: ( contact:  Contact) => void
    removeContact: ( pk: string ) => void,
    setStatus: ( pk: string, newStatus: ContactStatus ) => void
    getPkWithName: ( name: string) => string
    getNameWithPk: ( pk: string ) => string,
    addMessage: (with_pk: string, message: Message) => void
    removeMessage: (with_pk: string, id: string) => void
    replaceMessageId: (with_pk: string, oldId: string, newId: string) => void
    getContactsByStatus: (status: ContactStatus) => Contact[]
    setRead: (pk: string, id: string, newRead: boolean) => void 
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
        setStatus:(pk, newStatus) => {
            set((state) => ({
                contacts: state.contacts.map((c) => c.pk == pk ? {...c, status: newStatus} : c)
            }))
        },
        getPkWithName: ( name ) => {
            const contact = get().contacts.find((c) => c.name === name)
            if (!contact) {
                return "Unknow"
            }
            return contact.pk
        },
        getNameWithPk: ( pk ) => {
            const contact = get().contacts.find((c) => c.pk === pk)
            if (!contact) {
                return "Unknow"
            }
            return contact.name
        },
        addMessage: (with_pk, message) => {
            if (get().contacts.find((c) => c.pk === with_pk)?.messages.find((m) => m.id == message.id)) return
            set((state) => {
                return { contacts: state.contacts.map((c) => 
                    c.pk == with_pk 
                        ? {...c, messages: [...c.messages, message ]}
                        : c
                    
                ) }
            })
        },
        removeMessage: (with_pk, id) => {
            set((state) => ({
                contacts: state.contacts.map((c) => 
                    c.pk == with_pk
                        ? {...c, messages: c.messages.filter((m) => m.id != id)}
                        : c
            )
            }))
        },
        replaceMessageId: (with_pk, oldId, newId) => {
            set((state) => ({
                contacts: state.contacts.map((c) => 
                    c.pk == with_pk
                        ? {...c, messages: c.messages.map((m) => 
                            m.id == oldId
                                ? {...m, id: newId}
                                : m
                        )}
                        : c
            )
            }))
        },
        getContactsByStatus: (status: "PROPOSED" | "RECEIVED" | "ESTABLISHED") => {
            return get().contacts.filter(c => c.status === status);
        },
        setRead: (pk, id, newRead) => {
            set((state) => ({
                contacts: state.contacts.map((c) => c.pk == pk
                    ? {...c, messages: c.messages.map(m => m.id == id 
                        ? {...m, read: newRead}
                        : m)
                    }
                    : c)
                }
            ))
        }
        

    }), {
        name: "messages-storage",
        storage: createJSONStorage(() => AsyncStorage)
    }
    )
)