'use strict';
const ccxt = require ('ccxt');
const Ticker = require ('./services/Ticker');
const Combo = require ('./services/Combo');
const Portfolio = require ('./services/Portfolio');
(async () => {


let binanceAPI   = new ccxt.binance ()


const exchangeId = 'binance'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
        'apiKey': 'YOUR_API_KEY',
        'secret': 'YOUR_SECRET',
        'timeout': 30000,
        'enableRateLimit': true,
    })

await binanceAPI.loadMarkets()

let btc = new Combo("ETH/BTC", "BTC/USDT", "ETH/USDT", binanceAPI, 20000, 10);


let wallet = new Portfolio("ETH/BTC");
wallet.deposit(50, 2000, 0);
wallet.deposit(100/59, 59000, 1);
let tempWallet = wallet.clone();

btc.onTick((tick) => {
    // console.log(tick);
    const prices = [tick['ETH/USDT'].last, tick['BTC/USDT'].last, tick['ETH/BTC'].last];
    wallet.ai(prices);

    console.log("---- WALLET ----");
    console.log(`ETH : ${wallet.amount[0]}`);
    console.log(`BTC : ${wallet.amount[1]}`);
    return;
});
btc.tick();

})();