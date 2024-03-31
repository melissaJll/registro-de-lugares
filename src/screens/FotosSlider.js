import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, FlatList } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import SafeContainer from "../components/SafeContainer";

export default function FotosSlider() {
  // Estado para armazenar os dados das fotos
  const [arquivos, setArquivos] = useState([]);

  useEffect(() => {
    // Função para buscar as fotos no Firestore
    const fetchImages = async () => {
      try {
        // Obtém uma referência para o Firestore
        const db = getFirestore();
        // Obtém uma referência para a coleção "lugares" no Firestore
        const lugaresCollectionRef = collection(db, "lugares");
        // Obtém os documentos da coleção "lugares"
        const snapshot = await getDocs(lugaresCollectionRef);
        // Mapeia os documentos para extrair os dados das fotos
        const imageData = snapshot.docs.map((doc) => doc.data());
        // Atualiza o estado com os dados das fotos
        setArquivos(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    // Chama a função para buscar as fotos ao montar o componente
    fetchImages();
  }, []);

  // Função para renderizar cada item da lista de fotos
  const renderItem = ({ item }) => (
    <View style={estilos.item}>
      {/* Exibe a descrição da foto */}
      <Text style={estilos.descricao}>{item.descricao}</Text>
      {/* Exibe a imagem */}
      <Image source={{ uri: item.foto }} style={estilos.imagem} />
    </View>
  );

  // Componente FlatList para exibir as fotos em um carrossel horizontal
  return (
    <SafeContainer>
      <View style={estilos.container}>
        <FlatList
          data={arquivos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
        />
      </View>
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    // Aumenta a largura e do item para exibir imagens maiores
    width: 330,
    height: 650,
    marginHorizontal: 20,
    borderRadius: 16, // Adiciona um leve arredondamento nas bordas dos itens
    overflow: "hidden", // Esconde qualquer conteúdo que ultrapasse os limites do item
    position: "relative", // Definindo a posição como relativa para que a descrição fique sobre a imagem
  },
  imagem: {
    width: "100%", // A imagem ocupa toda a largura e alt do item
    height: "100%",
    resizeMode: "cover", // Redimensiona a imagem para cobrir todo o espaço disponível
  },
  descricao: {
    fontSize: 24, // Define o tamanho da fonte da descrição
    paddingHorizontal: 16, // Adiciona um espaçamento horizontal interno à descrição
    paddingVertical: 8, // Adiciona um espaçamento vertical interno à descrição
    fontWeight: "bold",
    marginVertical: 20,
  },
});
