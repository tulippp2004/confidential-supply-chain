/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.VITE_CONTRACT_ADDRESS || '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef12345678',
    NEXT_PUBLIC_NETWORK: process.env.VITE_NETWORK || 'preview',
    NEXT_PUBLIC_PROOF_SERVER_URL: process.env.VITE_PROOF_SERVER_URL || 'http://127.0.0.1:6300',
  },
};

module.exports = nextConfig;
