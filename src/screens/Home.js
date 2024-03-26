import React, { useEffect, useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Button,
  Pressable,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";

import TirarFoto from "../components/TirarFoto";

export default function Home() {
  const [nome, setNome] = useState("");

  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();
  }, []);

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!imagem.canceled) {
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  // MAPA

  const [minhaLocalizacao, setminhaLocalizacao] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

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
      // Aqui é necessário aacessar a propriedade 'coords' do state minhaLocalizacao.
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

  return (
    <LinearGradient
      colors={["#F0FFFF", "#fffff2", "#d7f6fc"]}
      style={estilos.container}
    >
      <SafeAreaView style={estilos.container}>
        <TextInput
          style={estilos.input}
          placeholder="Digite a Legenda do local"
          onChangeText={(textDigitado) => setNome(textDigitado)}
        />
        {nome && <Text style={estilos.text}>Local: {nome}</Text>}

        <TirarFoto></TirarFoto>

        <View>
          <MapView
            style={estilos.map}
            mapType="mutedStandard"
            region={localizacao ?? regiaoInicialMapa}
          >
            <Marker coordinate={localizacao}>
              <Image
                source={require("../../assets/marker.png")}
                height={4}
                width={3}
              />
            </Marker>
          </MapView>
        </View>

        <Pressable onPress={marcarLocal} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>Localizar no Mapa</Text>
        </Pressable>
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
  botaoText: {
    color: "#09768f",
    fontWeight: "600",
    fontSize: 18,
  },
  botaoFoto: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#0c8ca8",
    padding: 15,
    borderStyle: "solid",
    marginTop: 15,
    marginBottom: 25,
  },
  map: {
    width: 340,
    height: 250,
    borderRadius: 8,
  },
});
