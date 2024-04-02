import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

import SafeContainer from "../components/SafeContainer";
import TirarFoto from "../components/TirarFoto"; // Assuming firebase.config.js is in the same directory

import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase.config";

import app from "../../firebase.config"; // Assuming firebase.config.js is in the same directory

export default function Home() {
  return (
    <SafeContainer>
      <View style={estilos.containerFoto}>
        <TirarFoto />
      </View>
    </SafeContainer>
  );
}

const estilos = StyleSheet.create({});
