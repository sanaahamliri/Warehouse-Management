import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchStockStatistics } from '../services/productService';

interface Statistics {
  totalProducts: number;
  totalCities: number;
  outOfStockProducts: number;
  totalStockValue: number;
}

export default function App() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  useEffect(() => {
    const getStatistics = async () => {
      const stats = await fetchStockStatistics();
      setStatistics(stats);
    };
    getStatistics();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {statistics ? (
          <>
            <Text style={styles.title}>Statistiques des stocks</Text>
            <View style={styles.statItem}>
              <Text style={styles.label}>Nombre total de produits:</Text>
              <Text style={styles.value}>{statistics.totalProducts}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.label}>Nombre total de villes:</Text>
              <Text style={styles.value}>{statistics.totalCities}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.label}>Produits en rupture de stock:</Text>
              <Text style={styles.value}>{statistics.outOfStockProducts}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.label}>Valeur totale des stocks:</Text>
              <Text style={styles.value}>{statistics.totalStockValue} MAD</Text>
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Chargement des statistiques...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});