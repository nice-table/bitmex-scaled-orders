# Bitmex scaled orders

_A tool for creating scaled orders / bulk orders on Bitmex_

![Preview](https://i.imgur.com/dWgDAeg.png)

Video demo: https://streamable.com/d3qr4

**You should only run this locally.**

## Table of Contents

- [Requirements](#requirements)
- [Startup](#startup)
- [Adding more instruments](#adding-more-instruments)
- [Tests](#tests)
- [Changelog](#changelog)
- [TODO](#todo)
- [Maybe](#maybe)

## Requirements

- nodeJS 8.5+

## Startup

Open a terminal and run the following:

- `npm install`

Logon Bitmex and create an API key with order permissions https://www.bitmex.com/app/apiKeys.

Edit the properties in `src/config/index.js`. Mainly:

- `apiKeyID`
- `apiKeySecret`
- `testnet` - Whether you want to use Bitmex's testnet or production. Note that testnet and production have separate API keys.

Get these running at the same time

- `npm run proxy`
- `npm start`

## Adding more instruments

By default only XBTUSD instrument is enabled, but you can add more by editing the symbols array in `src/config/index.js`.

```
  // Default
  symbols: ["XBTUSD"],

  // Enable both XBTUSD and XBTU18 (futures)
  symbols: ["XBTUSD", "XBTU18"],
```

**NOTE: Only BTC futures like XBTU18 and XBTZ18 are supported. Do not add something like UP or DOWN, or ETH instruments etc.**

The app will automatically reload with the new instruments (if already running)

## Tests

Tests can be run in a terminal:

`npm test`

## Changelog

For changelog see https://github.com/nice-table/bitmex-scaled-orders/releases

## TODO

- Warn user if one or more orders may be executed as a market order

## Maybe

- Other order types / strategies (https://www.sierrachart.com/index.php?page=doc/OrderTypes.html)
- Moon
