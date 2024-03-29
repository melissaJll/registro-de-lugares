import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../firebase.config";

export default function TirarFoto() {
  const [foto, setFoto] = useState(null);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [uploading, setUploading] = useState(false);
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
  console.log(foto);

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
      const filename = foto.substring(foto.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);

      await ref.put(blob);
      setUploading(false);
      Alert.alert("Upload feito");
      setFoto(null);
    } catch (erro) {
      console.error(erro);
      setUploading(false);
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
        <Pressable style={estilos.botaoFoto}>
          <Text style={estilos.botaoText} onPress={escolherFoto}>
            Carregar imagem
          </Text>
        </Pressable>
        <Pressable style={estilos.botaoFoto}>
          <Text style={estilos.botaoText} onPress={uploadStorage}>
            Storage
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
});
