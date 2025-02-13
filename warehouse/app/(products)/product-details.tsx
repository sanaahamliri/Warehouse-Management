"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

type Stock = {
  id: number
  name: string
  quantity: number
  localisation: {
    city: string
    latitude: number
    longitude: number
  }
}

type Product = {
  id: number
  name: string
  type: string
  barcode: string
  price: number
  solde?: number
  supplier: string
  image: string
  stocks: Stock[]
}

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://192.168.9.96:3001/products/${id}`)
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
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
  }

  if (!product) {
    return <Text style={styles.errorText}>Produit introuvable.</Text>
  }

  const getTotalStock = () => {
    if (!product || !Array.isArray(product.stocks)) {
      return 0;
    }
    return product.stocks.reduce((total, stock) => total + stock.quantity, 0);
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.type}>{product.type}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price.toLocaleString()} MAD</Text>
          {product.solde && <Text style={styles.solde}>{product.solde.toLocaleString()} MAD</Text>}
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="barcode-outline" size={20} color="#6200ee" />
          <Text style={styles.detailText}>{product.barcode}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={20} color="#6200ee" />
          <Text style={styles.detailText}>{product.supplier}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={20} color="#6200ee" />
          <Text style={styles.detailText}>Stock total: {getTotalStock()}</Text>
        </View>
        <Text style={styles.sectionTitle}>Stocks par entrepôt</Text>
        {product.stocks && Array.isArray(product.stocks) && product.stocks.length > 0 ? (
          product.stocks.map((stock) => (
            <View key={stock.id} style={styles.stockItem}>
              <Text style={styles.stockName}>{stock.name}</Text>
              <Text style={styles.stockQuantity}>{stock.quantity} unités</Text>
              <Text style={styles.stockCity}>{stock.localisation.city}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>Aucun stock disponible.</Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  type: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
    marginRight: 10,
  },
  solde: {
    fontSize: 18,
    color: "#4CAF50",
    textDecorationLine: "line-through",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  stockItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stockName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  stockQuantity: {
    fontSize: 16,
    color: "#6200ee",
    marginBottom: 5,
  },
  stockCity: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
})

