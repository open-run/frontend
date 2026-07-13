const path = require('path')

// Swarm gateway — NFT 카탈로그 이미지(thumbnailUrl)의 호스트.
// 백엔드 nft.swarm-gateway-url과 동일한 값으로 환경별(.env) 설정. 기본값은 api.gateway.ethswarm.org.
const swarmGatewayUrl = new URL(process.env.NEXT_PUBLIC_SWARM_GATEWAY_URL || 'https://api.gateway.ethswarm.org')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@openrun/types', '@openrun/api-client', '@openrun/ui'],
  images: {
    remotePatterns: [
      {
        // Swarm gateway — 호스트는 NEXT_PUBLIC_SWARM_GATEWAY_URL(.env)에서 주입. 위 swarmGatewayUrl 참고.
        protocol: swarmGatewayUrl.protocol.replace(':', ''),
        hostname: swarmGatewayUrl.hostname,
        port: swarmGatewayUrl.port,
        pathname: '/bzz/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/openrun-nft/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '**',
      },
    ],
  },
  // Reown WalletConnect 소셜 로그인 popup이 OAuth 후 window.close()를 호출할 수 있도록
  // COOP를 same-origin-allow-popups로 설정. opener-popup 격리는 유지되어 보안에 안전.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
