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

import app from "../../firebase.config"; //exportando para fazer a instancia do firestore

import { GeoPoint } from "firebase/firestore";
import Mapa from "./Mapa";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const db = getFirestore(app);

export default function TirarFoto() {
  // Storage
  const storage = getStorage();
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const navigation = useNavigation();

  const [descricao, setDescricao] = useState("");

  // Carregamento
  const [uploading, setUploading] = useState(true); // Estado para controlar o carregamento
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Minha localizaçao
  const [minhaLocalizacao, setminhaLocalizacao] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  // Mapa coordenadas
  const [latitudeStore, setlatitudeStore] = useState(true);
  const [longitudeStore, setlongitudeStore] = useState(true);
  const coordenadas = new GeoPoint(latitudeStore, longitudeStore);

  useEffect(() => {
    // Permissão camera
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();

    // obter permissão da minha localização
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

  // Mapa
  const marcarLocal = () => {
    setlatitudeStore(minhaLocalizacao.coords.latitude);
    setlongitudeStore(minhaLocalizacao.coords.longitude);
    Alert.alert("Localização adicionada!");
  };

  // Camera
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
  //  upload para storage e firebase
  const uploadStorage = async () => {
    setUploading(true);

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
        throw new Error("Falha ao obter a imagem");
      }

      // Converte a imagem para um blob ( array de bytes )
      // Obtém o nome da imagem
      const blob = await response.blob();
      const imageName = foto.substring(foto.lastIndexOf("/") + 1);

      // Faz o upload da imagem para o Firebase Storage
      const storageRef = ref(storage, imageName); // Cria uma referência para o local de armazenamento da imagem
      await uploadBytes(storageRef, blob); // Realiza o upload da imagem para o Firebase Storage

      // Obtém o URL de download da imagem
      const downloadURL = await getDownloadURL(storageRef);

      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: minhaLocalizacao.coords.latitude,
        longitude: minhaLocalizacao.coords.longitude,
      });
      // Salva o URL de download da imagem e a descrição no Firestore
      const placesCollectionRef = collection(db, "lugares"); // Obtém a referência para a coleção "lugares" no Firestore
      await addDoc(placesCollectionRef, {
        foto: downloadURL, // Adiciona o URL de download da imagem ao documento
        descricao: descricao, // Adiciona a descrição ao documento (capturada do estado "descricao")
        coordenadas: coordenadas,
        endereco: addressResponse[0].street,
      });
      console.log("Download URL:", downloadURL);

      setUploading(false);
      Alert.alert("Upload concluído", "Veja suas fotos na galeria"); // Exibe um alerta indicando que o upload foi concluído com sucesso
      setFoto(null);
      setDescricao(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert("Falha ao fazer upload da imagem", error.message); // Exibe um alerta indicando que ocorreu uma falha no upload
    }
  };

  console.log(minhaLocalizacao); //Esperar carregar no console para testar

  return (
    <View style={estilos.containerFoto}>
      {descricao && <Text style={estilos.text}> {descricao}</Text>}
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
          </View>
        </>
      )}

      <View style={estilos.viewBotoes}>
        <Pressable onPress={acessarCamera} style={estilos.botaoFotoGhost}>
          <MaterialIcons name="add-to-photos" size={24} color="black" />
          <Text style={estilos.botaoTextGhost}>Nova foto</Text>
        </Pressable>
        <Pressable onPress={marcarLocal} style={estilos.botaoFotoGhost}>
          <Ionicons name="compass" size={24} color="black" />
          <Text style={estilos.botaoTextGhost}>Guardar localização</Text>
        </Pressable>
      </View>

      <Pressable
        style={estilos.botaoFotoGhost}
        onPress={() => navigation.navigate("FotosSlider")}
      >
        <FontAwesome name="picture-o" size={24} color="black" />
        <Text style={estilos.botaoTextGhost}>Ver fotos</Text>
      </Pressable>
      {descricao && (
        <Pressable
          style={({ pressed }) => [
            estilos.botaoFirestore,
            { backgroundColor: pressed ? "#Fd66c3e" : "#F46A2E" }, //
          ]}
          onPress={uploadStorage}
        >
          <Text style={estilos.botaoFirestoreText}>Salvar Lugar</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  containerFoto: {
    alignItems: "center",
  },
  viewBotoes: {
    flexDirection: "row",
    marginBottom: 3,
  },

  botaoTextGhost: {
    color: "#0C0D0F",
    fontWeight: "600",
    fontSize: 17,
    marginLeft: 2,
  },
  botaoFotoGhost: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#0C0D0F",
    padding: 15,
    paddingHorizontal: 15,
    borderStyle: "solid",
    marginTop: 15,
    marginBottom: 8,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  botaoFirestoreText: {
    color: "#fff", // Cor do texto alterada para branco
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  botaoFirestore: {
    backgroundColor: "#F46A2E",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 117,
    marginTop: 15,

    marginHorizontal: 5,
  },

  text: {
    fontSize: 20,
    color: "#0C0D0F",
    marginVertical: 5,
    fontWeight: "bold",
  },
  input: {
    height: 45,
    width: 343,
    borderColor: "gray",
    padding: 10,
    marginTop: 10,
    borderColor: "#0C0D0F",
    borderWidth: 2,
    borderRadius: 4,
  },

  map: {
    width: 340,
    height: 250,
    borderRadius: 8,
    borderColor: "#262628",
    borderWidth: 0.3,
  },
});
