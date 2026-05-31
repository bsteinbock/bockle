import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { DEFAULT_DICE, DEFAULT_EXPIRY_ALERT_TEXT, useGame } from '@/context/game-context';
import { useTheme } from '@/hooks/use-theme';
import { playTimerExpiredAlert } from '@/utils/timer-alert';

export default function SettingsScreen() {
  const {
    timerMinutes,
    setTimerMinutes,
    dice,
    setDice,
    hasCustomSavedDice,
    expiryAlertMode,
    setExpiryAlertMode,
    expiryAlertText,
    setExpiryAlertText,
    expiryAlertVolume,
    setExpiryAlertVolume,
  } = useGame();
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
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

          {Platform.OS !== 'web' && (
            <ThemedView type="backgroundElement" style={styles.section}>
              <ThemedText type="smallBold" style={styles.sectionLabel}>
                Timer Expiration Alert
              </ThemedText>
              <View style={styles.alertModeRow}>
                {(['speak', 'vibrate'] as const).map((mode) => {
                  const isSelected = expiryAlertMode === mode;

                  return (
                    <Pressable
                      key={mode}
                      style={({ pressed }) => [
                        styles.alertModeButton,
                        {
                          backgroundColor: isSelected ? theme.backgroundSelected : theme.background,
                          borderColor: isSelected ? theme.text : theme.textSecondary,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      onPress={() => setExpiryAlertMode(mode)}
                    >
                      <ThemedText
                        style={[
                          styles.alertModeButtonText,
                          { color: isSelected ? theme.text : theme.textSecondary },
                        ]}
                      >
                        {mode === 'speak' ? 'Speak' : 'Vibrate'}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                Alert Volume
              </ThemedText>
              <View style={styles.alertModeRow}>
                {[
                  { label: 'Low', value: 0.3 as const },
                  { label: 'Medium', value: 0.6 as const },
                  { label: 'High', value: 1.0 as const },
                ].map(({ label, value }) => {
                  const isSelected = expiryAlertVolume === value;

                  return (
                    <Pressable
                      key={label}
                      style={({ pressed }) => [
                        styles.alertModeButton,
                        {
                          backgroundColor: isSelected ? theme.backgroundSelected : theme.background,
                          borderColor: isSelected ? theme.text : theme.textSecondary,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      onPress={() => setExpiryAlertVolume(value)}
                    >
                      <ThemedText
                        style={[
                          styles.alertModeButtonText,
                          { color: isSelected ? theme.text : theme.textSecondary },
                        ]}
                      >
                        {label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                Alert Text (for Speak mode)
              </ThemedText>
              <View style={styles.alertTextRow}>
                <TextInput
                  value={expiryAlertText}
                  onChangeText={setExpiryAlertText}
                  onBlur={() => {
                    const normalized =
                      expiryAlertText.length === 0 ? DEFAULT_EXPIRY_ALERT_TEXT : expiryAlertText;
                    if (normalized !== expiryAlertText) setExpiryAlertText(normalized);
                  }}
                  style={[
                    styles.alertTextInput,
                    {
                      color: theme.text,
                      backgroundColor: theme.background,
                      borderColor: theme.backgroundSelected,
                    },
                  ]}
                  placeholder={DEFAULT_EXPIRY_ALERT_TEXT}
                  placeholderTextColor={theme.textSecondary}
                  maxLength={80}
                  autoCorrect={false}
                  autoCapitalize="sentences"
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.resetAlertTextButton,
                    {
                      backgroundColor: theme.backgroundElement,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => setExpiryAlertText(DEFAULT_EXPIRY_ALERT_TEXT)}
                >
                  <ThemedText type="small" themeColor="textSecondary">
                    Reset Alert Text
                  </ThemedText>
                </Pressable>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.testAlertButton,
                  { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => playTimerExpiredAlert(expiryAlertMode, expiryAlertText, expiryAlertVolume)}
              >
                <ThemedText type="smallBold">Test Alert</ThemedText>
              </Pressable>
            </ThemedView>
          )}

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
  alertModeRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  alertModeButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  alertModeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  alertTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  alertTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    minHeight: 40,
  },
  resetAlertTextButton: {
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    minHeight: 40,
    justifyContent: 'center',
  },
  testAlertButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 8,
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
