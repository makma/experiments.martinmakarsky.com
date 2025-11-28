const puppeteer = require("puppeteer");
const proxies = require("./proxies");

const TARGET_URL = "https://experiments.martinmakarsky.com/signup-flow";
const BUTTON_TEXT = "sign up";
const USE_PROXIES = true;

async function clickSignupButton(page) {
  const buttonHandle = await page.evaluateHandle((text) => {
    const lowerText = text.toLowerCase();
    const buttons = Array.from(document.querySelectorAll("button"));
    return (
      buttons.find((btn) => btn.textContent && btn.textContent.trim().toLowerCase().includes(lowerText)) ||
      null
    );
  }, BUTTON_TEXT);

  if (!buttonHandle || !(await buttonHandle.asElement())) {
    throw new Error(`Unable to find a button containing text "${BUTTON_TEXT}"`);
  }

  const elementHandle = buttonHandle.asElement();
  await elementHandle.click();
}

async function main() {
  let iteration = 0;
  console.log(`Monitoring started at ${new Date().toISOString()}`);
  console.log(`Target: ${TARGET_URL}`);

  while (true) {
    iteration += 1;

    const proxy = USE_PROXIES
      ? proxies[Math.floor(Math.random() * proxies.length)]
      : null;

    const launchArgs = [];
    if (proxy) {
      const proxyUrl = `http://${proxy.host}:${proxy.port}`;
      launchArgs.push(`--proxy-server=${proxyUrl}`);
      console.log(`\n[${new Date().toISOString()}] Iteration ${iteration} using proxy ${proxy.host}:${proxy.port}`);
    } else {
      console.log(`\n[${new Date().toISOString()}] Iteration ${iteration} without proxy`);
    }

    const browser = await puppeteer.launch({ headless: "new", args: launchArgs });
    const page = await browser.newPage();

    if (proxy && proxy.username && proxy.password) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });
    }

    await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
    await page.waitForFunction(
      (text) => {
        const lowerText = text.toLowerCase();
        return Array.from(document.querySelectorAll("button")).some(
          (btn) => btn.textContent && btn.textContent.trim().toLowerCase().includes(lowerText)
        );
      },
      { timeout: 10000 },
      BUTTON_TEXT
    );

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
        logOutput += `Body:\n${bodyText}\n`;
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
