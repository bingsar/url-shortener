import { Controller, Post, Body, Get, Param, Res, Delete, Ip } from '@nestjs/common'
import { UrlsService } from './urls.service'
import { CreateUrlDto } from './dto/create-url.dto'
import { Response } from 'express'

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    const url = await this.urlsService.create(createUrlDto)
    return { shortUrl: url.shortUrl }
  }

  @Get(':shortUrl')
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
    @Ip() ipAddress: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.urlsService.findOriginalUrl(shortUrl, ipAddress)
    return res.redirect(originalUrl)
  }

  @Get('info/:shortUrl')
  async getUrlInfo(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.getUrlInfo(shortUrl)
  }

  @Delete('delete/:shortUrl')
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    await this.urlsService.deleteUrl(shortUrl)
    return { message: 'URL deleted successfully' }
  }
}
