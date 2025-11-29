## QualityShop.SUT

A lightweight SUT (System Under Test) built with HTML, CSS, and JavaScript.  
Used primarily for UI automation practice, demo scenarios, and QA training.

---
<h3 align="center">Created by </h3>
<p align="center">
  <a href="https://github.com/r-ankur2k" target="_blank">
    <img src="https://avatars.githubusercontent.com/u/124512084?v=4" width="100px" alt="Ankur Raj" />
    <br/>
    <h3 align="center">ANKUR RAJ</h3>
  </a>
</p>

---

![Static Badge](https://img.shields.io/badge/Project-SUT-blue)  ![Status](https://img.shields.io/badge/Status-Active-success)  ![HTML](https://img.shields.io/badge/HTML-5-orange)  ![CSS](https://img.shields.io/badge/CSS-3-blue)  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)  

## Access The site -> https://r-ankur2k.github.io/QualityShop.SUT/

---

## Table of Contents
- Overview  
- Features  
- Project Structure  
- Getting Started  
- Automation Usage  
- Contributing  
- Future Enhancements  

---

## Overview
QualityShop.SUT serves as a stable front-end target for automation frameworks such as Playwright, Selenium, or Cypress.  
It contains static UI flows like product listing, cart actions, and basic user interactions.

---

## Features
- Static, dependency-free HTML/JS project  
- Ideal for automation demo, POM design, and locator strategies  
- Quick local testing (just open the HTML file)  

---

## Project Structure

root/
│── index.html
│── script.js
│── styles.css
│── assets/ (if added later)


---

## Getting Started

### Prerequisites
- Any modern browser  
- No server needed (client-side only)

### Run Application
Simply open `index.html` in a browser.

### Clone Repo


---

## Automation Usage

Automation engineers can point tests directly at the HTML file or serve it locally.

### Example (Playwright)
```
import { test, expect } from '@playwright/test';

test('Add item to cart', async ({ page }) => {
  await page.goto('file:///path/to/index.html');
  await page.click('#add-to-cart');
  await expect(page.locator('#cart-count')).toHaveText('1');
});

