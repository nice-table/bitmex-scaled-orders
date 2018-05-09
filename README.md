# Bitmex scaled orders

![Preview](https://i.imgur.com/FjPDll9.png)

Video demo: https://streamable.com/04rxn

Tool for setting scaled orders / bulk orders on Bitmex.

Currently hardcoded to XBTUSD.

**You should only run this locally.**

## Requirements

* nodeJS 8.5+

## Startup

Open a terminal and run the following:

* `npm install`

Logon Bitmex and create an API key with order permissions https://www.bitmex.com/app/apiKeys.

Edit the properties in `src/config/index.js`. Mainly:

* `apiKeyID`
* `apiKeySecret`
* `testnet` - Whether you want to use Bitmex's testnet or production. Note that testnet and production use separate API keys.

Get these running at the same time

* `npm run proxy`
* `npm start`

## TODO

* Support more BTC instruments (futures)
* Warn user if one or more orders may be executed as a market order

## Maybe

* Other order types / strategies (https://www.sierrachart.com/index.php?page=doc/OrderTypes.html)
* Moon
