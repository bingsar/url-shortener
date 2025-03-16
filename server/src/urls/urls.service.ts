import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Url } from './url.entity'
import { CreateUrlDto } from './dto/create-url.dto'
import { generateShortUrl } from '../common/utils/nanoid.util'
import {
  UrlNotFoundException,
  UrlExpiredException,
  AliasAlreadyExistsException,
} from '../common/exceptions'
import { AnalyticsService } from '../analytics/analytics.service'

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private analyticsService: AnalyticsService,
  ) {}

  async create(createUrlDto: CreateUrlDto): Promise<Url> {
    const { originalUrl, expiresAt, alias } = createUrlDto

    const shortUrl = alias || generateShortUrl()

    const existingUrl = await this.urlRepository.findOne({ where: { shortUrl } })

    if (existingUrl) {
      throw AliasAlreadyExistsException()
    }

    const url = this.urlRepository.create({
      originalUrl,
      shortUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    })

    return this.urlRepository.save(url)
  }

  async findOriginalUrl(shortUrl: string, ipAddress: string): Promise<string> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } })

    if (!url) {
      throw UrlNotFoundException()
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      throw UrlExpiredException()
    }

    url.clickCount += 1
    await this.urlRepository.save(url)

    await this.analyticsService.recordClick(url, ipAddress)

    return url.originalUrl
  }

  async getUrlInfo(
    shortUrl: string,
  ): Promise<{ originalUrl: string; createdAt: Date; clickCount: number }> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } })

    if (!url) {
      throw UrlNotFoundException()
    }

    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    }
  }

  async deleteUrl(shortUrl: string): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } })

    if (!url) {
      throw UrlNotFoundException()
    }

    await this.urlRepository.delete(url.id)
  }
}
