import { StyleSheet, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { getStorage, ref } from "firebase/storage";

export default function Galeria({ route }) {
  const [imageUrls, setImageUrls] = useState([]);

  const storage = getStorage();
  const imagesRef = ref(storage, "images");
  useEffect(() => {
    const listImages = async () => {
      // List all images in the "images" folder
      const imageList = await imagesRef.listAll();

      const downloadURLs = [];
      for await (const imageRef of imageList.items) {
        const downloadURL = await getDownloadURL(imageRef);
        downloadURLs.push(downloadURL);
      }

      // Update your UI with the downloaded URLs
      setImageUrls(downloadURLs);
      console.log("Updated image URLs:", imageList);
    };

    listImages();
  }, [imageUrls]);

  return (
    <View style={styles.container}>
      {imageUrls.map((downloadURL) => (
        <Image
          key={downloadURL}
          source={{ uri: downloadURL }}
          style={styles.image}
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
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
});
