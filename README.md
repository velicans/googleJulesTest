# Playwright API and UI Testing Project

This project contains a suite of automated tests for the Swagger Petstore API and a UI test for the HotNews.ro website, built using Playwright and TypeScript.

## Project Overview

The project is structured to provide a clear separation between different types of tests:

-   **API Tests:** A comprehensive suite of tests for the Swagger Petstore API (`https://petstore.swagger.io/v2`), covering all major endpoints for `pet`, `store`, and `user` resources. These tests validate both successful (200) and error (4xx) responses.
-   **UI Tests:** A test that verifies the user interface of the HotNews.ro website. This test navigates to the "Sport" section, then to the "Fotbal" subsection, and lists the titles of the first 10 articles.

## Technologies Used

-   **Playwright:** For end-to-end testing, including API and UI tests.
-   **TypeScript:** For type safety and improved code quality.
-   **Node.js:** As the runtime environment.
-   **npm:** For package management.

## Setup Instructions

To get started with this project, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This project uses `npm` for package management. To install the required dependencies, run the following command:
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    Playwright requires browser binaries to run the tests. Install them with the following command:
    ```bash
    npx playwright install
    ```

## Running the Tests

To run the entire test suite, use the following command:

```bash
npm test
```

This command will execute all the test files located in the `tests/` directory.

## Project Structure

-   `tests/`: This directory contains all the test files.
    -   `pet.spec.ts`: API tests for the `pet` endpoints.
    -   `store.spec.ts`: API tests for the `store` endpoints.
    -   `user.spec.ts`: API tests for the `user` endpoints.
    -   `hotnews.spec.ts`: UI test for the HotNews.ro website.
-   `playwright.config.js`: Configuration file for Playwright.
-   `package.json`: Defines the project dependencies and scripts.
-   `tsconfig.json`: Configuration file for TypeScript.
-   `README.md`: This file.