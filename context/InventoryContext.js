import React, { useState } from 'react';  // Import React and useState

// Create the Inventory Context
const InventoryContext = React.createContext();

// InventoryProvider component to wrap the app
const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);  // Define state for products

  return (
    <InventoryContext.Provider value={{ products, setProducts }}>
      {children}
    </InventoryContext.Provider>
  );
};

export { InventoryContext, InventoryProvider };
