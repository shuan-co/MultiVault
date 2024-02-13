import React, { useState, useMemo } from 'react';
import './Inventory.css'
import './InventoryHead.css'
import './InventorySide.css'
import { Pagination, Dropdown, Form } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
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
            <Dropdown show={dropdownOpen} onToggle={() => {}}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic" onClick={handleToggleDropdown}>
                {sortBy}
                <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '5px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu show={dropdownOpen}>
                <Dropdown.Item onClick={() => { setSortBy('Name'); setDropdownOpen(false); }}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Quantity'); setDropdownOpen(false); }}>Quantity</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button className="add-button" onClick={onShowAddItem}>ADD</button>
          </h2>
        </div>
        <div className="inventory">
          {currentItems.length > 0 ? (
             currentItems.map((item, index) => (
                <div key={index} className="item">
                  <img src={item.image || "https://raw.githubusercontent.com/shuan-co/MultiVault/feature/firebase_registration/multivault/src/pages/noauth/Login/loginBg.jpg?token=GHSAT0AAAAAACH6U6KGEXWRX7AF3K2QVACCZOG7U2A"} alt={item.name || "Default placeholder"} />
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
