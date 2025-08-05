# mcpx

A reusable and CLI-accessible Model Context Protocol (MCP) server for mcpX.

## Installation

```sh
npm install mcpx
```

## Usage as a Library

```js
import { createServer, startServer } from 'mcpx';

// Programmatically create and start the server
startServer();
```

## Usage as a CLI

After installing globally or linking:

```sh
npx browsermcp-server
```

## Features
- Exposes an MCP server with a sample "get x factor" tool
- Usable as both a library and a CLI

## Development

- Build: `npm run build`
- Prepare for publish: `npm run prepare`

## License
ISC
