import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View , Text, Share} from 'react-native';
import { QRCodeLink } from '@/components/QRCodePublicKey';
import { linkManager } from '@/nostr/link';
import { useEffect, useState } from 'react';
export default function ModalScreen() {
  const theme = useTheme() 
  const [link, setLink] = useState<string | null>(null)

  useEffect(() => {
    async function generateLink(){
      setLink(await linkManager.makeLink())
    }

    generateLink()
  }, [])
  return (
    <View style={styles.container}>
      {link && (
        <View>
          <QRCodeLink link={link}/>
          <Text style={{color: theme.text}}> { link }</Text>
        </View>
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
  }
});
