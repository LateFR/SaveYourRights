import { deepLinkService, Handlers } from "@/services/DeepLink";
import { useEffect, useRef } from "react";

export function useDeepLink({onNewExchange, onError}: Handlers){
    useEffect(() => {
        deepLinkService.initialize({
            onNewExchange,
            onError
        })
    }, [onNewExchange, onError])
}