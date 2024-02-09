// App.js
import React, { useState } from 'react';
import SideNav from './pages/auth/Inventory/SideNav';
import Inventory from './pages/auth/Inventory/Inventory';
import AddItem from './pages/auth/Inventory/AddItem';

function App() {
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false); // State to control the AddItem modal

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowAddItem(false); // Close the modal after item is added
  };

  return (
    <div className="App">
      <SideNav />
      <div className="content">
        <main>
          <Inventory items={items} onShowAddItem={() => setShowAddItem(true)} />
          <AddItem onAdd={handleAddItem} show={showAddItem} onHide={() => setShowAddItem(false)} />
        </main>
      </div>
    </div>
  );
}

export default App;
