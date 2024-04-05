describe('Iventory Item Management', () => {
    Cypress.config('defaultCommandTimeout', 10000);
    it('Add New Item', () => {
        cy.viewport(1920, 1080) 
        cy.visit('https://multivault-e2e-test.netlify.app/login');
        
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

        cy.wait(1000);

        // ADD MULTIPLE ITEMS!

        // [Perishable] 

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('FishBall');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('30');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        cy.get('[data-testid=itemDate]').type('2024-04-25');

        // Submit Item
        cy.contains('Submit').click();

        // Intercept the alert
        let alertCount = 0;

        cy.on('window:alert', (message) => {
            alertCount++;
            if (alertCount >= 2) {
                // Add assertions for the alert content
                expect(message).to.equal('Item Added Successfully');
            }
        });

        // [Non-Perishable]

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('Squid Ball');
        cy.get('[data-testid=itemDescription]').type('The starfish is a fish');
        cy.get('[data-testid=itemQuantity]').type('50');
        cy.get('[data-testid=itemStatus]').select('Non-Perishable');
        cy.get('[data-testid=itemDate]').type('2024-05-01');

        // Submit Item  
        cy.contains('Submit').click();
    });

    it('Check Item Information Consistency', () => {
        cy.viewport(1920, 1080) 
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Check Previosly Added Items Information after Website Refresh

        // [First Item]

        cy.contains('FishBall').should('be.visible');
        cy.contains('Lorem ipsum dolor sit amet').should('be.visible');
        cy.contains('Perishable').should('be.visible');
        cy.get('[data-testid="itemValue"]').first()
            .should('have.text', 'Perishable'); 

        cy.contains('30').should('be.visible');
        cy.contains('2024-04-25').should('be.visible');

        // [Second Item]

        cy.contains('Squid Ball').should('be.visible');
        cy.contains('The starfish is a fish').should('be.visible');
        cy.contains('Non-Perishable').should('be.visible');
        cy.get('[data-testid="itemValue"]').eq(1)
            .should('have.text', 'Non-Perishable'); 
        cy.contains('50').should('be.visible');
        cy.contains('2024-05-01').should('be.visible');
    });

    it('Multi Select / Deselect Items Feature', () => {
        cy.viewport(1920, 1080) 
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Select Multiple Items
        cy.get('[datatest-id=itemSelect]').eq(0).click();

        cy.get('[datatest-id=itemSelect]').eq(1).click();

        cy.get('[datatest-id=itemSelect]').should('be.checked')

        // De Select Multiple Items
        cy.get('[datatest-id=itemSelect]').eq(0).click();

        cy.get('[datatest-id=itemSelect]').eq(1).click();

        cy.get('[datatest-id=itemSelect]').should('not.be.checked')
    });

    Cypress.config('defaultCommandTimeout', 20000);
    it('Multi Favorite / UnFavorite Items Feature', () => {
        cy.viewport(1920, 1080)
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Favorite Multiple Items
        // Select all elements with data-testid="StarBorderIcon"
        cy.get('[data-testid=StarBorderIcon]').each(($el) => {
            // Perform click action on each element
            cy.wrap($el).click();
        });
        cy.wait(3000);

        // Refresh Page to Double Check if Database had saved the information
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Check Changes
        cy.get('[data-testid=StarIcon]').should('exist');

        // UnFavorite Multiple Items
        // Select all elements with data-testid="StarBorderIcon"
        cy.get('[data-testid=StarIcon]').each(($el) => {
            // Perform click action on each element
            cy.wrap($el).click();
        });
        cy.wait(3000);

        // Refresh Page to Double Check if Database had saved the information
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Check Changes
        cy.get('[data-testid=StarBorderIcon]').should('exist');
    });

    Cypress.config('defaultCommandTimeout', 20000);
    it('Edit Selected Item', () => {
        cy.viewport(1920, 1080)
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Click Edit Button
        cy.get('[datatest-id=itemEdit]').eq(0).click();
        cy.wait(1000);

        // Edit Form Values
        cy.get('[data-testid=editItemName]').clear().type('Chicken Ball');
        cy.get('[data-testid=editItemDescription]').clear().type('The chicken is a chicken');
        cy.get('[data-testid=editItemQuantity]').clear().type('20');
        cy.get('[data-testid=editItemStatus]').select('Perishable');
        cy.get('[data-testid=editItemDate]').clear().type('2025-02-03');

        // Submit the Edit Form
        cy.contains('Submit').click();
        cy.wait(5000);

        // Refresh Page to Double Check if Database had saved the information
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Check the Changes
        cy.contains('Chicken Ball').should('be.visible');
        cy.contains('The chicken is a chicken').should('be.visible');
        cy.get('[data-testid="itemValue"]').first()
            .should('have.text', 'Perishable'); 
        cy.contains('20').should('be.visible');
        cy.contains('2025-02-03').should('be.visible');
    });

    Cypress.config('defaultCommandTimeout', 20000);
    it('Filter By Category, Perishable vs Non-Perishable vs All', () => {
        cy.viewport(1920, 1080)
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        // Filter by Perishable
        cy.contains('Perishable').click();
        cy.wait(1000);

        // Check for existance of Non Perishable Items
        cy.contains('body', 'Squid Ball').should('not.exist');
        cy.contains('Chicken Ball').should('be.visible');

        // Filter by Non-Perishable
        cy.contains('Non-Perishable').click();
        cy.wait(1000);

        // Check for existance of Perishable Items
        cy.contains('Squid Ball').should('be.visible');
        cy.contains('body', 'Chicken Ball').should('not.exist');

        // Filter by All
        cy.contains('All').click();
        cy.wait(1000);

        // Check for existance of All Items
        cy.contains('Squid Ball').should('be.visible');
        cy.contains('Chicken Ball').should('be.visible');

    });


    
    it('Delete Test Account', () => {
        cy.visit("https://multivault-e2e-test.netlify.app/private")
        cy.wait(1000);
        cy.contains('Logout').click();
        cy.wait(1000);

        cy.visit('https://multivault-e2e-test.netlify.app/login');

        cy.contains('Business').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('admin1@example.com');
        cy.get('[data-testid=password]').type('businessPassword1');

        // Click the Register button
        cy.contains('Sign in').click();

        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/inventory');

        cy.visit("https://multivault-e2e-test.netlify.app/private");
        cy.contains('Delete Account').click();
        cy.wait(5000);

    });


});

