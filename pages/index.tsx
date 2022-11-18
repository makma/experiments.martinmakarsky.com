import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Random experiments</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to random experiments</h1>

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
            <p>No lib, TS NPM agent, cloudflare integration, extended result</p>
          </Link>

          <Link className={styles.card} href="/fingerprint-pro-react-package">
            <h2>Fingerprint Pro Custom subdomain React lib &rarr;</h2>
            <p>React NPM lib, subdomain setup, extended and basic result</p>
          </Link>

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
  );
}
