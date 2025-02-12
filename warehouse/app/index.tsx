"use client"

import { useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated } from "react-native"
import { useRouter } from "expo-router"
import { useFonts } from "expo-font"

export default function HomeScreen() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  })

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  const titleWords = ["Bienvenue", "sur", "Warehouse", "Manager"]
  const titleAnims = titleWords.map(() => useRef(new Animated.Value(0)).current)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      ...titleAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: 500 + index * 300,
          useNativeDriver: true,
        }),
      ),
    ]).start()
  }, [fadeAnim, slideAnim, ...titleAnims])

  if (!fontsLoaded) {
    return null
  }

  return (
    <ImageBackground
      source={require("../assets/images/warehouse-background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.titleContainer}>
            {titleWords.map((word, index) => (
              <Animated.Text key={index} style={[styles.titleWord, { opacity: titleAnims[index] }]}>
                {word}
              </Animated.Text>
            ))}
          </View>
          <Text style={styles.subtitle}>Gérez vos stocks facilement et efficacement !</Text>

          <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
            <Text style={styles.buttonText}>Se connecter</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
  },
  titleWord: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    color: "#fff",
    marginRight: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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

