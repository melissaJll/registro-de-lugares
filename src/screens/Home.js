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
} from "react-native";
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

  return (
    <LinearGradient
      colors={["#F0FFFF", "#fffff2", "#def6fc"]}
      style={estilos.container}
    >
      <SafeAreaView style={estilos.container}>
        <TextInput
          style={estilos.input}
          placeholder="Digite a Legenda do local"
          onChangeText={(textDigitado) => setNome(textDigitado)}
        />
        {nome && <Text style={estilos.text}>Local: {nome}</Text>}
        <Button onPress={acessarCamera} title="Tirar uma nova foto" />
        {foto ? (
          <Image source={{ uri: foto }} style={{ width: 300, height: 300 }} />
        ) : (
          <Text>Tire uma foto</Text>
        )}
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
