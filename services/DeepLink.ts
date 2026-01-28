import * as Linking from 'expo-linking'
import { EmitterSubscription } from 'react-native';

export type Handlers = {
    onNewExchange: (pk: string, name: string) => void,
    onError: (error: Error) => void
}
export class DeepLink{
    handlers: Handlers
    isInitialized: boolean
    subscription: EmitterSubscription | undefined
    constructor(handlers: Handlers){
        this.handlers = handlers
        this.isInitialized = false
    }

    initialize(){
        Linking.getInitialURL().then((url) => {
            if (url) this.handleURL(url)
        })
        this.isInitialized = true

        this.subscription = Linking.addEventListener("url", (event) => {
            this.handleURL(event.url)
        })
    }

    handleURL(url: string){
        this.handlers.onNewExchange(url, url)
    }

    cleanup(){
        this.subscription?.remove()
    }
}

