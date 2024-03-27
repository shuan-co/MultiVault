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
      <Modal.Header closeButton className='pt-5 ps-5 mb-3'>
        <Modal.Title>Order Items</Modal.Title>
      </Modal.Header>
      <Modal.Body  className='px-5'>
        {selectedItems.length === 0 ? (
          <p>No items selected.</p>
        ) : (
            <div className="space-y-3">
                <div className='grid grid-cols-4'>
                    <h3 className='font-bold'>Item</h3>
                    <h3 className='font-bold'>Remaining Quantity</h3>
                    <h3 className='font-bold'>Expiration Date</h3>
                    <h3 className='font-bold'>Order Amount</h3>
                </div>
                <div>
              {selectedItems.map((item) => (
                 <div key={item.index} className='grid grid-cols-4'>
                  <h3>{item.name}</h3>
                    <h3>{item.quantityCurr}</h3>
                    <h3>{item.expiry}</h3>
                    <h3>
                    <input
                      type="number"
                      min="0"
                      value={orderAmount[item.index] || ''}
                      className='w-full bg-slate-200 rounded-md'
                      onChange={(e) =>
                        handleOrderAmountChange(item.index, e.target.value)
                      }
                    />
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className='mt-5 pb-5 pe-5 flex justify-end space-x-3'>
      <button className="btn text-red-500" onClick={onHide}>
          Cancel
        </button>
        <button className="btn bg-green-600 hover:bg-green-500 p-3 rounded-lg text-white" onClick={handleConfirm}>
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderItem;