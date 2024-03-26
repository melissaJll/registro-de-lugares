import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import MapView from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

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
  const regiaoInicialMapa = {
    latitude: -10,
    longitude: -55,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  };

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

        {
          foto && (
            <Image
              source={{ uri: foto }}
              style={{ width: 300, height: 250, borderRadius: 8 }}
            />
          )
          //  : (
          //   <Image
          //     // source="https://via.placeholder.com/1024x768/eee?text=4:3"
          //     contentFit="cover"
          //     width={290}
          //     height={250}
          //   />
          // )
        }
        {/* <Button onPress={acessarCamera} title="Tirar uma nova foto" /> */}
        <Pressable onPress={acessarCamera} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>Tirar uma nova foto</Text>
        </Pressable>

        <View initialRegion={regiaoInicialMapa}>
          <MapView style={estilos.map} />
        </View>

        <Pressable style={estilos.botaoFoto}>
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
    width: 300,
    height: 250,
    borderRadius: 8,
  },
});
