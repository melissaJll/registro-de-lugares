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
import Mapa from "../components/Mapa";

import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase.config";

import app from "../../firebase.config"; // Assuming firebase.config.js is in the same directory

const db = getFirestore(app);
console.log("DB is", db);

export default function Home() {
  const [nome, setNome] = useState("");
  // MAPA
  const [minhaLocalizacao, setminhaLocalizacao] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  const salvarLugar = async () => {
    if (!nome || !localizacao) {
      alert("Preencha a legenda e marque um local no mapa!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "lugares"), {
        nome: nome,
        foto: "", // Assuming you have a way to get the image URL from TirarFoto component
        // localizacao: new db.firestore.GeoPoint(
        //   localizacao.latitude,
        //   localizacao.longitude
        // ),
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Lugar salvo com sucesso!"); // Informative success message
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Erro ao salvar lugar. Tente novamente."); // User-friendly error message
    }
  };

  return (
    <SafeContainer>
      <TirarFoto />

      <Mapa></Mapa>

      <Pressable onPress={salvarLugar}>
        <Text>salvar Lugar</Text>
      </Pressable>
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  text: {
    fontSize: 20,
    color: "#056a80",
    marginVertical: 5,
    fontWeight: "bold",
  },

  botaoText: {
    color: "#09768f",
    fontWeight: "600",
    fontSize: 18,
  },
  botaoMapa: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#0c8ca8",
    padding: 15,
    borderStyle: "solid",
    marginTop: 15,
    marginBottom: 25,
  },
  map: {
    width: 300,
    height: 250,
    borderRadius: 8,
  },
});
