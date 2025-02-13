"use client"

import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"

export default function ProductFormScreen() {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [supplier, setSupplier] = useState("")
  const [initialQuantity, setInitialQuantity] = useState("")
  const [warehouse, setWarehouse] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.9.96:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          type,
          supplier,
          initialQuantity: Number(initialQuantity),
          warehouse: Number(initialQuantity) > 0 ? warehouse : undefined,
          price: Number(price), 
          image
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'ajout du produit.")

      Alert.alert("Succès", "Produit ajouté avec succès", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ajouter le produit.")
    }
  }

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un Produit</Text>
      <TextInput placeholder="Nom du produit" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Type" value={type} onChangeText={setType} style={styles.input} />
      <TextInput placeholder="Fournisseur" value={supplier} onChangeText={setSupplier} style={styles.input} />
      <TextInput placeholder="Quantité initiale" value={initialQuantity} onChangeText={setInitialQuantity} keyboardType="numeric" style={styles.input} />
      {Number(initialQuantity) > 0 && (
        <TextInput placeholder="Entrepôt" value={warehouse} onChangeText={setWarehouse} style={styles.input} />
      )}
      <TextInput placeholder="Prix" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text>Choisir une image</Text>
        )}
      </TouchableOpacity>
      <Button title="Ajouter" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
})
