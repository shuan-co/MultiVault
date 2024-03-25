describe('Iventory Item Management', () => {
    Cypress.config('defaultCommandTimeout', 10000);
    it('Add New Item', () => {
        cy.viewport(1920, 1080) 
        cy.visit('localhost:3000/login');
        
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
        cy.visit('localhost:3000/inventory');
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
        cy.visit('localhost:3000/inventory');
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
        cy.visit('localhost:3000/inventory');
        cy.wait(1000);

        // Favorite Multiple Items
        // Select all elements with data-testid="StarBorderIcon"
        cy.get('[data-testid=StarBorderIcon]').each(($el) => {
            // Perform click action on each element
            cy.wrap($el).click();
        });
        cy.wait(3000);

        // Refresh Page to Double Check if Database had saved the information
        cy.visit('localhost:3000/inventory');
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
        cy.visit('localhost:3000/inventory');
        cy.wait(1000);

        // Check Changes
        cy.get('[data-testid=StarBorderIcon]').should('exist');
    });

    Cypress.config('defaultCommandTimeout', 20000);
    it('Edit Selected Item', () => {
        cy.viewport(1920, 1080)
        cy.visit('localhost:3000/inventory');
        cy.wait(1000);

        // Click Edit Button
        cy.get('[datatest-id=itemEdit]').eq(0).click();
        cy.wait(1000);

        // Edit Form Values
        cy.get('[datatest-id=editItemName]').clear().type('Chicken Ball');
        cy.get('[datatest-id=editItemDescription]').clear().type('The chicken is a chicken');
        cy.get('[datatest-id=editItemQuantity]').clear().type('20');
        cy.get('[datatest-id=editItemStatus]').select('Perishable');
        cy.get('[datatest-id=editItemDate]').clear().type('2025-02-03');

        // Submit the Edit Form
        cy.contains('Submit').click();
        cy.wait(5000);

        // Refresh Page to Double Check if Database had saved the information
        cy.visit('localhost:3000/inventory');
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
        cy.visit('localhost:3000/inventory');
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
        cy.visit("localhost:3000/private")
        cy.wait(1000);
        cy.contains('Logout').click();
        cy.wait(1000);

        cy.visit('localhost:3000/login');

        cy.contains('Business').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('admin1@example.com');
        cy.get('[data-testid=password]').type('businessPassword1');

        // Click the Register button
        cy.contains('Sign in').click();

        cy.url().should('include', 'localhost:3000/inventory');

        cy.visit("localhost:3000/private");
        cy.contains('Delete Account').click();
        cy.wait(1000);

    });


});