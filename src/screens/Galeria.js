import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { getStorage, ref, listAll } from "firebase/storage";

export default function Galeria() {
  const [arquivos, setArquivos] = useState([]);

  const storage = getStorage();
  const imagesRef = ref(storage, "images");

  useEffect(() => {
    const listImages = async () => {
      const imageList = await listAll(imagesRef);

      const downloadURLs = [];
      for await (const imageRef of imageList.items) {
        const downloadURL = await getDownloadURL(imageRef);
        downloadURLs.push(downloadURL);
      }

      setArquivos(downloadURLs);
      console.log("dowloads", downloadURLs);
    };

    listImages();
  }, []);

  return (
    <View style={styles.container}>
      {arquivos.map((downloadURL) => (
        <Image
          key={downloadURL}
          source={{ uri: downloadURL }}
          style={styles.imagem}
        />
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
