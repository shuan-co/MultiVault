import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/noauth/Login/Login';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

import { signInWithEmailAndPassword } from 'firebase/auth';


// Mocking Firebase functions
jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    signInWithEmailAndPassword: jest.fn(),
}));

window.alert = jest.fn();

// Additional test cases using forEach
const testCases = [
    {
        email: 'shuannoelco@gmail.com',
        password: 'password',
    },
    {
        email: 'jane.smith@example.com',
        password: 'securePassword123',
    },
    {
        email: 'test.user+special@example.com',
        password: 'p@$$w0rd',
    },
    {
        email: 'symbol_user123#!@example.com',
        password: 'strongP@ss',
    },
];

testCases.forEach((testCase, index) => {
    test(`User Account can login successfully - Test Case ${index + 1}`, async () => {
        window.alert.mockClear();
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: `mockUid${index}` } });

        const { getByLabelText, getByText, getByTestId } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(getByTestId('email'), { target: { value: testCase.email } });
        fireEvent.change(getByTestId('password'), { target: { value: testCase.password } });

        fireEvent.click(getByText('Sign in'));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                expect.any(Object),
                testCase.email,
                testCase.password
            );
        });
    });
});


// Test cases for Business Account Registration
const businessTestCases = [
    {
        email: 'admin1@example.com',
        password: 'businessPassword1',
    },
    {
        email: 'admin2@example.com',
        password: 'businessPassword2',
    },
    {
        email: 'admin3@example.com',
        password: 'businessPassword3',
    },
    {
        email: 'admin4@example.com',
        password: 'businessPassword4',
    },
];

businessTestCases.forEach((testCase, index) => {
    test(`Business Account can login successfully - Test Case ${index + 1}`, async () => {
        window.alert.mockClear();
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: `mockUid${index}` } });

        const { getByLabelText, getByText, getByTestId } = render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Set account type to Business
        fireEvent.click(getByText('Business'));

        // Fill the form fields for Business Account
        fireEvent.change(getByTestId('email'), { target: { value: testCase.email } });
        fireEvent.change(getByTestId('password'), { target: { value: testCase.password } });

        // Click the register button
        fireEvent.click(getByText('Sign in'));

        // Wait for asynchronous operations to complete
        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                expect.any(Object),
                testCase.email,
                testCase.password
            );
        });
    });
});