import { Sequelize } from 'sequelize';
import dbConfig  from '../config/config';

const seq:Sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  pool: {
    max: dbConfig.max,
    min: dbConfig.min,
    idle: dbConfig.idle
  }
});

export const authenticateDb = async () => {
  try {
    await seq.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default seq;
