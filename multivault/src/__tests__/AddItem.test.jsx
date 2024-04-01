import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import AddItem from '../pages/auth/Inventory/AddItem';

describe('AddItem component', () => {
  test('adds a new item when form is submitted', async () => {
    const onAdd = jest.fn();
    const onHide = jest.fn();
    const show = true;

    const { getByTestId, getByText, getByPlaceholderText } = render(
      <AddItem
        onAdd={onAdd}
        onHide={onHide}
        show={show}
      />
    );

    fireEvent.change(getByPlaceholderText('Enter item name'), { target: { value: 'Test Item' } });
    fireEvent.change(getByPlaceholderText('Enter item description'), { target: { value: 'Test Description' } });
    fireEvent.change(getByPlaceholderText('Enter item quantity'), { target: { value: '10' } });
    fireEvent.change(getByTestId('itemStatus'), { target: { value: 'Perishable' } });
    fireEvent.change(getByTestId('itemDate'), { target: { value: '2024-12-31' } });

    fireEvent.click(getByText('Submit'));

    // Wait for the form submission to be processed
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith({
        name: 'Test Item',
        description: 'Test Description',
        status: 'Perishable',
        quantityOrig: '10',
        quantityCurr: '10',
        expiry: '2024-12-31',
        index: expect.any(Number),
        prioritized: false,
      });

      expect(onHide).toHaveBeenCalled();
    });

  });
});
