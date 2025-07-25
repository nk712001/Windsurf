/// <reference types="cypress" />

describe('Password Reset', () => {
  const user = {
    email: `testuser_${Date.now()}@example.com`,
    password: 'password123',
    newPassword: 'newPassword456',
  };

  beforeEach(() => {
    cy.createAndVerifyUser(user.email, user.password);
  });

  it('should allow a user to reset their password', () => {
    // 1. Visit the forgot password page and request a reset
    cy.visit('/forgot-password');
    cy.get('input[name="email"]').type(user.email);
    cy.get('button[type="submit"]').click();
    cy.contains('Password reset email sent').should('be.visible');

    // 2. Get the reset token from the backend
    cy.getResetToken(user.email).then((token) => {
      // 3. Visit the reset password page with the token
      cy.visit(`/reset-password/${token}`);

      // 4. Fill in the new password
      cy.get('input[name="password"]').type(user.newPassword);
      cy.get('input[name="confirmPassword"]').type(user.newPassword);
      cy.get('button[type="submit"]').click();

      // 5. Assert that the password was reset successfully
      cy.contains('Password has been reset successfully.').should('be.visible');
      cy.url().should('include', '/login');

      // 6. Verify login with the new password
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.newPassword);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/tasks');
      cy.contains('Logout').should('be.visible');
    });
  });
});
