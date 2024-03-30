import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
// import getFirestore from "firebase/firestore";

export default function Galeria() {
  const [arquivos, setArquivos] = useState([]);

  /*listAll(imagesRef) é usado para buscar a lista de arquivos no bucket imagesRef. A variável imageList armazena o resultado da listagem.
Um loop for await é utilizado para iterar sobre cada item na lista de arquivos (imageList.items).
Dentro do loop, getDownloadURL(imageRef) é usado para obter a URL de download de cada arquivo. A URL é então adicionada à lista downloadURLs.*/
  const storage = getStorage();
  const imagesRef = ref(storage, "");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageList = await listAll(imagesRef);
        const downloadURLs = [];
        for await (const imageRef of imageList.items) {
          const downloadURL = await getDownloadURL(imageRef);
          downloadURLs.push(downloadURL);
        }
        setArquivos(downloadURLs);
        console.log("downloads", downloadURLs);
      } catch (error) {
        console.error("Error fetching images:", error);
        // Handle the error appropriately, e.g., display an error message to the user
      }
    };

    fetchImages();
  }, []);

  /* firestore().collection('lugares') faz referência à coleção "lugares" no Firestore. No entanto, essa coleção precisa existir previamente.
Buscando dados:

.get() inicia a busca de documentos na coleção "lugares".
A função .then() é usada para lidar com os resultados retornados pela busca. */
  // getFirestore()
  //   .collection("Lugares")
  //   .doc("ABC")
  //   .get()
  //   .then((documentSnapshot) => {
  //     console.log("place exists: ", documentSnapshot.exists);

  //     if (documentSnapshot.exists) {
  //       console.log("place data: ", documentSnapshot.data());
  //     }
  //   });

  return (
    <View style={styles.container}>
      {arquivos.map((downloadURL, index) => (
        <>
          <Image
            key={index}
            source={{ uri: downloadURL }}
            style={styles.imagem}
          />
          <Text>Imagem</Text>
        </>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagem: {
    width: 200,
    height: 200,
    margin: 10,
  },
});
