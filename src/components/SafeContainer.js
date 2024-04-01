// RNFS
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import * as SplashScreen from "expo-splash-screen";

// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

export default function SafeContainer({ children }) {
  return (
    <View style={estilos.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView>{children}</SafeAreaView>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3EEDD",
    paddingVertical: 30,
  },
});
