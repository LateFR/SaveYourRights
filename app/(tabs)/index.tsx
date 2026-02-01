import { StyleSheet, Button } from 'react-native';

import { Text, View } from 'react-native'
import { useAppStore } from '@/store/app';
import { useTheme } from '@/hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function TabOneScreen() {
  const firstLaunch = useAppStore((state) => state.firstLaunch) 
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.text}]}>{String(firstLaunch)}</Text>
      <View/>
      <Text style={{color: theme.text}}>
        Hello! This isn't the first launch
      </Text>
      <Button 
        title='Reset' 
        onPress={() => AsyncStorage.clear()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
