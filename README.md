# FlowerEngine-TS

A TypeScript library for retrieving and processing Hive-Engine node information from the `flowerengine` account's JSON metadata. This library helps in identifying active, failing, and optimal Hive-Engine nodes.

More about this account in HIVE [here](https://peakd.com/@flowerengine)

-----

## Table of Contents

  - [Overview](#overview)
- [Why TypeScript?](#why-typescript)
- [Features](#features)
- [Technical Specifications](#technical-specifications)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Core Functions](#core-functions)
  - [Running the Example Script](#running-the-example-script)
  - [Testing Locally in Another Project](#testing-locally-in-another-project)
- [Browser Example](#browser-example)
  - [Running the HTML Example](#running-the-html-example)
- [Future: Publishing to NPM](#future-publishing-to-npm)
- [Contributing](#contributing)
- [More Projects](#more-projects)
- [Repository](#repository)
- [License](#license)

-----

## Overview

`flowerengine-ts` provides a set of tools to interact with the node information published by the `flowerengine` account on the Hive blockchain. It allows developers to:

  * Fetch the latest node metadata.
  * Identify currently active and responsive Hive-Engine nodes.
  * List nodes that are currently failing or unresponsive.
  * Determine the "best" or most performant node based on available metrics (like latency and benchmark results).

This is particularly useful for applications that need to reliably connect to a Hive-Engine sidechain node.

-----

## Why TypeScript?

This library is written in TypeScript to leverage its strong typing system. This brings several advantages:

  * **Improved Code Quality:** Type checking at compile-time catches many common errors before runtime.
  * **Better Developer Experience:** Autocompletion and type information in IDEs make development faster and more efficient.
  * **Enhanced Maintainability:** Clear type definitions make the codebase easier to understand, refactor, and maintain, especially as the project grows.

-----

## Features

  * Fetch full node metadata from the `flowerengine` account.
  * Parse and provide lists of active and failing nodes.
  * Function to determine the best available node based on latency and benchmark status.
  * Typed interfaces for all data structures, ensuring type safety.

-----

## Technical Specifications

  * **Language:** TypeScript
  * **Core Dependency:** [`@hiveio/dhive`](https://www.google.com/search?q=%5Bhttps://github.com/hiveio/dhive%5D\(https://github.com/hiveio/dhive\)) for interacting with the Hive blockchain.
  * **Data Source:** JSON metadata from the [`flowerengine` Hive account](https://www.google.com/search?q=%5Bhttps://peakd.com/%40flowerengine%5D\(https://peakd.com/%40flowerengine\)).
  * **Node Environment:** Designed primarily for Node.js environments (uses `node-fetch` internally, which can be adapted for browser environments if bundled).

-----

## Getting Started

### Prerequisites

  * **Node.js:** (LTS version recommended)
  * **npm:** (usually comes with Node.js) or Yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TheCrazyGM/flowerengine-ts.git
    cd flowerengine-ts
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Build the project (compile TypeScript to JavaScript):**

    ```bash
    npm run build
    ```

-----

## Usage

### Core Functions

The main functionalities are exposed through functions in `src/node-updater.ts`. These include:

  * `updateNodesFromAccount(accountName: string): Promise<NodeUpdateResult>`: Fetches and processes raw node data from the Hive blockchain.
  * `getBestNode(metadata: FlowerEngineMetadata): string | null`: Analyzes the provided metadata to determine the best performing node URL based on its weighted score.
  * `getFullNodeReport(accountName: string): Promise<NodeReport[]>`: Retrieves the full list of node reports, including detailed performance metrics for each.

For detailed type definitions, refer to `src/types.ts` which defines the structure of `NodeUpdateResult`, `FlowerEngineMetadata`, `NodeReport`, and other related interfaces.

### Running the Example Script

An example usage script (`src/example-usage.ts`) is provided to demonstrate basic functionality. To run it:

```bash
npm start
```

Alternatively, if you have `ts-node` installed globally or as a dev dependency, you can run it directly:

```bash
ts-node src/example-usage.ts
```

This script will fetch node information and then query details for a specific token (`SWAP.HIVE`) using one of the fetched nodes.

### Testing Locally in Another Project

Before publishing to NPM, or if you want to use your local version of `flowerengine-ts` in another local project, you can use `npm link` (or `yarn link`).

1.  **Build `flowerengine-ts`:** Make sure you have the latest JavaScript output in your `dist` folder.
    ```bash
    npm run build
    ```
2.  **Link `flowerengine-ts` globally from its directory:** Navigate to the root directory of your `flowerengine-ts` project and run:
    ```bash
    npm link
    # or for yarn:
    # yarn link
    ```
    This creates a global symbolic link to your `flowerengine-ts` package.
3.  **Link `flowerengine-ts` into your other project:** Navigate to the root directory of your other local project where you want to use `flowerengine-ts`. Then run:
    ```bash
    npm link flowerengine-ts
    # or for yarn:
    # yarn link flowerengine-ts
    ```
    This creates a symbolic link in your other project's `node_modules` folder, pointing to your local `flowerengine-ts` build.
4.  **Use the library in your other project:** You can now import and use `flowerengine-ts` in your other project as if it were installed from NPM:
    ```typescript
    // In your other project's .ts file
    import { updateNodesFromAccount, getBestNode } from 'flowerengine-ts';

    async function main() {
      try {
        const nodeData = await updateNodesFromAccount('flowerengine'); // Correct account name
        console.log('Active nodes:', nodeData.nodes);
        const bestNode = await getBestNode('flowerengine'); // Call getBestNode with account name
        console.log('Best node:', bestNode);
      } catch (error) {
        console.error('Error using flowerengine-ts:', error);
      }
    }

    main();
    ```
5.  **To unlink:** When you're done, you can unlink the package:
      * In your other project: `npm unlink flowerengine-ts` (then `npm install` if you want to get the NPM version again).
      * In the `flowerengine-ts` project directory: `npm unlink` (to remove the global link).

-----

## Browser Example

An HTML example is provided in the `examples/browser/` directory to demonstrate how the core logic can be used in a web browser.

### Running the HTML Example

1.  **Navigate** to the `examples/browser/` directory.
2.  **Open** the `index.html` file in your web browser.
      * **Using VS Code Live Server:** If you have VS Code and the "Live Server" extension, right-click on `index.html` in the VS Code explorer and select "Open with Live Server".
      * **Using other local servers:** You can use any simple HTTP server. For example, with Node.js, you can install `http-server` globally (`npm install -g http-server`) and then run `http-server .` from within the `examples/browser/` directory.
      * **Directly opening the file:** For simple cases, you might be able to open `index.html` directly from your file system in a browser, but using a local server is highly recommended for consistent behavior, especially regarding JavaScript module loading or API requests.

The example page will allow you to fetch and display node information directly.

-----

## Future: Publishing to NPM

To publish this library to NPM in the future, the general steps would be:

1.  Ensure your `package.json` is correctly configured (name, version, `main` file, `types`, author, `repository`, `license`, etc.).
2.  Log in to NPM via the CLI: `npm login`
3.  Increment the version number in `package.json` according to [semantic versioning](https://semver.org/).
4.  Build your project: `npm run build`
5.  Publish: `npm publish`

Consider adding a `.npmignore` file to exclude unnecessary files (like `src/`, `examples/`, test files) from the published package, keeping your package lightweight.

-----

## Contributing

Contributions are welcome\! Please feel free to submit issues or pull requests.

-----

## More Projects

Discover more projects by TheCrazyGM at [thecrazygm.com](https://thecrazygm.com).

-----

## Repository

The source code is available on GitHub: [https://github.com/TheCrazyGM/flowerengine-ts](https://github.com/TheCrazyGM/flowerengine-ts)

-----

## License

This project is licensed under the MIT License. See the `LICENSE` file in the repository for details.

-----