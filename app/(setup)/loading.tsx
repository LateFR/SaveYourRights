import { View, ActivityIndicator, StyleSheet } from "react-native"
import { KeyManager } from "@/nostr/keys"
import { useEffect } from "react"
import { useAppStore } from "@/store/app"
import { router } from "expo-router"
import { useNostrStore } from "@/store/nostr"
export default function LoadingView(){
    const setFirstLaunch = useAppStore((state) => state.setFirstLaunch)
    const setLastSubCheck = useNostrStore((state) => state.setLastSubCheck)
    
    useEffect(() => {
        async function prepareApp(){
            await KeyManager.ensureIdentity()

            setFirstLaunch(false)
            setLastSubCheck(Date.now())
            router.replace("/(tabs)")
        }

        prepareApp()
    }, [])
    return (
        <View style={style.container}>
            <ActivityIndicator size={ 90 }/>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        marginTop: 10
    }
})