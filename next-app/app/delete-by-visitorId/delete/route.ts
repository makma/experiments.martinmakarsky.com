import { DecryptionAlgorithm, unsealEventsResponse } from '@fingerprintjs/fingerprintjs-pro-server-api';
import { NextResponse } from 'next/server';


export async function DELETE(request: Request) {
  if (request.method !== "DELETE") {
    return NextResponse.json({ message: `${request.method} is not a supported method.` }, { status: 400 });
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

  // Only I can delete the data
  const requestVisitorId = unsealedResult.products.identification.data.visitorId;
  if (requestVisitorId !== "phKwbdoV8NEAGTATwAiT") {
    return NextResponse.json({ message: `${requestVisitorId} is not allowed to delete data` }, { status: 403 });
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

  const headers = {
    "Content-Type": "application/json",
    "Auth-API-Key": secretAPIKey
  };

  const response = await fetch(`https://eu.api.fpjs.io/visitors/${visitorIdToDelete}`, {
    method: "DELETE",
    headers: headers,
  });
  console.log(response.status)
  console.log(response.body)
  if (response.status !== 200) {
    return NextResponse.json({ message: { status: response.status, body: response.body } }, { status: 500 });
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