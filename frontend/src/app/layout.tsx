import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Confidential Supply Chain Compliance Platform | Midnight Network',
  description: 'Zero-Knowledge Supply Chain Audit & Compliance Verification Platform powered by Midnight Compact smart contracts.',
  keywords: ['Midnight Network', 'Zero Knowledge', 'Supply Chain Compliance', 'Cardano', 'ZK Proofs', 'Privacy-Preserving', 'Compact Smart Contracts'],
  authors: [{ name: 'Shreya Das', url: 'https://github.com/tulippp2004' }],
  openGraph: {
    title: 'Confidential Supply Chain Compliance Platform',
    description: 'Verify enterprise audit compliance with Zero-Knowledge proofs on Midnight Preview testnet without disclosing confidential business metrics.',
    url: 'https://confidential-supply-chain.vercel.app',
    siteName: 'Confidential Supply Chain Compliance',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
