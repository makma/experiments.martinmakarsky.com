addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const requestClone = request.clone();

    if (request.method === "POST") {
        try {
            const requestBody = await request.json();
            const sealedResult = requestBody.fingerprintData.sealedResult;
            const base64Key = ENCRYPTION_KEY;
            const unsealedData = await unsealEventsResponse(sealedResult, base64Key);
            const fingerprintData = JSON.parse(unsealedData);

            // Fetch rules from KV store with better error handling
            let rulesData;
            try {
                rulesData = await FP_WALL_KV_RULES.get("rules", { type: "json" });
                if (!rulesData || !rulesData.rules) {
                    console.error("No rules found in KV store");
                    return new Response("Configuration error", { status: 500 });
                }
            } catch (kvError) {
                console.error("Failed to fetch rules from KV:", kvError);
                return new Response("Configuration error", { status: 500 });
            }

            // Apply rules from the rules array inside the rulesData object
            for (const rule of rulesData.rules) {
                if (await evaluateRule(rule, fingerprintData)) {
                    return new Response(rule.message, { status: rule.status });
                }
            }

            // Forward the cloned request if no rules were violated
            return fetch(requestClone).then((oldResponse) => new Response(oldResponse.body, oldResponse));
        } catch (error) {
            console.error("Error processing request:", error);
            return new Response("Malformed unexpected request", { status: 403 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
}

async function evaluateRule(rule, data) {
    const { expression, operator, value } = rule;
    const parts = expression.split('.');
    let result = data;
    
    // Safely traverse the object path
    for (const part of parts) {
        if (result && typeof result === 'object') {
            result = result[part];
        } else {
            return false;
        }
    }

    switch (operator) {
        case 'eq':
            return result === value;
        case 'gt':
            return result > value;
        case 'lt':
            return result < value;
        case 'ne':
            return result !== value;
        default:
            return false;
    }
}

// Bellow is just the unsealemnet logic, quickly hacked, not tested thoroughly; ref: https://dev.fingerprint.com/docs/sealed-client-results
async function unsealEventsResponse(sealedDataBase64, base64Key) {
    // Convert base64 to Uint8Array
    const key = base64ToUint8Array(base64Key);
    const data = base64ToUint8Array(sealedDataBase64);
  
    // Define the header and lengths
    const sealedHeaderHex = '9E85DCED';
    const sealedHeader = hexToUint8Array(sealedHeaderHex);
    const nonceLength = 12;
    const authTagLength = 16;
  
    // Verify header
    const header = data.slice(0, sealedHeader.length);
    if (uint8ArrayToHex(header).toUpperCase() !== sealedHeaderHex) {
        throw new Error("Wrong header");
    }
  
    // Extract nonce, ciphertext, and authTag
    const nonce = data.slice(sealedHeader.length, sealedHeader.length + nonceLength);
    const ciphertext = data.slice(sealedHeader.length + nonceLength, -authTagLength);
    const authTag = data.slice(-authTagLength);
  
    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );
  
    try {
        // Decrypt the data
        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: nonce },
            cryptoKey,
            new Uint8Array([...ciphertext, ...authTag])
        );
  
        // Convert the decrypted data from ArrayBuffer to Uint8Array
        const decryptedArray = new Uint8Array(decrypted);
  
        return await decompress(decryptedArray)
    } catch (error) {
        console.error("Decryption error details:", error);
        throw new Error("Decryption failed: " + error.message);
    }
  }
  
  function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  
  function hexToUint8Array(hex) {
    const length = hex.length / 2;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }
  
  function uint8ArrayToHex(uint8Array) {
    return Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
  }
  
  
  /**
  * Decompress bytes into a UTF-8 string.
  *
  * @param {Uint8Array} compressedBytes
  * @returns {Promise<string>}
  */
  async function decompress(compressedBytes) {
    // Convert the bytes to a stream.
    const stream = new Blob([compressedBytes]).stream();
  
    // Create a decompressed stream.
    const decompressedStream = stream.pipeThrough(
        new DecompressionStream("deflate-raw")
    );
  
    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of decompressedStream) {
        chunks.push(chunk);
    }
    const stringBytes = await concatUint8Arrays(chunks);
  
    // Convert the bytes to a string.
    return new TextDecoder().decode(stringBytes);
  }
  
  /**
  * Combine multiple Uint8Arrays into one.
  *
  * @param {ReadonlyArray<Uint8Array>} uint8arrays
  * @returns {Promise<Uint8Array>}
  */
  async function concatUint8Arrays(uint8arrays) {
    const blob = new Blob(uint8arrays);
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  }


// Rules in the KV stored

// {rules:[
//     {
//         expression: "products.identification.data.timestamp",
//         operator: "lt",
//         value: "${Date.now() - 5000}", // Note: This will need to be evaluated at runtime
//         message: "Timestamp is older than 5 seconds!",
//         status: 403
//     },
//     {
//         expression: "products.botd.data.bot.result",
//         operator: "ne",
//         value: "notDetected",
//         message: "Bots are forbidden!",
//         status: 403
//     },
//     {
//         expression: "products.suspectScore.data.result",
//         operator: "gt",
//         value: 10,
//         message: "Suspect score!",
//         status: 403
//     },
//     {
//         expression: "products.ipBlocklist.data.result",
//         operator: "eq",
//         value: true,
//         message: "IP Blocklist!",
//         status: 403
//     },
//     {
//         expression: "products.tampering.data.result",
//         operator: "eq",
//         value: true,
//         message: "Tampering is forbidden!",
//         status: 403
//     }
// ]}