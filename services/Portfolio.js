const fs = require('fs');

class Portfolio extends Metrics {
    constructor(symbol, amount = [0, 0]) {
        super();
        this.symbol = symbol;
        this.amount = amount;
        this.buyPrice = [0, 0];
    }

    deposit(amount, price, position = 1) {
        this.amount[position] += amount; 
        this.buyPrice[position] = price;
    }

    buy(total, prices) {
        this.buyPrice[0] = 
        ( this.buyPrice[0] * this.amount[0] + prices[0] * (this.amount[0] + total) ) / 
        ( 2 * this.amount[0] + total )
        this.buyPrice[1] = 
        ( this.buyPrice[1] * this.amount[1] + prices[1] * (this.amount[1] - total) ) / 
        ( 2 * this.amount[1] - total )

        this.amount[1] -= total;
        this.amount[0] += total / prices[2];
    }

    sell(total, prices) {
        this.buyPrice[0] = ( this.buyPrice[0] * this.amount[0] + prices[0] * (this.amount[0] - total) ) / ( 2 * this.amount[0] - total );
        this.buyPrice[1] = ( this.buyPrice[1] * this.amount[1] + prices[1] * (this.amount[1] + total) ) / ( 2 * this.amount[1] + total );
        
        this.amount[1] += total * prices[2];
        this.amount[0] -= total;
    }

    clone() {
        return new Portfolio(this.symbol, this.amount);
    }

    getValue(prices) {
        return this.amount[0] * prices[0] + this.amount[1] * prices[1];
    }

    buyValue() {
        return this.amount[0] * this.buyPrice[0] + this.amount[1] * this.buyPrice[1];
    }

    gain(prices) {
        let first_win = (prices[0] - this.buyPrice[0]) ;
        let second_win = (prices[1] - this.buyPrice[1]);
        let ratio = Math.abs((this.amount[0] * (prices[0] - this.buyPrice[0]) ) / ( this.amount[1] * (prices[1] - this.buyPrice[1])))
        if( first_win > 0 && second_win < 0 ) {
            return [ratio, 'sell', first_win * this.amount[0],  second_win * this.amount[1]];
        }
        else if ( first_win < 0 && second_win > 0 ) {
            return [1/ratio, 'buy', first_win * this.amount[0],  second_win * this.amount[1]];
        }
        return [0, 'stand', first_win * this.amount[0],  second_win * this.amount[1]];
    }

    stabilize(prices) {
        let first_win = this.amount[0] * (prices[0] - this.buyPrice[0]) ;
        let second_win = this.amount[1] * (prices[1] - this.buyPrice[1]);
        let ratio = Math.abs((this.amount[0] * (prices[0] - this.buyPrice[0]) ) / ( this.amount[1] * (prices[1] - this.buyPrice[1])))

        if( first_win > 0 && second_win < 0 ) {
            
            const sell = - (second_win / prices[1]) / prices[2];
            return [sell, 'sell'];
        }
        else if ( first_win < 0 && second_win > 0 ) {
            const buy = - (first_win / prices[0]) * prices[2];
            return [buy, 'buy'];
        }
        return [0, "stand"];
    }


    ai(prices) {
        let wallet = this;
        const [gain, action, fg, sg] = wallet.gain(prices);
        const value = wallet.getValue(prices);
        const [orderValue, orderType] = wallet.stabilize(prices);
        const buyValue = wallet.buyValue();

        console.log("[:up:]");
        console.log("Buy value: \t", buyValue);
        console.log("Current value: \t", value);
        console.log("Gain value: \t", fg, "\t", sg);
        console.log("Action: \t", action);
        console.log("GAIN: \t\t", gain);
        console.log("OrderValue: \t", orderValue);
        console.log("OrderType: \t", orderType);
        console.log(prices)

        if(orderType == "sell" && gain > 1) {
            console.log("Selling ", orderValue)
            wallet.sell(orderValue, prices);
        } else if (orderType == "buy" && gain > 1) {
            console.log("Buying ", orderValue)
            wallet.buy(orderValue, prices);
        }

        this.save();

        return {
            buyValue,
            value,
            fg,
            sg,
            action,
            orderValue,
            orderType,
            amounts: [...wallet.amount]
        }
    }

    save() {
        const jsonData = {
            symbol: this.symbol,
            amount: this.amount,
            buyPrice: this.buyPrice,
        }
        fs.writeFile(__dirname + `/../symbols/${this.symbol.replace('/', '')}.json`, JSON.stringify(jsonData), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    load(symbol = "ETH/BTC") {
        const data = fs.readFileSync( __dirname + `/../symbols/${symbol.replace('/', '')}.json`);
        try {
            let json = JSON.parse(data);
            this.symbol = json.symbol;
            this.amount = json.amount;
            this.buyPrice = json.buyPrice;
        } catch (e) {
            console.log("Cannot load " + data);
        }
    }
}

module.exports = Portfolio;