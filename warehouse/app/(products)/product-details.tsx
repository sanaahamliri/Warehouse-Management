"use client"

import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, Button } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { fetchProductById, updateStock, exportProductReport } from '../services/productService'

type Stock = {
  id: number
  name: string
  quantity: number
  city: string
  latitude: string
  longitude: string
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
        const data = await fetchProductById(id as string)
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

  const handleRestock = async (stockId: number) => {
    setProduct(prevProduct => {
      if (!prevProduct) return null;

      updateStock(id as string, stockId, 1);
      return {
        ...prevProduct,
        stocks: prevProduct.stocks.map(stock => 
          stock.id === stockId ? { ...stock, quantity: stock.quantity + 1 } : stock
        )
      };
    });
  }

  const handleUnload = async (stockId: number) => {
    setProduct(prevProduct => {
      if (!prevProduct) return null;

      updateStock(id as string, stockId, -1);
      return {
        ...prevProduct,
        stocks: prevProduct.stocks.map(stock => 
          stock.id === stockId ? { ...stock, quantity: Math.max(stock.quantity - 1, 0) } : stock
        )
      };
    });
  }

  const handleExportReport = async () => {
    if (product) {
      console.log("Exporting report for product:", product);
      try {
        await exportProductReport(product);
        console.log("Report exported successfully.");
      } catch (error) {
        console.error("Error exporting report:", error);
      }
    } else {
      console.warn("No product available for export.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.type}>{product.type}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{product.price?.toLocaleString() || 'N/A'} MAD</Text>
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
          product.stocks.map((stock, index) => (
            <View key={index} style={styles.stockItem}>
              <Text style={styles.stockName}>{stock.name}</Text>
              <Text style={styles.stockQuantity}>{stock.quantity} unités</Text>
              <Text style={styles.stockCity}>Ville: {stock.city}</Text>
              <Text style={styles.stockLatitude}>Latitude: {stock.latitude}</Text>
              <Text style={styles.stockLongitude}>Longitude: {stock.longitude}</Text>
              <Text style={[
                styles.stockStatus,
                stock.quantity === 0 ? styles.outOfStock : stock.quantity < 10 ? styles.lowStock : {}
              ]}>
                {stock.quantity === 0 ? "Rupture de stock" : stock.quantity < 10 ? "Faible quantité" : "En stock"}
              </Text>
              <View style={styles.buttonContainer}>
                <Button title="Réapprovisionner" onPress={() => handleRestock(stock.id)} />
                <Button title="Décharger" onPress={() => handleUnload(stock.id)} />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>Aucun stock disponible.</Text>
        )}
        <Button title="Exporter le rapport PDF" onPress={handleExportReport} />
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
  stockLatitude: {
    fontSize: 14,
    color: "#666",
  },
  stockLongitude: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  stockStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  outOfStock: {
    color: "red",
  },
  lowStock: {
    color: "yellow",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
})

