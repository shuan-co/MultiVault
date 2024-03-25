describe('Iventory Management Items', () => {
    Cypress.config('defaultCommandTimeout', 10000);

    it('Item Usage / Decrement', () => {
        cy.viewport(1920, 1080);
        cy.visit('localhost:3000/login');

        // Select the Business account type
        cy.contains('Create an account').click();
        cy.contains('Business').click();

        // Fill the registration form for the Business account
        cy.get('[data-testid=firstName]').type('Admin1');
        cy.get('[data-testid=lastName]').type('Admin1Last');
        cy.get('[data-testid=sex]').select('Male');
        cy.get('[data-testid=birthday]').type('1990-01-15');
        cy.get('[data-testid=email]').type('73d7c005-0208-4919-910c-cc69156fd62a@mailslurp.net');
        cy.get('[data-testid=password]').type('NVANZIeMINetInTuSHig');
        cy.get('[data-testid=companyName]').type('TechCo1');
        cy.get('[data-testid=businessType]').type('Technology');
        cy.get('[data-testid=businessDesc]').type('Tech Company Description 1');

        // Click the Register button
        cy.contains('Register').click();

        cy.wait(1000);

        // ADD MULTIPLE ITEMS!

        // [Expires Soon] 

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('FishBall');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('100');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        cy.get('[data-testid=itemDate]').type('2099-04-25');

        // Submit Item
        cy.contains('Submit').click();

        // [Doesn't Expire Soon] 

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('Chicken');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('115');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        cy.get('[data-testid=itemDate]').type('2099-04-25');

        // Submit Item
        cy.contains('Submit').click();

        cy.wait(1000);

        // Click Edit Button
        cy.get('[datatest-id=itemSelect]').eq(1).click();

        cy.contains("USE ITEMS").click();
        cy.get('[type="number"]').type('50');
        cy.contains("Confirm").click();

        cy.wait(2000);

        // 100 - 50 = 50
        cy.contains('50').should('be.visible')


        cy.get('[datatest-id=itemSelect]').eq(0).click();

        cy.contains("USE ITEMS").click();
        cy.get('[type="number"]').eq(0).type('30');
        cy.get('[type="number"]').eq(1).type('30');
        cy.contains("Confirm").click();

        cy.wait(2000);

        // 50 - 30 = 20
        cy.contains('20').should('be.visible')

        // 115 - 30 = 85
        cy.contains('85').should('be.visible')
    });


    it('Item Order / Increment', () => {
        cy.viewport(1920, 1080);
        cy.visit('localhost:3000/login');

        cy.wait(1000);

        // Click Edit Button
        cy.get('[datatest-id=itemSelect]').eq(1).click();

        cy.contains("ORDER ITEMS").click();
        cy.get('[type="number"]').type('50');
        cy.contains("Confirm").click();

        cy.wait(2000);

        // 20 + 50 = 70
        cy.contains('70').should('be.visible')


        cy.get('[datatest-id=itemSelect]').eq(0).click();

        cy.contains("ORDER ITEMS").click();
        cy.get('[type="number"]').eq(0).type('30');
        cy.get('[type="number"]').eq(1).type('30');
        cy.contains("Confirm").click();

        cy.wait(2000);

        // 70 + 30 = 100
        cy.contains('100').should('be.visible')

        // 85 + 30 = 115
        cy.contains('115').should('be.visible')


    });

    it("Checks if Zero Quantity Warns User", () => {
        cy.viewport(1920, 1080);
        cy.visit("localhost:3000/inventory");
        cy.wait(1000);

        cy.get('[datatest-id=itemSelect]').eq(1).click();

        cy.contains("USE ITEMS").click();

        cy.get('[type="number"]').type('100');
        cy.contains("Confirm").click();

        cy.wait(2000);


        cy.get('.inventory > div').then(($children) => {
            // Assert the first child does not have class "highlight-red"
            cy.wrap($children.eq(0)).should('not.have.class', 'highlight-red');
            // Assert the second child has class "highlight-red"
            cy.wrap($children.eq(1)).should('have.class', 'highlight-red');
        });

    })

    it('Delete Test Account', () => {
        cy.viewport(1920, 1080);
        cy.visit("localhost:3000/private")
        cy.wait(1000);
        cy.contains('Logout').click();
        cy.wait(1000);

        cy.visit('localhost:3000/login');

        cy.contains('Business').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('73d7c005-0208-4919-910c-cc69156fd62a@mailslurp.net');
        cy.get('[data-testid=password]').type('NVANZIeMINetInTuSHig');

        // Click the Register button
        cy.contains('Sign in').click();

        cy.url().should('include', 'localhost:3000/inventory');

        cy.visit("localhost:3000/private");
        cy.contains('Delete Account').click();
        cy.wait(1000);

    });
});