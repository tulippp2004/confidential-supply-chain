import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const ledgerState = {
    isSystemActive: true,
    totalCertifications: 28,
    passCount: 24,
    supplierCount: 11,
    complianceThreshold: 75,
    verifiedTierCount: 14,
    passRate: '85.7%',
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef1234567',
    network: process.env.NEXT_PUBLIC_NETWORK || 'preview',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(ledgerState);
}
