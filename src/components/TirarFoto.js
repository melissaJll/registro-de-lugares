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

const db = getFirestore(app);
export default function TirarFoto() {
  const storage = getStorage();
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();

  const [descricao, setDescricao] = useState("");
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
      if (!descricao) {
        throw new Error("Please provide a description");
      }
      // Check if image URI exists
      if (!foto) {
        throw new Error("No image selected");
      }

      // Fetch image info
      const { uri } = await FileSystem.getInfoAsync(foto);
      const response = await fetch(uri);

      // Check if fetching image was successful
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Convert image to blob
      const blob = await response.blob();

      // Get image name (you can modify this to include a dynamic name)
      const imageName = foto.substring(foto.lastIndexOf("/") + 1);

      // Upload image to Firebase storage
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save image URL and description to Firestore
      const placesCollectionRef = collection(db, "lugares");
      await addDoc(placesCollectionRef, {
        foto: downloadURL,
        descricao: descricao, // Assuming 'nome' is the description captured from the text input
      });

      // Print download URL and do further processing if needed
      console.log("Download URL:", downloadURL);

      setUploading(false);
      Alert.alert("Upload done");
      setFoto(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert("Failed to upload image", error.message);
    }
  };

  return (
    <View style={estilos.container}>
      {foto && (
        <Image
          source={{ uri: foto }}
          style={{ width: 340, height: 250, borderRadius: 8 }}
        />
      )}
      <View style={estilos.containerInput}>
        <TextInput
          value={descricao}
          onChangeText={(text) => setDescricao(text)} // Atualiza o estado descricao conforme o texto é digitado
          style={estilos.input}
          placeholder="Descrição da Imagem"
        />
        <AntDesign name="enter" size={33} color="#056a80" />
      </View>
      {descricao && <Text style={estilos.text}>Local: {descricao}</Text>}

      <View style={estilos.viewBotoes}>
        <Pressable onPress={acessarCamera} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>Tirar uma nova foto</Text>
        </Pressable>

        <Pressable style={estilos.botaoFoto}>
          <Text style={estilos.botaoText} onPress={uploadStorage}>
            Enviar Storage
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={estilos.botaoFoto}
        onPress={() => navigation.navigate("Galeria")}
      >
        <Text style={estilos.botaoText}>Ver fotos</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    marginBottom: 20,
    marginHorizontal: 5,
  },
  viewBotoes: {
    flexDirection: "row",
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
