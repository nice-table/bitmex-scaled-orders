# Bitmex scaled orders

_A tool for creating scaled orders / bulk orders on Bitmex_

![Preview](https://i.imgur.com/dWgDAeg.png)

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

- Generate limit buy/sell orders based on user input
  - Amount
  - Number of orders
  - Upper price and lower price
  - Spread amount evenly, increasingly or decreasingly
- Supports XBTUSD and XBT futures instruments
- View current positions
- View and cancel current orders
- Retry on overload until successful

## Requirements

- nodeJS 8.5+

## Startup

Download latest release from https://github.com/nice-table/bitmex-scaled-orders/releases/latest or clone the project.

Open a terminal and run the following from the project folder:

- `npm install`

Get these running in a terminal at the same time

- `npm run proxy`
- `npm start`

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
