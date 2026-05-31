import { TabList, TabListProps, Tabs, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';

const WEB_TAB_CLEARANCE = Spacing.six + Spacing.four + Spacing.three;
const WEB_TAB_CLEARANCE_COMPACT = WEB_TAB_CLEARANCE - Spacing.two;

export default function AppTabs() {
  const { width } = useWindowDimensions();
  const isCompact = width < 820;

  return (
    <Tabs>
      <TabSlot
        style={{
          height: '100%',
          paddingTop: isCompact ? WEB_TAB_CLEARANCE_COMPACT : WEB_TAB_CLEARANCE,
        }}
      />
      <TabList asChild>
        <CustomTabList isCompact={isCompact}>
          <TabTrigger name="home" href="/" asChild>
            <TabButton compact={isCompact}>Game</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton compact={isCompact}>Settings</TabButton>
          </TabTrigger>
          <TabTrigger name="userDoc" href="/userDoc" asChild>
            <TabButton compact={isCompact}>Info</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  compact?: boolean;
};

export function TabButton({ children, isFocused, compact, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={[styles.tabButtonView, compact && styles.tabButtonViewCompact]}
      >
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

type CustomTabListProps = TabListProps & {
  isCompact?: boolean;
};

export function CustomTabList({ isCompact, ...props }: CustomTabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView
        type="backgroundElement"
        style={[styles.innerContainer, isCompact && styles.innerContainerCompact]}
      >
        {!isCompact && (
          <ThemedText type="smallBold" style={styles.brandText}>
            Bockle
          </ThemedText>
        )}

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  innerContainerCompact: {
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  brandText: {
    marginRight: 'auto',
    height: 24,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  tabButtonViewCompact: {
    paddingHorizontal: Spacing.two,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
