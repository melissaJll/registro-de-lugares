import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import SafeContainer from "../components/SafeContainer";

export default function Galeria() {
  const [arquivos, setArquivos] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchImagesFromFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lugares"));
        const images = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          images.push({ foto: data.foto, descricao: data.descricao });
        });
        setArquivos(images);
      } catch (error) {
        console.error("Erro no fetching do Firestore:", error);
      }
    };

    fetchImagesFromFirestore();
  }, []);

  return (
    <SafeContainer>
      <View style={styles.container}>
        {arquivos.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image source={{ uri: item.foto }} style={styles.imagem} />
            <Text style={styles.descricao}>{item.descricao}</Text>
          </View>
        ))}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    marginHorizontal: 2,
    marginVertical: 20,
  },
  imagem: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  descricao: {
    marginTop: 5,
    textAlign: "center",
    fontWeight: "500",
  },
});
