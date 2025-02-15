import { useEffect, useState, useCallback } from "react"
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image, TextInput } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { MotiView } from "moti"
import ProductFormScreen from "../(products)/product-form"
import { updateStock } from '../services/productService'

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

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts])
    setFilteredProducts((prevFiltered) => [newProduct, ...prevFiltered])
  }

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("http://192.168.9.108:3001/products")
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [])
  )

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  const getTotalStock = useCallback((stocks: Stock[]) => {
    if (!Array.isArray(stocks)) {
      return 0
    }
    return stocks.reduce((total, stock) => total + stock.quantity, 0)
  }, [])

  const filterProducts = useCallback(
    (query: string, filterValue: string) => {
      console.log("Filtering products with query:", query, "and filterValue:", filterValue)
      
      // Start with all products
      let filtered = [...products]

      // Apply search query if it exists
      if (query) {
        filtered = filtered.filter((product) => {
          const searchLower = query.toLowerCase()
          return (
            (product.name && product.name.toLowerCase().includes(searchLower)) ||
            (product.type && product.type.toLowerCase().includes(searchLower)) ||
            (product.supplier && product.supplier.toLowerCase().includes(searchLower))
          )
        })
      }

      // Apply type filter if not "all"
      if (filterValue !== "all") {
        filtered = filtered.filter((product) => 
          product.type && product.type.toLowerCase() === filterValue.toLowerCase()
        )
      }

      setFilteredProducts(filtered)
      if (sortOrder) {
        sortProducts(filtered, sortOrder)
      }
    },
    [products, sortOrder]
  )

  const handleFilter = useCallback(
    (filterValue: string) => {
      setFilter(filterValue)
      filterProducts(searchQuery, filterValue)
    },
    [searchQuery, filterProducts]
  )

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      filterProducts(query, filter)
    },
    [filter, filterProducts]
  )

  const handleSort = useCallback(
    (sortValue: string) => {
      setSortOrder(sortValue)
      sortProducts(filteredProducts, sortValue)
    },
    [filteredProducts]
  )

  const sortProducts = useCallback(
    (productsToSort: Product[], sortOrder: string) => {
      let sorted = [...productsToSort]
      
      switch(sortOrder) {
        case "price_asc":
          sorted.sort((a, b) => a.price - b.price)
          break
        case "price_desc":
          sorted.sort((a, b) => b.price - a.price)
          break
        case "name":
          sorted.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "quantity":
          sorted.sort((a, b) => getTotalStock(b.stocks) - getTotalStock(a.stocks))
          break
      }
      
      setFilteredProducts(sorted)
    },
    [getTotalStock]
  )

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => router.push({ pathname: "/(products)/product-details", params: { id: item.id } })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productType}>{item.type}</Text>
          <Text style={styles.productPrice}>
            {item.price != null ? item.price.toLocaleString() : 'N/A'} MAD
          </Text>
          <Text style={styles.productStock}>En stock: {getTotalStock(item.stocks)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#6200ee" />
      </TouchableOpacity>
    ),
    [router, getTotalStock]
  )

  const handleUpdateStock = async (productId: string, stockId: number, quantity: number) => {
    try {
      const updatedProduct = await updateStock(productId, stockId, quantity)
      setProducts((prevProducts) => 
        prevProducts.map(product => 
          product.id === Number(productId) ? updatedProduct : product
        )
      )
      setFilteredProducts((prevFiltered) => 
        prevFiltered.map(product => 
          product.id === Number(productId) ? updatedProduct : product
        )
      )
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock :", error)
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
  }

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
      >
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 300 }}
      >
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(products)/product-form")}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter un produit</Text>
        </TouchableOpacity>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 500, delay: 200 }}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateX: 50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 500, delay: 400 }}
      >
        <View style={styles.filterSortContainer}>
          <TouchableOpacity
            style={[styles.tag, filter === "all" && styles.activeTag]}
            onPress={() => handleFilter("all")}
          >
            <Text style={[styles.tagText, filter === "all" && styles.activeTagText]}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tag, sortOrder === "name" && styles.activeTag]}
            onPress={() => handleSort("name")}
          >
            <Text style={[styles.tagText, sortOrder === "name" && styles.activeTagText]}>Nom</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tag, sortOrder === "price_asc" && styles.activeTag]}
            onPress={() => handleSort("price_asc")}
          >
            <Text style={[styles.tagText, sortOrder === "price_asc" && styles.activeTagText]}>Prix ↑</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tag, sortOrder === "price_desc" && styles.activeTag]}
            onPress={() => handleSort("price_desc")}
          >
            <Text style={[styles.tagText, sortOrder === "price_desc" && styles.activeTagText]}>Prix ↓</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tag, sortOrder === "quantity" && styles.activeTag]}
            onPress={() => handleSort("quantity")}
          >
            <Text style={[styles.tagText, sortOrder === "quantity" && styles.activeTagText]}>Quantité</Text>
          </TouchableOpacity>
        </View>
      </MotiView>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item,index) => index.toString()}
        renderItem={renderItem}
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
    padding: 12,
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterSortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    color: "#333",
  },
  productType: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    color: "#6200ee",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productStock: {
    color: "#666",
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  tag: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  activeTag: {
    backgroundColor: "#6200ee",
  },
  activeTagText: {
    color: "#fff",
  },
})