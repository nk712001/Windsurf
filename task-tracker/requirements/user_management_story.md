## Epic: User Management

This epic covers all features related to user accounts, including registration, authentication, and profile management.

---

### User Story 1: New User Registration

- **As a:** New user
- **I want to:** Create an account using my email and a secure password.
- **So that:** I can access the application to manage my tasks.

**Acceptance Criteria:**
- The registration form must include fields for name, email, and password.
- Email input must be validated for correct format (e.g., `user@example.com`).
- The password must be at least 8 characters long and contain a mix of letters and numbers.
- The system must check if the email is already registered.
- Upon successful submission, a verification email with a unique link is sent to the user's email address.
- The user's account is created but remains inactive until verified.
- The user is redirected to a page instructing them to check their email for verification.

---

### User Story 2: User Authentication

- **As a:** Registered user
- **I want to:** Log in securely with my email and password.
- **So that:** I can access my personal dashboard and task lists.

**Acceptance Criteria:**
- The login page must have fields for email and password.
- The system must validate the user's credentials against the database.
- On successful login, a JWT is generated and returned to the client for session management.
- The user is redirected to their main dashboard.
- If login fails, a clear error message (e.g., "Invalid email or password") is displayed.
- A "Remember me" checkbox is available to keep the user logged in across sessions.
- A session should time out after a predefined period of inactivity for security.

---

### User Story 3: Password Reset

- **As a:** User who has forgotten their password
- **I want to:** Request a password reset link via email.
- **So that:** I can regain access to my account.

**Acceptance Criteria:**
- A "Forgot Password?" link is available on the login page.
- The user enters their registered email address to initiate the process.
- The system sends an email with a unique, time-limited password reset link.
- Clicking the link takes the user to a secure page to enter and confirm a new password.
- The new password must meet the defined security requirements.
- Upon successful reset, the user is notified and can log in with the new password.

---

### User Story 4: User Profile Management

- **As a:** Logged-in user
- **I want to:** View and update my profile information.
- **So that:** I can manage my personal details and account settings.

**Acceptance Criteria:**
- A dedicated profile page is accessible from the main navigation.
- The user can view and edit their name.
- The user can upload or change their profile picture (avatar).
- The user can change their current password by providing the old password and a new one.
- The user has an option to permanently delete their account, which requires a confirmation step.
