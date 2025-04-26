import { Controller, Get, Query, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('indices')
  async getStockIndices() {
    return this.stockService.getStockIndices();
  }

  @Get('snap')
  async getStocksnapshots() {
    return this.stockService.getStockSnapshots();
  }

  @Get('quote/:symbol')
  async getStockQuote(@Param('symbol') symbol: string) {
    return this.stockService.getStockQuote(symbol);
  }

  @Get('candles/:symbol')
  async getStockCandles(
    @Param('symbol') symbol: string,
    @Query('resolution') resolution: string,
    @Query('from') from: number,
    @Query('to') to: number,
  ) {
    return this.stockService.getStockCandles(symbol, resolution, from, to);
  }

  @Get('snapshot/:symbol')
  async getStockSnapshot(@Param('symbol') symbol: string) {
    return this.stockService.getStockSnapshot(symbol);
  }
} 