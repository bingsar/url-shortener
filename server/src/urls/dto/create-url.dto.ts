import { IsUrl, IsOptional, IsDateString, MaxLength, Matches, Validate } from 'class-validator'
import { Transform } from 'class-transformer'
import { UrlProtocolValidator } from '../../common/validators/url-protocol.validator'
import { IsFutureDate } from '../../common/validators/is-future-date.validator'

export class CreateUrlDto {
  @IsUrl({}, { message: 'Invalid URL format.' })
  @Validate(UrlProtocolValidator)
  originalUrl: string

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format.' })
  @IsFutureDate({ message: 'expiresAt must be date in future' })
  expiresAt?: string

  @IsOptional()
  @MaxLength(20, { message: 'Alias too long, max length 20 characters.' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Alias contains invalid characters.' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  alias?: string
}
