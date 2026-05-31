import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DEFAULT_DICE, useGame } from '@/context/game-context';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const { timerMinutes, setTimerMinutes, dice, setDice, hasCustomSavedDice } = useGame();
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
      paddingTop: 0,
      paddingBottom: Spacing.four,
    },
  });

  const sanitizeDieFaceInput = (value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z]/g, '').slice(0, 2);

    if (lettersOnly.length === 0) return '';
    if (lettersOnly.length === 1) return lettersOnly.toUpperCase();

    return `${lettersOnly[0].toUpperCase()}${lettersOnly[1].toLowerCase()}`;
  };

  const updateFace = (dieIndex: number, faceIndex: number, value: string) => {
    const sanitizedValue = sanitizeDieFaceInput(value);
    const newDice = dice.map((die, i) =>
      i === dieIndex ? die.map((face, j) => (j === faceIndex ? sanitizedValue : face)) : die,
    );
    setDice(newDice);
  };

  const resetToDefaults = () => {
    setDice(DEFAULT_DICE.map((die) => [...die]));
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{ bottom: insets.bottom }}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.pageTitle}>
          Settings
        </ThemedText>

        {/* Timer Duration */}
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Timer Duration
          </ThemedText>
          <View style={styles.timerRow}>
            {[1, 2, 3, 4, 5].map((min) => (
              <Pressable
                key={min}
                style={({ pressed }) => [
                  styles.timerButton,
                  {
                    backgroundColor: timerMinutes === min ? theme.backgroundSelected : theme.background,
                    borderColor: timerMinutes === min ? theme.text : theme.textSecondary,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => setTimerMinutes(min)}
              >
                <ThemedText
                  style={[
                    styles.timerButtonText,
                    { color: timerMinutes === min ? theme.text : theme.textSecondary },
                  ]}
                >
                  {min}m
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>

        {/* Dice Configuration Header */}
        <View style={styles.diceSectionHeader}>
          <ThemedText type="smallBold">Dice Configuration</ThemedText>
          {hasCustomSavedDice && (
            <Pressable
              style={({ pressed }) => [
                styles.resetButton,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={resetToDefaults}
            >
              <ThemedText type="small" themeColor="textSecondary">
                Reset to Defaults
              </ThemedText>
            </Pressable>
          )}
        </View>

        {dice.map((die, dieIndex) => (
          <ThemedView key={dieIndex} type="backgroundElement" style={styles.dieCard}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Die {dieIndex + 1}
            </ThemedText>
            <View style={styles.facesRow}>
              {die.map((face, faceIndex) => (
                <TextInput
                  key={faceIndex}
                  value={face}
                  onChangeText={(value) => updateFace(dieIndex, faceIndex, value)}
                  style={[
                    styles.faceInput,
                    {
                      color: theme.text,
                      backgroundColor: theme.background,
                      borderColor: theme.backgroundSelected,
                    },
                  ]}
                  maxLength={2}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  selectTextOnFocus
                />
              ))}
            </View>
          </ThemedView>
        ))}
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
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  sectionLabel: {
    marginBottom: Spacing.one,
  },
  timerRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  timerButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  diceSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  resetButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 6,
  },
  dieCard: {
    borderRadius: 10,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  facesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  faceInput: {
    width: 42,
    height: 42,
    borderRadius: 6,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});
