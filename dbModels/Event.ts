import { sequelize } from './dbInit';
import { DataTypes } from 'sequelize';

export const Event = sequelize.define('Event', {
  requestId: {
    type: DataTypes.STRING,
  },
  ip: {
    type: DataTypes.STRING
  },
  isBot: {
    type: DataTypes.BOOLEAN,
  },
  botType: {
    type: DataTypes.STRING
  },
});

let didInit = false;

export async function initBotEvents() {
  if (didInit) {
    return;
  }

  await Event.sync();
}

export async function persistBotEvent(event: any) {
  return Event.create({
    requestId: event.requestId,
    ip: event.ip,
    isBot: event.bot.result === "bad" || event.bot.result === "good",
    botType: event.bot.result
  });
}

export async function getBotEvents(limit: number = 100) {
  const botEvents = await Event.findAll({
    order: [['createdAt', 'DESC']],
    where: {
      isBot: true,
    },
    limit,
    raw: true
  });

  return botEvents;
}
