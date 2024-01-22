import { createDecipheriv } from 'crypto';
import { NextResponse } from 'next/server';
import { promisify } from 'util';
import { inflateRaw } from 'zlib';

export async function POST(request: Request) {
  const body = await request.json();
  const sealedResultBase64 = body.sealedResult;

  const sealedResult = Buffer.from(sealedResultBase64, 'base64')
  const sealedHeader = Buffer.from([0x9E, 0x85, 0xDC, 0xED]);

  const SEALED_RESULTS_DECRYPTION_KEY = process.env.SEALED_RESULTS_DECRYPTION_KEY;
  if (!SEALED_RESULTS_DECRYPTION_KEY) {
    throw new Error('Missing SEALED_RESULTS_DECRYPTION_KEY environment variable');
  }

  const key = Buffer.from(SEALED_RESULTS_DECRYPTION_KEY, 'base64')

  if (sealedResult.subarray(0, sealedHeader.length).toString('hex') !== sealedHeader.toString('hex')) {
    console.error("Wrong header");
  }

  const ivLength = 12
  const iv = sealedResult.subarray(sealedHeader.length, sealedHeader.length + ivLength)

  const authTagLength = 16
  const authTag = sealedResult.subarray(-authTagLength)

  const ciphertext = sealedResult.subarray(sealedHeader.length + ivLength, -authTagLength)

  const decipher = createDecipheriv('aes-256-gcm', key, iv).setAuthTag(authTag)
  const compressed = Buffer.concat([decipher.update(ciphertext), decipher.final()])

  const payload = await promisify(inflateRaw)(compressed)

  return NextResponse.json(payload.toString());
}