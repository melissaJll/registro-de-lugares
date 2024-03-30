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
import { AntDesign } from "@expo/vector-icons";

import SafeContainer from "../components/SafeContainer";
import TirarFoto from "../components/TirarFoto"; // Assuming firebase.config.js is in the same directory
import { initializeApp } from "firebase/app";
import app from "../../firebase.config";
import { addDoc, collection } from "firebase/firestore";

import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase.config"; // Assuming this contains your config

// Get Firestore instance
const firestore = getFirestore();
// Para usar o Firestore, é preciso importar getFirestore de firebase/firestore e obter uma instância do Firestore:
//const db = getFirestore();

export default function Home() {
  const [nome, setNome] = useState("");
  // MAPA
  const [minhaLocalizacao, setminhaLocalizacao] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  // const db = firebase.firestore();
  // const app = initializeApp(firebaseConfig);
  // firestore()
  //   .collection("Users")
  //   .add({
  //     name: "Ada Lovelace",
  //     age: 30,
  //   })
  //   .then(() => {
  //     console.log("User added!");
  //   });

  const salvarLugar = async () => {
    if (!nome || !localizacao) {
      alert("Preencha a legenda e marque um local no mapa!");
      return;
    }
    console.log(nome);
    console.log(localizacao.longitude);
    console.log(localizacao.latitude);

    try {
      // const docRef = await addDoc(collection(db, "lugares"), {
      //   nome: nome,
      //   // Assuming you have a way to get the image URL from TirarFoto component
      //   foto: "",
      //   localizacao: new firebase.firestore.GeoPoint(
      //     localizacao.latitude,
      //     localizacao.longitude
      //   ),
      // });

      firestore()
        .collection("lugares")
        .set({
          nome: nome,
          foto: "",
          localizacao: new firebase.firestore.GeoPoint(
            localizacao.latitude,
            localizacao.longitude
          ),
        })
        .then(() => {
          console.log("User added!");
        });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Erro ao salvar lugar. Tente novamente.");
    }
  };

  const regiaoInicialMapa = {
    latitude: -23.5489,
    longitude: -46.6388,

    latitudeDelta: 0.8,
    longitudeDelta: 0.8,
  };

  // Ação de marcar o local/tocar em um ponto do mapa e dar valor a localização através do state
  const marcarLocal = () => {
    // console.log(event.nativeEvent);
    setLocalizacao({
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  // obter permissão da minha localização
  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ops", "Você não autorizou o uso da geolocalizacao");
        return;
      }
      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setminhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);
  console.log(minhaLocalizacao); //Esperar carregar no console para testar

  /*Neste código, a coleção "users" não existe antes de chamar set(). No entanto, quando o documento é criado, a coleção "users" é criada automaticamente.
  const db = firebase.firestore();*/

  // db.collection("lugares")
  //   .doc("uid")
  //   .set({
  //     name: "John Doe",
  //     image: downloadURL,
  //     info: {
  //       address: {
  //         location: new firestore.GeoPoint(53.483959, -2.244644),
  //       },
  //     },
  //   })
  //   .then(() => {
  //     console.log("User added!");
  //   });

  // MAPA

  return (
    <SafeContainer>
      <View style={estilos.containerInput}>
        <TextInput
          value={nome}
          style={estilos.input}
          placeholder="Digite a Legenda do local"
          onChangeText={(textDigitado) => setNome(textDigitado)}
        />
        {/* <Ionicons name="enter-outline" size={40} color="#056a80" /> */}
        <AntDesign name="enter" size={33} color="#056a80" />
      </View>
      {nome && <Text style={estilos.text}>Local: {nome}</Text>}

      <TirarFoto />

      <MapView
        style={estilos.map}
        mapType="mutedStandard"
        region={localizacao ?? regiaoInicialMapa}
      >
        <Marker coordinate={localizacao}>
          <Image
            source={require("../../assets/marker.png")}
            height={3}
            width={2}
          />
        </Marker>
      </MapView>
      <Pressable onPress={marcarLocal} style={estilos.botaoMapa}>
        <Text style={estilos.botaoText}>Localizar no Mapa</Text>
      </Pressable>
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
