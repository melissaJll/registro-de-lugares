import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import SafeContainer from "../components/SafeContainer";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function FotosSlider() {
  const [arquivos, setArquivos] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    // Função para buscar as fotos no Firestore
    const fetchImages = async () => {
      try {
        // Obtém uma referência para o Firestore
        const db = getFirestore();
        // obtém uma referência para a coleção "lugares" no Firestore
        const lugaresCollectionRef = collection(db, "lugares");
        // pega os documentos da coleção "lugares"
        const snapshot = await getDocs(lugaresCollectionRef);
        // Mapeia os documentos para extrair os dados das fotos
        const imageData = snapshot.docs.map((doc) => doc.data());
        // Atualiza o estado com os dados das fotos
        setArquivos(imageData);
        setLoading(false); // Marca o carregamento como completo após buscar as imagens
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
      <Image source={{ uri: item.foto }} style={estilos.imagem} />
    </View>
  );

  // Componente FlatList para exibir as fotos em um carrossel horizontal
  return (
    <SafeContainer>
      {loading ? ( // Renderiza o indicador de carregamento se ainda estiver carregando
        <View style={estilos.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={estilos.container}>
          <FlatList
            data={arquivos}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
          />
        </View>
      )}
      <Pressable
        style={estilos.botaoIrGaleria}
        onPress={() => navigation.navigate("Galeria")}
      >
        <Text style={estilos.textoBotaoGaleria}>Ver todas as fotos</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </Pressable>
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    // Aumenta a largura e do item para exibir imagens maiores
    width: 330,
    height: 650,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden", // Esconde qualquer conteúdo que ultrapasse os limites do item
    position: "relative", // Definindo a posição como relativa para que a descrição fique sobre a imagem
  },
  imagem: {
    width: "100%", // A imagem ocupa toda a largura e alt do item
    height: "100%",
    resizeMode: "cover", // Redimensiona a imagem para cobrir todo o espaço disponível
  },
  descricao: {
    fontSize: 24,
    paddingVertical: 8,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  textoBotaoGaleria: {
    color: "#000", // Cor do texto alterada para branco
    fontWeight: "500",
    fontSize: 20,
    textAlign: "center",
    marginHorizontal: 4,
  },
  botaoIrGaleria: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 50,
    marginHorizontal: 40,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: "#ECE2C8",
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 30,
  },
});
