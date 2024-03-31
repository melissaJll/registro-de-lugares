// RNFS
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";

// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

export default function SafeContainer({ children }) {
  return (
    <ScrollView>
      <LinearGradient
        colors={["#F0FFFF", "#fffff2", "#d7f6fc"]}
        style={estilos.container}
      >
        <SafeAreaView style={estilos.container}>{children}</SafeAreaView>
      </LinearGradient>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
