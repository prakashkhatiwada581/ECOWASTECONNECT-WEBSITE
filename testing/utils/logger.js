const winston = require('winston');
const path = require('path');
const fs = require('fs');
const testConfig = require('../config/testConfig');

// Ensure logs directory exists
if (!fs.existsSync(testConfig.paths.logs)) {
  fs.mkdirSync(testConfig.paths.logs, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// File format without colors
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: testConfig.environment.logLevel,
  format: fileFormat,
  defaultMeta: { service: 'ecowasteconnect-testing' },
  transports: [
    // File transports
    new winston.transports.File({
      filename: path.join(testConfig.paths.logs, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(testConfig.paths.logs, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Console transport
    new winston.transports.Console({
      format: logFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    })
  ]
});

// Test-specific logging methods
logger.testStart = (testName, browser = '') => {
  logger.info(`🧪 TEST STARTED: ${testName} ${browser ? `[${browser}]` : ''}`);
};

logger.testEnd = (testName, status = 'PASSED', duration = '') => {
  const emoji = status === 'PASSED' ? '✅' : '❌';
  logger.info(`${emoji} TEST ${status}: ${testName} ${duration ? `(${duration})` : ''}`);
};

logger.stepStart = (stepDescription) => {
  logger.debug(`📋 STEP: ${stepDescription}`);
};

logger.stepEnd = (stepDescription, status = 'PASSED') => {
  const emoji = status === 'PASSED' ? '✔️' : '❌';
  logger.debug(`${emoji} STEP ${status}: ${stepDescription}`);
};

logger.assertion = (description, actual, expected) => {
  logger.debug(`🔍 ASSERTION: ${description} | Actual: ${actual} | Expected: ${expected}`);
};

logger.warning = (message) => {
  logger.warn(`⚠️ WARNING: ${message}`);
};

logger.screenshot = (filePath) => {
  logger.info(`📸 SCREENSHOT: ${filePath}`);
};

logger.apiCall = (method, url, status) => {
  logger.debug(`🌐 API ${method} ${url} - Status: ${status}`);
};

logger.browserAction = (action, element = '') => {
  logger.debug(`🖱️ BROWSER: ${action} ${element ? `on ${element}` : ''}`);
};

logger.setupStart = (description) => {
  logger.info(`🔧 SETUP: ${description}`);
};

logger.teardownStart = (description) => {
  logger.info(`🧹 TEARDOWN: ${description}`);
};

module.exports = logger;
