import { useTheme } from "@/hooks/useTheme"
import { StyleSheet, View, Text, Pressable, TextInput, ActivityIndicator } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import Animated, { SlideInUp, SlideInDown, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export function NewContactPopup({visible, onClose, onContinue}: {visible: boolean, onClose: () => void, onContinue: (name: string) => void}){
    const theme = useTheme()
    const [name, setName] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const scale = useSharedValue(1)
    const isValidInput = name.trim().length > 0


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }))
    const onPressIn = () => {
        scale.value = withTiming(0.96, { duration: 80 })
    }

    const onPressOut = () => {
        scale.value = withSpring(1, {
            damping: 12,
            stiffness: 200
        })
    }

    useEffect(() => {
        setName("")
        setLoading(false)
    }, [visible])
    
    if (!visible) return null
    return (
        <Animated.View 
            entering={SlideInDown}
            style={[style.overlay]}>
            <View style={[style.container,{
                backgroundColor: theme.interface.paleBackround,
                shadowColor: "#000",
                shadowOpacity: theme.isDark ? 0.6 : 0.15,
            }]}>
                {!loading && (
                <>    
                <Pressable style={[style.closeButton, {backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}]}
                    onPress={onClose} 
                > 
                    <AntDesign name="close" size={20} color={theme.text} />
                </Pressable>
                <View style={[style.avatarCircle, {backgroundColor: theme.interface.auxiliary}]}> 
                    <MaterialIcons name="person" size={70} color="white" />
                </View>
                <TextInput 
                    style={[style.userTextInput, {color: theme.text, borderColor: theme.text}]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Contact's name"
                    placeholderTextColor={theme.interface.secondary}
                />
                <Pressable
                    disabled={!isValidInput}
                    onPressIn={isValidInput ? onPressIn :  undefined}
                    onPressOut={isValidInput ? onPressOut : undefined}
                    onPress={() => {
                        if (!isValidInput) return
                        setLoading(true)
                        onContinue(name)
                    }}
                >
                    <Animated.View 
                        style={[style.continueButton, {
                            backgroundColor: isValidInput ? theme.interface.primary : theme.interface.secondary,
                            opacity: isValidInput ? 1 : 0.5
                        }, animatedStyle]}
                        
                    >
                        <Text style={{color: theme.text, fontSize: 17}}> Add </Text>
                        <FontAwesome5 name="arrow-right" size={20} color={theme.text} />
                    </Animated.View>
                </Pressable> 
                </>
                )}

                {loading && (
                    <>
                    <ActivityIndicator size={60}/>
                    <Text style={{marginTop: 20, fontSize: 15, color: theme.text}}> Wait...</Text>
                    </>
                )}
            </View>
        </Animated.View>
    )
}

const style = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        width: 320,
        paddingVertical: 32,
        paddingHorizontal: 24,
        padding: 12, 
        borderRadius: 20,
        bottom: 40,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8},

    },
    closeButton: {
        position: "absolute",
        top: 20,
        left: 20,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center"
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
        marginBottom: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    userTextInput: {
        fontSize: 20,
        minWidth: 100,
        borderWidth: 0,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: "center"
    },
    continueButton: {
        marginTop: 40,
        width: 100,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 7
    }
})