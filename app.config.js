export default {
  expo: {
    name: "WhosUp",
    slug: "whosUp",
    owner : 'velomarchand',
    version: "1.0.0",
    orientation: "portrait",
    icon: './assets/icon.png',
    userInterfaceStyle: "light",
    splash: {
      image: './assets/splash.png',
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },
    extra: {
      eas: {
        projectId: "3e85fa30-fc15-4e46-805e-c1d768961bd7"
      },
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/3e85fa30-fc15-4e46-805e-c1d768961bd7"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: 'com.whosup.app',
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
    },
    web: {
      favicon: './assets/favicon.png'
    }
  },
  assetBundlePatterns: [
    "**/*",
  ],
}
