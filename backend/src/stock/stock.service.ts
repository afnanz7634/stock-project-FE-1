import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StockService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async getStockIndices(limit: number = 20) {
    const response = await firstValueFrom(
      this.httpService.get('https://api.polygon.io/v3/reference/tickers', {
        params: {
          market: "indices",
          active: "true",
          order: "asc",
          limit: 100,
          sort: "ticker"
        }
      })
    );
    console.log(response)
    // Get quotes for all indices in parallel
    const indicesWithQuotes = await Promise.all(
      response.data.results.slice(0, 3).map(async (index: any) => {
        try {
          const quote = await this.getStockQuote(index.ticker);
          console.log(quote)
          console.log(index)
          return {
            id: index.ticker,
            name: index.name,
            market: index.market,
            locale: index.locale,
            active: index.active,
            sourceFeed: index.source_feed,
            value: quote.c,
            change: quote.c - quote.pc,
            changePercent: ((quote.c - quote.pc) / quote.pc) * 100,
            isUp: quote.c > quote.pc
          };
        } catch (error) {
          console.error(`Error fetching quote for ${index.ticker}:`, error);
          return {
            id: index.ticker,
            name: index.name,
            market: index.market,
            locale: index.locale,
            active: index.active,
            sourceFeed: index.source_feed,
            value: 0,
            change: 0,
            changePercent: 0,
            isUp: false
          };
        }
      })
    );

    return indicesWithQuotes;
  }

  async getStockQuote(symbol: string) {
    const response = await firstValueFrom(
      this.httpService.get(`/aggs/ticker/${symbol}/prev`),
    );
    const data = response.data.results[0];
    return {
      c: data.c, // current price
      h: data.h, // high
      l: data.l, // low
      o: data.o, // open
      pc: data.pc ?? data.o, // previous close
      t: data.t, // timestamp
    };
  }

  async getStockCandles(symbol: string, resolution: string, from: number, to: number) {
    const response = await firstValueFrom(
      this.httpService.get(`/aggs/ticker/${symbol}/range/1/${resolution}/${from}/${to}`),
    );
    return {
      c: response.data.results.map(r => r.c), // close prices
      h: response.data.results.map(r => r.h), // high prices
      l: response.data.results.map(r => r.l), // low prices
      o: response.data.results.map(r => r.o), // open prices
      t: response.data.results.map(r => r.t), // timestamps
      v: response.data.results.map(r => r.v), // volumes
    };
  }

  async getStockSnapshot(symbol: string) {
    const response = await firstValueFrom(
      this.httpService.get(`/snapshot/locale/us/markets/stocks/tickers/${symbol}`),
    );
    const data = response.data.ticker;
    return {
      symbol: data.ticker,
      currentPrice: data.lastTrade.p,
      change: data.todaysChange,
      changePercent: data.todaysChangePerc,
      volume: data.day.v,
      high: data.day.h,
      low: data.day.l,
      open: data.day.o,
      previousClose: data.prevDay.c,
      lastUpdated: data.lastTrade.t,
      min: data.min,
      day: data.day,
      prevDay: data.prevDay,
    };
  }

  async getStockSnapshots() {
    const response = await firstValueFrom(
      this.httpService.get(`/snapshot/locale/us/markets/stocks/tickers`),
    );
    return response.data.results.map(index => ({
      id: index.ticker,
      name: index.name,
      value: index.value,
      change: index.session.change,
      changePercent: index.session.change_percent,
      isUp: index.session.change > 0,
      high: index.session.high,
      low: index.session.low,
      open: index.session.open,
      close: index.session.close,
      volume: index.session.volume,
      timestamp: index.timestamp
    }));
  }
} 