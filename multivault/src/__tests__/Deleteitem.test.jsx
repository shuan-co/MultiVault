import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import EditItem from '../pages/auth/Inventory/EditItem';

describe('EditItem component', () => {
  test('deletes an item when delete button is clicked', async () => {
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
      imageurl: 'https://example.com/image.jpg',
    };

    const { getByText } = render(
      <EditItem
        onEdit={onEdit}
        onDelete={onDelete}
        onHide={onHide}
        show={show}
        item={item}
      />
    );

    fireEvent.click(getByText('Delete'));

    // Wait for the onDelete and onHide functions to be called
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(item.index);
      expect(onHide).toHaveBeenCalled();
      expect(onEdit).not.toHaveBeenCalled();
    });

  });
});
