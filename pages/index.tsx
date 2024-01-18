import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Random experiments</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to random{" "}
            <Link href="https://github.com/makma/experiments.martinmakarsky.com">
              Makma&apos;s experiments
            </Link>
          </h1>

          <div className={styles.grid}>
            <Link
              className={styles.card}
              href="/fingerprint-pro-and-botd-subdomain"
            >
              <h2>Fingerprint Pro Custom subdomain &rarr;</h2>
              <p>No lib, TS NPM agent, subdomain setup, extended result</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-and-botd-full-subdomain"
            >
              <h2>Fingerprint Pro Full Custom Subdomain &rarr;</h2>
              <p>
                No lib, TS NPM agent, full subdomain setup (ingress + agent),
                extended result
              </p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-and-botd-direct"
            >
              <h2>Fingerprint Pro Direct &rarr;</h2>
              <p>No lib, TS NPM agent, NO subdomain setup, extended result</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-and-botd-static-agent"
            >
              <h2>Fingerprint Pro Static Agent &rarr;</h2>
              <p>No lib, Static agent, subdomain setup, extended result</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-package-static-agent"
            >
              <h2>Fingerprint Pro React, Static Agent &rarr;</h2>
              <p>
                React library, Static agent, subdomain setup, extended result
              </p>
            </Link>

            <Link className={styles.card} href="/botd-only">
              <h2>BotD only &rarr;</h2>
              <p>No lib, TS NPM agent, subdomain setup, extended result</p>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-cloudflare">
              <h2>Fingerprint Pro Cloudflare &rarr;</h2>
              <p>
                No lib, TS NPM agent, cloudflare integration, extended result
              </p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudflare"
            >
              <h2>Fingerprint Pro React Cloudflare &rarr;</h2>
              <p>React lib, Cloudflare integration, extended result</p>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-akamai">
              <h2>Fingerprint Pro React Akamai &rarr;</h2>
              <p>React lib, Akamai integration</p>
            </Link>

            <Link className={styles.card} href="/custom-proxy-integration">
              <h2>Fingerprint Pro React Custom Proxy Integration &rarr;</h2>
              <p>React library, Custom Proxy Integration</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudflare-strip-url-params"
            >
              <h2>
                Fingerprint Pro React Cloudflare stripping url params &rarr;
              </h2>
              <p>
                React lib, Cloudflare integration, extended result, stripping
                url params
              </p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudflare-subdomain-unmanaged"
            >
              <h2>
                Fingerprint Pro React Cloudflare on subdomain unmanaged &rarr;
              </h2>
              <p>
                Unamanaged and created manually, won&apos;t be upgraded
                automatically
              </p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront"
            >
              <h2>Fingerprint Pro React CloudFront &rarr;</h2>
              <p>React lib, CloudFront integration, extended result</p>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-azure">
              <h2>Fingerprint Pro React Azure &rarr;</h2>
              <p>React lib, Azure integration, extended result</p>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-package">
              <h2>Fingerprint Pro Custom subdomain React lib &rarr;</h2>
              <p>React NPM lib, subdomain setup, extended and basic result</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-spa-package-static-agent"
            >
              <h2>
                Fingerprint Pro Custom subdomain SPA lib static agent&rarr;
              </h2>
              <p>
                React NPM lib, subdomain setup, extended and basic result,
                static agent
              </p>
            </Link>

            <Link className={styles.card} href="/botd-zero-trust">
              <h2>Fingerprint Pro BotD Zero Trust &rarr;</h2>
              <p>Browser SDK (agent), Zero Trust</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-fpnpmcdn-no-subdomain"
            >
              <h2>Fingerprint Pro npmcdn &rarr;</h2>
              <p>No subdomain, eu region</p>
            </Link>

            <Link className={styles.card} href="/gtm">
              <h2>Fingerprint Pro GTM integration &rarr;</h2>
              <p>No subdomain, eu region</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-segment-integration"
            >
              <h2>Fingerprint Pro Segment integration &rarr;</h2>
              <p>No subdomain, eu region</p>
            </Link>
          </div>

          <h2>Server API</h2>

          <div className={styles.grid}>
            <Link className={styles.card} href="/api/events?requestId=">
              <h2>Event info from the Server API</h2>
              <p>API route handler at the edge, NodeJS Server API SDK</p>
            </Link>

            <Link className={styles.card} href="/api/visitors?visitorId=">
              <h2>Visitor info from the Server API</h2>
              <p>API route handler at the edge, NodeJS Server API SDK</p>
            </Link>

            <Link className={styles.card} href="/events?requestId=">
              <h2>Event info from the Server API</h2>
              <p>getServerSideProps at the edge, NodeJS Server API SDK</p>
            </Link>
          </div>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
