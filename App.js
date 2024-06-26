import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Criação/inicialização do mecanismo stack
const Stack = createNativeStackNavigator();

import Home from "./src/screens/Home";

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: "#5451a6" },
            headerTintColor: "white",
          }}
        >
          {/* Cada página que será usada precisa de um stack.screen */}
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
            // Desabilita o nome na home
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
