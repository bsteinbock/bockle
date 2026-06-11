const isDev = process.env.APP_VARIANT === 'development';

const appName = isDev ? 'Bockle (Dev)' : 'Bockle';
const appScheme = isDev ? 'bockle-dev' : 'bockle';
const appId = isDev ? 'com.billsteinbock.bockle.dev' : 'com.billsteinbock.bockle';
const easProjectId = '69869262-8abe-4265-9aaa-cff224234ebb';

module.exports = {
  expo: {
    name: appName,
    slug: 'bockle',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: appScheme,
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: `https://u.expo.dev/${easProjectId}`,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0,
    },
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      icon: './assets/expo.icon',
      bundleIdentifier: appId,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: appId,
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-image',
      [
        'expo-dev-client',
        {
          addGeneratedScheme: isDev,
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          android: {
            image: './assets/images/splash-icon.png',
            imageWidth: 76,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      appVariant: isDev ? 'development' : 'production',
      eas: {
        projectId: easProjectId,
      },
    },
    owner: 'bsteinbk',
  },
};
