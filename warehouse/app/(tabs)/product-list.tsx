"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

type Stock = {
  id: number
  name: string
  quantity: number
}

type Product = {
  id: number
  name: string
  type: string
  price: number
  supplier: string
  image: string
  stocks: Stock[]
}

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.9.108:3001/products")
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getTotalStock = (stocks: Stock[]) => {
    return stocks.reduce((total, stock) => total + stock.quantity, 0)
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catalogue de Produits</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() => router.push({ pathname: "/(products)/product-details", params: { id: item.id } })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productType}>{item.type}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} MAD</Text>
              <Text style={styles.productStock}>En stock: {getTotalStock(item.stocks)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6200ee" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6200ee",
    marginBottom: 2,
  },
  productStock: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  separator: {
    height: 12,
  },
})

