# opencrypto-data-js

[![Build Status](https://travis-ci.org/opencrypto-io/data-js.svg?branch=master)](https://travis-ci.org/opencrypto-io/data-js)
 [![dependencies Status](https://david-dm.org/opencrypto-io/data-js/status.svg)](https://david-dm.org/opencrypto-io/data-js)
 [![npm bundle size (minified + zipped)](https://img.shields.io/bundlephobia/minzip/opencrypto-data-js.svg)](https://bundlephobia.com/result?p=opencrypto-data-js)
 [![npm](https://img.shields.io/npm/v/opencrypto-data-js.svg)](https://www.npmjs.com/package/opencrypto-data-js)


Universal Javascript client library for [Opencrypto Data](https://github.com/opencrypto-io/data)

## Installation

### Node.js / Webpack

Install package using NPM:
```bash
npm install --save opencrypto-data-js
```

And include library in your script:
```js
const ocd = require('opencrypto-data-js')
```

### Browser

Insert script loader into your html:
```html
<script src="https://opencrypto-io.github.io/data-js/dist/ocd.lib.min.js"></script>
```

Now you can access library thru `ocd` global variable.

## Usage

There is two methods how to use this library:

### Static usage
You dont need build a client instance, you can just use library:
```js
// require library
const ocd = require("opencrypto-data-js")

// get data
let data = await ocd.get("project", "ethereum")
```

### Client instance
Alternatively, you can build a custom client instance (and optionally specify your `options`):
```js
// require library
const ocd = require("opencrypto-data-js")

// construct client instance
const client = new ocd.Client({ preload: true })

// get data
let data = await client.get("project", "ethereum")
```

### Promises & async/await
This library has full support of Promises and async/await so you can use it as normal.

Async/await version:
```js
let data = await ocd.query("metadata.commit")
```

Promise variant:
```js
ocd.query("metadata.commit").then(res => {
  let data = res
})
```

## API

### Client(options = {}) constructor
Constructor for a new client.

Available `options`:
* `preload` (default: `false`)
* `dataUrl` (default: `https://data.opencrypto.io/data.json`)

### async raw()
Get complete raw data.
```js
let data = await ocd.raw()
```

### async query(query)
Query database by JMESPath query.
```js
await ocd.query("projects[].name")
```

### async get(model, id, query = "@")
Get object from database and run query against it (optional).
```js
await ocd.get("project", "ethereum")
await ocd.get("asset", "ethereum:eth")
```

### on(event, handler = (data) => data)
Bind to specified event. Not available as static method.
Available events:
* `loaded`

For example:
```js
let client = new ocd.Client({ preload: true })
await client.on("loaded")
```

### emit(event, data)

### version()

## CLI

To install CLI binary `ocd`, you need install package with `-g` option:
```bash
npm install -g opencrypto-data-js
```

Every command have simple command-line alternative:
```bash
ocd get asset bitcoin:btc
ocd query metadata.commit
ocd version
```

## License
MIT
