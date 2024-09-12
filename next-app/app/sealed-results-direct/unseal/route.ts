import { DecryptionAlgorithm, unsealEventsResponse } from '@fingerprintjs/fingerprintjs-pro-server-api';
import { createDecipheriv } from 'crypto';
import { NextResponse } from 'next/server';
import { promisify } from 'util';
import { inflateRaw } from 'zlib';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const unsealementMethod = searchParams.get('method')

  const body = await request.json();
  const sealedResultBase64 = body.sealedResult;

  const SEALED_RESULTS_DECRYPTION_KEY = process.env.SEALED_RESULTS_DECRYPTION_KEY;
  if (!SEALED_RESULTS_DECRYPTION_KEY) {
    throw new Error('Missing SEALED_RESULTS_DECRYPTION_KEY environment variable');
  }

  const key = Buffer.from(SEALED_RESULTS_DECRYPTION_KEY, 'base64')

  if (unsealementMethod === "node") {
    const unsealedResult = await unsealViaSDK(sealedResultBase64, key);
    return NextResponse.json(unsealedResult);
  }

  if (unsealementMethod === "custom") {
    // const unsealedResult = await unsealCustom(sealedResultBase64, key);
    return NextResponse.json({ message: `Custom unsealement not implemented` }, { status: 400 });
    // return NextResponse.json(unsealedResult);
  }

  throw Error("Unsupported unsealement method")
}

// async function unsealCustom(sealedResultBase64: string, key: Buffer) {
//   const sealedResult = Buffer.from(sealedResultBase64, 'base64')
//   const sealedHeader = Buffer.from([0x9E, 0x85, 0xDC, 0xED]);

//   if (sealedResult.subarray(0, sealedHeader.length).toString('hex') !== sealedHeader.toString('hex')) {
//     console.error("Wrong header");
//   }

//   const ivLength = 12
//   const iv = sealedResult.subarray(sealedHeader.length, sealedHeader.length + ivLength)

//   const authTagLength = 16
//   const authTag = sealedResult.subarray(-authTagLength)

//   const ciphertext = sealedResult.subarray(sealedHeader.length + ivLength, -authTagLength)

//   const decipher = createDecipheriv(
//     'aes-256-gcm',
//     new Uint8Array(key), // Convert Buffer to Uint8Array
//     new Uint8Array(iv)   // Convert Buffer to Uint8Array
//   ).setAuthTag(new Uint8Array(authTag));
  

//   const compressed = new Uint8Array(Buffer.concat([decipher.update(ciphertext), decipher.final()]));


//   const payload = await promisify(inflateRaw)(compressed)

//   return JSON.parse(payload.toString());
// }

async function unsealViaSDK(sealedResultBase64: string, key: Buffer) {
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