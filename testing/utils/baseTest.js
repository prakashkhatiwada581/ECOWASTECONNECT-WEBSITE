const { By } = require('selenium-webdriver');
const WebDriverManager = require('./webDriverManager');
const logger = require('./logger');
const testConfig = require('../config/testConfig');
const fs = require('fs');

class BaseTest {
  constructor() {
    this.driverManager = new WebDriverManager();
    this.driver = null;
    this.testStartTime = null;
    this.currentTestName = '';
  }

  /**
   * Setup before each test
   */
  async beforeEach(testName, browser = testConfig.defaultBrowser) {
    this.testStartTime = Date.now();
    this.currentTestName = testName;
    
    logger.testStart(testName, browser);
    
    try {
      this.driver = await this.driverManager.createDriver(browser);
      logger.setupStart(`WebDriver initialized for ${browser}`);
    } catch (error) {
      logger.error(`Failed to setup test: ${testName}`, error);
      throw error;
    }
  }

  /**
   * Cleanup after each test
   */
  async afterEach(testStatus = 'PASSED') {
    const duration = this.testStartTime ? `${Date.now() - this.testStartTime}ms` : '';
    
    try {
      // Take screenshot on failure
      if (testStatus === 'FAILED' && testConfig.environment.screenshotOnFailure) {
        await this.driverManager.takeScreenshot(`failure-${this.currentTestName}-${Date.now()}`);
      }

      // Get browser logs
      const logs = await this.driverManager.getBrowserLogs();
      if (logs.length > 0) {
        logger.debug(`Browser logs for ${this.currentTestName}:`, logs);
      }

      logger.teardownStart('Closing WebDriver');
      await this.driverManager.quit();
      
    } catch (error) {
      logger.error('Error in test cleanup:', error);
    } finally {
      logger.testEnd(this.currentTestName, testStatus, duration);
    }
  }

