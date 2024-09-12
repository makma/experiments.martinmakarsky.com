import { DecryptionAlgorithm, unsealEventsResponse } from "@fingerprintjs/fingerprintjs-pro-server-api";

export async function unsealViaSDK(sealedResultBase64: string, key: Buffer) {
    try {
      const unsealedData = await unsealEventsResponse(Buffer.from(sealedResultBase64, 'base64'), [
        {
          key: key,
          algorithm: DecryptionAlgorithm.Aes256Gcm,
        },
      ]);
      return unsealedData;
    } catch (e) {
      console.error(e);
    }
  }