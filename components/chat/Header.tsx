import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from "expo-router";

export function Header({name, id}: {name: string, id: string}){
    const theme = useTheme()
    return (
        <View style={[ style.container, { backgroundColor: theme.interface.paleBackround}]}>
            <Pressable style={style.backButton} onPress={() => {router.back()}}>
                <Ionicons name="arrow-back-outline" size={30} color={theme.text} />
            </Pressable>
            <View style={style.centerContent}> 
                <Ionicons name="person-circle-outline" size={40} color={theme.text} />
                <TouchableOpacity>

                    <Text style={[style.textName, { color: theme.text}]} > {name} </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        zIndex: 1000
    },
    textName: {
        fontSize: 18,
        fontWeight: "400",
        marginVertical: 10,
        marginLeft: 1,
        marginRight: 100,
    },
    backButton: {
        padding: 5
    },
    centerContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginLeft: 20
    },
    profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
})

