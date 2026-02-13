export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // No-op placeholder: previously imported Sentry server config.
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // No-op placeholder: previously imported Sentry edge config.
  }
}
