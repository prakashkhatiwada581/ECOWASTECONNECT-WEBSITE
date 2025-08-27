const { Builder, By, until, WebDriver } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const fs = require('fs');
const path = require('path');
const testConfig = require('../config/testConfig');
const logger = require('./logger');

class WebDriverManager {
  constructor() {
    this.driver = null;
    this.currentBrowser = testConfig.defaultBrowser;
  }

  /**
   * Create and configure WebDriver instance
   * @param {string} browserName - Browser name (chrome, firefox, edge)
   * @returns {Promise<WebDriver>}
   */
  async createDriver(browserName = testConfig.defaultBrowser) {
    try {
      this.currentBrowser = browserName;
      const browserConfig = testConfig.browsers[browserName];
      
      if (!browserConfig) {
        throw new Error(`Unsupported browser: ${browserName}`);
      }

      let driver;
      
      switch (browserName) {
        case 'chrome':
          driver = await this.createChromeDriver(browserConfig);
          break;
        case 'firefox':
          driver = await this.createFirefoxDriver(browserConfig);
          break;
        case 'edge':
          driver = await this.createEdgeDriver(browserConfig);
          break;
        default:
          throw new Error(`Browser ${browserName} is not supported`);
      }

      // Set timeouts
      await driver.manage().setTimeouts({
        implicit: testConfig.timeouts.implicit,
        pageLoad: testConfig.timeouts.page,
        script: testConfig.timeouts.script
      });

      // Maximize window
      await driver.manage().window().maximize();

      this.driver = driver;
      logger.info(`WebDriver created successfully for ${browserName}`);
      
      return driver;
    } catch (error) {
      logger.error(`Failed to create WebDriver for ${browserName}:`, error);
      throw error;
    }
  }

