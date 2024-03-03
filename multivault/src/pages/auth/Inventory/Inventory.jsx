import React, { useState, useMemo } from 'react';
import './Inventory.css';
import './InventoryHead.css';
import './InventorySide.css';
import { Pagination, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import EditItem from './EditItem.jsx';

const Inventory = ({ items, onShowAddItem, onShowEditItem, activeSubPage, sortItemsByMinQuantity, sortItemsByMaxQuantity, sortItemsAsc, sortItemsDesc, sortExpAsc, sortExpDesc, setItemToEdit, onToggleSelectItem, selectedItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('Name');
  const [filterBy, setFilterBy] = useState('All');

  const filteredItems = useMemo(() => {
    let tempItems = items;

    if (activeSubPage === 'low-stock') {
      tempItems = items.filter(item => item.quantity <= 50);
    }

    if (filterBy === 'Perishable') {
      tempItems = tempItems.filter(item => item.status === 'Perishable');
    } else if (filterBy === 'Non-Perishable') {
      tempItems = tempItems.filter(item => item.status === 'Non-Perishable');
    }

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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = (isOpen) => {
    console.log("Dropdown state before:", dropdownOpen);
    setDropdownOpen(isOpen);
    console.log("Dropdown state after:", dropdownOpen);
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
            <Dropdown show={dropdownOpen} onToggle={handleToggleDropdown}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {sortBy}
                <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: '5px' }} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { setSortBy('A-Z'); setDropdownOpen(false); sortItemsAsc()}}>A-Z</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Z-A'); setDropdownOpen(false); sortItemsDesc()}}>Z-A</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Quantity Ascending'); setDropdownOpen(false); sortItemsByMinQuantity()}}>Quantity Ascending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Quantity Descending'); setDropdownOpen(false); sortItemsByMaxQuantity()}}>Quantity Descending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Expiration Date Ascending'); setDropdownOpen(false); sortExpAsc()}}>Expiration Ascending</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('Expiration Date Descending'); setDropdownOpen(false); sortExpDesc()}}>Expiration Descending</Dropdown.Item>
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
                  <div className = "item-header">
                  <input
											class="item-select-checkbox"
											type="checkbox"
											onChange={() => onToggleSelectItem(item.index)}
										/>
										<button className="item-edit-button" onClick={() => {setItemToEdit(item); onShowEditItem();}}></button>
                  </div>
                  <img src={item.imageurl} alt={item.name || "Default placeholder"}/>
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