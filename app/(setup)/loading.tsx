import { View, ActivityIndicator, StyleSheet } from "react-native"
import { KeyManager } from "@/nostr/keys"
import { useEffect } from "react"
import { useAppStore } from "@/store/app"
import { router } from "expo-router"
export default function LoadingView(){
    const setFirstLaunch = useAppStore((state) => state.setFirstLaunch)
    useEffect(() => {
        async function prepareApp(){
            await KeyManager.generateAndSaveKeys()

            setFirstLaunch(false)
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