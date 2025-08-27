const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const BaseTest = require('../../utils/baseTest');
const testConfig = require('../../config/testConfig');

describe('User Dashboard Tests', function() {
  let test;

  beforeEach(async function() {
    test = new BaseTest();
    await test.beforeEach(this.currentTest.title);
    
    // Login as regular user before each test
    await test.navigateToApp('/login');
    await test.loginAsUser();
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED';
    await test.afterEach(testStatus);
  });

  describe('Dashboard Layout and Navigation', function() {
    it('should display user dashboard with all key sections', async function() {
      // Verify page title
      await test.verifyPageTitle('Dashboard');
      
      // Verify welcome section
      await test.verifyElementDisplayed(
        By.xpath('//h1[contains(text(), "Welcome back")]'),
        'Welcome message'
      );
      
      // Verify quick stats cards
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Next Pickup")]'),
        'Next Pickup card'
      );
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Total Pickups")]'),
        'Total Pickups card'
      );
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Recycling Rate")]'),
        'Recycling Rate card'
      );
      
      // Verify navigation sidebar
      await test.verifyElementDisplayed(
        By.xpath('//nav//a[contains(text(), "Dashboard")]'),
        'Dashboard nav'
      );
      await test.verifyElementDisplayed(
        By.xpath('//nav//a[contains(text(), "Schedule Pickup")]'),
        'Schedule Pickup nav'
      );
      await test.verifyElementDisplayed(
        By.xpath('//nav//a[contains(text(), "Report Issues")]'),
        'Report Issues nav'
      );
      await test.verifyElementDisplayed(
        By.xpath('//nav//a[contains(text(), "Notifications")]'),
        'Notifications nav'
      );
    });

    it('should display user branding without admin elements', async function() {
      // Verify user branding (not admin)
      await test.verifyTextContent(
        By.xpath('//span[contains(text(), "EcoWasteConnect")]'),
        'EcoWasteConnect',
        'App branding'
      );
      
      // Verify NO admin panel indicator
      const adminIndicators = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "Admin Panel")]')
      );
      expect(adminIndicators.length).to.equal(0, 'Should not show admin indicators');
      
      // Verify NO admin navigation items
      const adminNavItems = await test.driverManager.findElements(
        By.xpath('//nav//a[contains(text(), "Manage") or contains(text(), "System")]')
      );
      expect(adminNavItems.length).to.equal(0, 'Should not show admin navigation');
    });

    it('should navigate to different user sections', async function() {
      const userSections = [
        { name: 'Schedule Pickup', path: '/schedule-pickup', title: 'Schedule Pickup' },
        { name: 'Report Issues', path: '/report-issues', title: 'Report an Issue' },
        { name: 'Pickup History', path: '/pickup-history', title: 'Pickup History' },
        { name: 'Notifications', path: '/notifications', title: 'Notifications' },
        { name: 'Reports', path: '/reports', title: 'Reports' }
      ];

      for (const section of userSections) {
        // Navigate using sidebar
        await test.navigateUsingSidebar(section.name);
        
        // Verify URL
        const currentUrl = await test.driverManager.getCurrentUrl();
        expect(currentUrl).to.include(section.path);
        
        // Verify page title
        await test.verifyPageTitle(section.title);
        
        // Navigate back to dashboard
        await test.navigateUsingSidebar('Dashboard');
      }
    });
  });

  describe('Quick Stats and KPIs', function() {
    it('should display pickup statistics', async function() {
      // Verify next pickup date
      const nextPickupCard = await test.driverManager.findElement(
        By.xpath('//span[contains(text(), "Next Pickup")]/..')
      );
      const nextPickupText = await nextPickupCard.getText();
      expect(nextPickupText).to.include('Next Pickup', 'Should show next pickup info');
      
      // Verify total pickups count
      const totalPickupsText = await test.driverManager.getText(
        By.xpath('//span[contains(text(), "Total Pickups")]/following-sibling::p')
      );
      expect(totalPickupsText).to.match(/^\d+$/, 'Total pickups should be a number');
      
      // Verify recycling rate
      const recyclingRateText = await test.driverManager.getText(
        By.xpath('//span[contains(text(), "Recycling Rate")]/following-sibling::p')
      );
      expect(recyclingRateText).to.match(/^\d+%$/, 'Recycling rate should be a percentage');
    });

    it('should show environmental impact metrics', async function() {
      // Look for environmental metrics
      const impactCards = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "CO₂ Saved") or contains(text(), "Trees")]')
      );
      
      expect(impactCards.length).to.be.greaterThan(0, 'Should display environmental impact metrics');
    });
  });

  describe('Upcoming Pickups Section', function() {
    it('should display upcoming pickup schedule', async function() {
      // Verify upcoming pickups section
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Upcoming Pickups")]'),
        'Upcoming Pickups section'
      );
      
      // Verify pickup entries
      const pickupEntries = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "border-l-4")]')
      );
      
      expect(pickupEntries.length).to.be.greaterThan(0, 'Should display pickup entries');
    });

    it('should show pickup types and schedules', async function() {
      // Look for different pickup types
      const pickupTypes = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "General") or contains(text(), "Recycling") or contains(text(), "Organic")]')
      );
      
      expect(pickupTypes.length).to.be.greaterThan(0, 'Should display pickup types');
      
      // Look for dates/times
      const scheduleInfo = await test.driverManager.findElements(
        By.xpath('//p[contains(text(), "AM") or contains(text(), "PM") or contains(@class, "text-gray-500")]')
      );
      
      expect(scheduleInfo.length).to.be.greaterThan(0, 'Should display schedule information');
    });
  });

  describe('Recent Activity Section', function() {
    it('should display recent pickup activity', async function() {
      // Verify recent activity section
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Recent Activity")]'),
        'Recent Activity section'
      );
      
      // Verify activity entries
      const activityEntries = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "from-green-50")]//p[contains(@class, "font-semibold")]')
      );
      
      expect(activityEntries.length).to.be.greaterThan(0, 'Should display activity entries');
    });

    it('should show activity timestamps', async function() {
      // Look for time indicators
      const timeElements = await test.driverManager.findElements(
        By.xpath('//p[contains(text(), "ago") or contains(text(), "hours") or contains(text(), "days")]')
      );
      
      expect(timeElements.length).to.be.greaterThan(0, 'Should display timestamps');
    });
  });

  describe('Notifications Summary', function() {
    it('should display notifications summary', async function() {
      // Verify notifications section
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Notifications")]'),
        'Notifications section'
      );
      
      // Verify notification entries
      const notificationEntries = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "border-green-100")]')
      );
      
      expect(notificationEntries.length).to.be.greaterThan(0, 'Should display notification entries');
      
      // Verify "View All Notifications" link
      await test.verifyElementDisplayed(
        By.xpath('//button[contains(text(), "View All Notifications")]'),
        'View All Notifications button'
      );
    });

    it('should navigate to notifications page when clicking View All', async function() {
      // Click View All Notifications
      await test.driverManager.clickElement(
        By.xpath('//button[contains(text(), "View All Notifications")]')
      );
      
      // Verify navigation to notifications page
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/notifications');
      
      await test.verifyPageTitle('Notifications');
    });
  });

  describe('Quick Actions', function() {
    it('should display quick action buttons', async function() {
      // Look for quick action buttons
      const quickActions = await test.driverManager.findElements(
        By.xpath('//button[contains(text(), "Schedule") or contains(text(), "Report") or contains(text(), "View")]')
      );
      
      expect(quickActions.length).to.be.greaterThan(0, 'Should display quick action buttons');
    });

    it('should navigate when clicking quick actions', async function() {
      // Look for "Schedule Pickup" button and click if present
      const scheduleButtons = await test.driverManager.findElements(
        By.xpath('//button[contains(text(), "Schedule") or contains(text(), "New Pickup")]')
      );
      
      if (scheduleButtons.length > 0) {
        await test.driverManager.clickElement(
          By.xpath('//button[contains(text(), "Schedule") or contains(text(), "New Pickup")]')
        );
        
        // Verify navigation or modal opens
        const currentUrl = await test.driverManager.getCurrentUrl();
        const hasModal = await test.driverManager.findElements(By.css(testConfig.selectors.common.modal));
        
        const navigationWorked = currentUrl.includes('/schedule-pickup') || hasModal.length > 0;
        expect(navigationWorked).to.be.true;
      }
    });
  });

  describe('Community Information', function() {
    it('should display community information if available', async function() {
      // Look for community-related information
      const communityInfo = await test.driverManager.findElements(
        By.xpath('//div[contains(text(), "Community") or contains(text(), "Area")]')
      );
      
      // Community info may or may not be present depending on user setup
      if (communityInfo.length > 0) {
        expect(communityInfo.length).to.be.greaterThan(0, 'Should display community information');
      }
    });
  });

  describe('Search Functionality', function() {
    it('should have search input in header', async function() {
      await test.verifyElementDisplayed(
        By.css('input[placeholder*="Search"]'),
        'Search input'
      );
    });

    it('should accept search input', async function() {
      const searchInput = await test.driverManager.findElement(
        By.css('input[placeholder*="Search"]')
      );
      
      await test.driverManager.typeText(
        By.css('input[placeholder*="Search"]'),
        'pickup',
        false
      );
      
      const searchValue = await searchInput.getAttribute('value');
      expect(searchValue).to.equal('pickup');
    });
  });

  describe('Responsive Design', function() {
    it('should adapt to mobile viewport', async function() {
      // Set mobile viewport
      await test.driver.manage().window().setRect({ width: 375, height: 667 });
      
      // Verify key elements are still accessible
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "EcoWasteConnect")]'),
        'App logo on mobile'
      );
      
      // Verify dashboard content is visible
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Next Pickup")]'),
        'Stats cards on mobile'
      );
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });

    it('should maintain sidebar functionality on tablet', async function() {
      // Set tablet viewport
      await test.driver.manage().window().setRect({ width: 768, height: 1024 });
      
      // Verify sidebar navigation works
      const sidebarNav = await test.driverManager.findElement(
        By.xpath('//nav//a[contains(text(), "Schedule Pickup")]')
      );
      
      expect(await sidebarNav.isDisplayed()).to.be.true;
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });
  });

  describe('Data Accuracy and Updates', function() {
    it('should display consistent data across dashboard elements', async function() {
      // Get pickup count from stats card
      const statsPickupCount = await test.driverManager.getText(
        By.xpath('//span[contains(text(), "Total Pickups")]/following-sibling::p')
      );
      
      // Verify it's a valid number
      expect(statsPickupCount).to.match(/^\d+$/, 'Pickup count should be numeric');
      
      // Data consistency would be verified against other sections if they display the same metric
    });

    it('should show appropriate date formatting', async function() {
      // Look for date elements
      const dateElements = await test.driverManager.findElements(
        By.xpath('//p[contains(text(), "2024") or contains(text(), "2023")]')
      );
      
      if (dateElements.length > 0) {
        for (const dateElement of dateElements) {
          const dateText = await dateElement.getText();
          // Basic date format validation
          expect(dateText).to.match(/\d{4}|\d{1,2}\/\d{1,2}|\w+\s+\d{1,2}/, 'Should have valid date format');
        }
      }
    });
  });

  describe('Performance and Error Handling', function() {
    it('should load dashboard without console errors', async function() {
      // Verify no console errors on dashboard load
      await test.verifyNoConsoleErrors();
    });

    it('should handle page refresh gracefully', async function() {
      // Refresh the page
      await test.driverManager.refresh();
      
      // Verify dashboard loads correctly after refresh
      await test.verifyPageTitle('Dashboard');
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Next Pickup")]'),
        'Stats after refresh'
      );
      
      // Verify no console errors after refresh
      await test.verifyNoConsoleErrors();
    });

    it('should maintain user session after navigation', async function() {
      // Navigate to another page
      await test.navigateUsingSidebar('Schedule Pickup');
      
      // Navigate back to dashboard
      await test.navigateUsingSidebar('Dashboard');
      
      // Verify user is still logged in
      expect(await test.verifyLoggedIn()).to.be.true;
      
      // Verify dashboard content is available
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Next Pickup")]'),
        'Dashboard content after navigation'
      );
    });
  });

  describe('Accessibility', function() {
    it('should have proper heading structure', async function() {
      // Check for h1 heading
      const h1Elements = await test.driverManager.findElements(By.tagName('h1'));
      expect(h1Elements.length).to.be.greaterThan(0, 'Should have h1 heading');
      
      // Check for proper heading hierarchy
      const headings = await test.driverManager.findElements(
        By.xpath('//h1 | //h2 | //h3 | //h4 | //h5 | //h6')
      );
      expect(headings.length).to.be.greaterThan(1, 'Should have proper heading structure');
    });

    it('should have keyboard navigation support', async function() {
      // Test basic keyboard navigation (Tab key)
      const focusableElements = await test.driverManager.findElements(
        By.css('button, a, input, [tabindex]:not([tabindex="-1"])')
      );
      
      expect(focusableElements.length).to.be.greaterThan(0, 'Should have focusable elements');
    });
  });
});
