describe('Iventory Item Alerts', () => {
    Cypress.config('defaultCommandTimeout', 10000);

    it('Checks for Email Alerts and Information Consistency for Near Expiring Items', () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/login');

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
        cy.get('[data-testid=itemQuantity]').type('30');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        const currentDate = new Date().toISOString().slice(0, 10);
        cy.get('[data-testid=itemDate]').type(currentDate);

        // Submit Item
        cy.contains('Submit').click();

        // [Doesn't Expire Soon] 

        // Click the Add Item button
        cy.contains('ADD').click();

        // Fill Add Item Form
        cy.get('[data-testid=itemName]').type('Chicken');
        cy.get('[data-testid=itemDescription]').type('Lorem ipsum dolor sit amet');
        cy.get('[data-testid=itemQuantity]').type('30');
        cy.get('[data-testid=itemStatus]').select('Perishable');
        cy.get('[data-testid=itemDate]').type('2099-04-25');

        // Submit Item
        cy.contains('Submit').click();

        // Click Edit Button
        cy.get('[datatest-id=itemEdit]').eq(1).click();
        cy.wait(1000);

        // Submit the Edit Form
        cy.contains('Submit').click();
        cy.wait(5000);

        // Refresh Page to Double Check if Database had saved the information
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(1000);

        cy.wait(10000);
        // Now, use MailSlurp API to check for received emails
        cy.request({
            method: 'GET',
            url: 'https://api.mailslurp.com/inboxes/73d7c005-0208-4919-910c-cc69156fd62a/emails',
            headers: {
                'x-api-key': '6ce6a7c6f931e56b602fb341231139eaefee4ee8979e80ceb2317dbfb6f51b98'
            }
        }).then(response => {
            // Check if there are any emails received
            expect(response.status).to.eq(200);
            expect(response.body.length).to.be.greaterThan(0);

            // Extract item name and expiry date from the first email
            const emailContent = response.body[0].subject;

            // Regular expression to extract item and expiry date
            const regex = /\] *([^\s]+) *- *Expires on *(\d{4}-\d{2}-\d{2})/;

            // Extracting item and expiry date using regex
            const match = emailContent.match(regex);

            // If there's a match, extract item and expiry date
            if (match) {
                const item = match[1];
                const expiry_date = match[2];
                expect(item).to.equal('FishBall');
                expect(expiry_date).to.equal(currentDate);
            } else {
                console.log("No match found.");
            }
        });

    });


    it('Checks if User Interface warns for Near Expiring Items', () => {
        cy.viewport(1920, 1080);
        cy.visit('https://multivault-e2e-test.netlify.app/inventory');
        cy.wait(5000);
        // Select the parent div element with class "inventory" and get its first-level div children
        cy.get('.inventory > div').then(($children) => {
            // Assert the first child does not have class "highlight-red"
            cy.wrap($children.eq(0)).should('not.have.class', 'highlight-red');

            // Assert the second child has class "highlight-red"
            cy.wrap($children.eq(1)).should('have.class', 'highlight-red');
        });
    });


    it('Delete Test Account', () => {
        cy.visit("https://multivault-e2e-test.netlify.app/private")
        cy.wait(1000);
        cy.contains('Logout').click();
        cy.wait(1000);

        cy.visit('https://multivault-e2e-test.netlify.app/login');

        cy.contains('Business').click();

        // Fill the registration form for the User account
        cy.get('[data-testid=email]').type('73d7c005-0208-4919-910c-cc69156fd62a@mailslurp.net');
        cy.get('[data-testid=password]').type('NVANZIeMINetInTuSHig');

        // Click the Register button
        cy.contains('Sign in').click();

        cy.url().should('include', 'https://multivault-e2e-test.netlify.app/inventory');

        cy.visit("https://multivault-e2e-test.netlify.app/private");
        cy.contains('Delete Account').click();
        cy.wait(1000);

    });
});