import { useTheme } from "@/hooks/useTheme"; 
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export function QRCodeLink({ link }: { link: string}){
    const theme = useTheme();
    
    return (
        <View style={[styles.qrCodeContainer,{backgroundColor: theme.interface.primary}]}>
        <QRCode
          value={link}
          size={220}
          color="#000"
          backgroundColor={theme.interface.primary}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  qrCodeContainer: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: "#000",
    margin: 100
  }
})