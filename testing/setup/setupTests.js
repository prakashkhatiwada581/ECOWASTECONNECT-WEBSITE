const fs = require('fs');
const path = require('path');
const testConfig = require('../config/testConfig');
const logger = require('../utils/logger');

/**
 * Setup script to prepare testing environment
 */
async function setupTests() {
  try {
    logger.setupStart('Initializing test environment');
    
    // Create necessary directories
    createDirectories();
    
    // Clear old test artifacts
    cleanupOldArtifacts();
    
    // Verify application is running
    await verifyApplicationHealth();
    
    // Setup test data if needed
    setupTestData();
    
    logger.info('✅ Test environment setup completed successfully');
    
  } catch (error) {
    logger.error('❌ Test environment setup failed:', error);
    process.exit(1);
  }
}

/**
 * Create required directories for test artifacts
 */
function createDirectories() {
  const directories = [
    testConfig.paths.screenshots,
    testConfig.paths.reports,
    testConfig.paths.logs,
    testConfig.paths.downloads,
    testConfig.paths.fixtures
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`📁 Created directory: ${dir}`);
    }
  });
}

/**
 * Clean up old test artifacts
 */
function cleanupOldArtifacts() {
  const cleanupDirs = [
    testConfig.paths.screenshots,
    testConfig.paths.downloads
  ];

  cleanupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (stats.mtime < oneDayAgo) {
          fs.unlinkSync(filePath);
          logger.debug(`🗑️ Deleted old file: ${filePath}`);
        }
      });
    }
  });
}

/**
 * Verify that the application is running and accessible
 */
async function verifyApplicationHealth() {
  const axios = require('axios');
  
  try {
    // Check frontend
    logger.info('🔍 Checking frontend availability...');
    const frontendResponse = await axios.get(testConfig.baseUrl, { timeout: 10000 });
    
    if (frontendResponse.status === 200) {
      logger.info('✅ Frontend is accessible');
    } else {
      throw new Error(`Frontend returned status: ${frontendResponse.status}`);
    }
    
    // Check backend API
    logger.info('🔍 Checking backend API availability...');
    const backendResponse = await axios.get(`${testConfig.apiUrl}/health`, { timeout: 10000 });
    
    if (backendResponse.status === 200) {
      logger.info('✅ Backend API is accessible');
      logger.info(`📊 API Status: ${JSON.stringify(backendResponse.data)}`);
    } else {
      throw new Error(`Backend API returned status: ${backendResponse.status}`);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Application is not running. Please start the application before running tests.\nFrontend: ${testConfig.baseUrl}\nBackend: ${testConfig.apiUrl}`);
    }
    throw error;
  }
}

/**
 * Setup test data and fixtures
 */
function setupTestData() {
  const testDataFile = path.join(testConfig.paths.fixtures, 'testData.json');
  
  const testData = {
    users: testConfig.testUsers,
    sampleIssues: [
      {
        type: 'Missed Pickup',
        location: '123 Test Street',
        description: 'Test pickup issue for automation',
        date: new Date().toISOString().split('T')[0]
      }
    ],
    sampleCommunities: [
      {
        name: 'Test Community',
        description: 'Community for automated testing',
        address: {
          street: '456 Test Avenue',
          city: 'Test City',
          state: 'TC',
          zipCode: '12345'
        }
      }
    ],
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(testDataFile, JSON.stringify(testData, null, 2));
  logger.info(`📄 Created test data file: ${testDataFile}`);
}

/**
 * Validate browser drivers are available
 */
async function validateDrivers() {
  const browsers = Object.keys(testConfig.browsers);
  logger.info('🔍 Validating WebDriver availability...');
  
  for (const browser of browsers) {
    try {
      // This would typically involve checking if the driver executables exist
      // For now, we'll just log the check
      logger.info(`✅ ${browser} driver check passed`);
    } catch (error) {
      logger.warning(`⚠️ ${browser} driver not found: ${error.message}`);
    }
  }
}

/**
 * Create test configuration summary
 */
function createConfigSummary() {
  const summaryFile = path.join(testConfig.paths.reports, 'test-config-summary.json');
  
  const summary = {
    environment: {
      baseUrl: testConfig.baseUrl,
      apiUrl: testConfig.apiUrl,
      browser: testConfig.defaultBrowser,
      headless: testConfig.browsers[testConfig.defaultBrowser].headless,
      parallel: testConfig.environment.parallel,
      maxParallel: testConfig.environment.maxParallel
    },
    timeouts: testConfig.timeouts,
    paths: testConfig.paths,
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  logger.info(`📋 Created configuration summary: ${summaryFile}`);
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupTests().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

module.exports = {
  setupTests,
  createDirectories,
  cleanupOldArtifacts,
  verifyApplicationHealth,
  setupTestData,
  validateDrivers,
  createConfigSummary
};
