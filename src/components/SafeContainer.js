// RNFS
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";

// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

export default function SafeContainer({ children }) {
  return (
    <LinearGradient
      colors={["#F3EEDD", "#fffff2", "#F3EEDD"]}
      style={estilos.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView>{children}</SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
