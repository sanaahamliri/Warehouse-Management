"use client"

import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"

export default function ProductFormScreen() {
  const [name, setName] = useState("")
  const [stock, setStock] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.9.108:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, stock: Number(stock), category, price: Number(price) }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit.")

      Alert.alert("Succès", "Produit ajouté avec succès", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter le produit.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Produit</Text>
      <TextInput placeholder="Nom du produit" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Catégorie" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Prix" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <Button title="Ajouter" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
})
