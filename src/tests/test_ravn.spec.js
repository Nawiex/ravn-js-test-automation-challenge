const { test, expect } = require('@playwright/test');

test('Challenge: Extract and Verify Ravn QA Services', async ({ page }) => {
  await page.goto('https://www.ravn.co/');

  // Click "Services" link
  await page.getByRole('link', { name: 'services' }).first().click();
  
  // Verify we are on the correct page
  await expect(page).toHaveURL(/.*services/);

  // Scroll to Quality Assurance
  const qaHeading = page.getByRole('heading', { name: 'Quality Assurance' });
  await expect(qaHeading).toBeVisible();
  await qaHeading.scrollIntoViewIfNeeded();

  // Locate the container holding the testing types
  // I had to use xpath here because the structure of the HTML requires navigating to a sibling div, this may create problems if the page structure changes.
  const techStackContainer = page.locator('div.content-title')
     .filter({ has: qaHeading }) 
     .locator('xpath=following-sibling::div[contains(@class, "content-tech")]')
     .first();

  // Get all paragraph (<p>) tags inside that container
  const items = techStackContainer.locator('p');

  // Store all testing types in a single variable
  const testingTypes = await items.allInnerTexts();

  console.log('------------------------------------------------');
  console.log('📝 REQUIREMENT OUTPUT (Console Print):');
  console.log(testingTypes);
  console.log('------------------------------------------------');

  // --- AUTOMATED TEST ASSERTIONS ---

  // 1. Sanity Check: Ensure the list is not empty
  expect(testingTypes.length).toBeGreaterThan(0);

  // 2. Exact Match Verification: Ensure the list matches the expected business requirements
  const expectedServices = [
    'QA Automation',
    'Manual QA',
    'API Testing',
    'Regression Testing',
    'Performance Testing'
  ];

  expect(testingTypes).toEqual(expectedServices);
  
  console.log('TEST PASSED: Services list matches expected data.');
});