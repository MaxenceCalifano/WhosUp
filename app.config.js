export default {
  expo: {
    name: "WhosUp",
    slug: "whosUp",
    owner : 'velomarchand',
    version: "1.0.0",
    orientation: "portrait",
    icon: 'icon.png',
    userInterfaceStyle: "light",
    splash: {
      image: 'splash.png',
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      eas: {
        projectId: "3e85fa30-fc15-4e46-805e-c1d768961bd7"
      },
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "assets/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      package: 'com.whosup.app',
      adaptiveIcon: {
        foregroundImage: 'adaptive-icon.png',
        backgroundColor: "#FFFFFF"
      },
    },
    web: {
      favicon: 'favicon.png'
    }
  }
}
