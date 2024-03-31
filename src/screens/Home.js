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

import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SafeContainer from "../components/SafeContainer";

import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase.config";

// const app = initializeApp(firebaseConfig);
import app from "../../firebase.config"; // Assuming firebase.config.js is in the same directory

const db = getFirestore(app);

export default function Home() {
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const storage = getStorage();
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageUrl] = useState();
  const navigation = useNavigation();

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
    setUploading(true);

    try {
      const { uri } = await FileSystem.getInfoAsync(foto);
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();
      const storage = getStorage();
      const filename = foto.substring(foto.lastIndexOf("/") + 1);
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, blob);

      // Get download URL (optional)
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadURL);
      setImageUrl(downloadURL);
      console.log(imageURL, "Imagem url");

      setUploading(false);
      Alert.alert("Upload feito");
      setFoto(null);
    } catch (erro) {
      console.error(erro);
      setUploading(false);
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

  const marcarLocal = () => {
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

  //                        Firestore

  const salvarLugar = async () => {
    if (!nome || !localizacao) {
      alert("Preencha a legenda e marque um local no mapa!");
      return;
    }

    try {
      console.log(imageURL, "Imagem url");
      const docRef = await addDoc(collection(db, "lugares"), {
        nome: nome,
        foto: imageURL, // Assuming you have a way to get the image URL from TirarFoto component
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
    <SafeContainer
      colors={["#F0FFFF", "#fffff2", "#d7f6fc"]}
      style={estilos.container}
    >
      <View style={estilos.container}>
        <TextInput
          style={estilos.input}
          placeholder="Digite a Legenda do local"
          onChangeText={(textDigitado) => setNome(textDigitado)}
        />
        {nome && <Text style={estilos.text}>Local: {nome}</Text>}

        {foto && (
          <Image
            source={{ uri: foto }}
            style={{ width: 300, height: 250, borderRadius: 8 }}
          />
        )}
        <Pressable onPress={acessarCamera} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>Tirar uma nova foto</Text>
        </Pressable>
        <Pressable onPress={uploadStorage} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>storage</Text>
        </Pressable>
        <Pressable onPress={salvarLugar} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>firestore</Text>
        </Pressable>

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
      </View>
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({
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
    width: 300,
    height: 250,
    borderRadius: 8,
  },
});
