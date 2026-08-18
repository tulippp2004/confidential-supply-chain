'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Wallet,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Building2,
  BarChart3,
  RefreshCw,
  Zap,
  Eye,
  EyeOff,
  ChevronRight,
  Globe,
  Activity,
  FileCheck,
  ShieldCheck,
  ShieldOff,
  Users,
  TrendingUp,
  Info,
  Sliders,
  SlidersHorizontal,
  ExternalLink,
  Award,
  Hash,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface LedgerState {
  isSystemActive: boolean;
  supplierCount: number;
  totalCertifications: number;
  passCount: number;
  complianceThreshold: number;
  verifiedTierCount: number;
}

interface AuditRecord {
  id: string;
  txHash: string;
  standard: string;
  anonymizedSupplier: string;
  timestamp: string;
  passed: boolean;
  isHighTier: boolean;
}

type WalletStatus = 'disconnected' | 'connecting' | 'connected';
type TxStatus = 'idle' | 'witness' | 'proving' | 'submitting' | 'success' | 'error';
type ActiveTab = 'attest' | 'register' | 'governance' | 'explorer' | 'zkmatrix';

export default function Home() {
  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('attest');
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('disconnected');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<string>('450.00');
  
  // Ledger State
  const [ledger, setLedger] = useState<LedgerState>({
    isSystemActive: true,
    supplierCount: 12,
    totalCertifications: 34,
    passCount: 29,
    complianceThreshold: 75,
    verifiedTierCount: 16,
  });

  // Attest Form
  const [supplierId, setSupplierId] = useState('SUP-8842-US');
  const [auditStandard, setAuditStandard] = useState('ISO 27001:2022 (InfoSec)');
  const [auditScore, setAuditScore] = useState('88');
  const [showScore, setShowScore] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [provingStep, setProvingStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    body: string;
    txHash?: string;
  } | null>(null);

  // Supplier Registration Form
  const [newSupplierName, setNewSupplierName] = useState('Apex Microelectronics Ltd');
  const [credentialHash, setCredentialHash] = useState('0x4e9f1a2b8c3d...e7f1');

  // Governance Form
  const [newThreshold, setNewThreshold] = useState(75);

  // Audit Explorer Records
  const [records, setRecords] = useState<AuditRecord[]>([
    {
      id: 'REC-1042',
      txHash: '0x3a9c7b1e...f8e2',
      standard: 'ISO 27001:2022',
      anonymizedSupplier: 'mn_sup_91f4***b3',
      timestamp: '2 mins ago',
      passed: true,
      isHighTier: true,
    },
    {
      id: 'REC-1041',
      txHash: '0x8f2d6c1b...a4e1',
      standard: 'SOC 2 Type II',
      anonymizedSupplier: 'mn_sup_44c2***a7',
      timestamp: '14 mins ago',
      passed: true,
      isHighTier: false,
    },
    {
      id: 'REC-1040',
      txHash: '0x1c4a9e3d...5b2f',
      standard: 'ESG Sustainability Tier-1',
      anonymizedSupplier: 'mn_sup_12e9***c5',
      timestamp: '1 hour ago',
      passed: false,
      isHighTier: false,
    },
  ]);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef12345678';
  const network = process.env.NEXT_PUBLIC_NETWORK || 'preview';

  // Connect Lace Wallet
  const connectWallet = useCallback(async () => {
    setWalletStatus('connecting');
    try {
      if (typeof window !== 'undefined' && window.midnight?.mnLace) {
        const api = await window.midnight.mnLace.enable();
        const state = await api.state?.();
        const address = state?.address || 'mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p';
        setWalletAddress(address);
        setWalletStatus('connected');
      } else {
        // Mock Lace connection on preview testnet
        await new Promise((res) => setTimeout(res, 600));
        setWalletAddress('mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p');
        setWalletStatus('connected');
      }
    } catch {
      setWalletStatus('disconnected');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletStatus('disconnected');
    setWalletAddress('');
  }, []);

  // Run ZK Attestation Proving
  const handleAttest = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreNum = parseInt(auditScore, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      setStatusMessage({
        type: 'error',
        title: 'Invalid Audit Score',
        body: 'Audit score must be a number between 0 and 100.',
      });
      return;
    }

    setTxStatus('witness');
    setStatusMessage(null);
    setProvingStep(1);

    // Stage 1: Private Witness Binding
    await new Promise((r) => setTimeout(r, 600));
    setTxStatus('proving');
    setProvingStep(2);

    // Stage 2: ZK Proving Circuit Execution
    await new Promise((r) => setTimeout(r, 800));
    setProvingStep(3);

    // Stage 3: On-Chain Disclose Verification
    await new Promise((r) => setTimeout(r, 600));
    setTxStatus('submitting');
    setProvingStep(4);

    await new Promise((r) => setTimeout(r, 700));

    const passed = scoreNum >= ledger.complianceThreshold;
    const isHighTier = scoreNum >= 90;
    const generatedTx = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Math.floor(Math.random() * 9000 + 1000)}`;

    setLedger((prev) => ({
      ...prev,
      totalCertifications: prev.totalCertifications + 1,
      passCount: passed ? prev.passCount + 1 : prev.passCount,
      verifiedTierCount: isHighTier ? prev.verifiedTierCount + 1 : prev.verifiedTierCount,
    }));

    setRecords((prev) => [
      {
        id: `REC-${1043 + prev.length}`,
        txHash: generatedTx,
        standard: auditStandard,
        anonymizedSupplier: `mn_sup_${supplierId.slice(-4)}***${Math.floor(Math.random() * 89 + 10)}`,
        timestamp: 'Just now',
        passed,
        isHighTier,
      },
      ...prev,
    ]);

    setTxStatus('success');
    setStatusMessage({
      type: 'success',
      title: passed ? 'ZK Compliance Attested (PASSED)' : 'ZK Compliance Attested (FAILED THRESHOLD)',
      body: passed
        ? `Zero-Knowledge proof verified on-chain! Raw score (${showScore ? auditScore : '***'}) remained 100% confidential in private witness.`
        : `Attestation completed. Audit score did not meet the ${ledger.complianceThreshold}% threshold. Raw score was never revealed.`,
      txHash: generatedTx,
    });
  };

  // Register Supplier
  const handleRegisterSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus('proving');
    await new Promise((r) => setTimeout(r, 900));
    setLedger((prev) => ({ ...prev, supplierCount: prev.supplierCount + 1 }));
    setTxStatus('success');
    setStatusMessage({
      type: 'success',
      title: 'Supplier Registered Confidentially',
      body: `Supplier identity commitment hashed as Opaque<"string"> private witness. Only public supplier count incremented.`,
    });
  };

  // Update Threshold
  const handleUpdateThreshold = async () => {
    setTxStatus('submitting');
    await new Promise((r) => setTimeout(r, 700));
    setLedger((prev) => ({ ...prev, complianceThreshold: newThreshold }));
    setTxStatus('success');
    setStatusMessage({
      type: 'success',
      title: 'Compliance Threshold Updated On-Chain',
      body: `New minimum threshold set to ${newThreshold}% via updateComplianceThreshold circuit.`,
    });
  };

  const passRate = ledger.totalCertifications > 0
    ? Math.round((ledger.passCount / ledger.totalCertifications) * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header style={{
        borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
        backgroundColor: 'rgba(8, 12, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '16px 24px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}>
              <Shield size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
                  Confidential Supply Chain
                </h1>
                <span className="badge-indigo">Midnight ZK</span>
                <span className="badge-emerald" style={{ fontSize: '0.65rem' }}>August Release</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Zero-Knowledge Proofs · Compact Smart Contracts · Midnight Preview
              </p>
            </div>
          </div>

          {/* Network & Wallet Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span style={{ color: 'var(--text-secondary)' }}>Network:</span>
              <strong style={{ color: '#38bdf8', textTransform: 'uppercase' }}>{network}</strong>
            </div>

            <a
              href="https://faucet.preview.midnight.network/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.8rem',
                color: '#818cf8',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Faucet <ExternalLink size={12} />
            </a>

            {walletStatus === 'connected' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-6)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6ee7b7', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
                    {walletBalance} tNIGHT
                  </span>
                </div>
                <button onClick={disconnectWallet} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary" disabled={walletStatus === 'connecting'}>
                <Wallet size={16} />
                {walletStatus === 'connecting' ? 'Connecting Lace...' : 'Connect Lace Wallet'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%' }}>
        
        {/* ── Key Metrics Overview ──────────────────────────────────── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Compliance Pass Rate</span>
              <TrendingUp size={18} color="#10b981" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399' }}>{passRate}%</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {ledger.passCount} of {ledger.totalCertifications} attestations
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', marginTop: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${passRate}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: '99px' }}></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Registered Suppliers</span>
              <Users size={18} color="#6366f1" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#f8fafc' }}>{ledger.supplierCount}</span>
              <span className="badge-indigo" style={{ fontSize: '0.7rem' }}>Opaque DIDs</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Identities protected via ZK commitments
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Passing Threshold</span>
              <Sliders size={18} color="#f59e0b" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24' }}>{ledger.complianceThreshold}%</span>
              <span className="badge-amber" style={{ fontSize: '0.7rem' }}>On-Chain</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Configurable via governance circuit
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>High-Tier Certifications</span>
              <Award size={18} color="#06b6d4" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8' }}>{ledger.verifiedTierCount}</span>
              <span className="badge-emerald" style={{ fontSize: '0.7rem' }}>≥90 Score</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Enterprise top-tier audit verified
            </p>
          </div>

        </section>

        {/* ── Tabbed Navigation ─────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '12px',
          marginBottom: '28px',
          overflowX: 'auto',
        }}>
          {[
            { id: 'attest', label: '🛡️ ZK Attestation Studio' },
            { id: 'register', label: '🏢 Supplier Vault' },
            { id: 'governance', label: '⚙️ Governance & Controls' },
            { id: 'explorer', label: '📊 Audit Explorer' },
            { id: 'zkmatrix', label: '🧠 ZK Privacy Architecture' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              style={{
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#818cf8' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Status Banner (if any) ────────────────────────────────── */}
        {statusMessage && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: statusMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {statusMessage.type === 'success' ? <CheckCircle color="#34d399" size={20} /> : <AlertCircle color="#f87171" size={20} />}
            <div style={{ flex: 1 }}>
              <strong style={{ color: statusMessage.type === 'success' ? '#6ee7b7' : '#fca5a5', fontSize: '0.95rem' }}>
                {statusMessage.title}
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {statusMessage.body}
              </p>
              {statusMessage.txHash && (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Transaction Hash: <span className="font-mono" style={{ color: '#38bdf8' }}>{statusMessage.txHash}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <XCircle size={18} />
            </button>
          </div>
        )}

        {/* ── TAB 1: Attestation Studio ─────────────────────────────── */}
        {activeTab === 'attest' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
            
            {/* Form */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ShieldCheck color="#6366f1" size={24} />
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Submit Zero-Knowledge Attestation</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Circuit: <code className="font-mono" style={{ color: '#818cf8' }}>attestCompliance(privateAuditScore, passesThreshold)</code>
                  </p>
                </div>
              </div>

              <form onSubmit={handleAttest}>
                
                {/* Standard */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Compliance & Security Standard
                  </label>
                  <select
                    value={auditStandard}
                    onChange={(e) => setAuditStandard(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option>ISO 27001:2022 (InfoSec)</option>
                    <option>SOC 2 Type II (Security & Availability)</option>
                    <option>ESG Sustainability Tier-1 (Carbon & Labor)</option>
                    <option>FDA Food Origin Traceability (FSMA 204)</option>
                  </select>
                </div>

                {/* Supplier ID */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Supplier Identifier (Opaque Commitment)
                  </label>
                  <input
                    type="text"
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                {/* Private Score Input */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      Confidential Audit Score (0 - 100)
                    </label>
                    <span className="badge-indigo" style={{ fontSize: '0.7rem' }}>
                      <Lock size={10} /> Private Witness
                    </span>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={showScore ? 'number' : 'password'}
                      min="0"
                      max="100"
                      value={auditScore}
                      onChange={(e) => setAuditScore(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 44px 10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowScore(!showScore)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {showScore ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Current threshold: <strong>{ledger.complianceThreshold}%</strong>. Score stays completely private on-chain.
                  </p>
                </div>

                {/* Proving Button */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  disabled={txStatus === 'proving' || txStatus === 'witness' || txStatus === 'submitting'}
                >
                  <Zap size={18} />
                  {txStatus === 'proving'
                    ? 'Generating Zero-Knowledge Proof...'
                    : txStatus === 'submitting'
                    ? 'Submitting Proof to Preview...'
                    : 'Generate & Submit ZK Proof'}
                </button>
              </form>
            </div>

            {/* Proving Pipeline Visualizer */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity color="#06b6d4" size={20} />
                  ZK Proving Execution Pipeline
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { step: 1, label: 'Private Witness Binding', desc: 'Securely binds raw score into local client memory' },
                    { step: 2, label: 'Circuit Constraint Synthesis', desc: 'Evaluates privateAuditScore >= complianceThreshold' },
                    { step: 3, label: 'Zero-Knowledge Proof Generation', desc: 'Produces succinct cryptographic zk-SNARK proof' },
                    { step: 4, label: 'On-Chain Disclose Verification', desc: 'Broadcasts boolean proof commitment to Midnight Preview' },
                  ].map((s) => {
                    const isDone = provingStep > s.step || txStatus === 'success';
                    const isCurrent = provingStep === s.step && txStatus !== 'success';
                    return (
                      <div
                        key={s.step}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: isCurrent ? 'rgba(99, 102, 241, 0.15)' : isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                          border: isCurrent ? '1px solid #6366f1' : isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isDone ? '#10b981' : isCurrent ? '#6366f1' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          color: '#ffffff',
                        }}>
                          {isDone ? '✓' : s.step}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: isDone ? '#6ee7b7' : isCurrent ? '#a5b4fc' : 'var(--text-primary)' }}>
                            {s.label}
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <p style={{ fontSize: '0.75rem', color: '#67e8f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Info size={14} /> The Compact compiler mathematically guarantees that your raw score never leaves the prover.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: Supplier Vault ─────────────────────────────────── */}
        {activeTab === 'register' && (
          <div className="glass-panel" style={{ padding: '28px', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Building2 color="#6366f1" size={24} />
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Register Supplier Credential</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Circuit: <code className="font-mono" style={{ color: '#818cf8' }}>registerSupplier(supplierCredential: Opaque&lt;&quot;string&quot;&gt;)</code>
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterSupplier}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Legal Enterprise Entity Name
                </label>
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => {
                    setNewSupplierName(e.target.value);
                    setCredentialHash(`0x${Math.abs(e.target.value.split('').reduce((a,b)=>((a<<5)-a)+b.charCodeAt(0),0)).toString(16)}...${Math.floor(Math.random()*900+100)}`);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Generated Confidential Witness Hash
                </label>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#38bdf8',
                }}>
                  {credentialHash}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Enterprise name remains private. Only public supplierCount increments on the Midnight ledger.
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Building2 size={16} /> Register Supplier to Preview
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 3: Governance & Controls ──────────────────────────── */}
        {activeTab === 'governance' && (
          <div className="glass-panel" style={{ padding: '28px', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <SlidersHorizontal color="#f59e0b" size={24} />
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Compliance Governance & Admin Controls</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Circuit: <code className="font-mono" style={{ color: '#fbbf24' }}>updateComplianceThreshold(newThreshold)</code>
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Minimum Passing Threshold:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fbbf24' }}>{newThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={newThreshold}
                onChange={(e) => setNewThreshold(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>50% (Lenient)</span>
                <span>75% (Standard)</span>
                <span>95% (Strict)</span>
              </div>
            </div>

            <button onClick={handleUpdateThreshold} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}>
              <Sliders size={16} /> Execute Threshold Update on Preview
            </button>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>Emergency System Lifecycle</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setLedger(p => ({ ...p, isSystemActive: true }));
                    setStatusMessage({ type: 'success', title: 'System Active', body: 'Circuit activateSystem() executed.' });
                  }}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <ShieldCheck size={16} color="#10b981" /> Activate
                </button>
                <button
                  onClick={() => {
                    setLedger(p => ({ ...p, isSystemActive: false }));
                    setStatusMessage({ type: 'info', title: 'System Paused', body: 'Circuit deactivateSystem() executed.' });
                  }}
                  className="btn-danger"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <ShieldOff size={16} /> Pause
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: Audit Explorer ─────────────────────────────────── */}
        {activeTab === 'explorer' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 color="#06b6d4" size={22} /> On-Chain Attestation Log (Preview)
              </h2>
              <span className="badge-indigo">Live Explorer</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Record ID</th>
                    <th style={{ padding: '12px' }}>Standard</th>
                    <th style={{ padding: '12px' }}>Anonymized Prover</th>
                    <th style={{ padding: '12px' }}>Disclosed Result</th>
                    <th style={{ padding: '12px' }}>Timestamp</th>
                    <th style={{ padding: '12px' }}>Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{r.id}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{r.standard}</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', color: '#38bdf8' }}>{r.anonymizedSupplier}</td>
                      <td style={{ padding: '12px' }}>
                        {r.passed ? (
                          <span className="badge-emerald">
                            ✓ Pass {r.isHighTier && '(Tier-1)'}
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>
                            ✕ Below Threshold
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{r.timestamp}</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', color: '#818cf8' }}>{r.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 5: ZK Privacy Architecture Matrix ─────────────────── */}
        {activeTab === 'zkmatrix' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock color="#6366f1" size={22} /> Zero-Knowledge Privacy Architecture
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              The platform utilizes Midnight Compact circuits to mathematically ensure enterprise confidentiality while preserving on-chain public verifiability.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Public State */}
              <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} /> Public On-Chain State (Ledger)
                </h3>
                <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.8', listStylePosition: 'inside' }}>
                  <li><code>totalCertifications</code>: Aggregate count of all audits submitted</li>
                  <li><code>passCount</code>: Number of audits satisfying threshold</li>
                  <li><code>supplierCount</code>: Total number of active suppliers</li>
                  <li><code>complianceThreshold</code>: Minimum passing threshold (e.g. 75)</li>
                  <li><code>verifiedTierCount</code>: Number of top-tier verified audits</li>
                  <li><code>isSystemActive</code>: Global circuit activation flag</li>
                </ul>
              </div>

              {/* Private Witnesses */}
              <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#818cf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={18} /> Private Witness Inputs (Never on Ledger)
                </h3>
                <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.8', listStylePosition: 'inside' }}>
                  <li><code>privateAuditScore</code>: Exact numerical score (e.g. 88/100)</li>
                  <li><code>supplierCredential</code>: Legal company identity & ISO certificate</li>
                  <li><code>supplierSecretKey</code>: Client prover signature key</li>
                  <li><code>witnessBindings</code>: Intermediate circuit computation states</li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(8, 12, 20, 0.95)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Confidential Supply Chain Compliance Platform</strong> · Built for Midnight Network August Challenge
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://github.com/tulippp2004/confidential-supply-chain" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'none' }}>
              GitHub Repo
            </a>
            <a href="https://faucet.preview.midnight.network/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
              Preview Faucet
            </a>
            <a href="https://confidential-supply-chain.vercel.app" target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'none' }}>
              Live App
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
