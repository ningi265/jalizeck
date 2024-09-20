import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const SalesScreen = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://192.168.44.245:4000/api/sales');
        setSales(response.data);
      } catch (error) {
        Alert.alert('Error', `Failed to fetch sales: ${error.message}`);
        setSales([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading sales data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recorded Sales</Text>
      <FlatList
        data={sales}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.saleItem}>
            {item.productId ? (
              <>
                <Text style={styles.productId}>Product ID: {item.productId._id}</Text>
                <Text style={styles.productName}>Product Name: {item.productId.name}</Text>
                <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.price}>Price: ${item.productId.price ? item.productId.price.toFixed(2) : 'N/A'}</Text>
                <Text style={styles.date}>Date: {new Date(item.saleDate).toLocaleDateString()}</Text>
              </>
            ) : (
              <Text style={styles.errorText}>Product information not available.</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  saleItem: {
    padding: 15,
    marginVertical: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  quantity: {
    fontSize: 16,
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#28a745',
  },
  date: {
    fontSize: 14,
    color: '#777',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default SalesScreen;
