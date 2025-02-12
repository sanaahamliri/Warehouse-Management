"use client"

import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams } from "expo-router"

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://192.168.9.108:3001/products/${id}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Erreur lors du chargement du produit :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  if (loading) {
    return <ActivityIndicator size="large" color="#4c669f" style={styles.loader} />
  }

  if (!product) {
    return <Text style={styles.errorText}>Produit introuvable.</Text>
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.detail}>Stock: {product.stock}</Text>
      <Text style={styles.detail}>Catégorie: {product.category}</Text>
      <Text style={styles.detail}>Prix: {product.price} MAD</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  detail: { fontSize: 16, marginBottom: 5 },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
})
