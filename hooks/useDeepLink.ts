import { deepLinkService, Handlers } from "@/services/DeepLink";
import { useEffect, useRef } from "react";

export function useDeepLink({onNewExchange, onError}: Handlers){
    useEffect(() => {

        const init = async () => { 
            deepLinkService.initialize({
                onNewExchange,
                onError
            })
        }
        init()
    }, [onNewExchange, onError])
}