import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

import SafeContainer from "../components/SafeContainer";
import TirarFoto from "../components/TirarFoto"; // Assuming firebase.config.js is in the same directory

import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase.config";

import app from "../../firebase.config"; // Assuming firebase.config.js is in the same directory

export default function Home() {
  return (
    <SafeContainer>
      <View style={estilos.containerFoto}>
        <Text style={estilos.tituloPrincipal}>Guarde suas lembranças</Text>
        <Text style={estilos.textoSecundario}>
          Tire uma foto, adicione a localização e uma bela descrição
        </Text>
        <TirarFoto />
      </View>
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({
  containerFoto: {
    flex: 1,
  },
  tituloPrincipal: {
    fontSize: 33,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textoSecundario: {
    fontSize: 16,
    marginBottom: 20,
  },
});
