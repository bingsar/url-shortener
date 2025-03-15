import { customAlphabet } from 'nanoid'

export const generateShortUrl = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  8,
)
