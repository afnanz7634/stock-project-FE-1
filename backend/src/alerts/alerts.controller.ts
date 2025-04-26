import { Controller, Post, Get, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('alerts')
@UseGuards(AuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async addAlert(
    @Body() alert: {
      symbol: string;
      threshold: number;
      type: 'above' | 'below';
      email: string;
      userId: string
    },
  ) {
    return this.alertsService.addAlert(alert.userId, alert);
  }

  @Delete(':symbol')
  async removeAlert(
    @Param('symbol') symbol: string,
    @Body() body: { userId: string }
  ) {
    debugger
    return this.alertsService.removeAlert(body.userId, symbol);
  }

  @Get()
  async getUserAlerts(@Query('userId') userId: string) {
    
    return this.alertsService.getUserAlerts(userId);
  }
} 