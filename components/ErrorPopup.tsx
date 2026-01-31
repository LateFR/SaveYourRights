import { useTheme } from '@/hooks/useTheme';
import { View, Text, Pressable, StyleSheet, Platform, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useState } from 'react';

export function ErrorPopup({ 
  message, 
  details, 
  onClose 
}: { 
  message: string; 
  details?: string; 
  onClose: () => void 
}) {
  const theme = useTheme();
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Animated.View 
      entering={FadeIn.duration(200)} 
      exiting={FadeOut.duration(150)}
      style={styles.overlay}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      
      <Animated.View 
        entering={SlideInDown.springify().damping(130)}
        style={[
          styles.card, 
          styles.shadow, 
          { backgroundColor: theme.interface.paleBackround }
        ]}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <Text 
          style={[styles.title, { color: theme.interface.danger }]}
          accessibilityLabel="Erreur"
        >
          Error
        </Text>

        <ScrollView 
          style={styles.messageContainer}
          contentContainerStyle={styles.messageContent}
        >
          <Text style={[styles.text, { color: theme.text }]}>
            {message}
          </Text>
        </ScrollView>

        {/* Section détails techniques */}
        {details && (
          <View style={styles.detailsSection}>
            <Pressable 
              onPress={() => setDetailsOpen(!detailsOpen)}
              style={styles.detailsToggle}
              accessibilityRole="button"
              accessibilityLabel={detailsOpen ? "Masquer les détails" : "Afficher les détails"}
            >
              <Text style={[styles.detailsToggleText, { color: theme.text }]}>
                {detailsOpen ? '▼' : '>'} Details
              </Text>
            </Pressable>

            {detailsOpen && (
              <ScrollView 
                style={[
                  styles.detailsContent, 
                  { 
                    backgroundColor: theme.isDark ? '#1a1a1a' : "white",
                    borderColor: theme.interface.danger
                  }
                ]}
                contentContainerStyle={styles.detailsPadding}
              >
                <Text 
                  style={[styles.detailsText, { color: theme.text }]}
                  selectable // Permet la sélection pour copier
                >
                  {details}
                </Text>
              </ScrollView>
            )}
          </View>
        )}

        <Pressable 
          onPress={onClose} 
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.interface.primary },
            pressed && styles.buttonPressed
          ]}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
        >
          <Text style={styles.buttonText}>OK</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    maxHeight: '80%', // Augmenté pour les détails
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messageContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  messageContent: {
    flexGrow: 1,
  },
  text: { 
    fontSize: 16,
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsToggle: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  detailsToggleText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  detailsContent: {
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1,
    maxHeight: 150,
  },
  detailsPadding: {
    padding: 12,
  },
  detailsText: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    lineHeight: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: 'stretch',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: { 
    color: 'white', 
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});