#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const testConfig = require('./config/testConfig');
const logger = require('./utils/logger');
const { setupTests } = require('./setup/setupTests');
const { teardownTests } = require('./setup/teardownTests');

/**
 * Main test runner for EcoWasteConnect testing suite
 */
class TestRunner {
  constructor() {
    this.testSuites = {
      auth: 'tests/auth/*.test.js',
      admin: 'tests/admin/*.test.js',
      user: 'tests/user/*.test.js',
      api: 'tests/api/*.test.js',
      e2e: 'tests/e2e/*.test.js',
      smoke: 'tests/smoke/*.test.js'
    };
    
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      duration: 0,
      suites: {}
    };
  }

  /**
   * Parse command line arguments
   */
  parseArguments() {
    const args = process.argv.slice(2);
    const options = {
      suite: 'all',
      browser: testConfig.defaultBrowser,
      headless: false,
      parallel: false,
      maxParallel: 3,
      grep: null,
      timeout: 30000,
      reporter: 'spec',
      bail: false,
      setup: true,
      teardown: true
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      switch (arg) {
        case '--suite':
        case '-s':
          options.suite = args[++i];
          break;
        case '--browser':
        case '-b':
          options.browser = args[++i];
          break;
        case '--headless':
        case '-h':
          options.headless = true;
          break;
        case '--parallel':
        case '-p':
          options.parallel = true;
          if (args[i + 1] && !args[i + 1].startsWith('-')) {
            options.maxParallel = parseInt(args[++i]);
          }
          break;
        case '--grep':
        case '-g':
          options.grep = args[++i];
          break;
        case '--timeout':
        case '-t':
          options.timeout = parseInt(args[++i]);
          break;
        case '--reporter':
        case '-r':
          options.reporter = args[++i];
          break;
        case '--bail':
          options.bail = true;
          break;
        case '--no-setup':
          options.setup = false;
          break;
        case '--no-teardown':
          options.teardown = false;
          break;
        case '--help':
          this.showHelp();
          process.exit(0);
          break;
        default:
          if (arg.startsWith('-')) {
            console.error(`Unknown option: ${arg}`);
            this.showHelp();
            process.exit(1);
          }
      }
    }

    return options;
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(`
🧪 EcoWasteConnect Test Runner

Usage: node testRunner.js [options]

Options:
  -s, --suite <name>       Test suite to run (auth, admin, user, api, e2e, smoke, all) [default: all]
  -b, --browser <name>     Browser to use (chrome, firefox, edge) [default: chrome]
  -h, --headless           Run in headless mode
  -p, --parallel [count]   Run tests in parallel [default: 3]
  -g, --grep <pattern>     Only run tests matching pattern
  -t, --timeout <ms>       Test timeout in milliseconds [default: 30000]
  -r, --reporter <name>    Mocha reporter (spec, json, mochawesome) [default: spec]
  --bail                   Stop on first test failure
  --no-setup               Skip test environment setup
  --no-teardown            Skip test environment teardown
  --help                   Show this help message

Examples:
  node testRunner.js                           # Run all tests
  node testRunner.js -s auth                   # Run only authentication tests
  node testRunner.js -b firefox -h             # Run in Firefox headless mode
  node testRunner.js -p 5                      # Run with 5 parallel processes
  node testRunner.js -g "login"                # Run only tests matching "login"
  node testRunner.js -s admin --bail           # Run admin tests, stop on first failure

Test Suites:
  auth     - Authentication and authorization tests
  admin    - Admin dashboard and management tests
  user     - User dashboard and functionality tests
  api      - Backend API tests
  e2e      - End-to-end workflow tests
  smoke    - Quick smoke tests for basic functionality
  all      - All test suites
`);
  }

  /**
   * Set environment variables based on options
   */
  setEnvironment(options) {
    process.env.BROWSER = options.browser;
    process.env.HEADLESS = options.headless.toString();
    process.env.PARALLEL = options.parallel.toString();
    process.env.MAX_PARALLEL = options.maxParallel.toString();
    
    logger.info(`🔧 Environment configured:`);
    logger.info(`   Browser: ${options.browser}`);
    logger.info(`   Headless: ${options.headless}`);
    logger.info(`   Parallel: ${options.parallel} (max: ${options.maxParallel})`);
    logger.info(`   Base URL: ${testConfig.baseUrl}`);
    logger.info(`   API URL: ${testConfig.apiUrl}`);
  }

  /**
   * Get test files for specified suite
   */
  getTestFiles(suite) {
    if (suite === 'all') {
      return Object.values(this.testSuites);
    }
    
    if (this.testSuites[suite]) {
      return [this.testSuites[suite]];
    }
    
    throw new Error(`Unknown test suite: ${suite}. Available suites: ${Object.keys(this.testSuites).join(', ')}`);
  }

  /**
   * Run mocha tests
   */
  async runMochaTests(testFiles, options) {
    return new Promise((resolve, reject) => {
      const mochaArgs = [
        '--timeout', options.timeout.toString(),
        '--reporter', options.reporter
      ];
      
      if (options.grep) {
        mochaArgs.push('--grep', options.grep);
      }
      
      if (options.bail) {
        mochaArgs.push('--bail');
      }
      
      if (options.reporter === 'mochawesome') {
        mochaArgs.push('--reporter-options', `reportDir=${testConfig.paths.reports},reportFilename=test-report`);
      }
      
      // Add test files
      testFiles.forEach(pattern => {
        const files = this.expandGlob(pattern);
        mochaArgs.push(...files);
      });
      
      logger.info(`🚀 Running tests with Mocha: ${mochaArgs.join(' ')}`);
      
      const startTime = Date.now();
      const mocha = spawn('npx', ['mocha', ...mochaArgs], {
        cwd: __dirname,
        stdio: 'inherit',
        env: { ...process.env }
      });
      
      mocha.on('close', (code) => {
        const duration = Date.now() - startTime;
        this.results.duration = duration;
        
        if (code === 0) {
          logger.info(`✅ Tests completed successfully in ${duration}ms`);
          resolve({ success: true, code, duration });
        } else {
          logger.error(`❌ Tests failed with exit code ${code} after ${duration}ms`);
          resolve({ success: false, code, duration });
        }
      });
      
      mocha.on('error', (error) => {
        logger.error('❌ Failed to start test process:', error);
        reject(error);
      });
    });
  }

  /**
   * Expand glob pattern to actual file paths
   */
  expandGlob(pattern) {
    const glob = require('glob');
    try {
      return glob.sync(pattern, { cwd: __dirname });
    } catch (error) {
      logger.warning(`Could not expand glob pattern ${pattern}: ${error.message}`);
      return [];
    }
  }

  /**
   * Generate test execution report
   */
  generateReport(options, result) {
    const reportData = {
      timestamp: new Date().toISOString(),
      configuration: {
        suite: options.suite,
        browser: options.browser,
        headless: options.headless,
        parallel: options.parallel,
        maxParallel: options.maxParallel,
        grep: options.grep,
        timeout: options.timeout
      },
      execution: {
        success: result.success,
        exitCode: result.code,
        duration: result.duration,
        durationFormatted: this.formatDuration(result.duration)
      },
      environment: {
        baseUrl: testConfig.baseUrl,
        apiUrl: testConfig.apiUrl,
        nodeVersion: process.version,
        platform: process.platform
      },
      artifacts: {
        screenshots: testConfig.paths.screenshots,
        logs: testConfig.paths.logs,
        reports: testConfig.paths.reports
      }
    };
    
    const reportFile = path.join(testConfig.paths.reports, 'execution-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    
    logger.info(`📊 Test execution report saved: ${reportFile}`);
    return reportData;
  }

  /**
   * Format duration in a human-readable way
   */
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Main execution method
   */
  async run() {
    const startTime = Date.now();
    let setupSuccess = false;
    let testResult = { success: false, code: 1, duration: 0 };
    
    try {
      logger.info('🧪 Starting EcoWasteConnect Test Suite');
      
      // Parse command line arguments
      const options = this.parseArguments();
      
      // Set up environment
      this.setEnvironment(options);
      
      // Run setup if requested
      if (options.setup) {
        logger.info('🔧 Running test environment setup...');
        await setupTests();
        setupSuccess = true;
      }
      
      // Get test files
      const testFiles = this.getTestFiles(options.suite);
      logger.info(`📁 Test files: ${testFiles.join(', ')}`);
      
      // Run tests
      testResult = await this.runMochaTests(testFiles, options);
      
      // Generate report
      this.generateReport(options, testResult);
      
    } catch (error) {
      logger.error('❌ Test execution failed:', error);
      testResult = { success: false, code: 1, duration: Date.now() - startTime };
    } finally {
      // Run teardown if setup was successful and teardown is requested
      if (setupSuccess && this.parseArguments().teardown) {
        try {
          logger.info('🧹 Running test environment teardown...');
          await teardownTests();
        } catch (error) {
          logger.error('❌ Teardown failed:', error);
        }
      }
      
      // Final summary
      const totalDuration = Date.now() - startTime;
      logger.info(`🏁 Test suite completed in ${this.formatDuration(totalDuration)}`);
      
      if (testResult.success) {
        logger.info('✅ All tests passed successfully!');
        process.exit(0);
      } else {
        logger.error('❌ Some tests failed. Check the logs for details.');
        process.exit(testResult.code);
      }
    }
  }
}

// Run the test runner if this script is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;
