import { Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function UserDocScreen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const bottomInset = safeAreaInsets.bottom + BottomTabInset + Spacing.three;

  const contentPlatformStyle = Platform.select({
    android: {
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
      paddingBottom: bottomInset,
    },
    web: {
      paddingTop: 0,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentInset={{ bottom: bottomInset }}
        contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      >
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle" style={styles.pageTitle}>
            Bockle Game Info
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="mediumBold" style={styles.sectionLabel}>
              Object of the Game
            </ThemedText>
            <ThemedText>
              Find as many words as possible using the 4x4 grid of dice before time runs out. Words must be at
              least 3 characters and can only be formed from adjacent dice. Each die can only be used once per
              word.
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="mediumBold" style={styles.sectionLabel}>
              How to Score
            </ThemedText>
            <ThemedText>1. At the end of a round, compare your words with other players.</ThemedText>
            <ThemedText>2. Any word used by another player scores 0.</ThemedText>
            <ThemedText>3. Add the number of characters from each word that only you found.</ThemedText>
            <ThemedText>
              4. Your total score is the sum of the character counts of all unique words.
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="mediumBold" style={styles.sectionLabel}>
              Customization
            </ThemedText>
            <ThemedText>
              In Settings, you can customize both the timer length (1 to 5 minutes) and the characters shown
              on each face of all 16 dice.
            </ThemedText>
            <ThemedText>
              Timer length, dice configuration, and timer-expiration alert preferences are saved between
              sessions.
            </ThemedText>
            <ThemedText>
              On mobile devices, you can also choose how the app alerts you when time expires: Speak or
              Vibrate.
            </ThemedText>
            <ThemedText>
              If Speak is selected, you can customize the spoken Alert Text. The default is "Time's up".
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.section}>
            <ThemedText type="mediumBold" style={styles.sectionLabel}>
              Testing Alert Mode
            </ThemedText>
            <ThemedText>1. Open Settings and set Timer Expiration Alert to Speak or Vibrate.</ThemedText>
            <ThemedText>2. If using Speak, edit Alert Text and save by leaving the field.</ThemedText>
            <ThemedText>3. Tap Test Alert to confirm the selected behavior immediately.</ThemedText>
            <ThemedText>
              4. Start a round and let the timer reach 0:00 to verify in-game expiration feedback.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    flexGrow: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Platform.OS === 'ios' ? Spacing.three : 0,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  pageTitle: {
    marginBottom: Spacing.two,
  },
  section: {
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  sectionLabel: {
    marginBottom: Spacing.one,
  },
});
