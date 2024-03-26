import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

import TirarFoto from "../components/TirarFoto";
import Mapa from "../components/Mapa";

export default function Home() {
  const [nome, setNome] = useState("");

  // MAPA

  return (
    <LinearGradient
      colors={["#F0FFFF", "#fffff2", "#d7f6fc"]}
      style={estilos.container}
    >
      <SafeAreaView style={estilos.container}>
        <View style={estilos.containerInput}>
          <TextInput
            style={estilos.input}
            placeholder="Digite a Legenda do local"
            onChangeText={(textDigitado) => setNome(textDigitado)}
          />
          {/* <Ionicons name="enter-outline" size={40} color="#056a80" /> */}
          <AntDesign name="enter" size={33} color="#056a80" />
        </View>
        {nome && <Text style={estilos.text}>Local: {nome}</Text>}

        <TirarFoto />
        <Mapa />
      </SafeAreaView>
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    height: 45,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginVertical: 20,
    borderColor: "#0c8ca8",
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
    color: "#056a80",
    marginVertical: 5,
    fontWeight: "bold",
  },
  containerInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
