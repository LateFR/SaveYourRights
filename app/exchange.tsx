import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import QRCode from "react-native-qrcode-svg"
import { Text, View } from 'react-native'
import { KeyManager } from '@/nostr/keys';
import { useEffect, useState } from 'react';
export default function ModalScreen() {
  const theme = useTheme() 
  let [publicKey, setPublicKey] = useState<string | null>(null)

  useEffect(() => {
    const loadKey = async () => {
      const pk = KeyManager.encodeToNip19(await KeyManager.getPublicKey())
      setPublicKey(pk)
    }

    loadKey()
  }, [])
  return (
    <View style={styles.container}>
      {publicKey && (
      <QRCode
        value={publicKey}
        size={220}
        color="#000"
        backgroundColor="#fff"
      />
    )}


      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
