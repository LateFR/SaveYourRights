import { useTheme } from '@/hooks/useTheme';
import {StyleSheet, View, Share, Pressable, Text} from 'react-native';
import { QRCodeLink } from '@/components/exchange/QRCodePublicKey';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';


export function QRCodeSection({ link, regenerateLink }: { link: string, regenerateLink: () => void}){
    const [copied, setCopied] = useState<boolean>(false)
    const theme = useTheme()
    return (
        <View style={styles.linkContainer}>
          <QRCodeLink link={link}/>
          <Text style={[{color: theme.interface.secondary}]} > This link is valid only 10 minutes</Text>
          <View style={styles.buttonsContainer}>
            <Pressable style={({ pressed }) => [styles.shareContainer, { opacity: pressed ? 0.5 : 1, backgroundColor: theme.interface.auxiliary}]} onPress={async () => {
              await Share.share({ message: link })
            }}> 
              <Ionicons style={{marginRight: 3}} name="share-social" size={30} color="white" />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.shareContainer, { opacity: pressed ? 0.5 : 1, backgroundColor: theme.interface.auxiliary}]} disabled={copied} onPress={async () => {
              await Clipboard.setStringAsync(link)
              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 1000)
            }}>
              {copied && <Ionicons name="checkmark-sharp" size={24} color="white" />}
              {(!copied) && <AntDesign name="link" size={24} color="white" /> }
            </Pressable>
            <Pressable style={({ pressed }) => [styles.shareContainer, { opacity: pressed ? 0.5 : 1, backgroundColor: theme.interface.auxiliary}]} onPress={async () => {
              regenerateLink()
            }}> 
              <Ionicons style={{marginBottom: 3}} name="refresh-sharp" size={28} color="white" />
            </Pressable>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  linkContainer:  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 100
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 24 
  },
  shareContainer: {

    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
