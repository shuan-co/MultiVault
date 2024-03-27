import React, { useState, useMemo, useEffect } from 'react';
import './Inventory.css';
import './InventoryHead.css';
import './InventorySide.css';
import { Pagination, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { collection, doc, getDoc, addDoc, getDocs, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import { auth, db } from '../../../firebase/firebase';
import { Fragment } from 'react'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { grey, yellow } from '@mui/material/colors'
import ProfileSection from './ProfileSection';

const Inventory = ({ 
  userData, onSave, onDelete, onLogout, items, onShowAddItem, onShowEditItem, 
  activeSubPage, setItemToEdit, onToggleSelectItem, 
  selectedItems, onShowUseItem, onShowOrderItem,
}) => {

  // - Inventory Details
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortBy, setSortBy] = useState('Name');
  const [filterBy, setFilterBy] = useState('All');
  const [prioritizedItems, setPrioritizedItems] = useState({});
  const itemsCollectionRef = collection(db, `users/${auth.currentUser?.uid}/items`);
  const [allItems, setAllItems] = useState([]);
  const [selected, setSelected] = useState('AZ');
  const [filteredItems, setFilteredItems] = useState([])
  
  useEffect(() => {
    const unsubscribe = onSnapshot(itemsCollectionRef, (snapshot) => {
      const itemsData = [];
      snapshot.forEach(doc => {
        itemsData.push({ id: doc.id, ...doc.data() });
      });
      setAllItems(itemsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPrioritizedItems = async () => {
      try {
        setSortBy('Priority');
        const querySnapshot = await getDocs(itemsCollectionRef);
        const prioritizedItemsData = {};
        querySnapshot.forEach(doc => {
          prioritizedItemsData[doc.id] = doc.data().prioritized || false;
        });
        setPrioritizedItems(prioritizedItemsData);
      } catch (error) {
        console.error('Error fetching prioritized items:', error);
      }
    };

    fetchPrioritizedItems();
  }, []);

  // Check if an item is low on stock
  const isLowOnStock = (item) => {
    const tenPercentOfOriginal = item.quantityOrig * 0.1;
    return item.quantityCurr <= tenPercentOfOriginal;
  }

  // Alert Expiration
  const alertExpiry = (item) => {
    const currDate = new Date();
    const expiryDate = new Date(item.expiry);
    // Calculate the difference between the two dates in milliseconds
    const differenceMs = expiryDate - currDate;
    // Convert milliseconds to days
    const differenceDays = differenceMs / (1000 * 60 * 60 * 24);

    return differenceDays <= 2;
  }

  /*************************************************************** 
                      Sort Items Functions
  ***************************************************************/
    function sortItemsByMinQuantity() {
        setFilteredItems([...filteredItems].sort((a, b) => parseInt(a.quantityCurr) - parseInt(b.quantityCurr)));
    }
        
    function sortItemsByMaxQuantity() {
        setFilteredItems([...filteredItems].sort((a, b) => parseInt(b.quantityCurr) - parseInt(a.quantityCurr)));
    }
        
    function sortItemsAsc() {
        setFilteredItems([...filteredItems].sort((a, b) => a.name.localeCompare(b.name)));
    }
        
    function sortItemsDesc() {
        setFilteredItems([...filteredItems].sort((a, b) => b.name.localeCompare(a.name)));
    }
        
    function sortExpAsc() {
        setFilteredItems([...filteredItems].sort((a, b) => new Date(a.expiry) - new Date(b.expiry)));
    }
        
    function sortExpDesc() {
        setFilteredItems([...filteredItems].sort((a, b) => new Date(b.expiry) - new Date(a.expiry)));
    }

    function sortFavorited() {
        setFilteredItems([...filteredItems].sort((a, b) => {
          const aIsFavorited = prioritizedItems[a.id] || false;
          const bIsFavorited = prioritizedItems[b.id] || false;
      
          if (aIsFavorited && !bIsFavorited) {
            return -1; // a comes before b
          } else if (!aIsFavorited && bIsFavorited) {
            return 1; // b comes before a
          } else {
            // If both are favorited or both are not favorited,
            // sort them based on their names
            return a.name.localeCompare(b.name);
          }
        }));
      }
      
                    
                    

  /*************************************************************** 
                      Inventory Functions
  ***************************************************************/
    useEffect(() => {
        setFilteredItems(() => {
        let tempItems = allItems;
    
        if (activeSubPage === 'low-stock') {
            tempItems = allItems.filter(item => item.quantity <= 50);
        }
    
        if (filterBy === 'Perishable') {
            tempItems = tempItems.filter(item => item.status === 'Perishable');
        } else if (filterBy === 'Non-Perishable') {
            tempItems = tempItems.filter(item => item.status === 'Non-Perishable');
        }
    
        if (filterBy === "Prioritized") {
            tempItems = tempItems.filter((item) => prioritizedItems[item.id]);
        }
    
        switch (sortBy) {
            case 'Name':
            return [...tempItems].sort((a, b) => a.name.localeCompare(b.name));
            case 'Quantity':
            return [...tempItems].sort((a, b) => Number(a.quantity) - Number(b.quantity));
            case 'Priority':
            return [...tempItems].sort((a, b) => {
                if (prioritizedItems[a.id] && !prioritizedItems[b.id]) {
                return -1;
                } else if (!prioritizedItems[a.id] && prioritizedItems[b.id]) {
                return 1;
                } else {
                return a.name.localeCompare(b.name);
                }
            });
            default:
            return tempItems;
        }
        });
    }, [allItems, activeSubPage, sortBy, filterBy, prioritizedItems]);
  

  const togglePrioritize = async (itemId) => {
    console.log(itemId);
    try {
      const itemRef = doc(itemsCollectionRef, itemId);
      const itemSnap = await getDoc(itemRef);
  
      if (!itemSnap.exists()) {
        console.log('No matching document.');
        return null;
      }
  
      const itemData = itemSnap.data();
  
      const updatedItemData = {
        ...itemData,
        prioritized: !itemData.prioritized
      };
  
      await updateDoc(itemRef, updatedItemData);
  
      console.log('Prioritization status updated successfully.');
  
      setPrioritizedItems(prevPrioritizedItems => ({
        ...prevPrioritizedItems,
        [itemId]: updatedItemData.prioritized
      }));
  
      setSortBy(prevSortBy => prevSortBy === 'Priority' ? null : prevSortBy);
    } catch (error) {
      console.error('Error updating prioritization status:', error);
  
      setPrioritizedItems(prevPrioritizedItems => ({
        ...prevPrioritizedItems,
        [itemId]: !prevPrioritizedItems[itemId]
      }));
    }
  };
  
  
  
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = (isOpen) => {
    console.log("Dropdown state before:", dropdownOpen);
    setDropdownOpen(false);
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

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    console.log(selected)
    switch(selected){
        case 'AZ': sortItemsAsc(); break;
        case 'ZA': sortItemsDesc(); break;
        case 'QA': sortItemsByMinQuantity(); break;
        case 'QD': sortItemsByMaxQuantity(); break;
        case 'EA': sortExpAsc(); break;
        case 'ED': sortExpDesc(); break;
        case 'F': sortFavorited(); break;
        default: break;
    }
  }, [selected])

  return (
    <div className="main-container">
       <div className="sidebar">
          {userData ? (
              <ProfileSection userData={userData} onSave={onSave} onDelete={onDelete} onLogout={onLogout}/>
              ) : (
                <div className="profile">
                  <h3 className="profile-name">Loading...</h3>
                </div>
              )}
       </div>
       <div className="p-6 space-y-3 w-full">
            <div className="header w-full p-5 bg-slate-200 rounded-xl">
                <div className='flex items-center justify-between'>
                    <div className='flex gap-3 items-center'>
                        <h1>Sort By:</h1>
                        <select value={selected} className='p-2 rounded-xl' onChange={(e) => setSelected(e.target.value)}>
                            <option value={'AZ'}>A-Z</option>
                            <option value={'ZA'}>Z-A</option>
                            <option value={'QA'}>Quantity Ascending</option>
                            <option value={'QD'}>Quantity Descending</option>
                            <option value={'EA'}>Expiration Ascending</option>
                            <option value={'ED'}>Expiration Descending</option>
                            <option value={'F'}>Favorited</option>
                        </select>
                    </div>
                    <div>
                      <button className="add-button" onClick={onShowUseItem} disabled={selectedItems.length === 0}>USE ITEMS</button>
                      <button className="add-button" onClick={onShowOrderItem} disabled={selectedItems.length === 0}>ORDER ITEMS</button>
                      <button className="add-button" onClick={onShowAddItem}>ADD</button>
                    </div>
                </div>
            </div>
            <div className="filter-buttons ">
                <button onClick={() => setFilterBy('All')} className={filterBy === 'All' ? 'active' : ''}>All</button>
                <button onClick={() => setFilterBy('Perishable')} className={filterBy === 'Perishable' ? 'active' : ''}>Perishable</button>
                <button onClick={() => setFilterBy('Non-Perishable')} className={filterBy === 'Non-Perishable' ? 'active' : ''}>Non-Perishable</button>
            </div>
            <div className="inventory">
            {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                <div key={index} className={`item ${isLowOnStock(item) || alertExpiry(item) ? 'highlight-red' : ''} h-full shadow-2xl drop-shadow-2xl rounded-xl space-y-3`}>
                        <div style={{backgroundImage: `url(${item.imageurl})`}} className="w-full bg-no-repeat bg-cover h-60 bg-center">
                            <div className='item-header px-1 pt-1'>
                                <input
                                    class="item-select-checkbox"
                                    type="checkbox"
                                    onChange={() => onToggleSelectItem(item.index)}
                                    datatest-id='itemSelect'
                                />
                                <button className="item-edit-button" datatest-id="itemEdit" onClick={() => {setItemToEdit(item); onShowEditItem();}}></button>
                                <button
                                    className="prioritize-button"
                                    onClick={() => {
                                    console.log('Button clicked. Item id:', item.id);
                                    togglePrioritize(item.id);
                                    }}
                                >
                                    {prioritizedItems[item.id] ? <StarIcon sx={{ color: yellow[500] }}/> : <StarBorderIcon sx={{ color: grey[50] }}/>}
                                </button>
                            </div>
                        </div>
                        {/*<img src={item.imageurl} alt={item.name || "Default placeholder"}></img>}*/}
                        <div className='space-y-2'>
                            <div className="item-name mx-auto text-center">
                                <span className="text-xl font-bold" data-testid="viewItemName">{item.name}</span>
                            </div>
                            <div className="item-details px-4 pb-4">
                                <div className="item-row space-x-2">
                                    <span className="item-title text-lg font-bold">DESCRIPTION:</span>
                                    <span className="item-value text-lg">{item.description}</span>
                                </div>
                                <div className="item-row space-x-2">
                                    <span className="item-title text-lg font-bold">PERISHABLE:</span>
                                    <span className="item-value text-lg" data-testid="itemValue">{item.status}</span>
                                </div>
                                <div className="item-row space-x-2">
                                    <span className={`item-title ${isLowOnStock(item) ? 'text-red': null} text-lg font-bold`}>QTY:</span>
                                    <span className={`item-value ${isLowOnStock(item) ? 'text-red': null} text-lg`}>{item.quantityCurr}</span>
                                </div>
                                <div className="item-row space-x-2">
                                    <span className={`item-title ${alertExpiry(item) ? 'text-red': null} text-lg font-bold`}>EXP:</span>
                                    <span className={`item-value ${alertExpiry(item) ? 'text-red': null} text-lg`}>{item.expiry}</span>
                                </div>
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