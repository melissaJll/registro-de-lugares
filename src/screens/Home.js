import React, { useState } from "react";
import {
  StatusBar,
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function Home() {
  const [nome, setNome] = useState("");

  return (
    <SafeAreaView style={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="Digite a Legenda do local"
        onChangeText={(textDigitado) => setNome(textDigitado)}
        // value={nome}
      />
      {nome && <Text style={estilos.text}>Local: {nome}</Text>}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
});
