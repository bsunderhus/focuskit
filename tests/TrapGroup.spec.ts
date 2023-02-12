import { test, expect } from '@playwright/test';
import { html } from 'lit-html';
import { FocusKitPage } from './FocusKitPage.js';

test('should not tab into contents', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  expect(await focuskitPage.activeElementId()).toBe('group');
  await page.keyboard.press('Tab');
  expect(await focuskitPage.activeElementId()).toBe('');

  const focusableElementIds = await focuskitPage.focusableElementIds();
  expect(focusableElementIds.length).toBe(2);
  expect(focusableElementIds[0]).toBe('one');
  expect(focusableElementIds[1]).toBe('two');
});

test('should focus first item on Enter', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  expect(await focuskitPage.activeElementId()).toBe('one');
});

test('should trap focus in group', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  expect(await focuskitPage.activeElementId()).toBe('one');
  await page.keyboard.press('Tab');
  expect(await focuskitPage.activeElementId()).toBe('two');
  await page.keyboard.press('Tab');
  expect(await focuskitPage.activeElementId()).toBe('one');
});

test('should focus group parent on Escape', async ({ page }) => {
  const focuskitPage = new FocusKitPage(page);
  await focuskitPage.goto();
  
  await focuskitPage.render(
    html`
  <div id="group" tabindex="0">
    <button type="button" id="one">One</button>
    <button type="button" id="two">Two</button>
  </div>
  `
  )

  await focuskitPage.createCommander();
  await focuskitPage.createTrapGroup('group');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  expect(await focuskitPage.activeElementId()).toBe('one');
  await page.keyboard.press('Escape');
  expect(await focuskitPage.activeElementId()).toBe('group');
});