"use client"

import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Animated } from "react-native"
import { useRouter } from "expo-router"
import { useFonts } from "expo-font"
import { Lock } from "lucide-react-native"
import { AuthService } from "../services/AuthService"

export default function LoginScreen() {
  const [secretKey, setSecretKey] = useState("")
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  })

  const fadeAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handleLogin = async () => {
    if (!secretKey.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre code secret !")
      return
    }

    try {
      const user = await AuthService.login(secretKey)
      if (user) {
        Alert.alert("Succès", `Bienvenue, ${user.name} !`, [{ text: "OK", onPress: () => router.push("/statistics") }])
      } else {
        Alert.alert("Erreur", "Code secret invalide !")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error)
      Alert.alert("Erreur", "Impossible de se connecter au serveur.")
    }
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <ImageBackground
      source={require("../../assets/images/warehouse-background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Lock color="#fff" size={48} style={styles.icon} />
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Entrez votre code secret</Text>

          <TextInput
            style={styles.input}
            placeholder="Code secret"
            placeholderTextColor="#999"
            secureTextEntry
            value={secretKey}
            onChangeText={setSecretKey}
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: "#fff" }]} onPress={handleLogin}>
            <Text style={[styles.buttonText, { color: "#4c669f" }]}>Se connecter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    color: "#4c669f",
    fontSize: 18,
  },
})

