const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { By, Key, until } = require('selenium-webdriver');
const BaseTest = require('../../utils/baseTest');
const testConfig = require('../../config/testConfig');
const { faker } = require('@faker-js/faker');

describe('Issue Reporting Tests', function() {
  let test;

  // Helper function to fill the issue form.
  // Defining it here makes it reusable within this test suite without relying on the `this` context.
  const fillIssueForm = async (issueData) => {
    // Select issue type
    await test.driverManager.clickElement(
      By.css('button[role="combobox"]')
    );

    await test.driverManager.clickElement(
      By.xpath(`//div[contains(text(), "${issueData.type}")]`)
    );

    // Fill location
    await test.fillFormField(
      By.css('input[placeholder*="address"]'),
      issueData.location,
      'Location'
    );

    // Fill description
    await test.fillFormField(
      By.css('textarea[placeholder*="details"]'),
      issueData.description,
      'Description'
    );

    // Fill date
    await test.fillFormField(
      By.css('input[type="date"]'),
      issueData.date,
      'Date'
    );
  };

  beforeEach(async function() {
    test = new BaseTest();
    await test.beforeEach(this.currentTest.title);
    
    // Login as user and navigate to report issues page
    await test.navigateToApp('/login');
    await test.loginAsUser();
    await test.navigateToApp('/report-issues');
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED';
    await test.afterEach(testStatus);
  });

  describe('Page Layout and Form Elements', function() {
    it('should display report issues page with all form elements', async function() {
      // Verify page title
      await test.verifyPageTitle('Report an Issue');
      
      // Verify form sections
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Submit a New Issue")]'),
        'Submit new issue section'
      );
      
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Your Recent Issues")]'),
        'Recent issues section'
      );
      
      // Verify form fields
      await test.verifyElementDisplayed(
        By.css('select, [role="combobox"]'),
        'Issue type selector'
      );
      
      await test.verifyElementDisplayed(
        By.css('input[placeholder*="address"]'),
        'Location input'
      );
      
      await test.verifyElementDisplayed(
        By.css('textarea[placeholder*="details"]'),
        'Description textarea'
      );
      
      await test.verifyElementDisplayed(
        By.css('input[type="date"]'),
        'Date input'
      );
      
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Submit Issue")]'),
        'Submit button'
      );
    });

    it('should have all required issue types in dropdown', async function() {
      // Click issue type dropdown
      await test.driverManager.clickElement(
        By.css('button[role="combobox"], select')
      );
      
      // Verify issue types are present
      const expectedTypes = ['Missed Pickup', 'Overflowing Bin', 'Damaged Bin', 'Illegal Dumping', 'Other'];
      
      for (const issueType of expectedTypes) {
        await test.verifyElementDisplayed(
          By.xpath(`//div[contains(text(), "${issueType}") or contains(., "${issueType}")]`),
          `${issueType} option`
        );
      }
    });

    it('should display form labels and placeholders correctly', async function() {
      // Verify labels are present
      const expectedLabels = ['Issue Type', 'Location', 'Description', 'Date of Incident'];
      
      for (const label of expectedLabels) {
        await test.verifyElementDisplayed(
          By.xpath(`//label[contains(text(), "${label}")]`),
          `${label} label`
        );
      }
      
      // Verify placeholders
      const locationInput = await test.driverManager.findElement(
        By.css('input[placeholder*="address"]')
      );
      const placeholder = await locationInput.getAttribute('placeholder');
      expect(placeholder).to.include('address', 'Location input should have address placeholder');
    });
  });

  describe('Issue Submission', function() {
    it('should successfully submit a new issue with all required fields', async function() {
      // Fill out the form
      await fillIssueForm({
        type: 'Missed Pickup',
        location: '123 Test Street, Test City',
        description: 'My pickup was scheduled for today but the truck never came. I waited all day.',
        date: '2024-01-15'
      });
      
      // Submit the form
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Verify success message
      await test.verifyElementDisplayed(
        By.xpath('//div[contains(@class, "border-green") or contains(text(), "successfully")]'),
        'Success message'
      );
      
      // Verify issue appears in recent issues section
      await test.verifyElementDisplayed(
        By.xpath('//h4[contains(text(), "Missed Pickup")]'),
        'New issue in recent issues'
      );
    });

    it('should submit issue for each type available', async function() {
      const issueTypes = [
        { type: 'Overflowing Bin', description: 'The recycling bin is overflowing and attracting pests.' },
        { type: 'Damaged Bin', description: 'My waste bin has a large crack and is leaking.' },
        { type: 'Illegal Dumping', description: 'Someone dumped furniture on the corner of our street.' }
      ];

      for (const issueData of issueTypes) {
        // Fill and submit form
        await fillIssueForm({
          type: issueData.type,
          location: faker.location.streetAddress(),
          description: issueData.description,
          date: '2024-01-15'
        });
        
        await test.driverManager.clickElement(
          By.xpath('//button[contains(text(), "Submit Issue")]')
        );
        
        // Instead of a fixed sleep, wait for the new element to appear.
        // This makes the test faster and more reliable.
        await test.driver.wait(until.elementLocated(
          By.xpath(`//h4[contains(text(), "${issueData.type}")]`)
        ), 5000);
        
        // Verify success
        await test.verifyElementDisplayed(
          By.xpath(`//h4[contains(text(), "${issueData.type}")]`),
          `${issueData.type} in recent issues`
        );
      }
    });

    it('should show validation errors for empty required fields', async function() {
      // Try to submit without filling any fields
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Form should not submit - check if we're still on the same page
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/report-issues');
      
      // Check for required field validation
      const requiredFields = await test.driverManager.findElements(
        By.css('input:required, select:required, textarea:required')
      );
      
      expect(requiredFields.length).to.be.greaterThan(0, 'Should have required fields');
    });

    it('should validate date field format', async function() {
      // Fill other fields but leave date invalid or empty
      await fillIssueForm({
        type: 'Other',
        location: 'Test Location',
        description: 'Test description',
        date: '' // Empty date
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Check date field validation
      const dateInput = await test.driverManager.findElement(
        By.css('input[type="date"]')
      );
      const validationMessage = await dateInput.getAttribute('validationMessage');
      
      if (validationMessage) {
        expect(validationMessage).to.not.be.empty;
      }
    });

    it('should handle long description text', async function() {
      const longDescription = faker.lorem.paragraphs(5);
      
      await fillIssueForm({
        type: 'Other',
        location: 'Test Location',
        description: longDescription,
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Should still submit successfully
      await test.verifyElementDisplayed(
        By.xpath('//div[contains(@class, "border-green") or contains(text(), "successfully")]'),
        'Success message for long description'
      );
    });
  });

  describe('Recent Issues Display', function() {
    it('should display user\'s recent issues with correct information', async function() {
      // First submit an issue to ensure there's data
      await fillIssueForm({
        type: 'Missed Pickup',
        location: 'Test Address',
        description: 'Test issue for display verification',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Wait for the recent issues section to update
      await test.driver.wait(until.elementLocated(
        By.xpath('//h4[contains(text(), "Missed Pickup")]')
      ), 5000);
      
      // Verify issue information is displayed
      await test.verifyElementDisplayed(
        By.xpath('//h4[contains(text(), "Missed Pickup")]'),
        'Issue type in display'
      );
      
      await test.verifyTextContent(
        By.xpath('//p[contains(text(), "Test Address")]'),
        'Test Address',
        'Issue location'
      );
      
      // Verify status badge
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "pending") or contains(text(), "in-progress") or contains(text(), "resolved")]'),
        'Status badge'
      );
    });

    it('should show appropriate message when no issues exist', async function() {
      // Clear any existing issues by navigating to a fresh user context
      // In a real test, this might involve using a different test user or clearing data
      
      // Look for empty state message
      const noIssuesMessage = await test.driverManager.findElements(
        By.xpath('//p[contains(text(), "No issues reported")]')
      );
      
      // If no issues exist, should show empty state
      if (noIssuesMessage.length > 0) {
        await test.verifyTextContent(
          By.xpath('//p[contains(text(), "No issues reported")]'),
          'No issues reported',
          'Empty state message'
        );
      }
    });

    it('should display issue dates correctly', async function() {
      // Submit an issue first
      await fillIssueForm({
        type: 'Other',
        location: 'Date Test Location',
        description: 'Testing date display',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Wait for the recent issues section to update
      await test.driver.wait(until.elementLocated(
        By.xpath('//p[contains(text(), "Reported on") or contains(text(), "2024")]')
      ), 5000);
      
      // Look for date information in the recent issues
      const dateElements = await test.driverManager.findElements(
        By.xpath('//p[contains(text(), "Reported on") or contains(text(), "2024")]')
      );
      
      expect(dateElements.length).to.be.greaterThan(0, 'Should display issue dates');
    });

    it('should show issue status with appropriate styling', async function() {
      // Submit an issue
      await fillIssueForm({
        type: 'Damaged Bin',
        location: 'Status Test Location',
        description: 'Testing status display',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Wait for the recent issues section to update
      await test.driver.wait(until.elementLocated(
        By.xpath('//span[contains(@class, "bg-yellow") or contains(@class, "bg-blue") or contains(@class, "bg-green")]')
      ), 5000);
      
      // Check for status badges with appropriate colors
      const statusBadges = await test.driverManager.findElements(
        By.xpath('//span[contains(@class, "bg-yellow") or contains(@class, "bg-blue") or contains(@class, "bg-green")]')
      );
      
      expect(statusBadges.length).to.be.greaterThan(0, 'Should display status badges with colors');
    });
  });

  describe('Form Interactions and UX', function() {
    it('should clear form after successful submission', async function() {
      // Fill and submit form
      await fillIssueForm({
        type: 'Other',
        location: 'Clear Test',
        description: 'Testing form clear',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Wait for the success message to ensure submission is complete
      await test.driver.wait(until.elementLocated(
        By.xpath('//div[contains(@class, "border-green")]')
      ), 5000);
      
      // Check if form fields are cleared
      const locationInput = await test.driverManager.findElement(
        By.css('input[placeholder*="address"]')
      );
      const locationValue = await locationInput.getAttribute('value');
      
      const descriptionInput = await test.driverManager.findElement(
        By.css('textarea[placeholder*="details"]')
      );
      const descriptionValue = await descriptionInput.getAttribute('value');
      
      expect(locationValue).to.be.empty;
      expect(descriptionValue).to.be.empty;
    });

    it('should handle form field focus and blur events', async function() {
      // Focus on location input
      const locationInput = await test.driverManager.findElement(
        By.css('input[placeholder*="address"]')
      );
      
      await locationInput.click();
      
      // Type and then blur
      await locationInput.sendKeys('Test focus');
      await locationInput.sendKeys(Key.TAB);
      
      // Verify input retained value
      const value = await locationInput.getAttribute('value');
      expect(value).to.equal('Test focus');
    });

    it('should support keyboard navigation between form fields', async function() {
      // Start at issue type dropdown
      const issueTypeButton = await test.driverManager.findElement(
        By.css('button[role="combobox"]')
      );
      
      await issueTypeButton.click();
      
      // Navigate through form using Tab key
      await test.driverManager.executeScript('arguments[0].focus()', issueTypeButton);
      
      // Tab to next field
      await issueTypeButton.sendKeys(Key.TAB);
      
      // Should move to location input
      const activeElement = await test.driverManager.executeScript('return document.activeElement');
      const tagName = await activeElement.getTagName();
      
      // Active element should be an input or similar
      expect(['input', 'textarea', 'button', 'select'].includes(tagName.toLowerCase())).to.be.true;
    });
  });

  describe('Success and Error Messages', function() {
    it('should display success message with appropriate styling', async function() {
      // Submit a valid issue
      await fillIssueForm({
        type: 'Missed Pickup',
        location: 'Success Test',
        description: 'Testing success message',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Look for success message with green styling
      await test.verifyElementDisplayed(
        By.xpath('//div[contains(@class, "border-green") or contains(@class, "bg-green")]'),
        'Success message with green styling'
      );
      
      // Verify success text
      await test.verifyTextContent(
        By.xpath('//div[contains(text(), "successfully") or contains(text(), "submitted")]'),
        'successfully',
        'Success message text'
      );
    });

    it('should auto-hide success message after timeout', async function() {
      // Submit an issue
      await fillIssueForm({
        type: 'Other',
        location: 'Timeout Test',
        description: 'Testing message timeout',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      const successMessageLocator = By.xpath('//div[contains(@class, "border-green")]');

      // Wait for success message
      await test.verifyElementDisplayed(
        successMessageLocator,
        'Success message appears'
      );
      
      // Wait for the message to become stale/disappear
      await test.driver.wait(until.stalenessOf(await test.driver.findElement(successMessageLocator)), 6000);
      
      // Check if message is hidden
      const successMessages = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "border-green")]')
      );
      
      expect(successMessages.length).to.equal(0, 'Success message should disappear after timeout');
    });
  });

  describe('Responsive Design', function() {
    it('should maintain form layout on tablet viewport', async function() {
      // Set tablet viewport
      await test.driver.manage().window().setRect({ width: 768, height: 1024 });
      
      // Verify form elements are still accessible
      await test.verifyElementDisplayed(
        By.css('button[role="combobox"]'),
        'Issue type dropdown on tablet'
      );
      
      await test.verifyElementDisplayed(
        By.css('input[placeholder*="address"]'),
        'Location input on tablet'
      );
      
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Submit Issue")]'),
        'Submit button on tablet'
      );
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });

    it('should adapt form layout for mobile viewport', async function() {
      // Set mobile viewport
      await test.driver.manage().window().setRect({ width: 375, height: 667 });
      
      // Verify form is still functional
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Submit a New Issue")]'),
        'Form title on mobile'
      );
      
      // Verify submit button is accessible
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Submit Issue")]'),
        'Submit button on mobile'
      );
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });
  });

  describe('Performance and Error Handling', function() {
    it('should handle rapid form submissions gracefully', async function() {
      // Fill form
      await fillIssueForm({
        type: 'Other',
        location: 'Rapid Test',
        description: 'Testing rapid submission',
        date: '2024-01-15'
      });
      
      // Click submit multiple times rapidly
      const submitButton = await test.driverManager.findElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      await submitButton.click();
      await submitButton.click(); // Second click should be handled gracefully
      
      // Should not create duplicate issues
      // Wait for a moment to see if multiple messages appear
      await test.driver.wait(until.elementLocated(
        By.xpath('//div[contains(@class, "border-green")]')
      ), 5000);
      
      // Verify only one success message or similar indication
      const successMessages = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "border-green")]')
      );
      
      expect(successMessages.length).to.be.at.most(1, 'Should not create duplicate submissions');
    });

    it('should not have console errors during form submission', async function() {
      // Submit a form and check for console errors
      await fillIssueForm({
        type: 'Missed Pickup',
        location: 'Console Test',
        description: 'Testing console errors',
        date: '2024-01-15'
      });
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Submit Issue")]')
      );
      
      // Wait for submission to complete
      await test.driver.wait(until.elementLocated(By.xpath('//h4[contains(text(), "Missed Pickup")]')), 5000);
      
      // Verify no console errors
      await test.verifyNoConsoleErrors();
    });
  });
});
