import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const BASEURL = 'http://spmwsm02x3zd.saipemnet.saipem.intranet/MeetingBookingApi';
// const BASEURL = '';
const frontRoute = 'MeetingBookingApp';
// const frontRoute = '';
// https://vitejs.dev/config/
export default defineConfig(() => {
  // Use FabsiWebPage path for consistent deployment
  const base = frontRoute + '/';
  
  return {
    base: base,
    plugins: [react()],
    server: {
      // allowedHosts: true,
      proxy: {
        // For development proxying (if you still need it), update the target if necessary.
        '/api': {
          target: BASEURL,
          changeOrigin: true,
          // secure: true,
        },
      },
    },
    build: {
      assetsDir: 'assets',
      copyPublicDir: true,
    },
    publicDir: 'public',
    cacheDir: '.vite-cache',
  };
});


