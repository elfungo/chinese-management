class Ticker {

    constructor(symbol, binance, interval = 60000, window = 240) {
        this.symbol = symbol;
        this.api = binance;
        this.interval = interval;
        this.ticks = [];
        this.window = window;
    }
    
    onTick(fn) {
        this._onTick = fn;
    }

    addTick(tick) {
        if(this.ticks.length < this.window) {
            this.ticks.push(tick);
        } else {
            this.ticks = [
                ...this.ticks.slice(1),
                tick
            ];
        }
        this._onTick && this._onTick(tick);
    }

    update = async() => {
        this.tick = await this.api.fetchTickers([this.symbol]);
        this.addTick(this.tick);
    };

    tick() {
        this.timerId = setInterval(this.update, this.interval);
        this.update()
    }
    
    stop() {
        clearInterval(this.timerId);
    }
};

module.exports = Ticker;