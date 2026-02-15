import { StyleSheet, Text, View } from "react-native"

export function PendingContact(){
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.primaryText}>This contact has not yet accepted you</Text>
        <Text style={styles.secondaryText}>He will not receive your messages</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  card: {
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'center',
  },
})