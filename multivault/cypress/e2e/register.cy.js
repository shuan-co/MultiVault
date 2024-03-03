// cypress/integration/register_spec.js

describe('Registration Flow', () => {
    it('Registers a User Account', () => {
        cy.visit('http://localhost:3000/');
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

        cy.url().should('include', 'http://localhost:3000/private');
    });

    it('Logouts a User Account', () => {
        cy.visit('http://localhost:3000/private');
        cy.contains('Logout Button').click();
        cy.url().should('include', 'http://localhost:3000/');
    });

    it('Registers a Business Account', () => {
        cy.visit('http://localhost:3000/'); // Adjust the URL to match your application's starting point

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
        cy.url().should('include', 'http://localhost:3000/private'); 
    });

    it('Logouts a Business Account', () => {
        cy.visit('http://localhost:3000/private');
        cy.contains('Logout Button').click();
        cy.url().should('include', 'http://localhost:3000/');
    });


    it('Attempts to Register with the Same Email (Error Case)', () => {
        cy.visit('http://localhost:3000/');

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
