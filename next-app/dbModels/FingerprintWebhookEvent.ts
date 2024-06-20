import { WebhookEvent } from '../shared/models';
import { sequelize } from './dbInit';
import { DataTypes, Op } from 'sequelize';

export const FingerprintWebhookEvent = sequelize.define('FingerprintWebhookEvent', {
  requestId: {
    type: DataTypes.STRING,
  },
  headers: {
    type: DataTypes.STRING
  },
  body: {
    type: DataTypes.STRING,
  }
});

let didInit = false;

export async function initFingerprintWebhookEvents() {
  if (didInit) {
    return;
  }

  await FingerprintWebhookEvent.sync();
}

export async function persistFingerprintWebhookEvent(event: any) {
  return FingerprintWebhookEvent.create({
    requestId: event.requestId,
    headers: event.headers,
    body: event.body
  });
}

export async function getFingerprintWebhookEvent(requestId: string) {
  const fingerprintWebhookEvent = (await FingerprintWebhookEvent.findOne({
    where: {
      requestId: {
        [Op.eq]: requestId
      },
    },
    })) as unknown as WebhookEvent

  fingerprintWebhookEvent.headers = (JSON.parse(fingerprintWebhookEvent.headers) as any)
  fingerprintWebhookEvent.body = (JSON.parse(fingerprintWebhookEvent.body) as any)
  
  return fingerprintWebhookEvent;
}
