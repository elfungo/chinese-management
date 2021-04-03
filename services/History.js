const headers = { "Content-Type": 'application/json' };

class History {
    constructor(symbol, api, limit = 500) {
        this.api = api;
        this.symbol = symbol;
        this.limit = limit;
    }

    async getHistoryAt(limit = this.limit, fromId) {
        const data = {
            symbol: this.symbol.replace('/',''),
            limit,
            fromId
        };
        return await this.api.fetch2('historicalTrades', 'public', 'GET', data, headers);
    }

    async getHistory(trades) {
        const pages = trades/this.limit;
        for(let i = 0; i < pages; i++) {
            let data = await this.getHistoryAt();
        }
    }


}

module.exports = History;