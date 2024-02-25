import React, { useState, useMemo } from 'react';
import './Inventory.css';
import './InventoryHead.css';
import './InventorySide.css';
import { Pagination, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const Inventory = ({ items, onShowAddItem, activeSubPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('Name');
  const [filterBy, setFilterBy] = useState('All'); // Added state for filtering

  // Adding dropdownOpen state for the Dropdown toggle functionality
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let tempItems = items;

    // Filter by activeSubPage
    if (activeSubPage === 'low-stock') {
      tempItems = items.filter(item => item.quantity <= 50);
    }

    // Filter by perishable status
    if (filterBy === 'Perishable') {
      tempItems = tempItems.filter(item => item.status === 'Perishable');
    } else if (filterBy === 'Non-Perishable') {
      tempItems = tempItems.filter(item => item.status === 'Non-Perishable');
    }

    // Sort items
    switch (sortBy) {
      case 'Name':
        return tempItems.sort((a, b) => a.name.localeCompare(b.name));
      case 'Quantity':
        return tempItems.sort((a, b) => a.quantity - b.quantity);
      default:
        return tempItems;
    }
  }, [items, activeSubPage, sortBy, filterBy]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="main-container">
       <div className="sidebar">
         <div className="profile">
           <img src="https://www.pinclipart.com/picdir/middle/148-1486972_mystery-man-avatar-circle-clipart.png" alt="Profile" className="profile-image" />
             <h3 className="profile-name">John Doe</h3>
               <div className="button-container">
                 <button className="sidebar-button">Button 1</button>
                 <button className="sidebar-button">Button 2</button>
                 <button className="sidebar-button">Button 3</button>
                 <button className="sidebar-button">Button 4</button>
               </div>
               <button className="sidebar-button"></button>
          </div> 
       </div>
       <div className="inventory-content">
        <div className="header">
          <h2 className="title">
            Sort By:
            <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {sortBy}
                <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '5px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('Name')}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('Quantity')}>Quantity</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="filter-buttons">
              <button onClick={() => setFilterBy('All')} className={filterBy === 'All' ? 'active' : ''}>All</button>
              <button onClick={() => setFilterBy('Perishable')} className={filterBy === 'Perishable' ? 'active' : ''}>Perishable</button>
              <button onClick={() => setFilterBy('Non-Perishable')} className={filterBy === 'Non-Perishable' ? 'active' : ''}>Non-Perishable</button>
            </div>
            <button className="add-button" onClick={onShowAddItem}>ADD</button>
          </h2>
        </div>
        <div className="inventory">
          {currentItems.length > 0 ? (
             currentItems.map((item, index) => (
                <div key={index} className="item">
                  <img src={item.image || "https://lh3.googleusercontent.com/proxy/ua8hNK96q9w_uMC3uKo2sYYPj0tyDTEKnm-LFkBt78dRYVdTRMI22L-KlAm2wTQW2MQSLVfLCdTtXdqkC2n7RJc9N9JDQoZM7hYlCCXusXho1gTfnjZiZQk3UHMQjZRJ"} alt={item.name || "Default placeholder"} />
                  <div className="item-name">
                  <span className="item-value-name">{item.name}</span>
                    </div>
                  <div className="item-details">
                  <div className="item-row">
                     <span className="item-title">DESCRIPTION:</span>
                     <span className="item-value">{item.description}</span>
                  </div>
                  <div className="item-row">
                     <span className="item-title">PERISHABLE:</span>
                     <span className="item-value">{item.status}</span>
                  </div>
                  <div className="item-row">
                     <span className="item-title">QTY:</span>
                     <span className="item-value">{item.quantity}</span>
                  </div>
                  <div className="item-row">
                     <span className="item-title">EXP:</span>
                     <span className="item-value">{item.expiry}</span>
                  </div>
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