"use client"

import React, { useState } from "react"
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { addProduct } from '../services/productService'
import Scanner from "../hooks/camera/Scanner"

interface Stock {
  name: string
  quantity: string
  city: string
  latitude: string
  longitude: string
}

interface ProductData {
  name: string
  type: string
  supplier: string
  price: string
  image: string
  barcode?: string
  stocks: Stock[]
}

export default function ProductFormScreen() {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    type: '',
    supplier: '',
    price: '',
    image: '',
    barcode: '',
    stocks: [{ name: '', quantity: '', city: '', latitude: '', longitude: '' }],
  })
  const [showStockForm, setShowStockForm] = useState(false)
  const router = useRouter()
  const [isScannerVisible, setIsScannerVisible] = useState(false)

  const handleStockChange = (index: number, field: string, value: string) => {
    const updatedStocks = [...productData.stocks]
    updatedStocks[index] = { ...updatedStocks[index], [field]: value }
    setProductData({ ...productData, stocks: updatedStocks })
  }

  const handleInputChange = (field: string, value: string) => {
    setProductData({ ...productData, [field]: value })
  }

  const handleSubmit = async () => {
    try {
      if (!productData.name || !productData.price || !productData.barcode) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires')
        return
      }

      const productToSubmit = { 
        ...productData,
        price: Number(productData.price), 
        image: productData.image || null,
      }

      await addProduct(productToSubmit)
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
    })

    if (!result.canceled) {
      setProductData({ ...productData, image: result.assets[0].uri })
    }
  }

  const handleScan = (barcode: string) => {
    handleInputChange('barcode', barcode)
    setIsScannerVisible(false)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajouter un Produit</Text>
      <TextInput placeholder="Nom du produit" value={productData.name} onChangeText={(text) => handleInputChange('name', text)} style={styles.input} />
      <TextInput placeholder="Type" value={productData.type} onChangeText={(text) => handleInputChange('type', text)} style={styles.input} />
      <TextInput placeholder="Fournisseur" value={productData.supplier} onChangeText={(text) => handleInputChange('supplier', text)} style={styles.input} />
      <TextInput placeholder="Prix" value={productData.price} onChangeText={(text) => handleInputChange('price', text)} keyboardType="numeric" style={styles.input} />
      <TextInput 
        placeholder="Code-barres" 
        value={productData.barcode} 
        onChangeText={(text) => handleInputChange('barcode', text)} 
        style={styles.input} 
      />
      <TouchableOpacity onPress={() => setIsScannerVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Scanner le Code-barres</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
        {productData.image ? (
          <Image source={{ uri: productData.image }} style={styles.image} />
        ) : (
          <Text>Choisir une image</Text>
        )}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Voulez-vous ajouter un stock à votre produit ?</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowStockForm(!showStockForm)}
        >
          <Text style={styles.toggleButtonText}>
            {showStockForm ? "-" : "+"}
          </Text>
        </TouchableOpacity>
      </View>

      {showStockForm && productData.stocks.map((stock, index) => (
        <View key={index} style={styles.stockContainer}>
          <Text style={styles.stockTitle}>Stock {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'entrepôt"
            placeholderTextColor="gray"
            value={stock.name}
            onChangeText={(value) => handleStockChange(index, "name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantité"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={stock.quantity}
            onChangeText={(value) => handleStockChange(index, "quantity", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ville"
            placeholderTextColor="gray"
            value={stock.city}
            onChangeText={(value) => handleStockChange(index, "city", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            placeholderTextColor="gray"
            value={stock.latitude}
            onChangeText={(value) => handleStockChange(index, "latitude", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            placeholderTextColor="gray"
            value={stock.longitude}
            onChangeText={(value) => handleStockChange(index, "longitude", value)}
          />
        </View>
      ))}

      {showStockForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setProductData({
              ...productData,
              stocks: [...productData.stocks, { name: "", quantity: "", city: "", latitude: "", longitude: "" }],
            })
          }}
        >
          <Text style={styles.addButtonText}>Ajouter un autre stock</Text>
        </TouchableOpacity>
      )}

      {isScannerVisible && (
        <Scanner onScan={handleScan} onClose={() => setIsScannerVisible(false)} />
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Ajouter</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#6200ee",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#e0e0ff",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stockContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    padding: 5,
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
})