const puppeteer = require("puppeteer");
const proxies = require("./proxies");
const credentials = require("./credentials");

const TARGET_URL = "https://experiments.martinmakarsky.com/signin";
const BUTTON_SELECTOR = "#signin-submit";

let proxyIndex = 0;

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

async function clickSigninButton(page) {
  const buttonHandle = await page.$(BUTTON_SELECTOR);

  if (!buttonHandle) {
    throw new Error(`Unable to find signin button with selector "${BUTTON_SELECTOR}"`);
  }

  await buttonHandle.click();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBrowserOnce({ useProxies = true, headless = true, shouldAbort } = {}) {
  let logs = "";
  while (true) {
    if (typeof shouldAbort === "function" && shouldAbort()) {
      logs += "Aborted by client.\n";
      break;
    }

    const creds =
      credentials[Math.floor(Math.random() * credentials.length)];
    logs += `Using credentials: ${creds.email}\n`;

    const proxy =
      useProxies && proxies.length > 0
        ? proxies[proxyIndex % proxies.length]
        : null;
    if (proxy) {
      proxyIndex += 1;
    }

    const launchArgs = [];
    if (proxy) {
      const proxyUrl = `http://${proxy.host}:${proxy.port}`;
      launchArgs.push(`--proxy-server=${proxyUrl}`);
      logs += `Using proxy: ${proxy.host}:${proxy.port}\n`;
    } else {
      logs += "Using no proxy\n";
    }

    const browser = await puppeteer.launch({
      headless: headless ? "new" : false,
      args: launchArgs,
    });

    try {
      const page = await browser.newPage();

      if (proxy && proxy.username && proxy.password) {
        await page.authenticate({
          username: proxy.username,
          password: proxy.password,
        });
      }

      await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
      await page.waitForSelector(BUTTON_SELECTOR, { timeout: 10000 });

      await fillSigninForm(page, creds.email, creds.password);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const clickPromise = clickSigninButton(page).catch((error) => {
        logs += `Error clicking button: ${error.message}\n`;
        return null;
      });

      const responsePromise = page
        .waitForResponse(
          (response) => {
            const request = response.request();
            if (!request) return false;
            const method = response.request().method();
            const url = response.url();
            return method === "POST" && url.includes("/api/signin");
          },
          { timeout: 10000 }
        )
        .catch(() => null);

      const response = await Promise.all([
        clickPromise,
        responsePromise,
      ]).then(([, resp]) => resp);

      if (response) {
        const status = response.status();
        const url = response.url();
        logs += `URL: ${url}\n`;
        logs += `Status: ${status}\n`;

        let bodyText = "<unable to read body>";
        try {
          bodyText = await response.text();
        } catch (error) {
          bodyText = `<error reading body: ${error.message}>`;
        }
        const preview =
          bodyText.length > 210000 ? `${bodyText.slice(0, 100)}...` : bodyText;
        logs += `Body (first 100 chars):\n${preview}\n`;
      } else {
        logs += "No matching response within timeout.\n";
      }

      // In headful mode, keep the browser open for 1000ms after the response
      if (!headless) {
        await sleep(1500);
      }
    } finally {
      await browser.close();
    }

    logs += "-----------------------------\n";

    // short pause between attempts
    await sleep(1000);
  }

  return logs;
}

module.exports = { runBrowserOnce };
