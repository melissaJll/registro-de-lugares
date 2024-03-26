import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

export default function TirarFoto() {
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
    <View style={estilos.container}>
      {
        foto && (
          <Image
            source={{ uri: foto }}
            style={{ width: 340, height: 250, borderRadius: 8 }}
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
      <Pressable onPress={acessarCamera} style={estilos.botaoFoto}>
        <Text style={estilos.botaoText}>Tirar uma nova foto</Text>
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
  },
});
