# Bockle

Bockle is a small cross-platform word game built with Expo and React Native. It presents a 4x4 grid of randomized dice, runs a configurable round timer, and includes in-app rules plus a settings screen for adjusting both the timer and the dice faces.

The app uses Expo Router, Expo SDK 56, and React 19. The route files live under `src/app`, and shared game configuration is provided through a React context.

## Features

- 4x4 dice grid with a fresh roll at the start of each round
- Round timer with start, pause, resume, and quit controls
- Visual urgency states as the timer approaches zero
- Web buzzer audio and native vibration when time expires
- Configurable timer length from 1 to 5 minutes
- Editable faces for all 16 dice, including multi-character faces like `Qu`
- Built-in game info screen with scoring rules
- Native tab navigation for Game, Settings, and Info

## How The Game Works

1. Start a round from the Game tab.
2. Bockle rolls all 16 dice and reveals one face from each die.
3. Players find as many words as possible before the timer expires.
4. At the end of the round, players compare lists.
5. Any word found by another player scores `0`.
6. Each unique word scores the number of characters in that word.

## Tech Stack

- Expo SDK 56
- Expo Router
- React 19
- React Native 0.85
- TypeScript
- ESLint via `eslint-config-expo`
- EAS build configuration for development, preview, and production builds

## Project Structure

```text
src/
   app/
      _layout.tsx      Expo Router layout, theme provider, game provider, splash overlay
      index.tsx        Main Bockle game screen
      settings.tsx     Timer and dice configuration
      userDoc.tsx      In-app rules and scoring information
   components/        Reusable UI components and native tab setup
   constants/         Theme tokens and layout constants
   context/           Shared game state, including default dice and timer settings
   hooks/             Theme and platform hooks
```

## Getting Started

### Prerequisites

- Current Node.js LTS release
- npm
- Xcode for iOS simulator work on macOS
- Android Studio for Android emulator work
- Expo account and EAS CLI if you plan to create cloud builds

### Install Dependencies

```bash
npm install
```

### Start The App

```bash
npm run start
```

Useful variants:

```bash
npm run ios
npm run android
npm run web
```

## Available Scripts

```bash
npm run start
npm run ios
npm run android
npm run web
npm run lint
npm run eas:init
npm run build:dev:ios
npm run build:dev:android
npm run build:dev:simulator
```

## Build Profiles

EAS is configured in `eas.json` with these profiles:

- `development`: internal distribution development client build
- `development-simulator`: iOS simulator development client build
- `preview`: internal preview build
- `production`: production build with auto-incrementing version

## Application Notes

- The default round length is 3 minutes.
- Default dice are defined in the shared game context and can be reset from Settings.
- Game state is currently in-memory only; timer and dice customizations reset when the app restarts.
- The app supports web, iOS, and Android through Expo.

## Key Implementation Details

- `src/app/index.tsx` handles dice rolling, timer lifecycle, and end-of-round feedback.
- `src/context/game-context.tsx` stores the timer length and dice definitions shared across screens.
- `src/app/settings.tsx` allows editing each die face directly and restoring defaults.
- `src/components/app-tabs.tsx` defines the native bottom-tab navigation.

## Development Notes

- The app entry point is `expo-router/entry`.
- Expo Router typed routes and the React Compiler experiment are enabled in `app.json`.
- Splash behavior is configured with `expo-splash-screen` and a custom animated overlay.

## License

This project is licensed under the terms in `LICENSE`.
