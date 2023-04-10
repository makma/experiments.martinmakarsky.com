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

          <h2>Experiments with implemented best practives</h2>

          <div className={styles.grid}>
            <Link className={styles.card} href="/fingerprint-pro-and-botd">
              <h2>Fingerprint Pro Custom subdomain &rarr;</h2>
              <p>No lib, TS NPM agent, subdomain setup, extended result</p>
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
              href="/fingerprint-pro-react-cloudfront"
            >
              <h2>Fingerprint Pro React CloudFront &rarr;</h2>
              <p>React lib, CloudFront integration, extended result</p>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront"
            >
              <h2>Fingerprint Pro React Cloudflare &rarr;</h2>
              <p>React lib, CloudFront integration, extended result</p>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-azure">
              <h2>Fingerprint Pro React Cloudflare &rarr;</h2>
              <p>React lib, Azure integration, extended result</p>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-package">
              <h2>Fingerprint Pro Custom subdomain React lib &rarr;</h2>
              <p>React NPM lib, subdomain setup, extended and basic result</p>
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
          </div>

          <h2>Anti-patterns - do not follow!</h2>

          <div className={styles.grid}>
            <Link className={styles.card} href="/antipatern-getStaticProps">
              <h2>Fingerprint Pro not working in the server-side context</h2>
              <p>getStaticProps</p>
            </Link>

            <Link className={styles.card} href="/antipatern-getServerSideProps">
              <h2>Fingerprint Pro not working in the server-side context</h2>
              <p>getServerSideProps</p>
            </Link>
          </div>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
