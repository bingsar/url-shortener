export const convertToIpv4 = (ip: string): string => {
  if (ip === '::1') {
    return '127.0.0.1'
  }

  if (ip && ip.includes('::ffff:')) {
    return ip.split('::ffff:')[1]
  }

  return ip
}
