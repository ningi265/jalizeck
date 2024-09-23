import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const SalesScreen = ({ navigation }) => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name'); // Default sorting by name
  const [page, setPage] = useState(1); // Pagination page
  const [isFetchingMore, setIsFetchingMore] = useState(false); // Track if more data is being fetched

  useEffect(() => {
    fetchSales();
  }, [page]);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`http://192.168.44.245:4000/api/sales?page=${page}&limit=10`);
      const newSales = response.data;
  
      setSales(prevSales => {
        const allSales = [...prevSales, ...newSales];
        
        // Use a Set to filter out duplicate _id values
        const uniqueSales = Array.from(new Map(allSales.map(sale => [sale._id, sale])).values());
  
        return uniqueSales;
      });
  
      setFilteredSales(prevSales => {
        const allSales = [...prevSales, ...newSales];
        const uniqueSales = Array.from(new Map(allSales.map(sale => [sale._id, sale])).values());
        
        return uniqueSales;
      });
    } catch (error) {
      Alert.alert('Error', `Failed to fetch sales: ${error.message}`);
      setSales([]);
      setFilteredSales([]);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };
  

  useEffect(() => {
    filterAndSortSales();
  }, [searchQuery, sortOption, sales]);

  const filterAndSortSales = () => {
    if (!sales.length) return;
  
    let updatedSales = [...sales];
  
    // Only filter if productId and name exist
    if (searchQuery) {
      updatedSales = updatedSales.filter(sale => 
        sale.productId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Sort based on valid data
    if (sortOption === 'name') {
      updatedSales.sort((a, b) => a.productId?.name?.localeCompare(b.productId?.name || ''));
    } else if (sortOption === 'price') {
      updatedSales.sort((a, b) => (a.productId?.price || 0) - (b.productId?.price || 0));
    } else if (sortOption === 'date') {
      updatedSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
    }
  
    setFilteredSales(updatedSales);
  };
  
  

  const handleLoadMore = () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderSaleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.saleItem}
      onPress={() => navigation.navigate('SalesDetailScreen', { sale: item })}
    >
      {item.productId ? (
        <>
          <Text style={styles.productName}>
            Product Name: {item.productId.name || 'N/A'}
          </Text>
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
          <Text style={styles.price}>Price: MWK {item.sellingPrice}</Text>
          <Text style={styles.date}>
            Date: {new Date(item.saleDate).toLocaleDateString()}
          </Text>
        </>
      ) : (
        <Text style={styles.errorText}>Product information not available.</Text>
      )}
    </TouchableOpacity>
  );
  
  
  

  if (isLoading && !isFetchingMore) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading sales data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by product name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity style={styles.sortOption} onPress={() => setSortOption('name')}>
          <Text style={sortOption === 'name' ? styles.activeSort : styles.inactiveSort}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortOption} onPress={() => setSortOption('price')}>
          <Text style={sortOption === 'price' ? styles.activeSort : styles.inactiveSort}>Price</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortOption} onPress={() => setSortOption('date')}>
          <Text style={sortOption === 'date' ? styles.activeSort : styles.inactiveSort}>Date</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredSales}
        keyExtractor={item => item._id}
        renderItem={renderSaleItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null}
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortOption: {
    marginHorizontal: 10,
  },
  activeSort: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  inactiveSort: {
    fontSize: 16,
    color: '#555',
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
