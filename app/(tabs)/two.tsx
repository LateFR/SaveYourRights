import { useTheme } from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

import { View, Text } from 'react-native';

export default function TabTwoScreen() {
  const theme = useTheme()
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: theme.text}]}>Tab Two</Text>
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
