import { CameraView, useCameraPermissions } from 'expo-camera';
import { Pressable, View, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

type Props = {
    setScanning: (scanning: boolean) => void;
    onScanned: (data: string) => void
}
export function QRCodeScanner({setScanning, onScanned} : Props){
    const theme = useTheme()
    const [permission, requestPermission] = useCameraPermissions()

    useEffect(() => {
        const askPermission = async ()=>{
            if (!permission){
                await requestPermission()
            }
        }

        askPermission()
    }, [permission])

    if (!permission || !permission.granted) {
        return (
        <View style={styles.centerContainer}>
            <Pressable onPress={() => setScanning(false)} style={[styles.backButton, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)' }]}>
            <Ionicons name="arrow-back-sharp" size={28} color={theme.text} />
            </Pressable>

            <Text style={{ color: theme.text, marginBottom: 12 }}>Autorisez l'accès à la caméra pour scanner un QR</Text>

            <Pressable
            onPress={() => requestPermission()}
            style={[styles.actionBtn, { backgroundColor: theme.interface.primary }]}
            >
            <Text style={{ color: 'white', fontWeight: '600' }}>Autoriser la caméra</Text>
            </Pressable>
        </View>
    )}
    return (
        <View style={StyleSheet.absoluteFill}> 
            <Pressable onPress={() => setScanning(false)} style={[styles.backButton,{ zIndex: 10 }]}>
                <Ionicons name="arrow-back-sharp" size={30} color="white" />
            </Pressable>

            <CameraView 
                style={StyleSheet.absoluteFill}
                barcodeScannerSettings={{ barcodeTypes: ["qr"]}}
                onBarcodeScanned={({ data }) => onScanned(data)}
            />
            
            <View style={styles.overlay} pointerEvents="none">
                <View style={styles.frame} />
            </View>

        </View>
    )
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  // overlay structure : top / middle(row) / bottom
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  side: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    // pointerEvents none pour laisser la caméra recevoir touchs si besoin
  },
});
