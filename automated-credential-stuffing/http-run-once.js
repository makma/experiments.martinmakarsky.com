const credentials = require("./credentials");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runHttpOnce(options = {}) {
  const { shouldAbort } = options;
  let logs = "";
  const URL = "https://experiments.martinmakarsky.com/api/signin";

  while (true) {
    if (typeof shouldAbort === "function" && shouldAbort()) {
      logs += "Aborted by client.\n";
      break;
    }

    const creds =
      credentials[Math.floor(Math.random() * credentials.length)];

    logs += `Using credentials: ${creds.email}\n`;

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

      const preview =
        bodyText.length > 100 ? `${bodyText.slice(0, 100)}...` : bodyText;

      logs += `Status: ${status}\n`;
      logs += "Body (first 100 chars):\n";
      logs += `${preview}\n`;
    } catch (error) {
      logs += `Request failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`;
    }

    logs += "-----------------------------\n";

    await sleep(1000);
  }

  return logs;
}

module.exports = { runHttpOnce };
