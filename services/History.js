const headers = { "Content-Type": 'application/json' };

class History {
    constructor(symbol, api, limit = 500) {
        this.api = api;
        this.symbol = symbol;
        this.limit = limit;
        this.history = [];
    }

    async getHistoryAt(limit = this.limit, fromId) {
        const data = {
            symbol: this.symbol.replace('/',''),
            limit,
            fromId
        };
        return await this.api.fetch2('historicalTrades', 'public', 'GET', data, headers);
    }

    async getHistory(trades, fromId) {
        const pages = trades/this.limit;
        let current = fromId;
        this.history = [];
        for(let i = 0; i < pages; i++) {
            let data = await this.getHistoryAt(this.limit, current);
            current = data[0].id;
            this.history.push(data);
        }
        return this.history;
    }


}

module.exports = History;