import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { firebaseConfig } from "../../firebase.config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { getFirestore, collection, addDoc } from "firebase/firestore";

import app from "../../firebase.config"; // Assuming firebase.config.js is in the same directory

import { GeoPoint } from "firebase/firestore";
import Mapa from "./Mapa";

const db = getFirestore(app);

export default function TirarFoto() {
  const storage = getStorage();
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const [descricao, setDescricao] = useState("");

  const latitude = 40.7128; // Exemplo de latitude
  const longitude = -74.006; // Exemplo de longitude
  const coordenadas = new GeoPoint(latitude, longitude);

  useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();
  }, []);

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

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

  const uploadStorage = async () => {
    setUploading(true); // Define uploading como true para indicar que o processo de upload está em andamento

    try {
      if (!descricao || !foto) {
        // Se não houver descrição ou imagem, lança um erro correspondente
        throw new Error(
          "Por favor, forneça uma descrição e selecione uma imagem"
        );
      }

      // Obtém informações sobre a imagem selecionada
      const { uri } = await FileSystem.getInfoAsync(foto); // Obtém o URI da imagem
      const response = await fetch(uri); // Realiza uma requisição para obter a imagem

      // Verifica se a requisição da imagem foi bem-sucedida
      if (!response.ok) {
        throw new Error("Falha ao obter a imagem"); // Se não for, lança um erro
      }

      // Converte a imagem para um blob
      // Obtém o nome da imagem
      const blob = await response.blob();
      const imageName = foto.substring(foto.lastIndexOf("/") + 1);

      // Faz o upload da imagem para o Firebase Storage
      const storageRef = ref(storage, imageName); // Cria uma referência para o local de armazenamento da imagem
      await uploadBytes(storageRef, blob); // Realiza o upload da imagem para o Firebase Storage

      // Obtém o URL de download da imagem
      const downloadURL = await getDownloadURL(storageRef);

      // Salva o URL de download da imagem e a descrição no Firestore
      const placesCollectionRef = collection(db, "lugares"); // Obtém a referência para a coleção "lugares" no Firestore
      await addDoc(placesCollectionRef, {
        foto: downloadURL, // Adiciona o URL de download da imagem ao documento
        descricao: descricao, // Adiciona a descrição ao documento (capturada do estado "descricao")
        coordenadas: coordenadas,
      });
      console.log("Download URL:", downloadURL);

      setUploading(false); // Define uploading como false para indicar que o processo de upload foi concluído
      Alert.alert("Upload concluído"); // Exibe um alerta indicando que o upload foi concluído com sucesso
      setFoto(null); // Limpa o estado da imagem selecionada
    } catch (error) {
      console.error(error); // Registra qualquer erro no console
      setUploading(false); // Define uploading como false para indicar que o processo de upload foi concluído (mesmo que com erro)
      Alert.alert("Falha ao fazer upload da imagem", error.message); // Exibe um alerta indicando que ocorreu uma falha no upload
    }
  };

  return (
    <View style={estilos.containerFoto}>
      {descricao && <Text style={estilos.text}>Local: {descricao}</Text>}

      {foto && (
        <>
          <Image
            source={{ uri: foto }}
            style={{ width: 340, height: 250, borderRadius: 8 }}
          />
          <View style={estilos.containerInput}>
            <TextInput
              value={descricao}
              onChangeText={(text) => setDescricao(text)} // Atualiza o estado descricao conforme o texto é digitado
              style={estilos.input}
              placeholder="Descrição da Imagem"
            />
            <AntDesign name="enter" size={33} color="#056a80" />
          </View>
        </>
      )}

      <View style={estilos.viewBotoes}>
        <Pressable onPress={acessarCamera} style={estilos.botaoFotoGhost}>
          <Text style={estilos.botaoTextGhost}>Tirar uma nova foto</Text>
        </Pressable>
        <Pressable
          style={estilos.botaoFotoGhost}
          onPress={() => navigation.navigate("Galeria")}
        >
          <Text style={estilos.botaoTextGhost}>Ver fotos</Text>
        </Pressable>
      </View>

      {descricao && (
        <Pressable style={estilos.botaoFoto}>
          <Text style={estilos.botaoText} onPress={uploadStorage}>
            Salvar Lugar
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  botaoTextGhost: {
    color: "#09768f",
    fontWeight: "600",
    fontSize: 18,
  },
  botaoFotoGhost: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#0c8ca8",
    padding: 15,
    borderStyle: "solid",
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  botaoText: {
    color: "#ffffff", // Cor do texto alterada para branco
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  botaoFoto: {
    backgroundColor: "#09768f",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 50,
    marginHorizontal: 5,
  },

  viewBotoes: {
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
    color: "#056a80",
    marginVertical: 5,
    fontWeight: "bold",
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
  containerInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
