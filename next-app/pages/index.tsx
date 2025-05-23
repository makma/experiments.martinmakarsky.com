import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";

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
            <Link className={styles.card} href="/fingerprint-pro-subdomain">
              <h2>Fingerprint Pro Custom subdomain &rarr;</h2>
              <p>No lib, TS NPM agent, subdomain setup, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-full-subdomain"
            >
              <h2>Fingerprint Pro Full Custom Subdomain &rarr;</h2>
              <p>
                No lib, TS NPM agent, full subdomain setup (ingress + agent),
                extended result
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-full-subdomain-sample-environment"
            >
              <h2>
                Fingerprint Pro Full Custom Subdomain, Sample environment &rarr;
              </h2>
              <p>
                No lib, TS NPM agent, full subdomain setup (ingress + agent),
                extended result, sample environment
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-direct">
              <h2>Fingerprint Pro Direct &rarr;</h2>
              <p>No lib, TS NPM agent, NO subdomain setup, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-direct-custom-tls-endpoint"
            >
              <h2>Fingerprint Pro Direct TLS endpoint testing &rarr;</h2>
              <p>No lib, TS NPM agent, No subdomain setup, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-static-agent">
              <h2>Fingerprint Pro Static Agent &rarr;</h2>
              <p>No lib, Static agent, subdomain setup, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-package-static-agent"
            >
              <h2>Fingerprint Pro React, Static Agent &rarr;</h2>
              <p>
                React library, Static agent, subdomain setup, extended result
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-cloudflare">
              <h2>Fingerprint Pro Cloudflare &rarr;</h2>
              <p>
                No lib, TS NPM agent, cloudflare integration, extended result
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-2nd-managed-integration"
            >
              <h2>Fingerprint Pro Cloudflare 2nd manged integration &rarr;</h2>
              <p>
                No lib, TS NPM agent, managed, cloudflare integration, extended
                result
              </p>
              <div>
                <pre>requests goes to: sub_AHhMVKY0HFYj3W</pre>
                <pre>created and managed at: sub_8VLhgjoASvOwjH</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-staging"
            >
              <h2>Fingerprint Pro Cloudflare &rarr;</h2>
              <p>
                No lib, TS NPM agent, cloudflare integration, extended result
              </p>
              <div>
                <pre>subId: sub_urYq4aadcfypu0</pre>
                <pre>env: staging</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-fastly-vcl">
              <h2>Fingerprint Pro Fastly VCL &rarr;</h2>
              <p>
                No lib, TS NPM agent, Fastly VCL Integration, extended result
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/fastly-logo.svg"
                width={80}
                height={50}
                alt="Fastly logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-fastly-compute-edge-proxy-integration-open-client-response"
            >
              <h2>
                Fingerprint Pro Fastly Edge Compute Open Client Response &rarr;
              </h2>
              <p>
                NPM agent, Fastly Edge Compute Proxy Integration, Open Client
                Response
              </p>
              <div>
                <pre>subId: sub_KpQKsqB3pwVKwi</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/fastly-logo.svg"
                width={80}
                height={50}
                alt="Fastly logo"
              />
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudflare"
            >
              <h2>Fingerprint Pro React Cloudflare &rarr;</h2>
              <p>React lib, Cloudflare integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-manual"
            >
              <h2>Fingerprint Pro React Cloudflare Manual setup &rarr;</h2>
              <p>React lib, Cloudflare integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-manual-terraform"
            >
              <h2>
                Fingerprint Pro React Cloudflare Manual Terraform setup &rarr;
              </h2>
              <p>React lib, Cloudflare integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link className={styles.card} href="/nuxt/fingerprint-pro-vue">
              <h2>Fingerprint Pro Vue &rarr;</h2>
              <p>Vue3 lib, No Proxy, NuxtJS3 environment</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/vue-logo.svg"
                width={80}
                height={50}
                alt="Vue logo"
              />
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-akamai">
              <h2>Fingerprint Pro React Akamai &rarr;</h2>
              <p>React lib, Akamai integration</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/akamai-logo.svg"
                width={80}
                height={50}
                alt="Akamai logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link className={styles.card} href="/custom-proxy-integration">
              <h2>Fingerprint Pro React Custom Proxy Integration &rarr;</h2>
              <p>React library, Custom Proxy Integration</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/custom-proxy-integration-open-client-response"
            >
              <h2>
                Fingerprint Pro React Custom Proxy Integration, Open Client
                Response &rarr;
              </h2>
              <p>React library, Custom Proxy Integration</p>
              <div>
                <pre>subId: sub_KpQKsqB3pwVKwi</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
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
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
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
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront"
            >
              <h2>Fingerprint Pro React CloudFront &rarr;</h2>
              <p>React lib, CloudFront integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudfront-logo.svg"
                width={80}
                height={50}
                alt="Cloudfront logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront-v1-terraform"
            >
              <h2>
                Fingerprint Pro React CloudFront v1 to upgrade, terraform &rarr;
              </h2>
              <p>React lib, CloudFront v1 integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudfront-logo.svg"
                width={80}
                height={50}
                alt="Cloudfront logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
              <Image
                className={styles.card_logo}
                src="images/terraform-logo.svg"
                width={80}
                height={50}
                alt="Terraform logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront-v2-terraform"
            >
              <h2>Fingerprint Pro React CloudFront v2, terraform &rarr;</h2>
              <p>React lib, CloudFront v2 integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudfront-logo.svg"
                width={80}
                height={50}
                alt="Cloudfront logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
              <Image
                className={styles.card_logo}
                src="images/terraform-logo.svg"
                width={80}
                height={50}
                alt="Terraform logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront-v2-official-terraform"
            >
              <h2>
                Fingerprint Pro React CloudFront v2, official terraform module
                &rarr;
              </h2>
              <p>React lib, CloudFront v2 integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudfront-logo.svg"
                width={80}
                height={50}
                alt="Cloudfront logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
              <Image
                className={styles.card_logo}
                src="images/terraform-logo.svg"
                width={80}
                height={50}
                alt="Terraform logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-react-cloudfront-v2-terraform-staging"
            >
              <h2>
                Fingerprint Pro React CloudFront v2, terraform, staging &rarr;
              </h2>
              <p>React lib, CloudFront v2 integration, staging</p>
              <div>
                <pre>subId: sub_urYq4aadcfypu0</pre>
                <pre>env: staging</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudfront-logo.svg"
                width={80}
                height={50}
                alt="Cloudfront logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
              <Image
                className={styles.card_logo}
                src="images/terraform-logo.svg"
                width={80}
                height={50}
                alt="Terraform logo"
              />
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-react-azure">
              <h2>Fingerprint Pro React Azure &rarr;</h2>
              <p>React lib, Azure integration, extended result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/azure-logo.svg"
                width={80}
                height={50}
                alt="Azure logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>
            <Link className={styles.card} href="/fingerprint-pro-react-package">
              <h2>Fingerprint Pro Custom subdomain React lib &rarr;</h2>
              <p>React NPM lib, subdomain setup, extended and basic result</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
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
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-on-demand-identification-static"
            >
              <h2>Static Fingerprint Pro On Demand Identification&rarr;</h2>
              <p>Static lib</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-on-demand-identification-pro-cdn"
            >
              <h2>Fingerprint Pro On Demand Identification&rarr;</h2>
              <p>Pro CDN lib</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link className={styles.card} href="/fingerprint-pro-zero-trust">
              <h2>Fingerprint Pro, Zero Trust &rarr;</h2>
              <p>Browser SDK (agent), Zero Trust</p>
              <div>
                <pre>subId: sub_8VLhgjoASvOwjH</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link className={styles.card} href="/sealed-results-direct">
              <h2>Sealed Results &rarr;</h2>
              <p>Basic NPM package, Direct requests</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/sealed-results-cloudflare-integration-react"
            >
              <h2>Sealed Results &rarr;</h2>
              <p>React lib, Cloudflare integration</p>
              <div>
                <pre>subId: sub_Ezq3jYsYhAKyXJ</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Fastly logo"
              />
              <Image
                className={styles.card_logo}
                src="images/react-logo.svg"
                width={80}
                height={50}
                alt="React logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-fpnpmcdn-no-subdomain"
            >
              <h2>Fingerprint Pro npmcdn &rarr;</h2>
              <p>No subdomain, eu region</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link className={styles.card} href="/gtm">
              <h2>Fingerprint Pro GTM integration &rarr;</h2>
              <p>No subdomain, eu region</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-segment-integration"
            >
              <h2>Fingerprint Pro Segment integration &rarr;</h2>
              <p>No subdomain, eu region</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
            </Link>
          </div>

          <h2>Server API</h2>

          <div className={styles.grid}>
            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-server-api-sdk"
            >
              <h2>
                Event info from the Server API based on the current requestId
              </h2>
              <p>
                NodeJS Server API SDK, requestId returned through the Cloudflare
                Integration
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-dotnet-server-api-sdk"
            >
              <h2>
                Event info from the .NET Server API based on the current
                requestId
              </h2>
              <p>
                Server API SDK, requestId returned through the Cloudflare
                Integration
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/dotnet-logo.svg"
                width={80}
                height={50}
                alt="Dotnet logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="/fingerprint-pro-cloudflare-go-server-api-sdk"
            >
              <h2>
                Event info from the Go Server API SDK based on the current
                requestId
              </h2>
              <p>
                Go Server API SDK, requestId returned through the Cloudflare
                Integration
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/golang-logo.svg"
                width={80}
                height={50}
                alt="Golang logo"
              />
            </Link>

            <Link className={styles.card} href="/api/events?requestId=">
              <h2>Event info from the Server API</h2>
              <p>API route handler at the edge, NodeJS Server API SDK</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link className={styles.card} href="/api/events-search">
              <h2>Events Search API</h2>
              <p>API route handler, NodeJS Server API SDK</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link className={styles.card} href="/api/visitors?visitorId=">
              <h2>Visitor info from the Server API</h2>
              <p>API route handler at the edge, NodeJS Server API SDK</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link className={styles.card} href="/events?requestId=">
              <h2>Event info from the Server API</h2>
              <p>getServerSideProps at the edge, NodeJS Server API SDK</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link className={styles.card} href="/delete-by-visitorId">
              <h2>Delete data by the visitorId</h2>
              <p>Protected by the sealed results</p>
              <div>
                <pre>subId: sub_Ezq3jYsYhAKyXJ</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>
          </div>

          <h2>Webhooks</h2>
          <div className={styles.grid}>
            <Link
              className={styles.card}
              href="/fingerprint-pro-webhook-event?requestId="
            >
              <h2>Webhooks</h2>
              <p>
                Get the webhook response for the specific requestId, webhook
                signatures
              </p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
            </Link>

            <Link
              className={styles.card}
              href="https://experiments-martinmakarsky.azurewebsites.net/api/webhook-event-info/validate-webhook-signature/"
            >
              <h2>Webhooks Signature Verification dotnet SDK</h2>
              <p>Get the webhook signature verification Dotnet SDK</p>
              <div>
                <pre>subId: sub_AHhMVKY0HFYj3W</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/dotnet-logo.svg"
                width={80}
                height={50}
                alt="Dotnet logo"
              />
            </Link>
          </div>

          <h2>Random</h2>
          <div className={styles.grid}>
            <Link className={styles.card} href="/login">
              <h2>Login?!</h2>
              <p>Nobody knows</p>
              <div>
                <pre>subId: sub_Ezq3jYsYhAKyXJ</pre>
                <pre>env: prod</pre>
              </div>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
            </Link>

            <Link className={styles.card} href="/signup-flow">
              <h2>Signup Flow</h2>
              <p>Signup Flow</p>
              <Image
                className={styles.card_logo}
                src="images/node-logo.svg"
                width={80}
                height={50}
                alt="Node logo"
              />
              <Image
                className={styles.card_logo}
                src="images/cloudflare-logo.svg"
                width={80}
                height={50}
                alt="Cloudflare logo"
              />
            </Link>
          </div>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
