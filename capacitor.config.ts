import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glutenworld.app',
  appName: 'GlutenWorld',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Production build - remove server config to use built files
  // server: {
  //   url: 'https://f766b849-5442-4d85-910f-517fa17ebb2e.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // Enable screenshots and screen recording
    useLegacyBridge: false,
    // Security settings that allow screenshots
    allowMediaPlaybackInBackground: true
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    // Enable screenshots on iOS
    allowsBackgroundAudioPlayback: true,
    // Security settings that allow screenshots
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;