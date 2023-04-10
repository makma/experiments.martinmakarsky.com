// @ts-nocheck

import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
import {
  CUSTOM_SUBDOMAIN,
  FINGERPRINT_PUBLIC_API_KEY,
} from "../shared/constants";

// This is antipatternm it's not possible to call Fingerprint Pro agent from the server-side context, will result in window undefined error
function AntipaternGetServeSideProps({ data }) {
  return <pre>{JSON.stringify(data)}</pre>;
}

// Just a hack to be able to build on CloudFlare
export const config = {
  runtime: "experimental-edge",
};

// This gets called on every request
export async function getServerSideProps() {
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

export default AntipaternGetServeSideProps;
