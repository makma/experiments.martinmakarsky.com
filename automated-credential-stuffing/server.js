const path = require("path");
const express = require("express");
const { runHttpOnce } = require("./http-run-once");
const { runBrowserOnce } = require("./browser-run-once");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/http", async (req, res) => {
  let aborted = false;
  req.on("close", () => {
    aborted = true;
  });

  try {
    const logs = await runHttpOnce({ shouldAbort: () => aborted });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

app.post("/api/browser", async (req, res) => {
  const { useProxies = true, headless = true } = req.body || {};
  let aborted = false;
  req.on("close", () => {
    aborted = true;
  });

  try {
    const logs = await runBrowserOnce({
      useProxies,
      headless,
      shouldAbort: () => aborted,
    });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

// Serve the Evil Console UI only for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Evil console running at http://localhost:${PORT}`);
});
