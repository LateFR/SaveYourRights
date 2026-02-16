import { View, TextInput, Pressable, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
    inputValue: string,
    setInputValue: (value: string) => void,
    handleSendMessage: (message: string) => void
}
export default function ChatInput({ inputValue, setInputValue, handleSendMessage }: Props){
    const theme = useTheme()

    const [sendAvailable, setSendAvailable] = useState(false)

    useEffect(() => {
        if (inputValue) setSendAvailable(true)
        else setSendAvailable(false)
    }, [inputValue])
    return (
            <View style={[style.container, {backgroundColor: theme.background}]}>
                <View style={[style.inputWrapper,{
                    borderColor: theme.interface.secondary
                }]}>
                    <TextInput 
                    value={inputValue}
                    onChangeText={setInputValue}
                    style={[style.input, {
                        color: theme.text,
                    }]}
                    multiline={true}
                    />
                    <Pressable style={{margin: 8}} onPress={() => {handleSendMessage(inputValue)}} disabled={!sendAvailable}>
                        <MaterialIcons name="send" size={22} color={sendAvailable ? theme.text: theme.colors.gray[500]}/>
                    </Pressable>
                </View>
            </View>
    )
}

const style = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        borderRadius: 50,
        marginHorizontal: 5
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 50,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 0,
        
    }

})