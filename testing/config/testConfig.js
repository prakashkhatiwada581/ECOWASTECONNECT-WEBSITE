const path = require('path');

const testConfig = {
  // Application URLs
  baseUrl: process.env.BASE_URL || 'http://localhost:8080',
  apiUrl: process.env.API_URL || 'http://localhost:5000/api',
  
  // Browser configurations
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
      headless: process.env.HEADLESS === 'true'
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
  
  // Timeouts (in milliseconds)
  timeouts: {
    implicit: 10000,
    explicit: 15000,
    page: 30000,
    script: 20000
  },
  
  // Test data
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
  
  // File paths
  paths: {
    screenshots: path.join(__dirname, '../screenshots'),
    reports: path.join(__dirname, '../reports'),
    logs: path.join(__dirname, '../logs'),
    fixtures: path.join(__dirname, '../fixtures'),
    downloads: path.join(__dirname, '../downloads')
  },
  
  // Test environment settings
  environment: {
    retryAttempts: 2,
    screenshotOnFailure: true,
    videoRecording: false,
    logLevel: process.env.LOG_LEVEL || 'info',
    parallel: process.env.PARALLEL === 'true',
    maxParallel: parseInt(process.env.MAX_PARALLEL) || 3
  },
  
  // Page selectors
  selectors: {
    // Authentication
    auth: {
      emailInput: 'input[type="email"]',
      passwordInput: 'input[type="password"]',
      loginButton: 'button[type="submit"]',
      logoutButton: '[data-testid="logout-button"]',
      signUpLink: 'a[href="/register"]',
      loginLink: 'a[href="/login"]'
    },
    
    // Navigation
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
    
    // Forms
    forms: {
      input: 'input',
      textarea: 'textarea',
      select: 'select',
      checkbox: 'input[type="checkbox"]',
      radio: 'input[type="radio"]',
      fileInput: 'input[type="file"]'
    }
  },
  
  // API endpoints for testing
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
