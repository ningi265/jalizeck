// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductListScreen from './Components/ProductListScreen';
import ProductDetailScreen from './Components/ProductDetailScreen';
import AddProductScreen from './Components/AddProductScreen';
import { InventoryProvider } from './context/InventoryContext'; 
import SalesScreen from './Components/SalesScreen'; // Import the InventoryProvider

const Stack = createStackNavigator();

export default function App() {
  return (
    <InventoryProvider>  
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen name="JALIZECK" component={ProductListScreen} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
          <Stack.Screen name="SalesScreen" component={SalesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </InventoryProvider>
  );
}
