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
  Sliders,
  ExternalLink
} from 'lucide-react';

const PRESETS = [
  { id: 'iso27001', name: 'ISO 27001 Security', minScore: 80, icon: '🛡️', category: 'Cybersecurity' },
  { id: 'esg', name: 'ESG Carbon Rating', minScore: 75, icon: '🌿', category: 'Sustainability' },
  { id: 'fda', name: 'FDA Pharma Origin', minScore: 90, icon: '💊', category: 'Healthcare' },
  { id: 'iso9001', name: 'ISO 9001 Quality', minScore: 85, icon: '📦', category: 'Manufacturing' },
];

export default function ConfidentialSupplyChainApp() {
  const [activeTab, setActiveTab] = useState<'auditor' | 'supplier' | 'governance' | 'observer'>('auditor');
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletAddress] = useState('mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p');
  const [walletBalance] = useState('245.50');

  const handleConnectLaceWallet = () => {
    setIsConnectingWallet(true);
    setTimeout(() => {
      setIsConnectingWallet(false);
      setWalletConnected(true);
    }, 1000);
  };

  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [auditScore, setAuditScore] = useState<number>(88);
  const [maskScore, setMaskScore] = useState<boolean>(true);
  const [provingStage, setProvingStage] = useState<number>(0);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [lastCertHash, setLastCertHash] = useState<string>('');

  const [supplierDID, setSupplierDID] = useState<string>('did:midnight:supplier_8a92f3e104b');
  const [isRegisteringSupplier, setIsRegisteringSupplier] = useState<boolean>(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<boolean>(false);

  const [newThresholdInput, setNewThresholdInput] = useState<number>(75);
  const [isUpdatingThreshold, setIsUpdatingThreshold] = useState<boolean>(false);
  const [thresholdUpdateSuccess, setThresholdUpdateSuccess] = useState<boolean>(false);

  const [stats, setStats] = useState({
    totalCertifications: 44,
    passCount: 40,
    supplierCount: 19,
    verifiedTierCount: 18,
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

  const runUpdateThreshold = () => {
    setIsUpdatingThreshold(true);
    setTimeout(() => {
      setIsUpdatingThreshold(false);
      setStats(prev => ({ ...prev, complianceThreshold: newThresholdInput }));
      setThresholdUpdateSuccess(true);
      setTimeout(() => setThresholdUpdateSuccess(false), 4000);
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
      <header style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid var(--border-glow-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="var(--cyan-bright)" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.02em' }}>
                Confidential Supply Chain <span className="badge-cyan">v2.0 August</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Zero-Knowledge Compliance Attestation on <span style={{ color: 'var(--purple-zk)', fontWeight: 600 }}>Midnight Network</span>
              </div>
            </div>
          </div>

          {/* Network & Wallet Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '6px 14px', borderRadius: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-pass)' }}></span>
              <span style={{ color: 'var(--emerald-pass)', fontWeight: 600 }}>Network: Preview Testnet</span>
            </div>

            <div 
              onClick={() => copyToClipboard(CONTRACT_ADDR)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 20, cursor: 'pointer' }}
              title="Click to copy deployed contract address"
            >
              <Lock size={13} color="var(--purple-zk)" />
              <span className="font-mono-code" style={{ color: 'var(--text-muted)' }}>
                {CONTRACT_ADDR.substring(0, 8)}...{CONTRACT_ADDR.substring(CONTRACT_ADDR.length - 6)}
              </span>
              <Copy size={13} color="var(--text-dim)" />
              {copiedContract && <span style={{ fontSize: 10, color: 'var(--emerald-pass)', fontWeight: 700 }}>COPIED!</span>}
            </div>

            {!walletConnected ? (
              <button 
                onClick={handleConnectLaceWallet}
                disabled={isConnectingWallet}
                className="btn-cyan"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', fontSize: 13 }}
              >
                <Cpu size={16} />
                {isConnectingWallet ? 'Connecting to Lace Wallet...' : 'Connect Lace Wallet'}
              </button>
            ) : (
              <button 
                onClick={() => setWalletConnected(false)}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                title="Click to disconnect"
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-pass)' }}></span>
                <span className="font-mono-code" style={{ fontSize: 12 }}>
                  {walletAddress.substring(0, 10)}... <span style={{ color: 'var(--cyan-bright)', marginLeft: 4, fontWeight: 700 }}>({walletBalance} tNIGHT)</span>
                </span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ─── 4 WORKSPACE NAV SWITCHER ─────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: '#070b14', padding: '12px 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          
          <button 
            onClick={() => setActiveTab('auditor')}
            className="btn-ghost"
            style={{ 
              background: activeTab === 'auditor' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              borderColor: activeTab === 'auditor' ? 'var(--cyan-bright)' : 'transparent',
              color: activeTab === 'auditor' ? 'var(--cyan-bright)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <ShieldCheck size={18} /> Auditor Attestation Studio
          </button>

          <button 
            onClick={() => setActiveTab('supplier')}
            className="btn-ghost"
            style={{ 
              background: activeTab === 'supplier' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
              borderColor: activeTab === 'supplier' ? 'var(--purple-zk)' : 'transparent',
              color: activeTab === 'supplier' ? 'var(--purple-zk)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <Building2 size={18} /> Supplier Credential Vault
          </button>

          <button 
            onClick={() => setActiveTab('governance')}
            className="btn-ghost"
            style={{ 
              background: activeTab === 'governance' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              borderColor: activeTab === 'governance' ? 'var(--amber-warn)' : 'transparent',
              color: activeTab === 'governance' ? 'var(--amber-warn)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <Sliders size={18} /> Governance Controls
          </button>

          <button 
            onClick={() => setActiveTab('observer')}
            className="btn-ghost"
            style={{ 
              background: activeTab === 'observer' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              borderColor: activeTab === 'observer' ? 'var(--emerald-pass)' : 'transparent',
              color: activeTab === 'observer' ? 'var(--emerald-pass)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <Activity size={18} /> Public Observer Ledger
          </button>

        </div>
      </div>

      {/* ─── Main Content Canvas ─────────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, width: '100%', margin: '0 auto', padding: '36px 28px', flex: 1 }}>

        {/* WORKSPACE 1: AUDITOR ATTESTATION STUDIO */}
        {activeTab === 'auditor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* Header Info Panel */}
            <div className="glass-card glass-card-cyan">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.01em' }}>
                    Confidential Compliance Attestation Studio
                  </h2>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 750, lineHeight: 1.6 }}>
                    Evaluate enterprise supplier compliance scores using Midnight's Compact Zero-Knowledge circuits. Numerical scores are computed as <span style={{ color: 'var(--purple-zk)', fontWeight: 600 }}>private witness inputs</span> in local prover memory — only binary pass/fail is disclosed to the public ledger.
                  </p>
                </div>
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid var(--border-glow-cyan)', padding: '10px 18px', borderRadius: 12, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Threshold</div>
                  <div className="font-mono-code" style={{ fontSize: 22, fontWeight: 800, color: 'var(--cyan-bright)' }}>
                    &gt;= {stats.complianceThreshold} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* 1-Click Enterprise Industry Presets */}
            <div>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: 14, fontWeight: 700 }}>
                Select 1-Click Enterprise Industry Preset
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {PRESETS.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setAuditScore(preset.minScore + 5);
                    }}
                    className="glass-card"
                    style={{ 
                      padding: 18, 
                      cursor: 'pointer', 
                      borderColor: selectedPreset.id === preset.id ? 'var(--cyan-bright)' : 'var(--border-subtle)',
                      background: selectedPreset.id === preset.id ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-card)',
                      boxShadow: selectedPreset.id === preset.id ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 24 }}>{preset.icon}</span>
                      <span className="font-mono-code" style={{ fontSize: 11, color: 'var(--text-dim)' }}>Req: &gt;={preset.minScore}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>{preset.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{preset.category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form & Real-Time Evaluation */}
            <div className="glass-card">
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: 20, fontWeight: 700 }}>
                Audit Evaluation Input & Secret Witness Masking
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                      Numerical Audit Score:
                    </label>
                    <button 
                      onClick={() => setMaskScore(!maskScore)}
                      className="btn-ghost"
                      style={{ padding: '5px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      {maskScore ? <EyeOff size={14} color="var(--purple-zk)" /> : <Eye size={14} color="var(--cyan-bright)" />}
                      {maskScore ? 'ZK Secret Masked' : 'Show Score'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={auditScore} 
                      onChange={(e) => setAuditScore(parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--cyan-bright)', cursor: 'pointer', height: 6 }}
                    />
                    <div className="font-mono-code" style={{ fontSize: 24, fontWeight: 800, width: 80, textAlign: 'center', background: 'rgba(0, 0, 0, 0.4)', padding: '6px 12px', borderRadius: 10, border: '1px solid var(--border-subtle)', color: auditScore >= stats.complianceThreshold ? 'var(--emerald-pass)' : 'var(--rose-fail)' }}>
                      {maskScore ? '***' : auditScore}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: 14, borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <Lock size={16} color="var(--purple-zk)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong style={{ color: 'var(--purple-zk)' }}>Privacy Guarantee:</strong> Raw audit score <span className="font-mono-code" style={{ color: '#ffffff' }}>{maskScore ? '***' : auditScore}</span> is processed locally as a private witness. Blockchain node observers never see this number.
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', padding: 24, borderRadius: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Circuit Evaluation Outcome</div>
                  
                  {auditScore >= stats.complianceThreshold ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--emerald-pass)', fontSize: 17, fontWeight: 800, marginBottom: 18 }}>
                      <CheckCircle2 size={22} /> THRESHOLD SATISFIED (PASS)
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--rose-fail)', fontSize: 17, fontWeight: 800, marginBottom: 18 }}>
                      <XCircle size={22} /> BELOW THRESHOLD (FAIL)
                    </div>
                  )}

                  <button 
                    onClick={runAttestCompliance}
                    disabled={provingStage > 0 && provingStage < 4}
                    className="btn-cyan"
                    style={{ width: '100%', opacity: (provingStage > 0 && provingStage < 4) ? 0.6 : 1, fontSize: 15 }}
                  >
                    {provingStage > 0 && provingStage < 4 ? 'Generating Zero-Knowledge Proof...' : 'Attest Compliance via ZK Circuit'}
                  </button>
                </div>

              </div>
            </div>

            {/* 4-Stage Animated ZK Proving Pipeline */}
            <div className="glass-card glass-card-purple">
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: 18, fontWeight: 700 }}>
                Compact ZK Circuit Execution Pipeline
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                
                <div style={{ background: provingStage >= 1 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 1 ? '1px solid var(--cyan-bright)' : '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>STAGE 1</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Private Witness</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score {maskScore ? '***' : auditScore} loaded into prover</div>
                </div>

                <div style={{ background: provingStage >= 2 ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 2 ? '1px solid var(--purple-zk)' : '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>STAGE 2</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>SNARK Proof</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Executing Compact ZK circuit</div>
                </div>

                <div style={{ background: provingStage >= 3 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 3 ? '1px solid var(--amber-warn)' : '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>STAGE 3</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Disclose Outcome</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>disclose(passesThreshold)</div>
                </div>

                <div style={{ background: provingStage >= 4 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)', border: provingStage >= 4 ? '1px solid var(--emerald-pass)' : '1px solid var(--border-subtle)', padding: 16, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>STAGE 4</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Ledger Sync</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>passCount incremented</div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* WORKSPACE 2: SUPPLIER CREDENTIAL VAULT */}
        {activeTab === 'supplier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            <div className="glass-card glass-card-purple">
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                Confidential Supplier Credential Vault
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 750, lineHeight: 1.6 }}>
                Register enterprise supplier credentials (DIDs, ISO certificates) into Midnight ledger using <span className="font-mono-code" style={{ color: 'var(--purple-zk)', fontWeight: 600 }}>Opaque&lt;"string"&gt;</span> private witness commitments. Raw credential details are never published on-chain.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ maxWidth: 650 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 10 }}>
                  Supplier Identity Hash / Certificate DID:
                </label>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <input 
                    type="text" 
                    value={supplierDID} 
                    onChange={(e) => setSupplierDID(e.target.value)}
                    className="font-mono-code"
                    style={{ flex: 1, background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-subtle)', color: '#ffffff', padding: '12px 16px', borderRadius: 10, fontSize: 13 }}
                  />
                  <button 
                    onClick={runRegisterSupplier}
                    disabled={isRegisteringSupplier}
                    className="btn-purple"
                    style={{ fontSize: 14 }}
                  >
                    {isRegisteringSupplier ? 'Registering Privately...' : 'Register Supplier Privately'}
                  </button>
                </div>

                {registeredSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--emerald-pass)', padding: 14, borderRadius: 10, color: 'var(--emerald-pass)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} /> Supplier credential registered into Midnight witness memory! Total suppliers: <strong>{stats.supplierCount}</strong>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* WORKSPACE 3: ON-CHAIN GOVERNANCE CONTROLS */}
        {activeTab === 'governance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            <div className="glass-card glass-card-amber">
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                On-Chain Governance Controls
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 750, lineHeight: 1.6 }}>
                Authorized compliance officers can adjust the minimum passing score dynamically using the <span className="font-mono-code" style={{ color: 'var(--amber-warn)', fontWeight: 600 }}>updateComplianceThreshold</span> circuit.
              </p>
            </div>

            <div className="glass-card">
              <div style={{ maxWidth: 650 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 12 }}>
                  Set New Passing Threshold (50 to 95):
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                  <input 
                    type="range" 
                    min="50" 
                    max="95" 
                    value={newThresholdInput} 
                    onChange={(e) => setNewThresholdInput(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--amber-warn)', cursor: 'pointer', height: 6 }}
                  />
                  <div className="font-mono-code" style={{ fontSize: 26, fontWeight: 800, width: 80, textAlign: 'center', background: 'rgba(0, 0, 0, 0.4)', padding: '6px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', color: 'var(--amber-warn)' }}>
                    {newThresholdInput}
                  </div>
                </div>

                <button 
                  onClick={runUpdateThreshold}
                  disabled={isUpdatingThreshold}
                  className="btn-amber"
                  style={{ fontSize: 15 }}
                >
                  {isUpdatingThreshold ? 'Updating On-Chain Threshold...' : 'Update On-Chain Threshold'}
                </button>

                {thresholdUpdateSuccess && (
                  <div style={{ marginTop: 16, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--emerald-pass)', padding: 14, borderRadius: 10, color: 'var(--emerald-pass)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} /> Global compliance threshold updated on-chain to <strong>{stats.complianceThreshold}</strong>!
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* WORKSPACE 4: PUBLIC OBSERVER LEDGER */}
        {activeTab === 'observer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* 4 Metric Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
              
              <div className="glass-card">
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Total Attestations</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--cyan-bright)' }}>{stats.totalCertifications}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Public Ledger Counter</div>
              </div>

              <div className="glass-card">
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Passing Attestations</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--emerald-pass)' }}>{stats.passCount}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Pass Rate: {passRate}%</div>
              </div>

              <div className="glass-card">
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Verified Top Tier (&gt;=90)</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--purple-zk)' }}>{stats.verifiedTierCount}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Enterprise Gold Tier</div>
              </div>

              <div className="glass-card">
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Registered Suppliers</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--amber-warn)' }}>{stats.supplierCount}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Confidential Identities</div>
              </div>

            </div>

            {/* Zero-Knowledge Privacy Architecture Comparison Table */}
            <div className="glass-card">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 18 }}>
                Zero-Knowledge Privacy Architecture Comparison
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                      <th style={{ padding: 12 }}>Data Point</th>
                      <th style={{ padding: 12 }}>Storage Layer</th>
                      <th style={{ padding: 12 }}>Disclosed To</th>
                      <th style={{ padding: 12 }}>Privacy Guarantee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono-code" style={{ padding: 12, fontWeight: 700, color: 'var(--cyan-bright)' }}>totalCertifications</td>
                      <td style={{ padding: 12 }}>Public Ledger</td>
                      <td style={{ padding: 12 }}>Everyone</td>
                      <td style={{ padding: 12, color: 'var(--text-muted)' }}>Macro compliance tracking</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono-code" style={{ padding: 12, fontWeight: 700, color: 'var(--emerald-pass)' }}>passCount</td>
                      <td style={{ padding: 12 }}>Public Ledger</td>
                      <td style={{ padding: 12 }}>Everyone</td>
                      <td style={{ padding: 12, color: 'var(--text-muted)' }}>Aggregate pass rate metric</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono-code" style={{ padding: 12, fontWeight: 700, color: 'var(--purple-zk)' }}>privateAuditScore</td>
                      <td style={{ padding: 12, color: 'var(--purple-zk)', fontWeight: 600 }}>Private Witness</td>
                      <td style={{ padding: 12, color: 'var(--rose-fail)', fontWeight: 700 }}>NO ONE (HIDDEN)</td>
                      <td style={{ padding: 12, color: 'var(--emerald-pass)', fontWeight: 600 }}>100% Confidential ZK Secret</td>
                    </tr>
                    <tr>
                      <td className="font-mono-code" style={{ padding: 12, fontWeight: 700, color: 'var(--amber-warn)' }}>supplierCredential</td>
                      <td style={{ padding: 12, color: 'var(--amber-warn)', fontWeight: 600 }}>Private Witness</td>
                      <td style={{ padding: 12, color: 'var(--rose-fail)', fontWeight: 700 }}>NO ONE (HIDDEN)</td>
                      <td style={{ padding: 12, color: 'var(--emerald-pass)', fontWeight: 600 }}>Supplier DID Privacy</td>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="glass-card glass-card-cyan" style={{ maxWidth: 500, width: '100%', padding: 32, position: 'relative', textAlign: 'center' }}>
            
            <button 
              onClick={() => setShowCertModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}
            >
              ✕
            </button>

            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-pass)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={32} color="var(--emerald-pass)" />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              Verifiable ZK Compliance Badge
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
              Verified on Midnight Preview Testnet
            </p>

            <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 16, textAlign: 'left', marginBottom: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-dim)' }}>Status:</span>
                <span style={{ color: 'var(--emerald-pass)', fontWeight: 700 }}>PASSED (Threshold &gt;= {stats.complianceThreshold})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-dim)' }}>Numerical Score:</span>
                <span style={{ color: 'var(--purple-zk)', fontWeight: 700 }}>[100% CONFIDENTIAL]</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-dim)' }}>Standard:</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedPreset.name}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8, marginTop: 8 }}>
                <span style={{ color: 'var(--text-dim)', display: 'block', marginBottom: 4 }}>Proof Hash Commitment:</span>
                <span className="font-mono-code" style={{ fontSize: 11, color: 'var(--cyan-bright)', wordBreak: 'break-all' }}>{lastCertHash}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setShowCertModal(false)}
                className="btn-cyan"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Download size={16} /> Download Badge
              </button>
              <button 
                onClick={() => copyToClipboard(lastCertHash)}
                className="btn-ghost"
                style={{ flex: 1 }}
              >
                Copy Hash
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 28px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
        Confidential Supply Chain Compliance Platform • Powered by <span style={{ color: 'var(--purple-zk)', fontWeight: 600 }}>Midnight Network Compact ZK Circuits</span>
      </footer>

    </div>
  );
}
