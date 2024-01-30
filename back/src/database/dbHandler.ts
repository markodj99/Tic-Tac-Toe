import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DATABASENAME || 'db_name';
const dbUsername = process.env.DATABASEUSERNAME || 'db_username';
const dbPassword = process.env.DATABASEPASSWORD || 'db_password';
const dbHost = process.env.DATABASEHOST || 'db_host';
const port = process.env.DATABASEPORT ? parseInt(process.env.DATABASEPORT, 10) : 10;

const seq:Sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
  port: port,
  pool: {
    max: 9,
    min: 0,
    idle: 10000
  },
  logging: false
});

export const authenticateDb = async () => {
  try {
    await seq.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default seq;
