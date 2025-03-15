import { NotFoundException, GoneException, ConflictException } from '@nestjs/common'

export class UrlNotFoundException extends NotFoundException {
  constructor() {
    super('URL not found')
  }
}

export class UrlExpiredException extends GoneException {
  constructor() {
    super('URL expired')
  }
}

export class AliasAlreadyExistsException extends ConflictException {
  constructor() {
    super('Alias already exists')
  }
}
