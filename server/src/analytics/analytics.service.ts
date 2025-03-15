import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Analytics } from './analytics.entity'
import { Url } from '../urls/url.entity'
import { UrlNotFoundException } from '../common/exceptions'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async recordClick(url: Url, ipAddress: string): Promise<void> {
    const clickRecord = this.analyticsRepository.create({
      url,
      clickedAt: new Date(),
      ipAddress,
    })

    await this.analyticsRepository.save(clickRecord)
  }

  async getAnalytics(shortUrl: string) {
    const url = await this.urlRepository.findOne({ where: { shortUrl }, relations: ['analytics'] })

    if (!url) {
      throw new UrlNotFoundException()
    }

    const recentClicks = await this.analyticsRepository.find({
      where: { url: { id: url.id } },
      order: { clickedAt: 'DESC' },
      take: 5,
    })

    return {
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      recentClicks: recentClicks.map((click) => ({
        clickedAt: click.clickedAt,
        ipAddress: click.ipAddress,
      })),
    }
  }
}
