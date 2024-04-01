import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function Mapa() {
  const [minhaLocalizacao, setminhaLocalizacao] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  const regiaoInicialMapa = {
    latitude: -23.5489,
    longitude: -46.6388,

    latitudeDelta: 0.8,
    longitudeDelta: 0.8,
  };

  // Ação de marcar o local/tocar em um ponto do mapa e dar valor a localização através do state
  const marcarLocal = () => {
    // console.log(event.nativeEvent);
    setLocalizacao({
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  // obter permissão da minha localização
  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ops", "Você não autorizou o uso da geolocalizacao");
        return;
      }
      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setminhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);
  console.log(minhaLocalizacao); //Esperar carregar no console para testar

  return (
    <View style={estilos.container}>
      <MapView
        style={estilos.map}
        mapType="mutedStandard"
        region={localizacao ?? regiaoInicialMapa}
      >
        <Marker coordinate={localizacao}>
          <Image
            source={require("../../assets/marker.png")}
            height={3}
            width={2}
          />
        </Marker>
      </MapView>
      <Pressable onPress={marcarLocal} style={estilos.botaoMapa}>
        <Text style={estilos.botaoText}>Localizar no Mapa</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  botaoText: {
    color: "#0C0D0F",
    fontWeight: "600",
    fontSize: 18,
  },
  botaoMapa: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#fff",
    padding: 15,
    borderStyle: "solid",
    marginTop: 20,
  },
  map: {
    width: 340,
    height: 250,
    borderRadius: 8,
    borderColor: "#262628",
    borderWidth: 0.3,
  },
});
