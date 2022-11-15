// @ts-nocheck

import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

// This is antipatternm it's not possible to call Fingerprint Pro agent from the server-side context, will result in window undefined error
function AntipaterngetStaticSiteProps({ data }) {
  return <pre>{JSON.stringify(data)}</pre>;
}

// This function gets called at build time on server-side.
// It won't be called on client-side
export async function getStaticProps() {
  let data;
  const fpPromise = FingerprintJS.load({
    apiKey: FINGERPRINT_PUBLIC_API_KEY,
    endpoint: CUSTOM_SUBDOMAIN,
  });

  fpPromise
    .then((fp) => fp.get())
    .then((result) => {
      data = result;
    });

  return {
    props: {
      data: data ?? "document is not defined",
    },
  };
}

export default AntipaterngetStaticSiteProps;
