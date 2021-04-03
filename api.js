'use strict';
const ccxt = require ('ccxt');
const Combo = require ('./services/Combo');
const Portfolio = require ('./services/Portfolio');

class API {

    constructor (delay = 20000) {
        this.state = {};
        this.delay = parseInt(delay);
    }

    start() {
        const self = this;
        async function _start() {
            let binanceAPI    = new ccxt.binance ()


            const exchangeId = 'binance'
                , exchangeClass = ccxt[exchangeId]
                , exchange = new exchangeClass ({
                    'apiKey': 'YOUR_API_KEY',
                    'secret': 'YOUR_SECRET',
                    'timeout': 30000,
                    'enableRateLimit': true,
                })

            await binanceAPI.loadMarkets()

            let btc = new Combo("ETH/BTC", "BTC/USDT", "ETH/USDT", binanceAPI, self.delay, 10);


            let wallet = new Portfolio("ETH/BTC");
            wallet.deposit(1000/59075.90, 59075.90, 1);
            wallet.deposit(1000/2088, 2088, 0);
            let tempWallet = wallet.clone();

            btc.onTick((tick) => {
                // console.log(tick);
                const prices = [tick['ETH/USDT'].last, tick['BTC/USDT'].last, tick['ETH/BTC'].last];
                const data = wallet.ai(prices);

                // console.log("---- WALLET ----");
                // console.log(`ETH : ${wallet.amount[0]}`);
                // console.log(`BTC : ${wallet.amount[1]}`);
                self.state = data;
            });
            btc.tick();
            self.comboCrawler = btc;
        }
        _start();
    }

    stop() {
        this.comboCrawler.stop();
    }
}

module.exports = API;