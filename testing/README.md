# EcoWasteConnect Testing Suite

A comprehensive system testing framework for the EcoWasteConnect application using Selenium WebDriver and JavaScript.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Chrome, Firefox, or Edge browser installed
- EcoWasteConnect application running locally

### Installation

```bash
cd testing
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:admin
npm run test:user
npm run test:auth

# Run with custom options
node testRunner.js --suite auth --browser firefox --headless
```

## 📁 Project Structure

```
testing/
├── config/
│   └── testConfig.js          # Test configuration and settings
├── utils/
│   ├── webDriverManager.js    # WebDriver management utilities
│   ├── baseTest.js            # Base test class with common functionality
��   └── logger.js              # Logging utilities
├── tests/
│   ├── auth/                  # Authentication tests
│   ├── admin/                 # Admin functionality tests
│   ├── user/                  # User functionality tests
│   ├── api/                   # Backend API tests
│   ├── e2e/                   # End-to-end workflow tests
│   └── smoke/                 # Quick smoke tests
├── setup/
│   ├── setupTests.js          # Test environment setup
│   └── teardownTests.js       # Test cleanup and reporting
├── screenshots/               # Test screenshots (auto-generated)
├── reports/                   # Test reports (auto-generated)
├── logs/                      # Test logs (auto-generated)
└── testRunner.js              # Main test runner script
```

## 🧪 Test Suites

### Authentication Tests (`npm run test:auth`)
- Login/logout functionality
- Role-based access control
- Session management
- Password validation
- Registration flow

### Admin Dashboard Tests (`npm run test:admin`)
- Admin dashboard layout and navigation
- User management functionality
- Community management
- Service areas management
- Analytics and reporting
- System settings

### User Dashboard Tests (`npm run test:user`)
- User dashboard functionality
- Pickup scheduling
- Issue reporting
- Notification system
- Profile management

### API Tests (`npm run test:api`)
- Backend endpoint testing
- Authentication API
- CRUD operations
- Error handling
- Data validation

### End-to-End Tests (`npm run test:e2e`)
- Complete user workflows
- Admin workflows
- Cross-browser compatibility
- Data consistency

### Smoke Tests (`npm run test:smoke`)
- Critical path verification
- Basic functionality check
- Quick regression testing

## 🔧 Configuration

### Environment Variables

```bash
# Application URLs
BASE_URL=http://localhost:8080
API_URL=http://localhost:5000/api

# Browser settings
BROWSER=chrome                 # chrome, firefox, edge
HEADLESS=false                # true for headless mode

# Test execution
PARALLEL=false                # Enable parallel execution
MAX_PARALLEL=3                # Maximum parallel processes
LOG_LEVEL=info                # debug, info, warn, error
```

### Test Configuration (`config/testConfig.js`)

```javascript
const testConfig = {
  baseUrl: 'http://localhost:8080',
  apiUrl: 'http://localhost:5000/api',
  defaultBrowser: 'chrome',
  timeouts: {
    implicit: 10000,
    explicit: 15000,
    page: 30000
  },
  testUsers: {
    admin: { email: 'admin@admin.com', password: 'admin123' },
    user: { email: 'user@user.com', password: 'user123' }
  }
};
```

## 🚀 Running Tests

### Basic Commands

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test suite
npm run test:auth
npm run test:admin
npm run test:user

# Run with specific browser
npm test -- --browser firefox

# Run in headless mode
npm test -- --headless

# Run specific test pattern
npm test -- --grep "login"
```

### Advanced Options

```bash
# Run tests in parallel
node testRunner.js --parallel 5

# Run specific suite with custom timeout
node testRunner.js --suite admin --timeout 60000

# Run tests with bail on first failure
node testRunner.js --bail

# Skip setup/teardown
node testRunner.js --no-setup --no-teardown

# Generate detailed reports
node testRunner.js --reporter mochawesome
```

## 📊 Test Reports

### Generated Artifacts

- **Screenshots**: Automatic screenshots on test failures
- **Logs**: Detailed execution logs with timestamps
- **Reports**: JSON and HTML test reports
- **Coverage**: Test coverage metrics (if configured)

### Report Locations

```
testing/
├── screenshots/           # Failure screenshots
├── logs/                 # Test execution logs
│   ├── combined.log     # All log levels
│   └── error.log        # Error logs only
└── reports/             # Test reports
    ├── test-report.html # HTML report
    ├── test-report.json # JSON report
    └── execution-report.json # Execution summary
