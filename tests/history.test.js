const History = require('../services/History');
const Exchange = require('../services/Exchange');

describe("History service", () => {
    let exchange = new Exchange();
    beforeAll(async () => {
        await exchange.initialize();
    })

    it("should get at least one page", async () => {
        const history = new History("ETH/BTC", exchange.api);

        const historyPage = await history.getHistoryAt(500, 247601154);

        expect(historyPage).toMatchSnapshot();
    })

    it("should get at three pages", async () => {
        const history = new History("ETH/BTC", exchange.api);

        const historyPage = await history.getHistory(1500, 247601154);

        expect(historyPage).toMatchSnapshot();
    })
})