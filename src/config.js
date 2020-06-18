module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN || 'not-a-real-api-token',
  DB_URL: process.env.DB_URL || 'postgresql://mrteaseeks:1@localhost/teaclippings',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mrteaseeks:1@localhost/teaclippings',
  TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://mrteaseeks:1@localhost/teaclippingstest',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://mrteaseeks:1@localhost/mrteaseekstest',
};
