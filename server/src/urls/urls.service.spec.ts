import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UrlsService } from './urls.service'
import { AnalyticsService } from '../analytics/analytics.service'
import { Url } from './url.entity'
import { CreateUrlDto } from './dto/create-url.dto'
import {
  AliasAlreadyExistsException,
  UrlNotFoundException,
  UrlExpiredException,
} from '../common/exceptions'

const mockUrlRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
})

const mockAnalyticsService = () => ({
  recordClick: jest.fn(),
})

describe('UrlsService', () => {
  let service: UrlsService
  let repository: Repository<Url>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: getRepositoryToken(Url), useFactory: mockUrlRepository },
        { provide: AnalyticsService, useFactory: mockAnalyticsService },
      ],
    }).compile()

    service = module.get<UrlsService>(UrlsService)
    repository = module.get<Repository<Url>>(getRepositoryToken(Url))
  })

  describe('create', () => {
    it('should create a short URL with a unique alias', async () => {
      const createUrlDto: CreateUrlDto = {
        originalUrl: 'https://example.com',
        alias: 'myalias',
      }

      ;(repository.findOne as jest.Mock).mockResolvedValue(undefined)
      ;(repository.create as jest.Mock).mockReturnValue(createUrlDto)
      ;(repository.save as jest.Mock).mockResolvedValue(createUrlDto)

      const result = await service.create(createUrlDto)

      expect(repository.findOne).toHaveBeenCalledWith({ where: { shortUrl: 'myalias' } })
      expect(repository.save).toHaveBeenCalled()
      expect(result.originalUrl).toEqual(createUrlDto.originalUrl)
    })

    it('should throw exception if alias already exists', async () => {
      const createUrlDto: CreateUrlDto = {
        originalUrl: 'https://example.com',
        alias: 'existing',
      }

      ;(repository.findOne as jest.Mock).mockResolvedValue({ shortUrl: 'existing' })

      await expect(service.create(createUrlDto)).rejects.toThrow(AliasAlreadyExistsException)
    })
  })

  describe('findOriginalUrl', () => {
    it('should redirect to original URL', async () => {
      const shortUrl = 'abc123'
      const url = {
        originalUrl: 'https://example.com',
        shortUrl,
        expiresAt: null,
        clickCount: 0,
      }

      ;(repository.findOne as jest.Mock).mockResolvedValue(url)
      ;(repository.save as jest.Mock).mockResolvedValue(true)

      const result = await service.findOriginalUrl(shortUrl, '127.0.0.1')

      expect(repository.findOne).toHaveBeenCalledWith({ where: { shortUrl } })
      expect(repository.save).toHaveBeenCalled()
      expect(result).toEqual('https://example.com')
    })

    it('should throw UrlNotFoundException if URL not found', async () => {
      ;(repository.findOne as jest.Mock).mockResolvedValue(undefined)

      await expect(service.findOriginalUrl('invalid', '127.0.0.1')).rejects.toThrow(
        UrlNotFoundException,
      )
    })

    it('should throw UrlExpiredException if URL expired', async () => {
      const expiredUrl = {
        originalUrl: 'https://expired.com',
        shortUrl: 'expired',
        expiresAt: new Date('2020-01-01'),
        clickCount: 0,
      }

      ;(repository.findOne as jest.Mock).mockResolvedValue(expiredUrl)

      await expect(service.findOriginalUrl('expired', '127.0.0.1')).rejects.toThrow(
        UrlExpiredException,
      )
    })
  })
})
