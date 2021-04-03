'use strict';
const ccxt = require ('ccxt');
const defaultConfig = require('../config/default');

class Exchange {
    constructor() {
        this.api = {};
    }

    initialize(platform = 'binance', config = defaultConfig) {
        this.api = new ccxt[platform](config);
    }
}


module.exports = Exchange;