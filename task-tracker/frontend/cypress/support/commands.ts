/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to create and verify a user via API.
       * @param email The user's email
       * @param password The user's password
       */
      createAndVerifyUser(email: string, password: string): Chainable<void>;
      /**
       * Custom command to get a password reset token for a user.
       * @param email The user's email
       */
      getResetToken(email: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add('createAndVerifyUser', (email, password) => {
  cy.request('POST', 'http://localhost:5000/api/testing/seed-user', {
    email,
    password,
  });
});

Cypress.Commands.add('getResetToken', (email) => {
  return cy
    .request('GET', `http://localhost:5000/api/testing/reset-token?email=${email}`)
    .its('body.token');
});

// To make this file a module and allow global augmentation
export {};
