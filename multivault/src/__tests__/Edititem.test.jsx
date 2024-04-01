import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import EditItem from '../pages/auth/Inventory/EditItem';

jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    signInWithEmailAndPassword: jest.fn(),
}));

window.alert = jest.fn();

describe('EditItem component', () => {
  test('Edit an item when submit button is clicked', async () => {
    // Mocking necessary functions and props
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onHide = jest.fn();
    const show = true;
    const item = {
      name: 'Test Item',
      description: 'Test Description',
      quantityCurr: '10',
      status: 'Perishable',
      expiry: '2024-12-31',
      index: 123456,
    };

    const { getByText, getByTestId } = render(
      <EditItem
        onEdit={onEdit}
        onDelete={onDelete}
        onHide={onHide}
        show={show}
        item={item}
      />
    );

    fireEvent.change(getByTestId('editItemName'), { target: { value: 'Updated Item' } });

    fireEvent.change(getByTestId('editItemDescription'), { target: { value: 'Updated Description' } });

    fireEvent.change(getByTestId('editItemQuantity'), { target: { value: '20' } });

    fireEvent.change(getByTestId('editItemStatus'), { target: { value: 'Non-Perishable' } });

    fireEvent.change(getByTestId('editItemDate'), { target: { value: '2025-01-01' } });

    fireEvent.click(getByText('Submit'));

    await waitFor(() => {
      expect(onEdit).toHaveBeenCalled();

      expect(onHide).toHaveBeenCalled();

      expect(onDelete).not.toHaveBeenCalled();
    });
  });
});
