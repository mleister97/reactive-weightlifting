import {ConfigContext, ExpoConfig} from '@expo/config';

export default ({config}: ConfigContext): ExpoConfig => ({
    ...config,
    entryPoint: "./src/App.tsx",
    name: "react-fit",
    platforms: ["ios", "android"],
    slug: "react-fit",
    description: "react-fit App",
    version: "1", // 206 for IOS
    // primaryColor: "#ff5b00",
    sdkVersion: "40.0.0",
    orientation: "portrait",
    // icon: "./assets/icon.png",
    // splash: {
    //     image: "./assets/icon.png",
    //     resizeMode: "contain",
    //     backgroundColor: "#ffffff"
    // },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        "**/*"
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "at.crossplatform.reactfit",
        buildNumber: "1",
        config: {
            usesNonExemptEncryption: false
        }
    },
    android: {
        package: "at.crossplatform.reactfit",
        versionCode: 1,
        permissions: []
    },
})
