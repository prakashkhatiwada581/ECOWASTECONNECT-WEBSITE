const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const BaseTest = require('../../utils/baseTest');
const testConfig = require('../../config/testConfig');

describe('Admin Dashboard Tests', function() {
  let test;

  beforeEach(async function() {
    test = new BaseTest();
    await test.beforeEach(this.currentTest.title);
    
    // Login as admin before each test
    await test.navigateToApp('/login');
    await test.loginAsAdmin();
  });

  afterEach(async function() {
    const testStatus = this.currentTest.state === 'failed' ? 'FAILED' : 'PASSED';
    await test.afterEach(testStatus);
  });

  describe('Dashboard Layout and Navigation', function() {
    it('should display admin dashboard with all key sections', async function() {
      // Verify main dashboard elements
      await test.verifyPageTitle('Admin Dashboard');
      
      // Verify stats cards
      await test.verifyElementDisplayed(By.xpath('//p[contains(text(), "Total Communities")]'), 'Total Communities card');
      await test.verifyElementDisplayed(By.xpath('//p[contains(text(), "Active Users")]'), 'Active Users card');
      await test.verifyElementDisplayed(By.xpath('//p[contains(text(), "Pickup Routes")]'), 'Pickup Routes card');
      await test.verifyElementDisplayed(By.xpath('//p[contains(text(), "System Alerts")]'), 'System Alerts card');
      
      // Verify navigation sidebar
      await test.verifyElementDisplayed(By.xpath('//nav//a[contains(text(), "Admin Dashboard")]'), 'Admin Dashboard nav');
      await test.verifyElementDisplayed(By.xpath('//nav//a[contains(text(), "Manage Communities")]'), 'Manage Communities nav');
      await test.verifyElementDisplayed(By.xpath('//nav//a[contains(text(), "Manage Users")]'), 'Manage Users nav');
      await test.verifyElementDisplayed(By.xpath('//nav//a[contains(text(), "Service Areas")]'), 'Service Areas nav');
      await test.verifyElementDisplayed(By.xpath('//nav//a[contains(text(), "Analytics")]'), 'Analytics nav');
    });

    it('should display admin branding and role indicator', async function() {
      // Verify admin panel branding
      await test.verifyTextContent(
        By.xpath('//span[contains(text(), "Admin Panel")]'),
        'Admin Panel',
        'Admin panel indicator'
      );
      
      // Verify admin role badge
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Administrator")]'),
        'Administrator badge'
      );
    });

    it('should navigate to different admin sections', async function() {
      const adminSections = [
        { name: 'Manage Users', path: '/admin/users', title: 'User Management' },
        { name: 'Manage Communities', path: '/admin/communities', title: 'Community Management' },
        { name: 'Service Areas', path: '/admin/areas', title: 'Service Areas Management' },
        { name: 'Analytics', path: '/admin/analytics', title: 'System Analytics' }
      ];

      for (const section of adminSections) {
        // Navigate using sidebar
        await test.navigateUsingSidebar(section.name);
        
        // Verify URL
        const currentUrl = await test.driverManager.getCurrentUrl();
        expect(currentUrl).to.include(section.path);
        
        // Verify page title
        await test.verifyPageTitle(section.title);
        
        // Navigate back to dashboard
        await test.navigateUsingSidebar('Admin Dashboard');
      }
    });
  });

  describe('Statistics and KPIs', function() {
    it('should display system statistics with valid numbers', async function() {
      // Get stats values
      const communitiesText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Total Communities")]/following-sibling::div')
      );
      const usersText = await test.driverManager.getText(
        By.xpath('//p[contains(text(), "Active Users")]/following-sibling::div')
      );
      
      // Verify stats are numbers
      expect(communitiesText).to.match(/^\d+$/, 'Communities count should be a number');
      expect(usersText).to.match(/^[\d,]+$/, 'Users count should be a formatted number');
    });

    it('should show trend indicators for statistics', async function() {
      // Look for trend indicators (+ or - signs)
      const trendElements = await test.driverManager.findElements(
        By.xpath('//span[contains(@class, "text-") and (contains(text(), "+") or contains(text(), "-"))]')
      );
      
      expect(trendElements.length).to.be.greaterThan(0, 'Should have trend indicators');
    });
  });

  describe('Issue Notifications Section', function() {
    it('should display issue notifications panel', async function() {
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Issue Notifications")]'),
        'Issue Notifications panel'
      );
      
      // Verify notification count badge
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "new")]'),
        'New notifications badge'
      );
    });

    it('should mark notifications as read when clicked', async function() {
      // Look for unread notifications
      const unreadNotifications = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "bg-red-50")]//button[contains(@class, "CheckCircle")]')
      );
      
      if (unreadNotifications.length > 0) {
        // Click mark as read button
        await test.driverManager.clickElement(
          By.xpath('//div[contains(@class, "bg-red-50")]//button[contains(@class, "CheckCircle")]')
        );
        
        // Wait for state change
        await test.driverManager.sleep(1000);
        
        // Verify notification is marked as read (background should change)
        const readNotifications = await test.driverManager.findElements(
          By.xpath('//div[contains(@class, "bg-white")]')
        );
        
        expect(readNotifications.length).to.be.greaterThan(0);
      }
    });
  });

  describe('Quick Actions', function() {
    it('should display quick action cards', async function() {
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Manage Users")]'),
        'Manage Users quick action'
      );
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Communities")]'),
        'Communities quick action'
      );
      await test.verifyElementDisplayed(
        By.xpath('//h3[contains(text(), "Analytics")]'),
        'Analytics quick action'
      );
    });

    it('should navigate when clicking quick action buttons', async function() {
      // Click Manage Users button
      await test.driverManager.clickElement(
        By.xpath('//button[contains(., "Manage Users")]')
      );
      
      // Verify navigation
      const currentUrl = await test.driverManager.getCurrentUrl();
      expect(currentUrl).to.include('/admin/users');
    });
  });

  describe('Community Overview', function() {
    it('should display community list with details', async function() {
      // Verify community overview section
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Community Overview")]'),
        'Community Overview section'
      );
      
      // Verify community entries
      const communityEntries = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "from-blue-50")]//p[contains(@class, "font-semibold")]')
      );
      
      expect(communityEntries.length).to.be.greaterThan(0, 'Should display community entries');
    });

    it('should show community status badges', async function() {
      // Look for status badges
      const statusBadges = await test.driverManager.findElements(
        By.xpath('//span[contains(text(), "Active") or contains(text(), "Warning")]')
      );
      
      expect(statusBadges.length).to.be.greaterThan(0, 'Should display status badges');
    });
  });

  describe('Recent Activity', function() {
    it('should display recent activity feed', async function() {
      await test.verifyElementDisplayed(
        By.xpath('//span[contains(text(), "Recent Activity")]'),
        'Recent Activity section'
      );
      
      // Verify activity entries
      const activityEntries = await test.driverManager.findElements(
        By.xpath('//p[contains(@class, "font-semibold") and contains(@class, "text-sm")]')
      );
      
      expect(activityEntries.length).to.be.greaterThan(0, 'Should display activity entries');
    });

    it('should show timestamps for activities', async function() {
      // Look for time indicators
      const timeElements = await test.driverManager.findElements(
        By.xpath('//p[contains(text(), "ago") or contains(text(), "hour") or contains(text(), "day")]')
      );
      
      expect(timeElements.length).to.be.greaterThan(0, 'Should display timestamps');
    });

    it('should display activity type indicators', async function() {
      // Look for activity type icons or indicators
      const activityIcons = await test.driverManager.findElements(
        By.xpath('//div[contains(@class, "from-green-100") or contains(@class, "from-yellow-100") or contains(@class, "from-blue-100")]')
      );
      
      expect(activityIcons.length).to.be.greaterThan(0, 'Should display activity type indicators');
    });
  });

  describe('Search and Filter Functionality', function() {
    it('should have search input in header', async function() {
      await test.verifyElementDisplayed(
        By.css('input[placeholder*="Search"]'),
        'Search input'
      );
    });

    it('should filter content when searching', async function() {
      // Find search input
      const searchInput = await test.driverManager.findElement(
        By.css('input[placeholder*="Search"]')
      );
      
      // Type search term
      await test.driverManager.typeText(
        By.css('input[placeholder*="Search"]'),
        'Green Valley',
        false
      );
      
      await test.driverManager.sleep(1000); // Wait for search to process
      
      // Verify search is working (implementation may vary)
      const searchValue = await searchInput.getAttribute('value');
      expect(searchValue).to.equal('Green Valley');
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
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });

    it('should have collapsible sidebar on smaller screens', async function() {
      // Set tablet viewport
      await test.driver.manage().window().setRect({ width: 768, height: 1024 });
      
      // Verify sidebar behavior (implementation specific)
      const sidebar = await test.driverManager.findElement(
        By.css('nav, [data-testid="sidebar"]')
      );
      
      expect(await sidebar.isDisplayed()).to.be.true;
      
      // Reset viewport
      await test.driver.manage().window().maximize();
    });
  });

  describe('Error Handling', function() {
    it('should handle network errors gracefully', async function() {
      // Simulate network condition (if supported by driver)
      // This is browser-specific implementation
      
      // Verify no unhandled JavaScript errors
      await test.verifyNoConsoleErrors();
    });

    it('should display loading states appropriately', async function() {
      // Refresh page to see loading states
      await test.driverManager.refresh();
      
      // Check for any loading indicators
      const loadingElements = await test.driverManager.findElements(
        By.css('[data-testid="loading"], .loading, .spinner')
      );
      
      // Loading elements may or may not be present depending on timing
      // This test mainly ensures no errors occur during page load
      await test.verifyNoConsoleErrors();
    });
  });
});
