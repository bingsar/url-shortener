import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Analytics } from './analytics.entity'
import { AnalyticsService } from './analytics.service'
import { AnalyticsController } from './analytics.controller'
import { Url } from '../urls/url.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Analytics, Url])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
