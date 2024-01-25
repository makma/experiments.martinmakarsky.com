import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: '.data/database.sqlite',
  logging: false,
});