describe("Iventory Sorting Feature", () => {
    it("Create Test Account", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/login');
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
        cy.wait(5000);
    });

    it("Create Test Items", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');


        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('Water');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('300');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        cy.get('[data-testid=itemDate]').type('2024-03-25');

        // Submit Item
        cy.contains('Submit').click();

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('Book Shelf');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('150');
        cy.get('[data-testid=itemStatus]').select('Non-Perishable');
        cy.get('[data-testid=itemDate]').type('2024-03-16');

        // Submit Item
        cy.contains('Submit').click();

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('Apples');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('200');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        cy.get('[data-testid=itemDate]').type('2024-03-13');

        // Submit Item
        cy.contains('Submit').click();
    });

    it("Sort Items by Name: Z-A", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(2000);
        cy.get('select.p-2.rounded-xl').select('ZA');

        cy.get('[data-testid=viewItemName]').eq(0).should('have.text', 'Water');
        cy.get('[data-testid=viewItemName]').eq(1).should('have.text', 'Book Shelf');
        cy.get('[data-testid=viewItemName]').eq(2).should('have.text', 'Apples');
    });

    it("Sort Items by Name: A-Z", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(2000);
        cy.get('select.p-2.rounded-xl').select('AZ');

        cy.get('[data-testid=viewItemName]').eq(2).should('have.text', 'Water');
        cy.get('[data-testid=viewItemName]').eq(1).should('have.text', 'Book Shelf');
        cy.get('[data-testid=viewItemName]').eq(0).should('have.text', 'Apples');
    });

    it("Sort Items by Quantity: Ascending", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(2000);
        cy.get('select.p-2.rounded-xl').select('QA');
        cy.wait(2000);

        cy.get('[class="item-value null text-lg"]').eq(0).should('have.text', 150);
        cy.get('[class="item-value null text-lg"]').eq(1).should('have.text', 200);
        cy.get('[class="item-value null text-lg"]').eq(2).should('have.text', 300);
    });

    it("Sort Items by Quantity: Descending", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(2000);
        cy.get('select.p-2.rounded-xl').select('QD');
        cy.wait(2000);

        cy.get('[class="item-value null text-lg"]').eq(2).should('have.text', 150);
        cy.get('[class="item-value null text-lg"]').eq(1).should('have.text', 200);
        cy.get('[class="item-value null text-lg"]').eq(0).should('have.text', 300);
    });

    it("Sort Items by Expiration: Ascending", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(2000);
        cy.get('select.p-2.rounded-xl').select('EA');
        cy.wait(2000);

        cy.get('[class="item-value text-red text-lg"]').eq(0).should('have.text', "2024-03-13");
        cy.get('[class="item-value text-red text-lg"]').eq(1).should('have.text', "2024-03-16");
        cy.get('[class="item-value text-red text-lg"]').eq(2).should('have.text', "2024-03-25");
    });

    it("Sort Items by Expiration: Descending", () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(2000);
        cy.get('select.p-2.rounded-xl').select('ED');
        cy.wait(2000);

        cy.get('[class="item-value text-red text-lg"]').eq(2).should('have.text', "2024-03-13");
        cy.get('[class="item-value text-red text-lg"]').eq(1).should('have.text', "2024-03-16");
        cy.get('[class="item-value text-red text-lg"]').eq(0).should('have.text', "2024-03-25");
    });

    it('Check if User Account Information is Consistent', () => {
        cy.visit('https://multivault-e2e-test.netlify.app/private');
        cy.wait(2000);

        cy.contains('Delete Account').click();
        cy.wait(5000);
    });
});