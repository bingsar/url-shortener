import { Controller, Get, Param } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    return this.analyticsService.getAnalytics(shortUrl)
  }
}
