import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { GameProvider } from '@/context/game-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    let isCancelled = false;

    const applyUpdateOnLaunch = async () => {
      if (__DEV__ || Platform.OS === 'web') {
        return;
      }

      try {
        const update = await Updates.checkForUpdateAsync();

        if (!update.isAvailable || isCancelled) {
          return;
        }

        await Updates.fetchUpdateAsync();

        if (!isCancelled) {
          await Updates.reloadAsync();
        }
      } catch {
        // Ignore update failures and continue launching the embedded bundle.
      }
    };

    void applyUpdateOnLaunch();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GameProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </GameProvider>
    </ThemeProvider>
  );
}
