import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const OrderItem = ({ onOrder, show, onHide, selectedItems }) => {
  const [orderAmount, setOrderAmount] = useState({});

  const handleOrderAmountChange = (itemIndex, amount) => {
    const numericValue = Number(amount);

    if( isNaN(numericValue) || numericValue < 0 ) {
      alert('Ordered amount must not be negative');
      return;
    }

    setOrderAmount((prevAmounts) => ({
      ...prevAmounts,
      [itemIndex]: amount,
    }));
  };

  const handleConfirm = () => {
    const orderedItems = selectedItems.map((item) => ({
      index: item.index,
      name: item.name,
      quantityOrdered: parseInt(orderAmount[item.index]) || 0,
    }));

    onOrder(orderedItems);
    setOrderAmount({});
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Items</Modal.Title>
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
                <th>Order Amount</th>
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
                      value={orderAmount[item.index] || ''}
                      onChange={(e) =>
                        handleOrderAmountChange(item.index, e.target.value)
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

export default OrderItem;