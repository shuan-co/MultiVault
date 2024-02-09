import React, { useState, useMemo } from 'react';
import './Inventory.css'
import './InventoryHead.css'
import './InventorySide.css'
import { Pagination, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDown} from '@fortawesome/free-solid-svg-icons';

const Inventory = ({ items, onShowAddItem, activeSubPage }) => {
  const filteredItems = useMemo(() => {
    if (activeSubPage === 'all') {
      return items;
    } else if (activeSubPage === 'low-stock') {
      return items.filter((item) => item.quantity <= 50)
    } else {
      return items;
    }
  }, [items, activeSubPage]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const [sortBy, setSortBy] = useState('Name');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="profile">
          <img src="profile-image-url" alt="Profile" className="profile-image" />
            <h3 className="profile-name">John Doe</h3>
              <div className="button-container">
                <button className="sidebar-button">Button 1</button>
                <button className="sidebar-button">Button 2</button>
                <button className="sidebar-button">Button 3</button>
                <button className="sidebar-button">Button 4</button>
       </div>
      </div>
      </div>
      <div className="inventory-content"> 
        <div className="header">
        <h2 className="title">
            Sort By:
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {sortBy}
                <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '5px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('Name')}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('Quantity')}>Quantity</Dropdown.Item>
                {/* Add more options as needed */}
              </Dropdown.Menu>
            </Dropdown>
            <button className="add-button" onClick={onShowAddItem}>ADD</button>
          </h2>
        </div>
        <div className="inventory">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div key={index} className="item">
                {item.image && <img src={item.image} alt={item.name} />}
                <div className="item-details">
                  <span className="item-name">Name: {item.name}</span>
                  <span className="item-description">Description: {item.description}</span>
                  <span className="item-status">Perishable: {item.status}</span>
                  <span className="item-quantity">Quantity: {item.quantity}</span>
                  <span className="item-expiry">Expiry: {item.expiry}</span> 
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">No items available</div>
          )}
        </div>
        <div className="pagination-container">
         <Pagination>
          {currentPage > 1 && (
            <Pagination.Item onClick={handlePrevPage}>
            <FontAwesomeIcon icon={faAngleLeft} />
            </Pagination.Item>
          )}

          {[...Array(totalPages)].map((_, idx) => (
           <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
           >
            {idx + 1}
           </Pagination.Item>
          ))}
 
          {currentPage < totalPages && (
           <Pagination.Item onClick={handleNextPage}>
            <FontAwesomeIcon icon={faAngleRight} />
           </Pagination.Item>
          )}
         </Pagination>
       </div>
      </div>
    </div>
  );
};

export default Inventory;
