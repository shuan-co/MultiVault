import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const UseItem = ({ onUse, show, onHide, selectedItems }) => {
  const [usageAmounts, setUsageAmounts] = useState({});

  const handleUsageAmountChange = (itemIndex, amount, max) => {
    const numericValue = Number(amount);
    if( isNaN(numericValue) || numericValue < 0 ) {
      alert('Usage amount must not be negative');
      return;
    } else if( numericValue > max ) {
      alert('Usage amount must not be greater than current amount');
      return;
    }

    setUsageAmounts((prevAmounts) => ({
      ...prevAmounts,
      [itemIndex]: amount,
    }));
  };

  const handleConfirm = () => {
    const usedItems = selectedItems.map((item) => ({
      index: item.index,
      name: item.name,
      quantityUsed: parseInt(usageAmounts[item.index]) || 0,
    }));

    onUse(usedItems);
    setUsageAmounts({});
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Use Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItems.length === 0 ? (
          <p>No items selected.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Remaining Quantity</th>
                <th>Expiration Date</th>
                <th>Usage Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.index}>
                  <td>{item.name}</td>
                  <td>{item.quantityCurr}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max={item.quantityCurr}
                      value={usageAmounts[item.index] || ''}
                      onChange={(e) =>
                        handleUsageAmountChange(item.index, e.target.value, item.quantityCurr)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UseItem;