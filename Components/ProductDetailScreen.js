import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity, Image, ScrollView, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import { InventoryContext } from '../context/InventoryContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [stockChange, setStockChange] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantitySold, setQuantitySold] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const { products, setProducts } = useContext(InventoryContext);

  const baseUrl = 'https://jbackend-production.up.railway.app'; // Ensure this is your correct base URL

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      axios.get(`${baseUrl}/api/inventory/${productId}`)
        .then(response => {
          setProduct(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          Alert.alert('Error', `Failed to fetch product details: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [productId]);

  const handleUpdateStock = () => {
    const quantity = parseInt(stockChange, 10);
    if (isNaN(quantity) || quantity < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid non-negative number');
      return;
    }
    setIsLoading(true);
    axios.put(`${baseUrl}/api/inventory/${productId}`, { stock: quantity })
      .then(() => {
        Alert.alert('Success', 'Stock updated successfully!');
        setProducts(prevProducts =>
          prevProducts.map(item =>
            item._id === productId ? { ...item, stock: quantity } : item
          )
        );
        setStockChange('');
      })
      .catch(error => {
        Alert.alert('Error', `Failed to update stock: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteProduct = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
            setIsLoading(true);
            axios.delete(`${baseUrl}/api/inventory/${productId}`)
              .then(() => {
                setProducts(prevProducts => prevProducts.filter(item => item._id !== productId));
                navigation.goBack();
              })
              .catch(error => {
                Alert.alert('Error', `Failed to delete product: ${error.message}`);
              })
              .finally(() => setIsLoading(false));
          }},
      ],
      { cancelable: true }
    );
  };

  const handleRecordSale = () => {
    const quantity = parseInt(quantitySold, 10);
    const price = parseFloat(sellingPrice);
  
    // Log the price before API call
    console.log('Selling Price before API call:', price);
  
    if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter valid values for quantity sold and selling price.');
      return;
    }
  
    setIsLoading(true);
    axios.post(`${baseUrl}/api/sales`, {
      productId,
      quantity,
      sellingPrice: price,
      saleDate: new Date().toISOString()
    })
    .then(() => {
      Alert.alert('Success', 'Sale recorded successfully');
      setQuantitySold('');
      setSellingPrice('');  // Reset only after success
    })
    .catch(error => {
      Alert.alert('Error', `Failed to record sale: ${error.message}`);
    })
    .finally(() => setIsLoading(false));
  };
  
  
  // Render loading or product not found message
  if (!product) {
    return (
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator size="large" color="#007BFF" /> : <Text>Product not found!</Text>}
      </View>
    );
  }
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={{ uri: `${baseUrl}${product.imageUrl}` }} style={styles.productImage} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.label}>Current Stock: {product.stock}</Text>

      <Text style={styles.label}>Quantity Sold:</Text>
      <TextInput
        style={styles.input}
        value={quantitySold}
        onChangeText={setQuantitySold}
        keyboardType="numeric"
        placeholder="Enter quantity sold"
      />

      <Text style={styles.label}>Selling Price:</Text>
      <TextInput
        style={styles.input}
        value={sellingPrice}
        onChangeText={setSellingPrice}
        keyboardType="numeric"
        placeholder="Enter selling price"
      />

<View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.button} onPress={handleRecordSale}>
    <Icon name="save" size={20} color="#fff" style={styles.icon} />
    <Text style={styles.buttonText}>Record Sale</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.button}
    onPress={() => navigation.navigate('SalesScreen')}
  >
    <Icon name="line-chart" size={24} color="#fff" />
    <Text style={styles.buttonText}>View Sales</Text>
  </TouchableOpacity>
</View>


      <Text style={styles.label}>Update Stock Quantity:</Text>
      <TextInput
        style={styles.input}
        value={stockChange}
        onChangeText={setStockChange}
        keyboardType="numeric"
        placeholder="Enter quantity"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpdateStock}>
          <Text style={styles.buttonText}>Update Stock</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.button1}
        onPress={handleDeleteProduct}
      >
        <Icon name="trash" size={24} color="white" />
        <Text style={styles.buttonText}> Delete Product</Text>
      </TouchableOpacity>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#555',
  },
  input: {
    borderColor: '#007BFF',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button1: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 5, 
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingDeleteButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#FF4D4D',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});

export default ProductDetailScreen;
