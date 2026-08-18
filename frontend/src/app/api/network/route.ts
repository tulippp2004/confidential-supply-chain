import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const networkInfo = {
    network: 'preview',
    name: 'Midnight Preview Testnet',
    faucetUrl: 'https://faucet.preview.midnight.network/',
    rpcUrl: 'https://rpc.preview.midnight.network',
    indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
    proofServerUrl: process.env.NEXT_PUBLIC_PROOF_SERVER_URL || 'http://127.0.0.1:6300',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef1234567',
    status: 'operational',
    version: '2.0.0-august',
  };

  return NextResponse.json(networkInfo);
}
