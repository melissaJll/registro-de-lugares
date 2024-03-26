import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export default function Home() {
  const [nome, setNome] = useState("");

  /* State tradicional para armazenar a referência da foto (quando existir) */
  const [foto, setFoto] = useState(null);

  /* State de checagem de permissões de uso (através do hook useCameraPermission) */
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  console.log(status);

  /* Ao entrar no app, será executada a verificação de permissões de uso */
  useEffect(() => {
    /* Esta função mostrará um popup para o usuário perguntando
      se ele autoriza a utilização do recurso móvel (no caso, selecionar/tirar foto). */
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      /* Ele dando autorização (granted), isso será armazenado
        no state de requestPermission. */
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();
  }, []);

  const acessarCamera = async () => {
    // Ao executar esta função quando o usuário escolhe tirar uma foto, utilizamos o launchCameraAsync para abrir a camera do sistema operacional
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });

    // usuario não parou
    if (!imagem.canceled) {
      // Usando a API pdo media library para salvar no armazenamento físico do dispositivo
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="Digite a Legenda do local"
        onChangeText={(textDigitado) => setNome(textDigitado)}
        // value={nome}
      />
      {nome && <Text style={estilos.text}>Local: {nome}</Text>}
      <Button onPress={acessarCamera} title="Tirar uma nova foto"></Button>

      {foto ? (
        <Image source={{ uri: foto }} style={{ width: 300, height: 300 }} />
      ) : (
        <Text>Tire uma foto</Text>
      )}
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
