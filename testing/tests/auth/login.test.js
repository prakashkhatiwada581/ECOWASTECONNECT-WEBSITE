const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const BaseTest = require('../../utils/baseTest');
const testConfig = require('../../config/testConfig');
const logger = require('../../utils/logger');

describe('Authentication - Login Tests', function() {
  let test;

  beforeEach(async function() {
    test = new BaseTest();
    await test.beforeEach(this.currentTest.title);
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED';
    await test.afterEach(testStatus);
  });

  describe('Valid Login Scenarios', function() {
    it('should login successfully with admin credentials', async function() {
      // Navigate to login page
      await test.navigateToApp('/login');
      
      // Verify login page elements
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.emailInput), 'Email input');
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.passwordInput), 'Password input');
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.loginButton), 'Login button');
      
      // Perform login
      await test.loginAsAdmin();
      
      // Verify successful login
      expect(await test.verifyLoggedIn()).to.be.true;
      expect(await test.verifyAdminAccess()).to.be.true;
      
      // Verify redirect to admin dashboard
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/admin/dashboard');
      
      // Verify page title
      await test.verifyPageTitle('Admin Dashboard');
      
      // Verify no console errors
      await test.verifyNoConsoleErrors();
    });

    it('should login successfully with user credentials', async function() {
      // Navigate to login page
      await test.navigateToApp('/login');
      
      // Perform login
      await test.loginAsUser();
      
      // Verify successful login
      expect(await test.verifyLoggedIn()).to.be.true;
      expect(await test.verifyAdminAccess()).to.be.false;
      
      // Verify redirect to user dashboard
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/dashboard');
      expect(currentUrl).to.not.include('/admin');
      
      // Verify page title
      await test.verifyPageTitle('Dashboard');
    });

    it('should show user name in profile dropdown after login', async function() {
      await test.navigateToApp('/login');
      await test.loginAsUser();
      
      // Click profile dropdown
      await test.driverManager.clickElement(By.css(testConfig.selectors.navigation.profileDropdown));
      
      // Verify user name is displayed
      await test.verifyTextContent(
        By.css('[data-testid="user-name"]'), 
        testConfig.testUsers.user.name,
        'User name in dropdown'
      );
    });
  });

  describe('Invalid Login Scenarios', function() {
    it('should show error for invalid credentials', async function() {
      await test.navigateToApp('/login');
      
      // Try login with invalid credentials
      await test.fillFormField(
        By.css(testConfig.selectors.auth.emailInput), 
        testConfig.testUsers.invalidUser.email,
        'Email'
      );
      await test.fillFormField(
        By.css(testConfig.selectors.auth.passwordInput), 
        testConfig.testUsers.invalidUser.password,
        'Password'
      );
      
      await test.driverManager.clickElement(By.css(testConfig.selectors.auth.loginButton));
      
      // Verify error message is displayed
      await test.verifyElementDisplayed(By.css(testConfig.selectors.common.errorMessage), 'Error message');
      
      // Verify user is not logged in
      expect(await test.verifyLoggedIn()).to.be.false;
      
      // Verify still on login page
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/login');
    });

    it('should show validation error for empty email', async function() {
      await test.navigateToApp('/login');
      
      // Leave email empty, fill password
      await test.fillFormField(
        By.css(testConfig.selectors.auth.passwordInput), 
        'somepassword',
        'Password'
      );
      
      await test.driverManager.clickElement(By.css(testConfig.selectors.auth.loginButton));
      
      // Verify validation error
      const emailInput = await test.driverManager.findElement(By.css(testConfig.selectors.auth.emailInput));
      const validationMessage = await emailInput.getAttribute('validationMessage');
      expect(validationMessage).to.not.be.empty;
    });

    it('should show validation error for empty password', async function() {
      await test.navigateToApp('/login');
      
      // Fill email, leave password empty
      await test.fillFormField(
        By.css(testConfig.selectors.auth.emailInput), 
        testConfig.testUsers.user.email,
        'Email'
      );
      
      await test.driverManager.clickElement(By.css(testConfig.selectors.auth.loginButton));
      
      // Verify validation error
      const passwordInput = await test.driverManager.findElement(By.css(testConfig.selectors.auth.passwordInput));
      const validationMessage = await passwordInput.getAttribute('validationMessage');
      expect(validationMessage).to.not.be.empty;
    });
  });

  describe('Login Page UI Tests', function() {
    it('should display all required elements on login page', async function() {
      await test.navigateToApp('/login');
      
      // Verify page title
      await test.verifyPageTitle('Login');
      
      // Verify form elements
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.emailInput), 'Email input');
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.passwordInput), 'Password input');
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.loginButton), 'Login button');
      
      // Verify link to sign up
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.signUpLink), 'Sign up link');
      
      // Verify application logo
      await test.verifyElementDisplayed(By.css(testConfig.selectors.navigation.logo), 'Application logo');
    });

    it('should navigate to register page when clicking sign up link', async function() {
      await test.navigateToApp('/login');
      
      // Click sign up link
      await test.driverManager.clickElement(By.css(testConfig.selectors.auth.signUpLink));
      
      // Verify navigation to register page
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/register');
      
      await test.verifyPageTitle('Register');
    });

    it('should have responsive design on mobile viewport', async function() {
      // Set mobile viewport
      await test.driver.manage().window().setRect({ width: 375, height: 667 });
      
      await test.navigateToApp('/login');
      
      // Verify elements are still visible and accessible
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.emailInput), 'Email input on mobile');
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.passwordInput), 'Password input on mobile');
      await test.verifyElementDisplayed(By.css(testConfig.selectors.auth.loginButton), 'Login button on mobile');
      
      // Reset to desktop viewport
      await test.driver.manage().window().maximize();
    });
  });

  describe('Logout Tests', function() {
    it('should logout successfully and redirect to login page', async function() {
      // Login first
      await test.navigateToApp('/login');
      await test.loginAsUser();
      
      // Verify user is logged in
      expect(await test.verifyLoggedIn()).to.be.true;
      
      // Perform logout
      await test.logout();
      
      // Verify user is logged out
      expect(await test.verifyLoggedIn()).to.be.false;
      
      // Verify redirect to login page
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/login');
    });

    it('should clear session data after logout', async function() {
      await test.navigateToApp('/login');
      await test.loginAsUser();
      
      // Check that user data is stored
      const userDataBefore = await test.driverManager.executeScript(
        'return localStorage.getItem("wasteWiseUser")'
      );
      expect(userDataBefore).to.not.be.null;
      
      // Logout
      await test.logout();
      
      // Check that user data is cleared
      const userDataAfter = await test.driverManager.executeScript(
        'return localStorage.getItem("wasteWiseUser")'
      );
      expect(userDataAfter).to.be.null;
    });
  });

  describe('Session Management', function() {
    it('should redirect to login when accessing protected route without authentication', async function() {
      // Try to access dashboard without login
      await test.navigateToApp('/dashboard');
      
      // Should be redirected to login
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/login');
    });

    it('should redirect to login when accessing admin route without admin privileges', async function() {
      // Login as regular user
      await test.navigateToApp('/login');
      await test.loginAsUser();
      
      // Try to access admin dashboard
      await test.navigateToApp('/admin/dashboard');
      
      // Should be redirected or show access denied
      const currentUrl = await test.driverManager.getCurrentUrl();
      const hasAccessDenied = currentUrl.includes('/login') || 
                             await test.driverManager.isDisplayed(By.css('[data-testid="access-denied"]'));
      
      expect(hasAccessDenied).to.be.true;
    });
  });
});
