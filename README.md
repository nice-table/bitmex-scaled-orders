# Bitmex scaled orders

_A tool for creating scaled orders / bulk orders on Bitmex_

![Preview](https://i.imgur.com/kfsQzLh.png)

Video demo: https://streamable.com/d3qr4

**You should only run this locally.**

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Startup](#startup)
- [Tests](#tests)
- [Changelog](#changelog)
- [TODO](#todo)
- [Maybe](#maybe)

## Features

- Generate limit buy/sell orders based on a set of variables:
  - Amount
  - Number of orders
  - Upper price and lower price
  - Spread amount evenly, increasingly or decreasingly
- Supports all Bitmex instruments
- View current positions
- View and cancel current orders
- Retry on overload until successful
- Supports testnet and production

## Requirements

- nodeJS 8.5+

## Startup

Download latest release from https://github.com/nice-table/bitmex-scaled-orders/releases/latest or clone the project.

Open a terminal and run the following from the project folder:

- `npm install`

When `npm install` has finished, we are ready to start the app. Run this in a terminal:

- `npm run startup`

App should open in your browser automatically and render when ready.

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