```

## 🔍 Debugging Tests

### Debug Mode

```bash
# Run with debug logging
LOG_LEVEL=debug npm test

# Run single test file
npx mocha tests/auth/login.test.js --timeout 30000

# Run with browser visible (non-headless)
HEADLESS=false npm test
```

### Screenshots

- Automatic screenshots on test failures
- Manual screenshots: `await test.takeScreenshot('description')`
- Screenshots saved to `screenshots/` directory

### Logging

```javascript
// In test files
logger.info('Test step description');
logger.debug('Detailed debug information');
logger.error('Error information');
```

## 🛠️ Writing Tests

### Basic Test Structure

```javascript
const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const BaseTest = require('../../utils/baseTest');

describe('Feature Tests', function() {
  let test;

  beforeEach(async function() {
    test = new BaseTest();
    await test.beforeEach(this.currentTest.title);
    // Setup code
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED';
    await test.afterEach(testStatus);
  });

  it('should test specific functionality', async function() {
    // Test implementation
    await test.navigateToApp('/some-page');
    await test.verifyElementDisplayed(By.css('.element'), 'Element description');
    // Assertions
  });
});
```

### Best Practices

1. **Use Page Object Pattern**: Encapsulate page elements and actions
2. **Descriptive Test Names**: Clear, specific test descriptions
3. **Independent Tests**: Each test should be independent
4. **Proper Cleanup**: Use beforeEach/afterEach hooks
5. **Meaningful Assertions**: Include descriptive assertion messages
6. **Error Handling**: Handle expected errors gracefully

### Common Utilities

```javascript
// Navigation
await test.navigateToApp('/dashboard');
await test.navigateUsingSidebar('Settings');

// Authentication
await test.loginAsAdmin();
await test.loginAsUser();
await test.logout();

// Element interactions
await test.verifyElementDisplayed(locator, 'description');
await test.fillFormField(locator, value, 'field name');
await test.clickAndWait(locator, waitCondition, 'button name');

// Screenshots and debugging
await test.takeDocumentationScreenshot('feature-overview');
await test.verifyNoConsoleErrors();
```

## 🔧 Browser Support

### Supported Browsers

- **Chrome** (default)
- **Firefox**
- **Microsoft Edge**

### Browser Configuration

```javascript
// Chrome with custom options
browsers: {
  chrome: {
    options: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ]
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Application not running**
   ```
   Error: Application is not running
   Solution: Start the EcoWasteConnect application before running tests
   ```

2. **WebDriver not found**
   ```
   Error: WebDriver executable not found
   Solution: Run npm run webdriver:install
   ```

3. **Element not found**
   ```
   Error: Element not found
   Solution: Check selectors and wait conditions
   ```

4. **Timeout errors**
   ```
   Error: Timeout waiting for element
   Solution: Increase timeout or check element selectors
   ```

### Debug Commands

```bash
# Check application health
curl http://localhost:8080
curl http://localhost:5000/api/health

# Verify test configuration
node -e "console.log(require('./config/testConfig'))"

# Test WebDriver setup
node -e "const WDM = require('./utils/webDriverManager'); new WDM().createDriver('chrome')"
```

## 📈 Performance Considerations

### Parallel Execution

```bash
# Run tests in parallel (faster execution)
npm test -- --parallel 3
```

### Optimization Tips

1. **Use headless mode** for faster execution
2. **Run specific suites** instead of all tests
3. **Use parallel execution** for large test suites
4. **Optimize selectors** for better performance
5. **Minimize unnecessary waits**

## 🤝 Contributing

### Adding New Tests

1. Create test file in appropriate directory
2. Follow naming convention: `*.test.js`
3. Use BaseTest class for common functionality
4. Add proper documentation and comments
5. Test locally before committing

### Test Categories

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **System Tests**: End-to-end functionality
- **Regression Tests**: Verify existing functionality
- **Smoke Tests**: Basic functionality verification

## 📝 License

This testing framework is part of the EcoWasteConnect project and follows the same license terms.

---

For more information or support, please refer to the main project documentation or contact the development team.
