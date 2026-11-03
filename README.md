# Random Fingerprint Pro Experiments 🕵️‍♂️🚀

Hey there! 👋 Welcome to the Fingerprint Pro NextJS Experiments repo!

## Overview

This repository showcases various usages of Fingerprint Pro within a NextJS project. Please note that this project is for personal use only, and there are no guarantees that it's running and up to date. Be aware of blindly copy-pasting code from this repository. ⚠️

## Disclaimer

This project is a collection of hacks for debugging and testing purposes and does not necessarily adhere to best practices. It's more of an experimental playground than a production-ready example. Use at your own risk! 🛑

## Demo Deployment

You can check out the demo deployed (most of the time) at [experiments.martinmakarsky.com](https://experiments.martinmakarsky.com). 🌐

## How to Run

To get started, follow these simple steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/makma/experiments.martinmakarsky.com.git
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Run the development server:

   ```bash
   yarn dev
   ```

That's it! Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Automation Intelligence demo

`/automation-intelligence` (in `next-app`) sends every request it receives to the Fingerprint [Automation Intelligence API](https://docs.fingerprint.com/reference/automation-intelligence-api) (`POST /v4/edge`, called directly over HTTP, no SDK) and shows the result: bot detection, IP intelligence, proxy/VPN, and the raw response. Point different agents or automation tools at it to see how they are classified.

- Add `?agent=<label>` (letters, digits, `.`, `_`, `-`, up to 64 chars) to tag the run, e.g. `/automation-intelligence?agent=claude-browser`. The label and a per-visit `linked_id` are shown on the page and sent to the API, so the event can be found in the Fingerprint dashboard under **Bots & AI agents**.
- Server-side env vars: `FINGERPRINT_SECRET_API_KEY` and `FINGERPRINT_REGION` (`global`, `eu` or `ap`).
- Tests: `node --test next-app/app/automation-intelligence/edge-api.test.mjs` (unit) and `BASE_URL=http://localhost:3000 npx playwright test tests/automation-intelligence --project=chromium` (end-to-end, calls the real API).
