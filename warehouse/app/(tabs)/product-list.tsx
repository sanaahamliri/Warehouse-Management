"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image, TextInput } from "react-native"
import { Picker } from '@react-native-picker/picker';
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("name")
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.9.96:3001/products")
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getTotalStock = (stocks: Stock[]) => {
    if (!Array.isArray(stocks)) {
      return 0;
    }
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterProducts(query, filter)
  }

  const handleFilter = (filterValue: string) => {
    setFilter(filterValue)
    filterProducts(searchQuery, filterValue)
  }

  const handleSort = (sortValue: string) => {
    setSortOrder(sortValue)
    sortProducts(filteredProducts, sortValue)
  }

  const filterProducts = (query: string, filter: string) => {
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.supplier.toLowerCase().includes(query.toLowerCase())
      return matchesSearch
    })

    if (filter !== "all") {
      filtered = filtered.filter((product) => product.type === filter)
    }

    sortProducts(filtered, sortOrder)
  }

  const sortProducts = (products: Product[], sortOrder: string) => {
    let sorted = [...products]
    if (sortOrder === "price_asc") {
      sorted = sorted.sort((a, b) => a.price - b.price)
    } else if (sortOrder === "price_desc") {
      sorted = sorted.sort((a, b) => b.price - a.price)
    } else if (sortOrder === "name") {
      sorted = sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === "quantity") {
      sorted = sorted.sort((a, b) => getTotalStock(b.stocks) - getTotalStock(a.stocks))
    }
    setFilteredProducts(sorted)
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catalogue de Produits</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(products)/product-form")}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Ajouter un produit</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterSortContainer}>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(itemValue) => handleFilter(itemValue)}
        >
          <Picker.Item label="Tous" value="all" />
          <Picker.Item label="Électronique" value="electronic" />
          <Picker.Item label="Vêtements" value="clothing" />
        </Picker>

        <Picker
          selectedValue={sortOrder}
          style={styles.picker}
          onValueChange={(itemValue) => handleSort(itemValue)}
        >
          <Picker.Item label="Nom" value="name" />
          <Picker.Item label="Prix croissant" value="price_asc" />
          <Picker.Item label="Prix décroissant" value="price_desc" />
          <Picker.Item label="Stock disponible" value="quantity" />
        </Picker>
      </View>

      <FlatList
        data={filteredProducts}
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginLeft: 8,
  },
  filterSortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    marginHorizontal: 5,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
  },
  productType: {
    color: "#666",
  },
  productPrice: {
    color: "#6200ee",
  },
  productStock: {
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
  },
  searchIcon: {
    marginRight: 8,
  },
})
