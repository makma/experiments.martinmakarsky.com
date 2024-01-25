import { fpjsPlugin, type FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3';
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { FINGERPRINT_PUBLIC_API_KEY } from '~/constants';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    nuxtApp.vueApp.use(
        fpjsPlugin as any,
        {
            loadOptions: {
                apiKey: FINGERPRINT_PUBLIC_API_KEY,
                region: 'eu'
            },
        } as FpjsVueOptions
    );
});