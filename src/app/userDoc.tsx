import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function UserDocScreen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.pageTitle}>
          Bockle Rules
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Object of the Game
          </ThemedText>
          <ThemedText>
            Find as many words as possible using the 4x4 grid of dice before time runs out.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            How to Score
          </ThemedText>
          <ThemedText>
            1. At the end of a round, compare your words with other players.
          </ThemedText>
          <ThemedText>
            2. Any word used by another player scores 0.
          </ThemedText>
          <ThemedText>
            3. Add the number of characters from each word that only you found.
          </ThemedText>
          <ThemedText>
            4. Your total score is the sum of the character counts of all unique words.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Customization
          </ThemedText>
          <ThemedText>
            In Settings, you can customize both the timer length (1 to 5 minutes) and the
            characters shown on each face of all 16 dice.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
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
