/// <reference types="cypress" />

describe('User Login', () => {
  const user = {
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123',
  };

  beforeEach(() => {
    // Create and verify a user before each test
    cy.createAndVerifyUser(user.email, user.password);
  });

  it('should allow a verified user to log in successfully', () => {
    // 1. Visit the login page
    cy.visit('/login');

    // 2. Fill out the login form
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);

    // 3. Submit the form
    cy.get('button[type="submit"]').click();

    // 4. Assert that the user is redirected and logged in
    cy.url().should('include', '/tasks');
    cy.contains('Logout').should('be.visible');
  });
});
