const credentials = require("./credentials");

const URL = "https://experiments.martinmakarsky.com/api/signin";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let iteration = 0;
  let credentialIndex = 0;
  console.log(`Monitoring started at ${new Date().toISOString()}`);
  console.log(`Target: ${URL}`);

  while (true) {
    iteration += 1;
    const creds = credentials[credentialIndex % credentials.length];
    credentialIndex += 1;

    console.log(`\n[${new Date().toISOString()}] Iteration ${iteration} using ${creds.email}`);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: creds.email, password: creds.password }),
      });

      const status = response.status;
      let bodyText = "<unable to read body>";
      try {
        bodyText = await response.text();
      } catch (error) {
        bodyText = `<error reading body: ${error.message}>`;
      }

      const preview = bodyText.length > 100 ? `${bodyText.slice(0, 100)}...` : bodyText;

      console.log(`Status: ${status}`);
      console.log("Body (first 100 chars):");
      console.log(preview);
      console.log("-----------------------------");
    } catch (error) {
      console.error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    await sleep(1000);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});


