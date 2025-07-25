/// <reference types="cypress" />

describe('User Registration', () => {
  it('should allow a new user to register successfully', () => {
    // Use a unique email for each test run
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    // 1. Visit the registration page
    cy.visit('/register');

    // 2. Fill out the registration form
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirm"]').type('password123');

    // 3. Submit the form
    cy.get('button[type="submit"]').click();

    // 4. Assert that the success message is shown
    cy.contains('Registration successful').should('be.visible');
    cy.contains('Please check your email to verify your account.').should('be.visible');
  });
});
