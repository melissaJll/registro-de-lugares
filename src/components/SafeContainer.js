// RNFS
import { SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";

// import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function SafeContainer({ children }) {
  return (
    <LinearGradient
      colors={["#F0FFFF", "#fffff2", "#d7f6fc"]}
      style={estilos.container}
    >
      <SafeAreaView onLayout={aoAtualizarLayout} style={estilos.container}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});