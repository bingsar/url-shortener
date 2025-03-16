import { HttpException, HttpStatus } from '@nestjs/common'

export const UrlNotFoundException = () => new HttpException('URL not found', HttpStatus.NOT_FOUND)

export const UrlExpiredException = () => new HttpException('URL expired', HttpStatus.GONE)

export const AliasAlreadyExistsException = () =>
  new HttpException('Alias already exists', HttpStatus.CONFLICT)
