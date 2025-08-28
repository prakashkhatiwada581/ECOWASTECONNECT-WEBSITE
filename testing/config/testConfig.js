/**
 * @file testConfig.js
 * @description Centralized test configuration for UI and API testing.
 *              Includes URLs, browsers, timeouts, test data, selectors, and environment settings.
 */

const path = require('path');

const testConfig = {
  // ------------------- Application URLs ------------------- //
  baseUrl: process.env.BASE_URL || 'http://localhost:8080', // Frontend URL
  apiUrl: process.env.API_URL || 'http://localhost:5000/api', // Backend API URL

  // ------------------- Browser Configurations ------------------- //
  browsers: {
    chrome: {
      name: 'chrome',
      options: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-extensions',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ],
      headless: process.env.HEADLESS === 'true' // Run Chrome in headless mode if env variable set
    },
    firefox: {
      name: 'firefox',
      options: [
        '--width=1920',
        '--height=1080'
      ],
      headless: process.env.HEADLESS === 'true'
    },
    edge: {
      name: 'MicrosoftEdge',
      options: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080'
      ],
      headless: process.env.HEADLESS === 'true'
    }
  },

  // Default browser for tests
  defaultBrowser: process.env.BROWSER || 'chrome',

  // ------------------- Timeouts (milliseconds) ------------------- //
  timeouts: {
    implicit: 10000,  // Implicit wait for elements
    explicit: 15000,  // Explicit wait for conditions
    page: 30000,      // Page load timeout
    script: 20000     // Script execution timeout
  },

  // ------------------- Test Users ------------------- //
  testUsers: {
    admin: {
      email: 'admin@admin.com',
      password: 'admin123',
      name: 'Test Admin',
      role: 'admin'
    },
    user: {
      email: 'user@user.com',
      password: 'user123',
      name: 'Test User',
      role: 'user'
    },
    invalidUser: {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }
  },

  // ------------------- File Paths ------------------- //
  paths: {
    screenshots: path.join(__dirname, '../screenshots'),
    reports: path.join(__dirname, '../reports'),
    logs: path.join(__dirname, '../logs'),
    fixtures: path.join(__dirname, '../fixtures'),
    downloads: path.join(__dirname, '../downloads')
  },

  // ------------------- Test Environment Settings ------------------- //
  environment: {
    retryAttempts: 2,               // Number of retry attempts for failed tests
    screenshotOnFailure: true,      // Capture screenshot on failure
    videoRecording: false,          // Record test videos
    logLevel: process.env.LOG_LEVEL || 'info',
    parallel: process.env.PARALLEL === 'true', // Run tests in parallel
    maxParallel: parseInt(process.env.MAX_PARALLEL) || 3
  },

  // ------------------- Page Selectors ------------------- //
  selectors: {
    // Authentication selectors
    auth: {
      emailInput: 'input[type="email"]',
      passwordInput: 'input[type="password"]',
      loginButton: 'button[type="submit"]',
      logoutButton: '[data-testid="logout-button"]',
      signUpLink: 'a[href="/register"]',
      loginLink: 'a[href="/login"]'
    },

    // Navigation selectors
    navigation: {
      logo: '[data-testid="logo"]',
      profileDropdown: '[data-testid="profile-dropdown"]',
      adminDashboardLink: 'a[href="/admin/dashboard"]',
      userDashboardLink: 'a[href="/dashboard"]',
      sidebarMenu: '[data-testid="sidebar-menu"]'
    },

    // Common UI elements
    common: {
      loadingSpinner: '[data-testid="loading"]',
      errorMessage: '[data-testid="error-message"]',
      successMessage: '[data-testid="success-message"]',
      modal: '[role="dialog"]',
      closeButton: '[aria-label="Close"]',
      submitButton: 'button[type="submit"]',
      cancelButton: 'button[type="button"]'
    },

    // Form elements
    forms: {
      input: 'input',
      textarea: 'textarea',
      select: 'select',
      checkbox: 'input[type="checkbox"]',
      radio: 'input[type="radio"]',
      fileInput: 'input[type="file"]'
    }
  },

  // ------------------- API Endpoints for Testing ------------------- //
  apiEndpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      profile: '/auth/me'
    },
    users: '/users',
    communities: '/communities',
    pickups: '/pickups',
    issues: '/issues',
    notifications: '/notifications',
    analytics: '/analytics',
    settings: '/settings'
  }
};

module.exports = testConfig;
