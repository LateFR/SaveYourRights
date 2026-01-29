import { useTheme } from '@/hooks/useTheme';
import { Pressable, StyleSheet, View, Text} from 'react-native';
import { linkManager } from '@/nostr/link';
import { useEffect, useState } from 'react';
import { QRCodeSection } from '@/components/exchange/QRCodeSection';
import { QRCodeScanner } from '@/components/exchange/QRCodeScanner';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { deepLinkService } from '@/services/DeepLink';
import { ErrorPopup } from '@/components/ErrorPopup';

export default function ModalScreen() {
  const theme = useTheme() 
  const [link, setLink] = useState<string | null>(null)
  const [scanning, setScanning] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const generateLink = async () => {
    try {
      setError(null)
      setLink(await linkManager.makeLink())
    } catch (e) {
      setError("Failed to generate link")
    }
  }
  useEffect(() => {
    generateLink()
  }, [])

  const onScanned = (data: string) => {
    setScanning(false)
    setError(null)
    if (!data.startsWith("saveyourrights://c?p=")){
      setError("The QR code isn't valid") 
      return
    }
    
    deepLinkService.getInstance()?.handleURL(data)
  }
  if (scanning){
    return (
      <QRCodeScanner setScanning={setScanning} onScanned={onScanned}/>
    )
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => {
        router.dismiss()
      }}> 
        <Feather name="x" size={28} color={theme.text} />
      </Pressable>
      
      {link && (
        <QRCodeSection link={link} regenerateLink={generateLink}/>
      )}
      {error && (
        <ErrorPopup message={error} onClose={() => {setError(null)}}/>
      )}
      <Pressable style={({pressed}) => [styles.scanButton, {backgroundColor: theme.interface.primary, opacity: pressed ? 0.5 : 1}]} onPress={() => setScanning(true)}> 
          <Text style={[styles.qrCodeText, {color: "white"}]}> Scan </Text>
          <Ionicons name="qr-code" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    position: 'absolute',
    bottom: 190,
    width: 230,
    height: 60,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row"
  }, 
  closeButton: {
    position: 'absolute',
    top: 25,
    left: 25
  },
  qrCodeText: {
    marginRight: 10,
    fontSize: 22
  }

})
