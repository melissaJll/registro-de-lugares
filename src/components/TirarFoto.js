import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { storage } from "../../firebase.config"; // Assuming you have `storage` imported here
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function TirarFoto() {
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const navigation = useNavigation();

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

      // Upload the image to Firebase Storage
      carregarStorage(imagem.assets[0].uri);
    }
  };

  const carregarStorage = async (imageUrl) => {
    try {
      const imageName = imageUrl.split("/").pop(); // Extract the filename
      const imageRef = ref(storage, `images/${imageName}`);

      const uploadTask = uploadBytesResumable(imageRef, {
        uri: imageUrl,
        type: "image/jpeg",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress handling (as shown in previous response)
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully:", downloadURL);
          // You can use the downloadURL for display or save to database
        }
      );
    } catch (error) {
      console.error("Error during upload:", error);
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
      <View style={estilos.viewBotoes}>
        <Pressable onPress={acessarCamera} style={estilos.botaoFoto}>
          <Text style={estilos.botaoText}>Tirar uma nova foto</Text>
        </Pressable>
        {foto && (
          <Pressable
            style={estilos.botaoFoto}
            onPress={() => navigation.navigate("Galeria")}
          >
            <Text style={estilos.botaoText}>Ver fotos</Text>
          </Pressable>
        )}
        <Pressable
          style={estilos.botaoFoto}
          onPress={() => carregarStorage(foto)}
        >
          <Text>Salvar no Storage</Text>
        </Pressable>
      </View>
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
});
