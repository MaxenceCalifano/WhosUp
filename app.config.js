export default {
  expo: {
    name: "Vantivities",
    slug: "whosUp",
    owner : 'velomarchand',
    version: "1.0.4",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme :"whosup",
    splash: {
      image: './assets/splash.png',
      resizeMode: "contain",
      backgroundColor: "#F5DF4D"
    },
    build: {
      production: {
        channel: "production"
      }
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
    androidStatusBar: {
      backgroundColor: "#F5DF4D",
    },
    android: {
      package: 'com.vantivities.app',
      versionCode: 5,
      config: {
        googleMaps:{
          apiKey: "AIzaSyA8HqahYLkO53-h022oIQeztlgNvWx_6vg"
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#F5DF4D"
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
