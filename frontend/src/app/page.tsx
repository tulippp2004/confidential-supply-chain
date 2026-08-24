'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Activity, 
  Copy, 
  Award, 
  Download,
  ExternalLink,
  Layers
} from 'lucide-react';

const PRESETS = [
  { id: 'iso27001', name: 'ISO 27001 Security', minScore: 80, icon: '🛡️', category: 'Cybersecurity' },
  { id: 'esg', name: 'ESG Carbon Rating', minScore: 75, icon: '🌿', category: 'Sustainability' },
  { id: 'fda', name: 'FDA Pharma Origin', minScore: 90, icon: '💊', category: 'Healthcare' },
  { id: 'iso9001', name: 'ISO 9001 Quality', minScore: 85, icon: '📦', category: 'Manufacturing' },
];

export default function CleanMidnightApp() {
  const [activeTab, setActiveTab] = useState<'attest' | 'supplier' | 'ledger'>('attest');
  
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress] = useState('mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p');
  const [walletBalance] = useState('245.50');

  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [auditScore, setAuditScore] = useState<number>(88);
  const [maskScore, setMaskScore] = useState<boolean>(true);
  const [provingStage, setProvingStage] = useState<number>(0);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [lastCertHash, setLastCertHash] = useState<string>('');

  const [supplierDID, setSupplierDID] = useState<string>('did:midnight:supplier_8a92f3e104b');
  const [isRegisteringSupplier, setIsRegisteringSupplier] = useState<boolean>(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<boolean>(false);

  const [stats, setStats] = useState({
    totalCertifications: 42,
    passCount: 38,
    supplierCount: 19,
    verifiedTierCount: 16,
    complianceThreshold: 75,
  });

  const [copiedContract, setCopiedContract] = useState(false);

  const CONTRACT_ADDR = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef12345678';

  const passRate = stats.totalCertifications > 0 
    ? Math.round((stats.passCount / stats.totalCertifications) * 100) 
    : 100;

  const runAttestCompliance = () => {
    setProvingStage(1);
    setTimeout(() => {
      setProvingStage(2);
      setTimeout(() => {
        setProvingStage(3);
        setTimeout(() => {
          setProvingStage(4);
          const isPass = auditScore >= stats.complianceThreshold;
          
          setStats((prev) => ({
            ...prev,
            totalCertifications: prev.totalCertifications + 1,
            passCount: isPass ? prev.passCount + 1 : prev.passCount,
            verifiedTierCount: auditScore >= 90 ? prev.verifiedTierCount + 1 : prev.verifiedTierCount,
          }));

          const fakeHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
          setLastCertHash(fakeHash);

          if (isPass) {
            setShowCertModal(true);
          }
        }, 1200);
      }, 1400);
    }, 1000);
  };

  const runRegisterSupplier = () => {
    setIsRegisteringSupplier(true);
    setTimeout(() => {
      setIsRegisteringSupplier(false);
      setRegisteredSuccess(true);
      setStats(prev => ({ ...prev, supplierCount: prev.supplierCount + 1 }));
      setTimeout(() => setRegisteredSuccess(false), 4000);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <header style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(12px)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--primary-cyan)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                Confidential Supply Chain <span className="badge-cyan">v2.0 August</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Powered by <span style={{ color: 'var(--purple-zk)', fontWeight: 500 }}>Midnight Network ZK Circuits</span>
              </div>
            </div>
          </div>

          {/* Network & Wallet Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '5px 12px', borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald-pass)' }}></span>
              <span style={{ color: 'var(--emerald-pass)', fontWeight: 500 }}>Midnight Preview</span>
            </div>

            <div 
              onClick={() => copyToClipboard(CONTRACT_ADDR)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', padding: '5px 12px', borderRadius: 20, cursor: 'pointer' }}
              title="Click to copy contract address"
            >
              <Lock size={12} color="var(--purple-zk)" />
              <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                {CONTRACT_ADDR.substring(0, 8)}...{CONTRACT_ADDR.substring(CONTRACT_ADDR.length - 6)}
              </span>
              <Copy size={12} color="var(--text-muted)" />
              {copiedContract && <span style={{ fontSize: 10, color: 'var(--emerald-pass)', fontWeight: 600 }}>COPIED!</span>}
            </div>

            <button 
              onClick={() => setWalletConnected(!walletConnected)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Cpu size={14} color="var(--primary-cyan)" />
              <span className="font-mono" style={{ fontSize: 12 }}>
                {walletAddress.substring(0, 10)}... <span style={{ color: 'var(--primary-cyan)', marginLeft: 4 }}>({walletBalance} tNIGHT)</span>
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ─── Segmented Navigation ─────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: '#090d16', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          
          <button 
            onClick={() => setActiveTab('attest')}
            className="btn-secondary"
            style={{ 
              background: activeTab === 'attest' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              borderColor: activeTab === 'attest' ? 'var(--primary-cyan)' : 'transparent',
              color: activeTab === 'attest' ? 'var(--primary-cyan)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px'
            }}
          >
            <ShieldCheck size={16} /> Attestation Studio
          </button>

          <button 
            onClick={() => setActiveTab('supplier')}
            className="btn-secondary"
            style={{ 
              background: activeTab === 'supplier' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
              borderColor: activeTab === 'supplier' ? 'var(--purple-zk)' : 'transparent',
              color: activeTab === 'supplier' ? 'var(--purple-zk)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px'
            }}
          >
            <Building2 size={16} /> Supplier Vault
          </button>

          <button 
            onClick={() => setActiveTab('ledger')}
            className="btn-secondary"
            style={{ 
              background: activeTab === 'ledger' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              borderColor: activeTab === 'ledger' ? 'var(--emerald-pass)' : 'transparent',
              color: activeTab === 'ledger' ? 'var(--emerald-pass)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px'
            }}
          >
            <Activity size={16} /> Public Ledger State
          </button>

        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1100, width: '100%', margin: '0 auto', padding: '32px 24px', flex: 1 }}>

        {/* TAB 1: ATTESTATION STUDIO */}
        {activeTab === 'attest' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Title Section */}
            <div className="clean-card clean-card-accent">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
                    Confidential Compliance Attestation
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 700, lineHeight: 1.6 }}>
                    Submit audit evaluation scores via Midnight's Zero-Knowledge Compact circuit. Numerical scores are evaluated in <span style={{ color: 'var(--purple-zk)', fontWeight: 600 }}>local prover memory</span> and are never published on-chain.
                  </p>
                </div>
                <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid var(--border-accent)', padding: '8px 14px', borderRadius: 8, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Compliance Threshold</div>
                  <div className="font-mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-cyan)' }}>
                    &gt;= {stats.complianceThreshold} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Presets */}
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>
                Select Enterprise Compliance Standard
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
                {PRESETS.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setAuditScore(preset.minScore + 5);
                    }}
                    className="clean-card"
                    style={{ 
                      padding: 16, 
                      cursor: 'pointer', 
                      borderColor: selectedPreset.id === preset.id ? 'var(--primary-cyan)' : 'var(--border-subtle)',
                      background: selectedPreset.id === preset.id ? 'rgba(56, 189, 248, 0.06)' : 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{preset.icon}</span>
                      <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Req: &gt;={preset.minScore}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 2 }}>{preset.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{preset.category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="clean-card">
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600 }}>
                Audit Score Evaluation Input
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      Numerical Audit Score:
                    </label>
                    <button 
                      onClick={() => setMaskScore(!maskScore)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {maskScore ? <EyeOff size={12} /> : <Eye size={12} />}
                      {maskScore ? 'ZK Secret Masked' : 'Show Score'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={auditScore} 
                      onChange={(e) => setAuditScore(parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--primary-cyan)', cursor: 'pointer' }}
                    />
                    <div className="font-mono" style={{ fontSize: 22, fontWeight: 700, width: 70, textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--border-subtle)', color: auditScore >= stats.complianceThreshold ? 'var(--emerald-pass)' : 'var(--rose-fail)' }}>
                      {maskScore ? '***' : auditScore}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Lock size={14} color="var(--purple-zk)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong style={{ color: 'var(--purple-zk)' }}>Privacy Invariant:</strong> Raw score <span className="font-mono" style={{ color: '#ffffff' }}>{maskScore ? '***' : auditScore}</span> is evaluated locally as a ZK private witness. Observers on Midnight blockchain can never deduce this score.
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', padding: 20, borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Circuit Disclose Outcome</div>
                  
                  {auditScore >= stats.complianceThreshold ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--emerald-pass)', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                      <CheckCircle2 size={18} /> THRESHOLD SATISFIED (PASS)
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--rose-fail)', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                      <XCircle size={18} /> BELOW THRESHOLD (FAIL)
                    </div>
                  )}

                  <button 
                    onClick={runAttestCompliance}
                    disabled={provingStage > 0 && provingStage < 4}
                    className="btn-primary"
                    style={{ width: '100%', opacity: (provingStage > 0 && provingStage < 4) ? 0.6 : 1 }}
                  >
                    {provingStage > 0 && provingStage < 4 ? 'Generating ZK Proof...' : 'Attest Compliance via ZK Circuit'}
                  </button>
                </div>

              </div>
            </div>

            {/* ZK Proving Pipeline Progress */}
            <div className="clean-card" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600 }}>
                Compact ZK Proving Pipeline Progress
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                <div style={{ background: provingStage >= 1 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 1 ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)', padding: 14, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>STEP 1</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Private Witness</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Score {maskScore ? '***' : auditScore} loaded into prover</div>
                </div>

                <div style={{ background: provingStage >= 2 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 2 ? '1px solid var(--purple-zk)' : '1px solid var(--border-subtle)', padding: 14, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>STEP 2</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>ZK Proof Generation</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Executing Compact circuit</div>
                </div>

                <div style={{ background: provingStage >= 3 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 3 ? '1px solid var(--amber-warn)' : '1px solid var(--border-subtle)', padding: 14, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>STEP 3</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Ledger Disclose</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>disclose(passesThreshold)</div>
                </div>

                <div style={{ background: provingStage >= 4 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 4 ? '1px solid var(--emerald-pass)' : '1px solid var(--border-subtle)', padding: 14, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>STEP 4</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>On-Chain State</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>passCount incremented</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUPPLIER VAULT */}
        {activeTab === 'supplier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="clean-card" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
                Supplier Credential Vault
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 700, lineHeight: 1.6 }}>
                Register supplier DIDs and ISO certificates using <span className="font-mono" style={{ color: 'var(--purple-zk)' }}>Opaque&lt;"string"&gt;</span> private witness commitments. Raw credential details are never published on-chain.
              </p>
            </div>

            <div className="clean-card">
              <div style={{ maxWidth: 600 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
                  Supplier Identity Hash / Certificate DID:
                </label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <input 
                    type="text" 
                    value={supplierDID} 
                    onChange={(e) => setSupplierDID(e.target.value)}
                    className="font-mono"
                    style={{ flex: 1, background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', color: '#ffffff', padding: '10px 14px', borderRadius: 8, fontSize: 12 }}
                  />
                  <button 
                    onClick={runRegisterSupplier}
                    disabled={isRegisteringSupplier}
                    className="btn-primary"
                    style={{ background: 'var(--purple-zk)', color: '#ffffff' }}
                  >
                    {isRegisteringSupplier ? 'Registering...' : 'Register Privately'}
                  </button>
                </div>

                {registeredSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--emerald-pass)', padding: 12, borderRadius: 8, color: 'var(--emerald-pass)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={16} /> Supplier credential registered! Total suppliers: <strong>{stats.supplierCount}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PUBLIC LEDGER STATE */}
        {activeTab === 'ledger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="clean-card">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Attestations</div>
                <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary-cyan)' }}>{stats.totalCertifications}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Public Ledger State</div>
              </div>

              <div className="clean-card">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Passing Attestations</div>
                <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--emerald-pass)' }}>{stats.passCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Pass Rate: {passRate}%</div>
              </div>

              <div className="clean-card">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Verified Gold Tier (≥90)</div>
                <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--purple-zk)' }}>{stats.verifiedTierCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Enterprise Tier</div>
              </div>

              <div className="clean-card">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Registered Suppliers</div>
                <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--amber-warn)' }}>{stats.supplierCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Confidential Count</div>
              </div>
            </div>

            <div className="clean-card">
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', marginBottom: 14 }}>
                Zero-Knowledge Privacy Model Breakdown
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: 10 }}>Data Point</th>
                      <th style={{ padding: 10 }}>Storage Layer</th>
                      <th style={{ padding: 10 }}>Disclosed To</th>
                      <th style={{ padding: 10 }}>Privacy Guarantee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 10, fontWeight: 600, color: 'var(--primary-cyan)' }}>totalCertifications</td>
                      <td style={{ padding: 10 }}>Public Ledger</td>
                      <td style={{ padding: 10 }}>Everyone</td>
                      <td style={{ padding: 10, color: 'var(--text-secondary)' }}>Macro compliance tracking</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 10, fontWeight: 600, color: 'var(--emerald-pass)' }}>passCount</td>
                      <td style={{ padding: 10 }}>Public Ledger</td>
                      <td style={{ padding: 10 }}>Everyone</td>
                      <td style={{ padding: 10, color: 'var(--text-secondary)' }}>Aggregate pass rate metric</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: 10, fontWeight: 600, color: 'var(--purple-zk)' }}>privateAuditScore</td>
                      <td style={{ padding: 10, color: 'var(--purple-zk)' }}>Private Witness</td>
                      <td style={{ padding: 10, color: 'var(--rose-fail)', fontWeight: 600 }}>NO ONE (HIDDEN)</td>
                      <td style={{ padding: 10, color: 'var(--emerald-pass)', fontWeight: 500 }}>100% Confidential ZK Secret</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 10, fontWeight: 600, color: 'var(--amber-warn)' }}>supplierCredential</td>
                      <td style={{ padding: 10, color: 'var(--amber-warn)' }}>Private Witness</td>
                      <td style={{ padding: 10, color: 'var(--rose-fail)', fontWeight: 600 }}>NO ONE (HIDDEN)</td>
                      <td style={{ padding: 10, color: 'var(--emerald-pass)', fontWeight: 500 }}>Supplier Identity Privacy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ─── CERTIFICATE MODAL ────────────────────────────────────────────── */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="clean-card clean-card-accent" style={{ maxWidth: 480, width: '100%', padding: 28, position: 'relative', textAlign: 'center' }}>
            
            <button 
              onClick={() => setShowCertModal(false)}
              style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}
            >
              ✕
            </button>

            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-pass)', margin: '0 auto 14px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={28} color="var(--emerald-pass)" />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
              Verifiable ZK Compliance Badge
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 16 }}>
              Verified on Midnight Preview Testnet
            </p>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 14, textAlign: 'left', marginBottom: 16, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: 'var(--emerald-pass)', fontWeight: 700 }}>PASSED (Threshold &gt;= {stats.complianceThreshold})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Numerical Score:</span>
                <span style={{ color: 'var(--purple-zk)', fontWeight: 600 }}>[100% CONFIDENTIAL]</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Standard:</span>
                <span style={{ color: '#ffffff' }}>{selectedPreset.name}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 6, marginTop: 6 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Proof Hash Commitment:</span>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--primary-cyan)', wordBreak: 'break-all' }}>{lastCertHash}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => setShowCertModal(false)}
                className="btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Download size={14} /> Download Badge
              </button>
              <button 
                onClick={() => copyToClipboard(lastCertHash)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Copy Hash
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '20px 24px', textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
        Confidential Supply Chain Compliance Platform • Powered by <span style={{ color: 'var(--purple-zk)', fontWeight: 500 }}>Midnight Network Compact ZK Circuits</span>
      </footer>

    </div>
  );
}
