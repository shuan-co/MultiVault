import React from 'react';

const Inventory = ({ items }) => {
  return (
    <div>
      <h2>Inventory</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
