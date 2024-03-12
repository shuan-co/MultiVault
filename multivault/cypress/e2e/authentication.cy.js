// cypress/integration/register_spec.js

describe('Registration Flow', () => {
    it('Registers a User Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');
        cy.contains('Create an account').click();
        
        // Select the User account type
        cy.contains('User').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=firstName]').type('John');
        cy.get('[data-testid=lastName]').type('Doe');
        cy.get('[data-testid=sex]').select('Male');
        cy.get('[data-testid=birthday]').type('2003-01-23');
        cy.get('[data-testid=email]').type('john.doe@example.com');
        cy.get('[data-testid=password]').type('userPassword123');

        // Click the Register button
        cy.contains('Register').click();

        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/inventory');

        // Intercept the alert
        cy.on('window:alert', (message) => {
            // Add assertions for the alert content
            expect(message).to.equal('Registration Successful');
        });
        cy.wait(5000);
    });

    it('Logouts a User Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/private');
        cy.contains('Logout').click();
        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/');
    });

    it('Attempts to User Register with the Same Email (Error Case)', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Select the Business account type
        cy.contains('Create an account').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=firstName]').type('John');
        cy.get('[data-testid=lastName]').type('Doe');
        cy.get('[data-testid=sex]').select('Male');
        cy.get('[data-testid=birthday]').type('2003-01-23');
        cy.get('[data-testid=email]').type('john.doe@example.com');
        cy.get('[data-testid=password]').type('userPassword123');

        // Intercept the alert
        cy.on('window:alert', (message) => {
            // Add assertions for the alert content
            expect(message).to.equal('Registration Error: Authentication');
        });

        // Click the Register button
        cy.contains('Register').click();
    });

    it('Registers a Business Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/'); 

        // Select the Business account type
        cy.contains('Create an account').click();
        cy.contains('Business').click();

        // Fill the registration form for the Business account
        cy.get('[data-testid=firstName]').type('Admin1');
        cy.get('[data-testid=lastName]').type('Admin1Last');
        cy.get('[data-testid=sex]').select('Male');
        cy.get('[data-testid=birthday]').type('1990-01-15');
        cy.get('[data-testid=email]').type('admin1@example.com');
        cy.get('[data-testid=password]').type('businessPassword1');
        cy.get('[data-testid=companyName]').type('TechCo1');
        cy.get('[data-testid=businessType]').type('Technology');
        cy.get('[data-testid=businessDesc]').type('Tech Company Description 1');

        // Click the Register button
        cy.contains('Register').click();
        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/inventory'); 

        // Intercept the alert
        cy.on('window:alert', (message) => {
            // Add assertions for the alert content
            expect(message).to.equal('Registration Successful');
        });

        cy.wait(5000);
    });

    it('Logouts a Business Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/private');
        cy.contains('Logout').click();
        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/');
    });


    it('Attempts to Register with the Same Business Email (Error Case)', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Select the Business account type
        cy.contains('Create an account').click();
        cy.contains('Business').click();

        // Fill the registration form for the Business account
        cy.get('[data-testid=firstName]').type('Admin1');
        cy.get('[data-testid=lastName]').type('Admin1Last');
        cy.get('[data-testid=sex]').select('Male');
        cy.get('[data-testid=birthday]').type('1990-01-15');
        cy.get('[data-testid=email]').type('admin1@example.com');
        cy.get('[data-testid=password]').type('businessPassword1');
        cy.get('[data-testid=companyName]').type('TechCo1');
        cy.get('[data-testid=businessType]').type('Technology');
        cy.get('[data-testid=businessDesc]').type('Tech Company Description 1');

        // Intercept the alert
        cy.on('window:alert', (message) => {
            // Add assertions for the alert content
            expect(message).to.equal('Registration Error: Authentication');
        });

        // Click the Register button
        cy.contains('Register').click();
    });
});


describe('Login Flow', () => {
    it('Login an existing User Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('john.doe@example.com');
        cy.get('[data-testid=password]').type('userPassword123');

        // Click the Register button
        cy.contains('Sign in').click();

        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/inventory');
    });

    it('Logouts a User Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/private');
        cy.contains('Logout').click();
        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/');
    });

    it('Login an invalid User Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('john.doe@true.com');
        cy.get('[data-testid=password]').type('userPassword123');

        // Intercept the alert
        cy.on('window:alert', (message) => {
            // Add assertions for the alert content
            expect(message).to.equal('Invalid Credentials');
        });

        // Click the Register button
        cy.contains('Sign in').click();
    });


    it('Login a Business Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        cy.contains('Business').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('admin1@example.com');
        cy.get('[data-testid=password]').type('businessPassword1');

        // Click the Register button
        cy.contains('Sign in').click();

        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/inventory');
    });

    it('Logouts a Business Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/private');
        cy.contains('Logout').click();
        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/');
    });


    it('Login an invalid Business Account', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('admin1@true.com');
        cy.get('[data-testid=password]').type('businessPassword1');

        // Intercept the alert
        cy.on('window:alert', (message) => {
            // Add assertions for the alert content
            expect(message).to.equal('Invalid Credentials');
        });

        // Click the Register button
        cy.contains('Sign in').click();
    });

});


describe('Check if Registered Information reflected properly in the Database', () => {
    it('Check if User Account Information is Consistent', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('john.doe@example.com');
        cy.get('[data-testid=password]').type('userPassword123');

        // Click the Register button
        cy.contains('Sign in').click();
        cy.wait(5000);
        cy.visit('https://multivault-e2e-test.netlify.app/private');


        // Check if First Name is visible
        cy.contains('First Name: John').should('be.visible');

        // Check if Last Name is visible
        cy.contains('Last Name: Doe').should('be.visible');

        // Check if Sex is visible
        cy.contains('Sex: Male').should('be.visible');

        // Check if Birthday is visible
        cy.contains('Birthday: 2003-01-23').should('be.visible');

        // Check if Company Name is visible
        cy.contains('Company Name:').should('be.visible');

        // Check if Business Type is visible
        cy.contains('Business Type:').should('be.visible');

        // Check if Business Description is visible
        cy.contains('Business Description:').should('be.visible');

        // Check if Account Type is visible
        cy.contains('Account Type: User').should('be.visible');

        cy.contains('Delete Account').click();
        cy.wait(5000);
    });

    it('Check if Business Account Information is Consistent', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/');

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('admin1@example.com');
        cy.get('[data-testid=password]').type('businessPassword1');

        // Click the Register button
        cy.contains('Sign in').click();
        cy.wait(5000);
        cy.visit('https://multivault-e2e-test.netlify.app/private');
        // Check if First Name is visible
        cy.contains('First Name: Admin1').should('be.visible');

        // Check if Last Name is visible
        cy.contains('Last Name: Admin1Last').should('be.visible');

        // Check if Sex is visible
        cy.contains('Sex: Male').should('be.visible');

        // Check if Birthday is visible
        cy.contains('Birthday: 1990-01-15').should('be.visible');

        // Check if Company Name is visible
        cy.contains('Company Name: TechCo1').should('be.visible');

        // Check if Business Type is visible
        cy.contains('Business Type: Technology').should('be.visible');

        // Check if Business Description is visible
        cy.contains('Business Description: Tech Company Description 1').should('be.visible');

        // Check if Account Type is visible
        cy.contains('Account Type: Business').should('be.visible');

        cy.contains('Delete Account').click();
        cy.wait(5000);
    });
});
