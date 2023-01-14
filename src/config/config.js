const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    development: {
        username: process.env.POSTGRES_USER,
        password: "postgres",
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        dialect: "postgres",
        logging: false,
        timezone: "-00:00",
        dialectOptions: {
            useUTC: true
        },
        pool: {
            max: 10,
            min: 0,
            idle: 10000,
            acquire: 20000
        }
    },
    production: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        dialect: "postgres",
        logging: false,
        timezone: "-00:00",
        dialectOptions: {
            useUTC: true
        },
        pool: {
            max: 10,
            min: 0,
            idle: 10000,
            acquire: 20000
        }
    }
};
