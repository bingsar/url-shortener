import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          if (!value) return true
          const date = new Date(value)
          return date > new Date()
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be date in future`
        },
      },
    })
  }
}
