import React from 'react';
import './SideNav.css';

function SideNav({ activePage, onSetActivePage }) {
  return (
    <div className="sidenav">
      <button
        className={`nav-button ${activePage === 'inventory' ? 'active' : ''}`}
        onClick={() => onSetActivePage('inventory')}
      >
        Inventory
      </button>
      <button
        className={`nav-button ${activePage === 'orders' ? 'active' : ''}`}
        onClick={() => onSetActivePage('orders')}
      >
        Orders
      </button>
      <button
        className={`nav-button ${activePage === 'customers' ? 'active' : ''}`}
        onClick={() => onSetActivePage('customers')}
      >
        Customers
      </button>
    </div>
  );
}

export default SideNav;