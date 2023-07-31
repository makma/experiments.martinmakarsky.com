import { sequelize } from './dbInit';
import { DataTypes } from 'sequelize';

export const Event = sequelize.define('Event', {
  requestId: {
    type: DataTypes.STRING,
  },
  event: {
    type: DataTypes.STRING,
  },
  isBot: {
    type: DataTypes.BOOLEAN,
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
    eventData: JSON.stringify(event),
    isBot: event.products.botd.data.bot.result !== "notDetected"
  });
}

export async function getBotEvents() {
  const botEvents = await Event.findAll({
    where: {
      isBot: true,
    },
  });

  return botEvents;
}
