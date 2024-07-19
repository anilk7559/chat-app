const path = require('path');
const { i18n } = require('./next-i18next.config');


module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  }, 
  i18n,
  distDir: 'dist/.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. in development we need to run yarn lint
    ignoreDuringBuilds: true
  },
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: process.env.API_SERVER_ENDPOINT || process.env.API_ENDPOINT
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: process.env.API_ENDPOINT,
    SOCKET_ENDPOINT: process.env.SOCKET_ENDPOINT
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/auth/home'
      },
      {
        source: '/favorites',
        destination: '/models?friendOnly=1'
      },
      {
        source: '/login',
        destination: '/auth/login'
      },
      {
        source: '/register',
        destination: '/auth/register'
      },
      {
        source: '/forgot',
        destination: '/auth/forgot'
      },
      {
        source: '/token-history',
        destination: '/tokens/history'
      },
      {
        source: '/bookmarked-messages',
        destination: '/profile/bookmarked-messages'
      },
      {
        source: '/purchased-media',
        destination: '/profile/purchased-media'
      },
      {
        source: '/payout-request',
        destination: '/profile/payout-request'
      },
      {
        source: '/media-content',
        destination: '/profile/media-content'
      },
      {
        source: '/payout-account',
        destination: '/profile/setting/payout-account'
      }
    ];
  }
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/auth/login',
  //       permanent: true
  //     }
  //   ]
  // }
};
