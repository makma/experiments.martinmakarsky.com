import { DecryptionAlgorithm, FingerprintJsServerApiClient, Region, unsealEventsResponse } from '@fingerprintjs/fingerprintjs-pro-server-api';
import { NextResponse } from 'next/server';


export async function DELETE(request: Request) {
  if (request.method !== "DELETE") {
    return NextResponse.json({ message: `${request.method} is not a supported method.` }, { status: 400 });
  }

  // Only I and the CI tests can delete the data, very naive, do not copy this code, harmless on the testing sub, harmful on prod use
  const { searchParams } = new URL(request.url)
  const deletionSecret = searchParams.get('deletionSecret')
  if (deletionSecret !== process.env.DELETION_SECRET) {
    return NextResponse.json({ message: `You are not allowed to delete data` }, { status: 403 });
  }

  const SEALED_RESULTS_DECRYPTION_KEY = process.env.SEALED_RESULTS_DECRYPTION_KEY;
  if (!SEALED_RESULTS_DECRYPTION_KEY) {
    return NextResponse.json({ message: `Missing SEALED_RESULTS_DECRYPTION_KEY environment variable` }, { status: 500 });
  }

  const body = await request.json();
  const key = Buffer.from(SEALED_RESULTS_DECRYPTION_KEY, 'base64')
  const unsealedResult = await unsealViaSDK(body.sealedFingerprintData.sealedResult, key);

  if (!unsealedResult || !unsealedResult.products.identification || !unsealedResult.products.identification.data) {
    return NextResponse.json({ message: `Invalid unsealed data.` }, { status: 400 });
  }

  const visitorIdToDelete = body.visitorIdToDelete;

  if (!visitorIdToDelete) {
    return NextResponse.json({ message: `${visitorIdToDelete} is not a visitorId.` }, { status: 400 });
  }

  if (visitorIdToDelete === unsealedResult.products.identification.data.visitorId) {
    return NextResponse.json({ message: `Cannot delete since the visitorId to delete is the same as the current visitorId.` }, { status: 400 });
  }

  const secretAPIKey = process.env.FINGERPRINT_SEALED_RESULTS_SECRET_API_KEY
  if (!secretAPIKey) {
    return NextResponse.json({ message: `Missing secret API key.` }, { status: 500 });

  }

  const apiKey = process.env.FINGERPRINT_SECRET_API_KEY ?? "";

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
  });

  try {
    await client.deleteVisitorData(visitorIdToDelete);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }

  return NextResponse.json({ message: `The visitorId: ${visitorIdToDelete} is scheduled to be deleted` }, { status: 200 });
}

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