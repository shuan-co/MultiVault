import React, { useState } from 'react';
import SideNav from './SideNav';
import Inventory from './Inventory';
import AddItem from './AddItem';

function Inventorypage() {
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (item) => {
    setItems([...items, item]);
    setShowAddItem(false); // Close the modal after item is added
  };

  return (
    <div className="Inventorypage">
      <div className="content">
        <main>
          <Inventory items={items} onShowAddItem={() => setShowAddItem(true)} />
          <AddItem onAdd={handleAddItem} show={showAddItem} onHide={() => setShowAddItem(false)} />
        </main>
      </div>
    </div>
  );
}

export default Inventorypage;
