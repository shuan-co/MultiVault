import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Inventory from '../pages/auth/Inventory/Inventory';
import AddItem from '../pages/auth/Inventory/AddItem';

describe('Inventory component', () => {
  const items = []; 

  const onShowAddItem = jest.fn();
  const onShowEditItem = jest.fn();
  const sortItemsByMinQuantity = jest.fn();
  const sortItemsByMaxQuantity = jest.fn();
  const sortItemsAsc = jest.fn();
  const sortItemsDesc = jest.fn();
  const sortExpAsc = jest.fn();
  const sortExpDesc = jest.fn();
  const setItemToEdit = jest.fn();
  const onToggleSelectItem = jest.fn();
  const selectedItems = [];

  test('renders Inventory component', async () => {
    const { getByText } = render( // Destructuring getByText function from render
      <Inventory
        items={items}
        onShowAddItem={onShowAddItem}
        onShowEditItem={onShowEditItem}
        activeSubPage="all"
        sortItemsByMinQuantity={sortItemsByMinQuantity}
        sortItemsByMaxQuantity={sortItemsByMaxQuantity}
        sortItemsAsc={sortItemsAsc}
        sortItemsDesc={sortItemsDesc}
        sortExpAsc={sortExpAsc}
        sortExpDesc={sortExpDesc}
        setItemToEdit={setItemToEdit}
        onToggleSelectItem={onToggleSelectItem}
        selectedItems={selectedItems}
      />
    );

    const addButton = getByText('ADD');
    fireEvent.click(addButton);

    // Verify that the function to show the add item modal is called
    expect(onShowAddItem).toHaveBeenCalled();

  });

});
