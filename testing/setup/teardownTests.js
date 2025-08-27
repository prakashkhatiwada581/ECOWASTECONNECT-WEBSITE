const fs = require('fs');
const path = require('path');
const testConfig = require('../config/testConfig');
const logger = require('../utils/logger');

/**
 * Teardown script to clean up after testing
 */
async function teardownTests() {
  try {
    logger.teardownStart('Cleaning up test environment');
    
    // Generate test summary report
    generateTestSummary();
    
    // Archive test artifacts
    archiveTestArtifacts();
    
    // Clean up temporary files
    cleanupTempFiles();
    
    // Close any remaining processes
    await closeRemainingProcesses();
    
    logger.info('✅ Test environment teardown completed successfully');
    
  } catch (error) {
    logger.error('❌ Test environment teardown failed:', error);
    process.exit(1);
  }
}

/**
 * Generate summary report of test execution
 */
function generateTestSummary() {
  try {
    const reportsDir = testConfig.paths.reports;
    const summaryFile = path.join(reportsDir, 'test-execution-summary.json');
    
    // Collect test artifacts
    const screenshots = getFileCount(testConfig.paths.screenshots, '.png');
    const logFiles = getFileCount(testConfig.paths.logs, '.log');
    const reportFiles = getFileCount(reportsDir, '.json');
    
    const summary = {
      executionDate: new Date().toISOString(),
      environment: {
        baseUrl: testConfig.baseUrl,
        browser: testConfig.defaultBrowser,
        headless: testConfig.browsers[testConfig.defaultBrowser].headless
      },
      artifacts: {
        screenshots: screenshots,
        logFiles: logFiles,
        reportFiles: reportFiles
      },
      paths: {
        screenshots: testConfig.paths.screenshots,
        logs: testConfig.paths.logs,
        reports: reportsDir
      }
    };
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    logger.info(`📋 Generated test summary: ${summaryFile}`);
    
  } catch (error) {
    logger.error('Failed to generate test summary:', error);
  }
}

/**
 * Archive test artifacts for historical reference
 */
function archiveTestArtifacts() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveDir = path.join(testConfig.paths.reports, 'archives', timestamp);
    
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    
    // Archive important files
    const filesToArchive = [
      { src: testConfig.paths.logs, dest: path.join(archiveDir, 'logs') },
      { src: testConfig.paths.screenshots, dest: path.join(archiveDir, 'screenshots') }
    ];
    
    filesToArchive.forEach(({ src, dest }) => {
      if (fs.existsSync(src)) {
        copyDirectory(src, dest);
        logger.info(`📦 Archived ${src} to ${dest}`);
      }
    });
    
  } catch (error) {
    logger.error('Failed to archive test artifacts:', error);
  }
}

/**
 * Clean up temporary files and directories
 */
function cleanupTempFiles() {
  try {
    const tempDirs = [
      testConfig.paths.downloads
    ];
    
    tempDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          try {
            if (fs.statSync(filePath).isDirectory()) {
              fs.rmSync(filePath, { recursive: true });
            } else {
              fs.unlinkSync(filePath);
            }
            logger.debug(`🗑️ Cleaned up: ${filePath}`);
          } catch (error) {
            logger.warning(`Could not clean up ${filePath}: ${error.message}`);
          }
        });
      }
    });
    
    logger.info('🧹 Temporary files cleaned up');
    
  } catch (error) {
    logger.error('Failed to clean up temporary files:', error);
  }
}

/**
 * Close any remaining browser processes or WebDriver instances
 */
async function closeRemainingProcesses() {
  try {
    // This would typically involve checking for and killing any remaining
    // browser or WebDriver processes that might be hanging
    
    if (process.platform === 'win32') {
      // Windows specific cleanup
      const { exec } = require('child_process');
      exec('taskkill /f /im chrome.exe /t', () => {});
      exec('taskkill /f /im firefox.exe /t', () => {});
      exec('taskkill /f /im msedge.exe /t', () => {});
      exec('taskkill /f /im chromedriver.exe /t', () => {});
      exec('taskkill /f /im geckodriver.exe /t', () => {});
    } else {
      // Unix-like systems
      const { exec } = require('child_process');
      exec('pkill -f chrome', () => {});
      exec('pkill -f firefox', () => {});
      exec('pkill -f chromedriver', () => {});
      exec('pkill -f geckodriver', () => {});
    }
    
    logger.info('🔄 Attempted to close remaining browser processes');
    
  } catch (error) {
    logger.warning('Could not clean up browser processes:', error.message);
  }
}

/**
 * Utility function to count files with specific extension
 */
function getFileCount(directory, extension) {
  if (!fs.existsSync(directory)) {
    return 0;
  }
  
  try {
    const files = fs.readdirSync(directory);
    return files.filter(file => file.endsWith(extension)).length;
  } catch (error) {
    logger.warning(`Could not count files in ${directory}: ${error.message}`);
    return 0;
  }
}

/**
 * Utility function to copy directory recursively
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

/**
 * Generate HTML report from test results
 */
function generateHTMLReport() {
  try {
    const reportsDir = testConfig.paths.reports;
    const htmlReportPath = path.join(reportsDir, 'test-report.html');
    
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EcoWasteConnect Test Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 20px; border-radius: 8px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .success { color: #10b981; }
            .error { color: #ef4444; }
            .warning { color: #f59e0b; }
            .artifact-list { list-style-type: none; padding: 0; }
            .artifact-list li { padding: 5px 0; }
            .footer { text-align: center; color: #6b7280; margin-top: 40px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🧪 EcoWasteConnect Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="section">
            <h2>📋 Test Execution Summary</h2>
            <p><strong>Environment:</strong> ${testConfig.baseUrl}</p>
            <p><strong>Browser:</strong> ${testConfig.defaultBrowser}</p>
            <p><strong>Headless Mode:</strong> ${testConfig.browsers[testConfig.defaultBrowser].headless}</p>
        </div>
        
        <div class="section">
            <h2>📁 Generated Artifacts</h2>
            <ul class="artifact-list">
                <li>📸 Screenshots: ${getFileCount(testConfig.paths.screenshots, '.png')} files</li>
                <li>📄 Log Files: ${getFileCount(testConfig.paths.logs, '.log')} files</li>
                <li>📊 Reports: ${getFileCount(reportsDir, '.json')} files</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>📂 Artifact Locations</h2>
            <ul class="artifact-list">
                <li><strong>Screenshots:</strong> ${testConfig.paths.screenshots}</li>
                <li><strong>Logs:</strong> ${testConfig.paths.logs}</li>
                <li><strong>Reports:</strong> ${reportsDir}</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>EcoWasteConnect Testing Suite v1.0.0</p>
        </div>
    </body>
    </html>
    `;
    
    fs.writeFileSync(htmlReportPath, htmlTemplate);
    logger.info(`📄 Generated HTML report: ${htmlReportPath}`);
    
  } catch (error) {
    logger.error('Failed to generate HTML report:', error);
  }
}

// Run teardown if this script is executed directly
if (require.main === module) {
  teardownTests().catch(error => {
    console.error('Teardown failed:', error);
    process.exit(1);
  });
}

module.exports = {
  teardownTests,
  generateTestSummary,
  archiveTestArtifacts,
  cleanupTempFiles,
  closeRemainingProcesses,
  generateHTMLReport
};