  /**
   * Create Chrome WebDriver
   */
  async createChromeDriver(config) {
    const options = new chrome.Options();
    
    // Add Chrome options
    config.options.forEach(option => options.addArguments(option));
    
    if (config.headless) {
      options.addArguments('--headless');
    }

    // Set download preferences
    const prefs = {
      'download.default_directory': testConfig.paths.downloads,
      'download.prompt_for_download': false,
      'download.directory_upgrade': true,
      'safebrowsing.enabled': true
    };
    options.setUserPreferences(prefs);

    return await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  /**
   * Create Firefox WebDriver
   */
  async createFirefoxDriver(config) {
    const options = new firefox.Options();
    
    config.options.forEach(option => options.addArguments(option));
    
    if (config.headless) {
      options.addArguments('--headless');
    }

    // Set Firefox preferences
    options.setPreference('browser.download.folderList', 2);
    options.setPreference('browser.download.dir', testConfig.paths.downloads);
    options.setPreference('browser.download.useDownloadDir', true);
    options.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/pdf,text/csv,application/vnd.ms-excel');

    return await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  }

  /**
   * Create Edge WebDriver
   */
  async createEdgeDriver(config) {
    const options = new edge.Options();
    
    config.options.forEach(option => options.addArguments(option));
    
    if (config.headless) {
      options.addArguments('--headless');
    }

    return await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeOptions(options)
      .build();
  }

  /**
   * Get current WebDriver instance
   */
  getDriver() {
    if (!this.driver) {
      throw new Error('WebDriver not initialized. Call createDriver() first.');
    }
    return this.driver;
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url) {
    if (!url.startsWith('http')) {
      url = testConfig.baseUrl + url;
    }
    
    logger.info(`Navigating to: ${url}`);
    await this.driver.get(url);
    
    // Wait for page to load
    await this.driver.wait(until.elementLocated(By.tagName('body')), testConfig.timeouts.page);
  }

  /**
   * Find element with enhanced error handling
   */
  async findElement(locator, timeout = testConfig.timeouts.explicit) {
    try {
      const element = await this.driver.wait(until.elementLocated(locator), timeout);
      await this.driver.wait(until.elementIsVisible(element), timeout);
      return element;
    } catch (error) {
      logger.error(`Failed to find element: ${locator.toString()}`);
      await this.takeScreenshot(`element-not-found-${Date.now()}`);
      throw error;
    }
  }

  /**
   * Find elements
   */
  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickable(locator, timeout = testConfig.timeouts.explicit) {
    const element = await this.findElement(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  /**
   * Click element with retry mechanism
   */
  async clickElement(locator, retryCount = 3) {
    for (let i = 0; i < retryCount; i++) {
      try {
        const element = await this.waitForClickable(locator);
        await element.click();
        return;
      } catch (error) {
        if (i === retryCount - 1) {
          logger.error(`Failed to click element after ${retryCount} attempts: ${locator.toString()}`);
          await this.takeScreenshot(`click-failed-${Date.now()}`);
          throw error;
        }
        await this.sleep(1000);
      }
    }
  }

  /**
   * Type text with clear first
   */
  async typeText(locator, text, clearFirst = true) {
    const element = await this.findElement(locator);
    
    if (clearFirst) {
      await element.clear();
    }
    
    await element.sendKeys(text);
    logger.debug(`Typed text: ${text}`);
  }

  /**
   * Get text from element
   */
  async getText(locator) {
    const element = await this.findElement(locator);
    return await element.getText();
  }

  /**
   * Get attribute value
   */
  async getAttribute(locator, attribute) {
    const element = await this.findElement(locator);
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is displayed
   */
  async isDisplayed(locator) {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(locator, timeout = testConfig.timeouts.explicit) {
    await this.driver.wait(until.stalenessOf(locator), timeout);
  }

  /**
   * Execute JavaScript
   */
  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename = null) {
    if (!filename) {
      filename = `screenshot-${Date.now()}`;
    }
    
    if (!filename.endsWith('.png')) {
      filename += '.png';
    }

    try {
      // Ensure screenshots directory exists
      if (!fs.existsSync(testConfig.paths.screenshots)) {
        fs.mkdirSync(testConfig.paths.screenshots, { recursive: true });
      }

      const screenshot = await this.driver.takeScreenshot();
      const filePath = path.join(testConfig.paths.screenshots, filename);
      
      fs.writeFileSync(filePath, screenshot, 'base64');
      logger.info(`Screenshot saved: ${filePath}`);
      
      return filePath;
    } catch (error) {
      logger.error('Failed to take screenshot:', error);
    }
  }

  /**
   * Switch to frame
   */
  async switchToFrame(frameLocator) {
    const frame = await this.findElement(frameLocator);
    await this.driver.switchTo().frame(frame);
  }

  /**
   * Switch to default content
   */
  async switchToDefaultContent() {
    await this.driver.switchTo().defaultContent();
  }

  /**
   * Handle alert
   */
  async handleAlert(accept = true) {
    try {
      const alert = await this.driver.switchTo().alert();
      const alertText = await alert.getText();
      
      if (accept) {
        await alert.accept();
      } else {
        await alert.dismiss();
      }
      
      logger.info(`Alert handled: ${alertText}`);
      return alertText;
    } catch (error) {
      logger.warn('No alert present');
      return null;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator) {
    const element = await this.findElement(locator);
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
    await this.sleep(500); // Allow scroll to complete
  }

  /**
   * Hover over element
   */
  async hoverOverElement(locator) {
    const element = await this.findElement(locator);
    const actions = this.driver.actions({ bridge: true });
    await actions.move({ origin: element }).perform();
  }

  /**
   * Drag and drop
   */
  async dragAndDrop(sourceLocator, targetLocator) {
    const source = await this.findElement(sourceLocator);
    const target = await this.findElement(targetLocator);
    
    const actions = this.driver.actions({ bridge: true });
    await actions.dragAndDrop(source, target).perform();
  }

  /**
   * Sleep/wait
   */
  async sleep(milliseconds) {
    await this.driver.sleep(milliseconds);
  }

  /**
   * Get page title
   */
  async getTitle() {
    return await this.driver.getTitle();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  /**
   * Refresh page
   */
  async refresh() {
    await this.driver.navigate().refresh();
  }

  /**
   * Go back
   */
  async goBack() {
    await this.driver.navigate().back();
  }

  /**
   * Go forward
   */
  async goForward() {
    await this.driver.navigate().forward();
  }

  /**
   * Close current window
   */
  async closeWindow() {
    await this.driver.close();
  }

  /**
   * Quit driver and clean up
   */
  async quit() {
    if (this.driver) {
      try {
        await this.driver.quit();
        logger.info('WebDriver quit successfully');
      } catch (error) {
        logger.error('Error quitting WebDriver:', error);
      } finally {
        this.driver = null;
      }
    }
  }

  /**
   * Get browser logs
   */
  async getBrowserLogs() {
    try {
      const logs = await this.driver.manage().logs().get('browser');
      return logs;
    } catch (error) {
      logger.warn('Could not retrieve browser logs:', error);
      return [];
    }
  }

  /**
   * Add cookie
   */
  async addCookie(name, value, options = {}) {
    await this.driver.manage().addCookie({ name, value, ...options });
  }

  /**
   * Get cookie
   */
  async getCookie(name) {
    return await this.driver.manage().getCookie(name);
  }

  /**
   * Delete all cookies
   */
  async deleteAllCookies() {
    await this.driver.manage().deleteAllCookies();
  }
}

module.exports = WebDriverManager;
