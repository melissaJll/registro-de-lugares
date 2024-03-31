import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, FlatList } from "react-native";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

export default function TodasAsFotos() {
  // Estado para armazenar as URLs das imagens
  const [arquivos, setArquivos] = useState([]);

  // Referência ao armazenamento do Firebase
  const storage = getStorage();
  const imagesRef = ref(storage, "");

  useEffect(() => {
    // Função para buscar as URLs das imagens
    const fetchImages = async () => {
      try {
        // Lista todas as imagens no armazenamento
        const imageList = await listAll(imagesRef);
        // Obtém as URLs de download de todas as imagens
        const downloadURLs = await Promise.all(
          imageList.items.map(async (imageRef) => {
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
          })
        );
        // Atualiza o estado com as URLs das imagens
        setArquivos(downloadURLs);
        console.log("downloads", downloadURLs);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    // Chama a função para buscar as imagens ao montar o componente
    fetchImages();
  }, []);

  // Função para renderizar cada item da lista de imagens
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item }} style={styles.imagem} />
    </View>
  );

  // Componente FlatList para exibir as imagens em um carrossel horizontal
  return (
    <View style={styles.container}>
      <FlatList
        data={arquivos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: 200,
    height: 200,
    margin: 10,
  },
  imagem: {
    flex: 1,
    width: "100%",
    borderRadius: 8,
  },
});
