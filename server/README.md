# @rpx_/mcpx

A reusable and CLI-accessible Model Context Protocol (MCP) server for mcpX.

## Installation

```sh
npm install @rpx_/mcpx
```

## Usage as a Library

```js
import { createServer, startServer } from '@rpx_/mcpx';

// Programmatically create and start the server
startServer();
```

## Usage as a CLI

After installing globally or linking:

```sh
npx @rpx_/mcpx
```

## Features
- Exposes an MCP server with a sample "get x factor" tool
- Usable as both a library and a CLI

## Development

- Build: `npm run build`
- Publish: `npm publish --access public`

## License
ISC
