const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');
const BaseTest = require('../../utils/baseTest');
const testConfig = require('../../config/testConfig');

describe('Service Areas Management Tests', function() {
  let test;

  beforeEach(async function() {
    test = new BaseTest();
    await test.beforeEach(this.currentTest.title);
    
    // Login as admin and navigate to service areas
    await test.navigateToApp('/login');
    await test.loginAsAdmin();
    await test.navigateToApp('/admin/areas');
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED';
    await test.afterEach(testStatus);
  });

  describe('Page Layout and Navigation', function() {
    it('should display service areas page with all key sections', async function() {
      // Verify page title
      await test.verifyPageTitle('Service Areas Management');
      
      // Verify header stats cards
      await test.verifyElementDisplayed(
        By.xpath('//p[contains(text(), "Total Areas")]'),
        'Total Areas stat card'
      );
      await test.verifyElementDisplayed(
        By.xpath('//p[contains(text(), "Active Areas")]'),
        'Active Areas stat card'
      );
      await test.verifyElementDisplayed(
        By.xpath('//p[contains(text(), "Households")]'),
        'Households stat card'
      );
      await test.verifyElementDisplayed(
        By.xpath('//p[contains(text(), "Communities")]'),
        'Communities stat card'
      );
      
      // Verify tabs
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Overview")]'),
        'Overview tab'
      );
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Coverage Map")]'),
        'Coverage Map tab'
      );
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Analytics")]'),
        'Analytics tab'
      );
    });

    it('should display search and filter controls', async function() {
      // Verify search input
      await test.verifyElementDisplayed(
        By.css('input[placeholder*="Search areas"]'),
        'Search areas input'
      );
      
      // Verify filter dropdown
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(., "All Status")]'),
        'Status filter dropdown'
      );
      
      // Verify Add Area button
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(., "Add Area")]'),
        'Add Area button'
      );
    });

    it('should switch between different tabs', async function() {
      const tabs = ['Overview', 'Coverage Map', 'Analytics'];
      
      for (const tab of tabs) {
        // Click tab
        await test.driverManager.clickElement(
          By.xpath(`//button[contains(text(), "${tab}")]`)
        );
        
        // Wait for tab content to load
        await test.driverManager.sleep(500);
        
        // Verify tab is active (implementation may vary)
        const tabButton = await test.driverManager.findElement(
          By.xpath(`//button[contains(text(), "${tab}")]`)
        );
        const tabClass = await tabButton.getAttribute('class');
        
        // Active tab should have different styling
        expect(tabClass).to.include('data-[state=active]', `${tab} tab should be active`);
      }
    });
  });

  describe('Statistics Display', function() {
    it('should show valid numbers in statistics cards', async function() {
      // Get statistics values
      const totalAreasText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Total Areas")]/following-sibling::p')
      );
      const activeAreasText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Active Areas")]/following-sibling::p')
      );
      const householdsText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Households")]/following-sibling::p')
      );
      
      // Verify all stats are valid numbers
      expect(totalAreasText).to.match(/^\d+$/, 'Total areas should be a number');
      expect(activeAreasText).to.match(/^\d+$/, 'Active areas should be a number');
      expect(householdsText).to.match(/^[\d,]+$/, 'Households should be a formatted number');
    });

    it('should display efficiency and issue metrics', async function() {
      // Verify efficiency percentage
      const efficiencyText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Avg Efficiency")]/following-sibling::p')
      );
      expect(efficiencyText).to.match(/^\d+\.\d%$/, 'Efficiency should be a percentage');
      
      // Verify open issues count
      const issuesText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Open Issues")]/following-sibling::p')
      );
      expect(issuesText).to.match(/^\d+$/, 'Open issues should be a number');
    });
  });

  describe('Service Areas List', function() {
    it('should display list of service areas with details', async function() {
      // Verify at least one service area is displayed
      const areaCards = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "bg-white")][.//h3[contains(@class, "font-bold")]]')
      );
      
      expect(areaCards.length).to.be.greaterThan(0, 'Should display service area cards');
      
      // Verify area details in first card
      if (areaCards.length > 0) {
        await test.verifyElementDisplayed(
          By.xpath('//h3[contains(@class, "font-bold")]'),
          'Area name'
        );
        await test.verifyElementDisplayed(
          By.xpath('//p[contains(@class, "text-gray-600")]'),
          'Area description'
        );
      }
    });

    it('should show area status badges', async function() {
      // Look for status badges
      const statusBadges = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "active") or contains(text(), "inactive") or contains(text(), "maintenance")]')
      );
      
      expect(statusBadges.length).to.be.greaterThan(0, 'Should display status badges');
    });

    it('should display coverage statistics for each area', async function() {
      // Look for households count
      const householdCounts = await test.driverManager.findElements(
        By.xpath('//div[contains(text(), "Households")]')
      );
      
      expect(householdCounts.length).to.be.greaterThan(0, 'Should display household counts');
      
      // Look for communities count
      const communityCounts = await test.driverManager.findElements(
        By.xpath('//div[contains(text(), "Communities")]')
      );
      
      expect(communityCounts.length).to.be.greaterThan(0, 'Should display community counts');
    });

    it('should show services offered for each area', async function() {
      // Look for service indicators
      const serviceIndicators = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "General") or contains(text(), "Recycling") or contains(text(), "Organic")]')
      );
      
      expect(serviceIndicators.length).to.be.greaterThan(0, 'Should display service indicators');
    });

    it('should display performance metrics for areas', async function() {
      // Look for efficiency percentages
      const efficiencyMetrics = await test.driverManager.findElements(
        By.xpath('//div[contains(text(), "%")]')
      );
      
      expect(efficiencyMetrics.length).to.be.greaterThan(0, 'Should display efficiency metrics');
    });
  });

  describe('Add New Service Area', function() {
    it('should open add area dialog when clicking Add Area button', async function() {
      // Click Add Area button
      await test.driverManager.clickElement(
        By.xpath('//button[contains(., "Add Area")]')
      );
      
      // Verify dialog opens
      await test.verifyElementDisplayed(
        By.xpath('//h2[contains(text(), "Add New Service Area")]'),
        'Add area dialog title'
      );
      
      // Verify form fields
      await test.verifyElementDisplayed(
        By.css('input[placeholder*="area name"]'),
        'Area name input'
      );
      await test.verifyElementDisplayed(
        By.css('textarea[placeholder*="Describe"]'),
        'Description textarea'
      );
      await test.verifyElementDisplayed(
        By.css('input[placeholder="City"]'),
        'City input'
      );
      await test.verifyElementDisplayed(
        By.css('input[placeholder="State"]'),
        'State input'
      );
    });

    it('should create new service area with valid data', async function() {
      // Open add dialog
      await test.driverManager.clickElement(
        By.xpath('//button[contains(., "Add Area")]')
      );
      
      // Fill form
      await test.fillFormField(
        By.css('input[placeholder*="area name"]'),
        'Test Service Area',
        'Area name'
      );
      await test.fillFormField(
        By.css('textarea[placeholder*="Describe"]'),
        'Test area for automated testing',
        'Description'
      );
      await test.fillFormField(
        By.css('input[placeholder="City"]'),
        'Test City',
        'City'
      );
      await test.fillFormField(
        By.css('input[placeholder="State"]'),
        'TC',
        'State'
      );
      
      // Submit form
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Create Area")]')
      );
      
      // Wait for dialog to close
      await test.driverManager.sleep(1000);
      
      // Verify new area appears in list
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Test Service Area")]'),
        'New service area in list'
      );
    });

    it('should validate required fields', async function() {
      // Open add dialog
      await test.driverManager.clickElement(
        By.xpath('//button[contains(., "Add Area")]')
      );
      
      // Try to submit without filling required fields
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Create Area")]')
      );
      
      // Verify validation (dialog should still be open)
      const dialogTitle = await test.driverManager.findElements(
        By.xpath('//h2[contains(text(), "Add New Service Area")]')
      );
      
      expect(dialogTitle.length).to.equal(1, 'Dialog should remain open for validation');
    });

    it('should close dialog when clicking Cancel', async function() {
      // Open add dialog
      await test.driverManager.clickElement(
        By.xpath('//button[contains(., "Add Area")]')
      );
      
      // Click Cancel
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Cancel")]')
      );
      
      // Verify dialog is closed
      const dialogTitle = await test.driverManager.findElements(
        By.xpath('//h2[contains(text(), "Add New Service Area")]')
      );
      
      expect(dialogTitle.length).to.equal(0, 'Dialog should be closed');
    });
  });

  describe('Search and Filter Functionality', function() {
    it('should filter areas by search term', async function() {
      // Get initial area count
      const initialAreas = await test.driverManager.findElements(
        By.xpath('//h3[contains(@class, "font-bold")]')
      );
      const initialCount = initialAreas.length;
      
      // Search for specific area
      await test.fillFormField(
        By.css('input[placeholder*="Search areas"]'),
        'Downtown',
        'Search input'
      );
      
      // Wait for search to filter
      await test.driverManager.sleep(1000);
      
      // Verify filtered results
      const filteredAreas = await test.driverManager.findElements(
        By.xpath('//h3[contains(@class, "font-bold")]')
      );
      
      // Should have fewer or equal results
      expect(filteredAreas.length).to.be.at.most(initialCount);
    });

    it('should filter areas by status', async function() {
      // Click status filter dropdown
      await test.driverManager.clickElement(
        By.xpath('//button[contains(., "All Status")]')
      );
      
      // Select "Active" status
      await test.driverManager.clickElement(
        By.xpath('//div[contains(text(), "Active")]')
      );
      
      // Wait for filter to apply
      await test.driverManager.sleep(1000);
      
      // Verify all visible areas have "active" status
      const statusBadges = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "active")]')
      );
      
      expect(statusBadges.length).to.be.greaterThan(0, 'Should show only active areas');
    });

    it('should clear search and show all areas', async function() {
      // Search for something
      await test.fillFormField(
        By.css('input[placeholder*="Search areas"]'),
        'Nonexistent Area',
        'Search input'
      );
      
      await test.driverManager.sleep(1000);
      
      // Clear search
      const searchInput = await test.driverManager.findElement(
        By.css('input[placeholder*="Search areas"]')
      );
      await searchInput.clear();
      
      await test.driverManager.sleep(1000);
      
      // Verify areas are shown again
      const areas = await test.driverManager.findElements(
        By.xpath('//h3[contains(@class, "font-bold")]')
      );
      
      expect(areas.length).to.be.greaterThan(0, 'Should show areas after clearing search');
    });
  });

  describe('Coverage Map Tab', function() {
    it('should switch to coverage map view', async function() {
      // Click Coverage Map tab
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Coverage Map")]')
      );
      
      // Verify map placeholder is displayed
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Interactive Coverage Map")]'),
        'Coverage map title'
      );
      
      // Verify map description
      await test.verifyTextContent(
        By.xpath('//p[contains(text(), "interactive map")]'),
        'interactive map',
        'Map description'
      );
    });
  });

  describe('Analytics Tab', function() {
    it('should switch to analytics view', async function() {
      // Click Analytics tab
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Analytics")]')
      );
      
      // Verify analytics sections
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Area Performance Comparison")]'),
        'Performance comparison section'
      );
      
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Service Distribution")]'),
        'Service distribution section'
      );
    });

    it('should display performance comparison data', async function() {
      // Switch to analytics tab
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Analytics")]')
      );
      
      // Verify performance data is displayed
      const performanceEntries = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "bg-gray-50")]//div[contains(@class, "font-medium")]')
      );
      
      expect(performanceEntries.length).to.be.greaterThan(0, 'Should display performance entries');
    });

    it('should show service distribution with progress bars', async function() {
      // Switch to analytics tab
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Analytics")]')
      );
      
      // Look for progress bars
      const progressBars = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "bg-gradient-to-r") and contains(@class, "h-2")]')
      );
      
      expect(progressBars.length).to.be.greaterThan(0, 'Should display progress bars for services');
    });
  });

  describe('Responsive Design', function() {
    it('should adapt to tablet viewport', async function() {
      // Set tablet viewport
      await test.driver.manage().window().setRect({ width: 768, height: 1024 });
      
      // Verify key elements are still accessible
      await test.verifyElementDisplayed(
        By.xpath('//p[contains(text(), "Total Areas")]'),
        'Stats cards on tablet'
      );
      
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "Overview")]'),
        'Tab navigation on tablet'
      );
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });

    it('should maintain functionality on mobile viewport', async function() {
      // Set mobile viewport
      await test.driver.manage().window().setRect({ width: 375, height: 667 });
      
      // Verify critical functionality works
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(., "Add Area")]'),
        'Add Area button on mobile'
      );
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });
  });

  describe('Error Handling and Performance', function() {
    it('should handle page refresh gracefully', async function() {
      // Refresh the page
      await test.driverManager.refresh();
      
      // Verify page loads correctly
      await test.verifyPageTitle('Service Areas Management');
      await test.verifyElementDisplayed(
        By.xpath('//p[contains(text(), "Total Areas")]'),
        'Stats after refresh'
      );
      
      // Verify no console errors
      await test.verifyNoConsoleErrors();
    });

    it('should not have console errors during normal usage', async function() {
      // Perform typical user interactions
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Coverage Map")]')
      );
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Analytics")]')
      );
      
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "Overview")]')
      );
      
      // Check for console errors
      await test.verifyNoConsoleErrors();
    });
  });
});
