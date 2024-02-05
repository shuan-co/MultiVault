import React, { useState } from 'react';

const AddItem = ({ onAdd }) => {
  const [itemName, setItemName] = useState('');

  const handleChange = (e) => {
    setItemName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    onAdd(itemName);
    setItemName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter item name"
        value={itemName}
        onChange={handleChange}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItem;
