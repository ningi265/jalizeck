import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SaleDetailScreen = ({ route }) => {
  const { sale } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sale Detail</Text>
      {sale.productId ? (
        <>
          <Text style={styles.productName}>Product Name: {sale.productId.name}</Text>
          <Text style={styles.productId}>Product ID: {sale.productId._id}</Text>
          <Text style={styles.quantity}>Quantity Sold: {sale.quantity}</Text>
          <Text style={styles.price}>Price: MWK {sale.sellingPrice}</Text>
          <Text style={styles.date}>Sale Date: {new Date(sale.saleDate).toLocaleDateString()}</Text>
        </>
      ) : (
        <Text style={styles.errorText}>Product information not available.</Text>
      )}
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
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  productId: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
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
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
  },
});

export default SaleDetailScreen;
