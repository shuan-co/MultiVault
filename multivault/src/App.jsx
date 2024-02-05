import React, { useState } from 'react';
import Inventory from './pages/auth/Inventory';
import AddItem from './pages/auth/AddItem';


function App() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const handleAddItem = (itemName) => {
    setItems([...items, itemName]);
  };

  return (
    <div className="App">
      <h1>Inventory Management System</h1>
      <AddItem onAdd={handleAddItem} />
      <Inventory items={items} />
    </div>
  );
}

export default App;
