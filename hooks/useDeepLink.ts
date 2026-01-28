import { DeepLink, Handlers } from "@/services/DeepLink";
import { useEffect, useRef } from "react";

export function useDeepLink({onNewExchange, onError}: Handlers){
    const deepLinkServiceRef = useRef<DeepLink | null>(null)

    useEffect(() => {
        if (!deepLinkServiceRef.current){
            deepLinkServiceRef.current = new DeepLink({onNewExchange, onError})
        }

        deepLinkServiceRef.current.initialize()

        return () => {
            deepLinkServiceRef.current?.cleanup()
        }
    }, [onNewExchange, onError])
}