"use client"

import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { useFonts } from "expo-font"
import { BarChart2, Package, AlertTriangle, ShoppingCart } from "lucide-react-native"

type Stats = {
  totalProducts: number
  lowStock: number
  outOfStock: number
  recentlyAdded: number
}

type CardProps = {
  title: string
  value: number
  color: string
  icon: React.ReactNode
}

const Card: React.FC<CardProps> = ({ title, value, color, icon }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <View style={styles.cardIcon}>{icon}</View>
    <View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  </View>
)

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  })

  const fetchStats = async () => {
    try {
      const res = await fetch("http://192.168.9.68/statistics")
      if (!res.ok) {
        throw new Error("Erreur réseau")
      }
      const data = await res.json()
      setStats(data)
      setError(null)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques :", error)
      setError("Impossible de charger les statistiques. Veuillez réessayer.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchStats()
  }, [fetchStats])

  if (!fontsLoaded) {
    return null
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#4c669f" style={styles.loader} />
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}></Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.statsContainer}>
          <Card
            title="Total Produits"
            value={stats?.totalProducts ?? 0}
            color="#4c669f"
            icon={<Package color="#4c669f" size={24} />}
          />
          <Card
            title="Stock Faible"
            value={stats?.lowStock ?? 0}
            color="#ff9800"
            icon={<AlertTriangle color="#ff9800" size={24} />}
          />
          <Card
            title="Rupture"
            value={stats?.outOfStock ?? 0}
            color="#f44336"
            icon={<BarChart2 color="#f44336" size={24} />}
          />
          <Card
            title="Ajouts Récents"
            value={stats?.recentlyAdded ?? 0}
            color="#4caf50"
            icon={<ShoppingCart color="#4caf50" size={24} />}
          />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#333",
  },
  errorText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginTop: 20,
  },
})

