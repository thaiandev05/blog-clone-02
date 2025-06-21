import { registerAs } from '@nestjs/config'

export default registerAs('cookie', () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  domain: process.env.COOKIE_DOMAIN,
})) 