export default () => {
  return {
    app: {
      isProduction: process.env.NODE_ENV === 'production',
      isDevelopment: process.env.NODE_ENV === 'development',
      isTest: process.env.NODE_ENV === 'test',
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 3000,
    },
    database: {
      url: process.env.DATABASE_URL,
    },
  }
} 