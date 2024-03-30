import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

export default function Galeria() {
  const [arquivos, setArquivos] = useState([]);

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
