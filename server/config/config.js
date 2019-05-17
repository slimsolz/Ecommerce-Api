import dotenv from 'dotenv';

dotenv.config();

const config = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DEVELOPMENT,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_TEST,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "production": {
    "database": process.env.DB_PRODUCTION,
  }
}

export default config;
