
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { theme } from "./src/theme";
import NewTripScreen from "./src/screens/NewTripScreen";
import TripsScreen from "./src/screens/TripsScreen";
import { View, Text, TouchableOpacity } from "react-native";
import Logo from "./src/components/Logo";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.white },
          headerTintColor: theme.colors.black,
          headerTitle: () => <Logo />,
        }}
      >
        <Stack.Screen
          name="NewTrip"
          component={NewTripScreen}
          options={({ navigation }) => ({
            title: "New Trip",
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Trips")}>
                <Text style={{ color: theme.colors.primary, fontWeight: "800" }}>Today's Trips</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Trips" component={TripsScreen} options={{ title: "Today's Trips" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
