module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'not-a-real-api-token',
  DB_URL: process.env.DB_URL || '"postgresql://mrteaseeks@localhost/mrteaseeks"',
  DATABASE_URL: process.env.DATABASE_URL || '"postgresql://mrteaseeks@localhost/mrteaseeks"',
  TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://mrteaseeks:1@localhost/mrteaseekstest',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://mrteaseeks:1@localhost/mrteaseekstest',
};
