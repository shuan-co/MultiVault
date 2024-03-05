import { render, fireEvent, waitFor } from '@testing-library/react';
import Register from '../pages/noauth/Register/Register';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

// Mocking Firebase functions
jest.mock('firebase/auth', () => ({
    ...jest.requireActual('firebase/auth'),
    createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    ...jest.requireActual('firebase/firestore'),
    setDoc: jest.fn(),
}));

window.alert = jest.fn();

// Additional test cases using forEach
const testCases = [
    {
        firstName: 'John',
        lastName: 'Doe',
        sex: 'Male',
        birthday: '2003-01-23',
        email: 'shuannoelco@gmail.com',
        password: 'password',
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        sex: 'Female',
        birthday: '1995-08-15',
        email: 'jane.smith@example.com',
        password: 'securePassword123',
    },
    {
        firstName: 'Test',
        lastName: 'User',
        sex: 'Female',
        birthday: '2000-12-31',
        email: 'test.user+special@example.com',
        password: 'p@$$w0rd',
    },
    {
        firstName: 'Symbol',
        lastName: 'User',
        sex: 'Male',
        birthday: '1980-05-20',
        email: 'symbol_user123#!@example.com',
        password: 'strongP@ss',
    },
];

testCases.forEach((testCase, index) => {
    test(`User Account can register successfully - Test Case ${index + 1}`, async () => {
        window.alert.mockClear();
        createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: `mockUid${index}` } });
        setDoc.mockResolvedValueOnce();

        const { getByLabelText, getByText, getByTestId } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(getByTestId('firstName'), { target: { value: testCase.firstName } });
        fireEvent.change(getByTestId('lastName'), { target: { value: testCase.lastName } });
        fireEvent.change(getByTestId('sex'), { target: { value: testCase.sex } });
        fireEvent.change(getByTestId('birthday'), { target: { value: testCase.birthday } });
        fireEvent.change(getByTestId('email'), { target: { value: testCase.email } });
        fireEvent.change(getByTestId('password'), { target: { value: testCase.password } });

        fireEvent.click(getByText('Register'));

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
                expect.any(Object),
                testCase.email,
                testCase.password
            );

            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    firstName: testCase.firstName,
                    lastName: testCase.lastName,
                    sex: testCase.sex,
                    birthday: testCase.birthday,
                    companyName: "",
                    businessType: "",
                    businessDesc: "",
                    accountType: 'User',
                })
            );
        });
    });
});

// Test cases for Business Account Registration
const businessTestCases = [
    {
        firstName: 'Admin1',
        lastName: 'Admin1Last',
        sex: 'Male',
        birthday: '1990-01-15',
        email: 'admin1@example.com',
        password: 'businessPassword1',
        companyName: 'TechCo1',
        businessType: 'Technology',
        businessDesc: 'Tech Company Description 1',
    },
    {
        firstName: 'Admin2',
        lastName: 'Admin2Last',
        sex: 'Female',
        birthday: '1985-05-20',
        email: 'admin2@example.com',
        password: 'businessPassword2',
        companyName: 'ConsultingCo',
        businessType: 'Consulting',
        businessDesc: 'Consulting Company Description',
    },
    {
        firstName: 'Admin3',
        lastName: 'Admin3Last',
        sex: 'Male',
        birthday: '1988-11-10',
        email: 'admin3@example.com',
        password: 'businessPassword3',
        companyName: 'FoodCo',
        businessType: 'Food',
        businessDesc: 'Food Company Description',
    },
    {
        firstName: 'Admin4',
        lastName: 'Admin4Last',
        sex: 'Female',
        birthday: '1992-08-25',
        email: 'admin4@example.com',
        password: 'businessPassword4',
        companyName: 'FashionCo',
        businessType: 'Fashion',
        businessDesc: 'Fashion Company Description',
    },
];

businessTestCases.forEach((testCase, index) => {
    test(`Business Account can register successfully - Test Case ${index + 1}`, async () => {
        window.alert.mockClear();
        createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: `mockUid${index}` } });
        setDoc.mockResolvedValueOnce();

        const { getByLabelText, getByText, getByTestId } = render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Set account type to Business
        fireEvent.click(getByText('Business'));

        // Fill the form fields for Business Account
        fireEvent.change(getByTestId('firstName'), { target: { value: testCase.firstName } });
        fireEvent.change(getByTestId('lastName'), { target: { value: testCase.lastName } });
        fireEvent.change(getByTestId('sex'), { target: { value: testCase.sex } });
        fireEvent.change(getByTestId('birthday'), { target: { value: testCase.birthday } });
        fireEvent.change(getByTestId('email'), { target: { value: testCase.email } });
        fireEvent.change(getByTestId('password'), { target: { value: testCase.password } });
        fireEvent.change(getByTestId('companyName'), { target: { value: testCase.companyName } });
        fireEvent.change(getByTestId('businessType'), { target: { value: testCase.businessType } });
        fireEvent.change(getByTestId('businessDesc'), { target: { value: testCase.businessDesc } });

        // Click the register button
        fireEvent.click(getByText('Register'));

        // Wait for asynchronous operations to complete
        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
                expect.any(Object),
                testCase.email,
                testCase.password
            );

            expect(setDoc).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    firstName: testCase.firstName,
                    lastName: testCase.lastName,
                    sex: testCase.sex,
                    birthday: testCase.birthday,
                    companyName: testCase.companyName,
                    businessType: testCase.businessType,
                    businessDesc: testCase.businessDesc,
                    accountType: 'Business',
                })
            );
        });
    });
});
