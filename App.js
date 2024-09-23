import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Import SafeAreaProvider
import ProductListScreen from './Components/ProductListScreen';
import ProductDetailScreen from './Components/ProductDetailScreen';
import AddProductScreen from './Components/AddProductScreen';
import SalesScreen from './Components/SalesScreen';
import { InventoryProvider } from './context/InventoryContext';
import SaleDetailScreen from './Components/SalesDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <InventoryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider> 
          <NavigationContainer>
            <Stack.Navigator initialRouteName="ProductList">
              <Stack.Screen name="ProductList" component={ProductListScreen} />
              <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
              <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
              <Stack.Screen name="SalesScreen" component={SalesScreen} />
              <Stack.Screen name="SalesDetailScreen" component={SaleDetailScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </InventoryProvider>
  );
}
