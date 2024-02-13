import { render, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/noauth/Register/Register';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';

// Mocking Firebase functions
jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    addDoc: jest.fn(),
}));


window.alert = jest.fn();

test('user can register successfully', async () => {
    window.alert.mockClear();
    // Mock the createUserWithEmailAndPassword and addDoc functions
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'mockUid' } });
    addDoc.mockResolvedValueOnce();

    const { getByLabelText, getByText, getByTestId } = render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    );

    // Fill the form fields
    fireEvent.change(getByTestId('firstName'), { target: { value: 'John' } });
    fireEvent.change(getByTestId('lastName'), { target: { value: 'Doe' } });
    fireEvent.change(getByTestId('sex'), { target: { value: 'Male' } });
    fireEvent.change(getByTestId('birthday'), { target: { value: '2003-01-23' } });
    fireEvent.change(getByTestId('email'), { target: { value: 'shuannoelco@gmail.com' } });
    fireEvent.change(getByTestId('password'), { target: { value: 'password' } });

    // Click the register button
    fireEvent.click(getByText('Register'));

    // Wait for asynchronous operations to complete
    await waitFor(() => {
        // Assertions
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            // Check if createUserWithEmailAndPassword is called with the correct arguments
            expect.any(Object), // mock auth object
            'shuannoelco@gmail.com',
            'password'
        );

        expect(addDoc).toHaveBeenCalledWith(
            expect.any(Object), // mock firestore object
            expect.objectContaining({
                accountType: 'User',
                birthday: '2003-01-23',
                businessDesc: '',
                businessType: '',
                companyName: '',
                firstName: 'John',
                lastName: 'Doe',
                sex: 'Male',
                uid: 'mockUid',
            })
        );
    });
});
