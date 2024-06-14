import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';
import { NextResponse } from 'next/server';


export async function DELETE(request: Request) {
  if (request.method !== "DELETE") {
    return NextResponse.json({ message: `${request.method} is not a supported method.` }, { status: 400 });
  }

  // Only I and the CI tests can delete the data, very naive, do not copy this code, harmless on the testing sub, harmful on prod use
  const body = await request.json();
  const deletionSecret = body.deletionSecret;
  if (deletionSecret !== process.env.DELETION_SECRET) {
    return NextResponse.json({ message: `You are not allowed to delete data` }, { status: 403 });
  }

  const visitorIdToDelete = body.visitorIdToDelete;

  if (!visitorIdToDelete) {
    return NextResponse.json({ message: `${visitorIdToDelete} is not a visitorId.` }, { status: 400 });
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