  /**
   * Navigate to application URL
   */
  async navigateToApp(path = '/') {
    logger.stepStart(`Navigating to ${path}`);
    await this.driverManager.navigateTo(path);
    await this.waitForPageLoad();
    logger.stepEnd(`Navigation to ${path}`);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.driver.wait(
      () => this.driver.executeScript('return document.readyState === "complete"'),
      testConfig.timeouts.page
    );
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin() {
    return await this.login(testConfig.testUsers.admin);
  }

  /**
   * Login as regular user
   */
  async loginAsUser() {
    return await this.login(testConfig.testUsers.user);
  }

  /**
   * Generic login method
   */
  async login(userCredentials) {
    logger.stepStart(`Logging in as ${userCredentials.email}`);
    
    try {
      // Navigate to login page if not already there
      const currentUrl = await this.driverManager.getCurrentUrl();
      if (!currentUrl.includes('/login')) {
        await this.navigateToApp('/login');
      }

      // Fill login form
      await this.driverManager.typeText(By.css(testConfig.selectors.auth.emailInput), userCredentials.email);
      await this.driverManager.typeText(By.css(testConfig.selectors.auth.passwordInput), userCredentials.password);
      
      // Submit form
      await this.driverManager.clickElement(By.css(testConfig.selectors.auth.loginButton));
      
      // Wait for redirect (dashboard or admin dashboard)
      await this.driver.wait(
        async () => {
          const url = await this.driverManager.getCurrentUrl();
          return url.includes('/dashboard') || url.includes('/admin');
        },
        testConfig.timeouts.page
      );

      logger.stepEnd(`Login as ${userCredentials.email}`, 'PASSED');
      return true;
      
    } catch (error) {
      logger.stepEnd(`Login as ${userCredentials.email}`, 'FAILED');
      logger.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    logger.stepStart('Logging out user');
    
    try {
      // Click profile dropdown to access logout
      await this.driverManager.clickElement(By.css(testConfig.selectors.navigation.profileDropdown));
      
      // Click logout button
      await this.driverManager.clickElement(By.css(testConfig.selectors.auth.logoutButton));
      
      // Wait for redirect to login/home page
      await this.driver.wait(
        async () => {
          const url = await this.driverManager.getCurrentUrl();
          return url.includes('/login') || url === testConfig.baseUrl + '/';
        },
        testConfig.timeouts.page
      );

      logger.stepEnd('Logout', 'PASSED');
      
    } catch (error) {
      logger.stepEnd('Logout', 'FAILED');
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Verify user is logged in
   */
  async verifyLoggedIn() {
    try {
      // Check if profile dropdown is visible (indicates logged in)
      const isLoggedIn = await this.driverManager.isDisplayed(By.css(testConfig.selectors.navigation.profileDropdown));
      logger.assertion('User is logged in', isLoggedIn, true);
      return isLoggedIn;
    } catch (error) {
      logger.warning('Could not verify login status');
      return false;
    }
  }

  /**
   * Verify admin access
   */
  async verifyAdminAccess() {
    try {
      const currentUrl = await this.driverManager.getCurrentUrl();
      const hasAdminAccess = currentUrl.includes('/admin');
      logger.assertion('User has admin access', hasAdminAccess, true);
      return hasAdminAccess;
    } catch (error) {
      logger.warning('Could not verify admin access');
      return false;
    }
  }

  /**
   * Wait for element and verify it's displayed
   */
  async verifyElementDisplayed(locator, elementName = 'Element') {
    logger.stepStart(`Verifying ${elementName} is displayed`);
    
    try {
      await this.driverManager.findElement(locator);
      const isDisplayed = await this.driverManager.isDisplayed(locator);
      
      logger.assertion(`${elementName} is displayed`, isDisplayed, true);
      logger.stepEnd(`Verify ${elementName} displayed`, isDisplayed ? 'PASSED' : 'FAILED');
      
      return isDisplayed;
    } catch (error) {
      logger.stepEnd(`Verify ${elementName} displayed`, 'FAILED');
      throw error;
    }
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle) {
    logger.stepStart(`Verifying page title: ${expectedTitle}`);
    
    const actualTitle = await this.driverManager.getTitle();
    const matches = actualTitle.includes(expectedTitle);
    
    logger.assertion('Page title', actualTitle, expectedTitle);
    logger.stepEnd('Verify page title', matches ? 'PASSED' : 'FAILED');
    
    return matches;
  }

  /**
   * Verify text content
   */
  async verifyTextContent(locator, expectedText, elementName = 'Element') {
    logger.stepStart(`Verifying ${elementName} contains text: ${expectedText}`);
    
    const actualText = await this.driverManager.getText(locator);
    const contains = actualText.includes(expectedText);
    
    logger.assertion(`${elementName} text`, actualText, expectedText);
    logger.stepEnd(`Verify ${elementName} text`, contains ? 'PASSED' : 'FAILED');
    
    return contains;
  }

  /**
   * Fill form field
   */
  async fillFormField(locator, value, fieldName = 'Field') {
    logger.stepStart(`Filling ${fieldName} with: ${value}`);
    
    try {
      await this.driverManager.typeText(locator, value);
      logger.stepEnd(`Fill ${fieldName}`, 'PASSED');
    } catch (error) {
      logger.stepEnd(`Fill ${fieldName}`, 'FAILED');
      throw error;
    }
  }

  /**
   * Click button and wait for response
   */
  async clickAndWait(locator, waitCondition, buttonName = 'Button') {
    logger.stepStart(`Clicking ${buttonName}`);
    
    try {
      await this.driverManager.clickElement(locator);
      
      if (waitCondition) {
        await this.driver.wait(waitCondition, testConfig.timeouts.explicit);
      }
      
      logger.stepEnd(`Click ${buttonName}`, 'PASSED');
    } catch (error) {
      logger.stepEnd(`Click ${buttonName}`, 'FAILED');
      throw error;
    }
  }

  /**
   * Navigate using sidebar menu
   */
  async navigateUsingSidebar(menuItemText) {
    logger.stepStart(`Navigating to ${menuItemText} via sidebar`);
    
    try {
      const menuItem = await this.driverManager.findElement(
        By.xpath(`//nav//a[contains(text(), '${menuItemText}')]`)
      );
      await this.driverManager.clickElement(By.xpath(`//nav//a[contains(text(), '${menuItemText}')]`));
      
      // Wait for navigation
      await this.waitForPageLoad();
      
      logger.stepEnd(`Navigate to ${menuItemText}`, 'PASSED');
    } catch (error) {
      logger.stepEnd(`Navigate to ${menuItemText}`, 'FAILED');
      throw error;
    }
  }

  /**
   * Handle modal dialog
   */
  async handleModal(action = 'close') {
    logger.stepStart(`Handling modal - ${action}`);
    
    try {
      const modal = await this.driverManager.findElement(By.css(testConfig.selectors.common.modal));
      
      if (action === 'close') {
        await this.driverManager.clickElement(By.css(testConfig.selectors.common.closeButton));
      }
      
      // Wait for modal to disappear
      await this.driverManager.waitForElementToDisappear(modal);
      
      logger.stepEnd(`Handle modal - ${action}`, 'PASSED');
    } catch (error) {
      logger.stepEnd(`Handle modal - ${action}`, 'FAILED');
      throw error;
    }
  }

  /**
   * Scroll to element and click
   */
  async scrollAndClick(locator, elementName = 'Element') {
    logger.stepStart(`Scrolling to and clicking ${elementName}`);
    
    try {
      await this.driverManager.scrollToElement(locator);
      await this.driverManager.clickElement(locator);
      
      logger.stepEnd(`Scroll and click ${elementName}`, 'PASSED');
    } catch (error) {
      logger.stepEnd(`Scroll and click ${elementName}`, 'FAILED');
      throw error;
    }
  }

  /**
   * Take screenshot for documentation
   */
  async takeDocumentationScreenshot(description) {
    const filename = `doc-${description.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    return await this.driverManager.takeScreenshot(filename);
  }

  /**
   * Get browser console errors
   */
  async getBrowserErrors() {
    const logs = await this.driverManager.getBrowserLogs();
    return logs.filter(log => log.level.name === 'SEVERE');
  }

  /**
   * Verify no console errors
   */
  async verifyNoConsoleErrors() {
    logger.stepStart('Verifying no console errors');
    
    const errors = await this.getBrowserErrors();
    const hasNoErrors = errors.length === 0;
    
    if (!hasNoErrors) {
      logger.warning(`Found ${errors.length} console errors:`, errors);
    }
    
    logger.assertion('Console errors count', errors.length, 0);
    logger.stepEnd('Verify no console errors', hasNoErrors ? 'PASSED' : 'FAILED');
    
    return hasNoErrors;
  }
}

module.exports = BaseTest;
