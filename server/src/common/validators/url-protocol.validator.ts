import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'urlProtocol', async: false })
export class UrlProtocolValidator implements ValidatorConstraintInterface {
  validate(url: string): boolean {
    return /^(https?:\/\/)/.test(url)
  }

  defaultMessage() {
    return 'URL must start with http:// or https://'
  }
}
