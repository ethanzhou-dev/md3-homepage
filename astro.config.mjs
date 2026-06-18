import { defineConfig, passthroughImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  image: {
    service: passthroughImageService()
  },
  output: 'server',
  adapter: cloudflare(),
  vite: {
    ssr: {
      noExternal: ['@material/material-color-utilities']
    }
  }
});
