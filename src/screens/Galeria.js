import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, ActivityIndicator } from "react-native";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import SafeContainer from "../components/SafeContainer";

export default function Galeria() {
  const [arquivos, setArquivos] = useState([]);
  const db = getFirestore();

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImagesFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lugares"));
        const images = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          images.push({
            foto: data.foto,
            descricao: data.descricao,
            endereco: data.endereco || "",
          });
        });
        setArquivos(images);
        setLoading(false);
      } catch (error) {
        console.error("Erro no fetching do Firestore:", error);
      }
    };

    fetchImagesFromFirestore();
  }, []);

  return (
    <SafeContainer>
      {loading ? ( // Renderiza o indicador de carregamento se ainda estiver carregando
        <View style={estilos.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={estilos.container}>
          {arquivos.map((item, index) => (
            <View key={index} style={estilos.itemContainer}>
              <Image source={{ uri: item.foto }} style={estilos.imagem} />
              <Text style={estilos.descricao}>{item.descricao}</Text>
              <Text style={estilos.endereco}>Endereço: {item.endereco}</Text>
            </View>
          ))}
        </View>
      )}
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    marginHorizontal: 3,
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  imagem: {
    width: 350,
    height: 380,
    borderRadius: 8,
  },
  descricao: {
    marginTop: 5,
    marginLeft: 5,
    fontWeight: "500",
    fontSize: 16,
    padding: 8,
  },
  loadingContainer: {
    padding: 30,
  },
  endereco: {
    padding: 11,
  },
});
