import { useTheme } from "@/hooks/useTheme";
import { useAppStore } from "@/store/app";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Setup(){
    const theme = useTheme()
    const setUsername = useAppStore(s => s.setUsername)
    const username = useAppStore(s => s.username)
    const isDisabled = username.trim().length === 0;
    useEffect(() => {
        setUsername("")
    }, [])
    return (
        <SafeAreaView style={[style.container, { flex: 1, backgroundColor: theme.background }]}>
            <View style={style.inputContainer}>
                <TextInput
                    placeholder="Choisis un pseudo"
                    placeholderTextColor={theme.text}
                    value={username}
                    onChangeText={setUsername}
                    style={[style.input, {
                        borderColor: theme.interface.primary,
                        color: theme.text
                    }]}
                />
                <TouchableOpacity 
                    onPress={() => router.push("/(setup)/loading")} 
                    disabled={isDisabled} 
                    style={style.iconButton}
                >
                    <Feather 
                        name="arrow-right" 
                        size={20}
                        color={isDisabled ? theme.interface.secondary : theme.text} 
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView> 
    )
}

const style = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        paddingHorizontal: 20, // ajoute du padding global
    },
    inputContainer: {
        position: 'relative', // conteneur relatif
        marginVertical: 40,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 12,
        paddingRight: 50, // CRUCIAL : espace pour la flèche
    },
    iconButton: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }], // centre verticalement (ajuste selon ta taille d'icône)
    },
    disabledButton: {
        opacity: 0.7
    },
})
