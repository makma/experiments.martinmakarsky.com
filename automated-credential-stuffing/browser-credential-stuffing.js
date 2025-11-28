const puppeteer = require("puppeteer");
const proxies = require("./proxies");
const credentials = require("./credentials");

const TARGET_URL = "https://experiments.martinmakarsky.com/signin-flow";
const BUTTON_SELECTOR = "#signin-submit";
const USE_PROXIES = true;
const HEADLESS = false; // set to false for full browser window

async function fillSigninForm(page, email, password) {

  const emailInput = await page.$("#signin-email");
  if (emailInput) {
    await emailInput.click({ clickCount: 3 });
    await emailInput.type(email);
  }

  const passwordInput = await page.$("#signin-password");
  if (passwordInput) {
    await passwordInput.click({ clickCount: 3 });
    await passwordInput.type(password);
  }
}

async function clickSignupButton(page) {
  const buttonHandle = await page.$(BUTTON_SELECTOR);

  if (!buttonHandle) {
    throw new Error(`Unable to find signup button with selector "${BUTTON_SELECTOR}"`);
  }

  await buttonHandle.click();
}

async function main() {
  let iteration = 0;
  let proxyIndex = 0;
  let credentialIndex = 0;
  console.log(`Monitoring started at ${new Date().toISOString()}`);
  console.log(`Target: ${TARGET_URL}`);

  while (true) {
    iteration += 1;

    const proxy =
      USE_PROXIES && proxies.length > 0
        ? proxies[proxyIndex % proxies.length]
        : null;
    if (proxy) {
      proxyIndex += 1;
    }

    const launchArgs = [];
    if (proxy) {
      const proxyUrl = `http://${proxy.host}:${proxy.port}`;
      launchArgs.push(`--proxy-server=${proxyUrl}`);
      console.log(`\n[${new Date().toISOString()}] Iteration ${iteration} using proxy ${proxy.host}:${proxy.port}`);
    } else {
      console.log(`\n[${new Date().toISOString()}] Iteration ${iteration} without proxy`);
    }

    const browser = await puppeteer.launch({
      headless: HEADLESS ? "new" : false,
      args: launchArgs,
    });
    const page = await browser.newPage();

    if (proxy && proxy.username && proxy.password) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });
    }

    const creds = credentials[credentialIndex % credentials.length];
    credentialIndex += 1;

    await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
    await page.waitForSelector(BUTTON_SELECTOR, { timeout: 10000 });

    await fillSigninForm(page, creds.email, creds.password);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const clickPromise = clickSignupButton(page).catch((error) => {
      console.error(`Error clicking button: ${error.message}`);
      return null;
    });

    const responsePromise = page
      .waitForResponse(
        (response) => {
          const request = response.request();
          if (!request) return false;
          const method = request.method();
          const url = response.url();
          return method === "POST" || url.includes("signup");
        },
        { timeout: 10000 }
      )
      .catch(() => null);

    const response = await Promise.all([clickPromise, responsePromise]).then(([, resp]) => resp);

    if (response) {
      const status = response.status();
      const url = response.url();
      let logOutput =
        `\n[${new Date().toISOString()}] Iteration ${iteration}\n` +
        `URL: ${url}\n` +
        `Status: ${status}\n`;

      if (status !== 200) {
        let bodyText = "<unable to read body>";
        try {
          bodyText = await response.text();
        } catch (error) {
          bodyText = `<error reading body: ${error.message}>`;
        }
        const preview = bodyText.length > 200 ? `${bodyText.slice(0, 200)}...` : bodyText;
        logOutput += `Body (first 200 chars):\n${preview}\n`;
      } else {
        logOutput += "Body: <omitted for status 200>\n";
      }

      console.log(logOutput + "-----------------------------");
    } else {
      console.warn(
        `\n[${new Date().toISOString()}] Iteration ${iteration}: No matching response within timeout.\n` +
          `-----------------------------`
      );
    }

    // Stay on the page briefly after receiving the response
    await new Promise((resolve) => setTimeout(resolve, 500));

    await browser.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
