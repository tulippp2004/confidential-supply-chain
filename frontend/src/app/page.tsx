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
  Sliders, 
  Building2, 
  Activity, 
  Copy, 
  Award, 
  Download
} from 'lucide-react';

const PRESET_STANDARDS = [
  { id: 'iso27001', name: 'ISO 27001 Security', minScore: 80, icon: '🛡️', category: 'Cybersecurity' },
  { id: 'esg', name: 'ESG Carbon Emissions', minScore: 75, icon: '🌿', category: 'Sustainability' },
  { id: 'fda', name: 'FDA Pharma Origin', minScore: 90, icon: '💊', category: 'Healthcare' },
  { id: 'iso9001', name: 'ISO 9001 Quality', minScore: 85, icon: '📦', category: 'Manufacturing' },
];

export default function MidnightSupplyChainApp() {
  const [activeRole, setActiveRole] = useState<'auditor' | 'supplier' | 'governance' | 'observer'>('auditor');
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance] = useState<string>('245.50');
  
  const [selectedPreset, setSelectedPreset] = useState(PRESET_STANDARDS[0]);
  const [auditScore, setAuditScore] = useState<number>(88);
  const [maskScore, setMaskScore] = useState<boolean>(true);
  const [provingStage, setProvingStage] = useState<number>(0);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [lastCertHash, setLastCertHash] = useState<string>('');

  const [supplierDID, setSupplierDID] = useState<string>('did:midnight:supplier_8a92f3e104b');
  const [isRegisteringSupplier, setIsRegisteringSupplier] = useState<boolean>(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<boolean>(false);

  const [complianceThreshold, setComplianceThreshold] = useState<number>(75);
  const [isSystemActive] = useState<boolean>(true);
  const [updatingThreshold, setUpdatingThreshold] = useState<boolean>(false);

  const [stats, setStats] = useState({
    totalCertifications: 42,
    passCount: 38,
    supplierCount: 19,
    verifiedTierCount: 16,
    isSystemActive: true,
    complianceThreshold: 75,
  });

  const [copiedContract, setCopiedContract] = useState(false);

  const CONTRACT_ADDR = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef12345678';

  const passRate = stats.totalCertifications > 0 
    ? Math.round((stats.passCount / stats.totalCertifications) * 100) 
    : 100;

  const toggleWallet = () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress(null);
    } else {
      setWalletConnected(true);
      setWalletAddress('mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p');
    }
  };

  const runAttestCompliance = () => {
    if (!isSystemActive) return;
    setProvingStage(1);
    
    setTimeout(() => {
      setProvingStage(2);
      setTimeout(() => {
        setProvingStage(3);
        setTimeout(() => {
          setProvingStage(4);
          const isPass = auditScore >= complianceThreshold;
          
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
    }, 1800);
  };

  const runUpdateThreshold = () => {
    setUpdatingThreshold(true);
    setTimeout(() => {
      setUpdatingThreshold(false);
      setStats(prev => ({ ...prev, complianceThreshold }));
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 28px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00f2fe 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)' }}>
              <ShieldCheck size={26} color="#020617" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                Confidential Supply Chain <span className="font-mono-code" style={{ fontSize: 11, background: 'rgba(0, 242, 254, 0.15)', color: 'var(--cyan-bright)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(0, 242, 254, 0.3)' }}>v2.0 August</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Zero-Knowledge Compliance Attestation on <span style={{ color: 'var(--violet-bright)', fontWeight: 600 }}>Midnight Network</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--emerald-pass)', boxShadow: '0 0 10px var(--emerald-pass)' }}></span>
              <span style={{ color: 'var(--text-muted)' }}>Network:</span>
              <span className="font-mono-code" style={{ fontWeight: 600, color: 'var(--cyan-bright)' }}>Preview Testnet</span>
            </div>

            <div 
              onClick={() => copyToClipboard(CONTRACT_ADDR)}
              style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' }}
              title="Click to copy contract address"
            >
              <Lock size={13} color="var(--violet-bright)" />
              <span className="font-mono-code" style={{ color: 'var(--text-muted)' }}>
                {CONTRACT_ADDR.substring(0, 8)}...{CONTRACT_ADDR.substring(CONTRACT_ADDR.length - 6)}
              </span>
              <Copy size={13} color="var(--text-muted)" />
              {copiedContract && <span style={{ fontSize: 10, color: 'var(--emerald-pass)', fontWeight: 700 }}>COPIED!</span>}
            </div>

            <button 
              onClick={toggleWallet}
              className={walletConnected ? 'btn-outline' : 'btn-cyan'}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
            >
              <Cpu size={16} />
              {walletConnected ? (
                <span>
                  {walletAddress?.substring(0, 10)}... <span style={{ color: 'var(--cyan-bright)', marginLeft: 4 }}>({walletBalance} tNIGHT)</span>
                </span>
              ) : (
                'Connect Lace Wallet'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Role Navigation Switcher */}
      <nav style={{ background: 'rgba(2, 4, 10, 0.6)', borderBottom: '1px solid var(--border-glass)', padding: '12px 28px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          
          <button 
            onClick={() => setActiveRole('auditor')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeRole === 'auditor' ? '1px solid var(--cyan-bright)' : '1px solid transparent',
              background: activeRole === 'auditor' ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
              color: activeRole === 'auditor' ? 'var(--cyan-bright)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={16} />
            Auditor Attestation Studio
          </button>

          <button 
            onClick={() => setActiveRole('supplier')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeRole === 'supplier' ? '1px solid var(--violet-bright)' : '1px solid transparent',
              background: activeRole === 'supplier' ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
              color: activeRole === 'supplier' ? 'var(--violet-bright)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Building2 size={16} />
            Supplier Credential Vault
          </button>

          <button 
            onClick={() => setActiveRole('governance')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeRole === 'governance' ? '1px solid var(--amber-warn)' : '1px solid transparent',
              background: activeRole === 'governance' ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
              color: activeRole === 'governance' ? 'var(--amber-warn)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Sliders size={16} />
            Governance Controls
          </button>

          <button 
            onClick={() => setActiveRole('observer')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeRole === 'observer' ? '1px solid var(--emerald-pass)' : '1px solid transparent',
              background: activeRole === 'observer' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              color: activeRole === 'observer' ? 'var(--emerald-pass)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Activity size={16} />
            Public Observer Ledger
          </button>

        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: 1300, width: '100%', margin: '0 auto', padding: '32px 28px', flex: 1 }}>

        {/* ROLE 1: AUDITOR WORKSPACE */}
        {activeRole === 'auditor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
            
            <div className="glass-panel glass-panel-glow" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    Zero-Knowledge Compliance Attestation Studio
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 800, lineHeight: 1.6 }}>
                    Attest to supplier compliance scores using Midnight Compact ZK circuit. Numerical audit scores remain <span style={{ color: 'var(--violet-bright)', fontWeight: 600 }}>100% confidential in local prover memory</span> — only the boolean pass/fail criteria is disclosed on-chain.
                  </p>
                </div>
                <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '10px 16px', borderRadius: 12, textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Required Threshold</div>
                  <div className="font-mono-code" style={{ fontSize: 20, fontWeight: 800, color: 'var(--cyan-bright)' }}>
                    &gt;= {complianceThreshold} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Presets */}
            <div>
              <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700 }}>
                1. Select Enterprise Compliance Preset
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {PRESET_STANDARDS.map((preset) => (
                  <div 
                    key={preset.id}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setAuditScore(preset.minScore + 5);
                    }}
                    className="glass-panel"
                    style={{ 
                      padding: 20, 
                      cursor: 'pointer', 
                      borderColor: selectedPreset.id === preset.id ? 'var(--cyan-bright)' : 'var(--border-glass)',
                      background: selectedPreset.id === preset.id ? 'rgba(0, 242, 254, 0.08)' : 'var(--bg-card)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 24 }}>{preset.icon}</span>
                      <span className="font-mono-code" style={{ fontSize: 11, background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: 10, color: 'var(--text-muted)' }}>
                        Req: &gt;={preset.minScore}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{preset.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{preset.category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Input Form */}
            <div className="glass-panel" style={{ padding: 28 }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 16, fontWeight: 700 }}>
                2. Input Numerical Audit Score (Private Witness)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                      Evaluated Audit Score:
                    </label>
                    <button 
                      onClick={() => setMaskScore(!maskScore)}
                      style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--violet-bright)', borderRadius: 8, padding: '4px 10px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                      {maskScore ? <EyeOff size={14} /> : <Eye size={14} />}
                      {maskScore ? 'ZK Masked Secret' : 'Show Score'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={auditScore} 
                      onChange={(e) => setAuditScore(parseInt(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--cyan-bright)', cursor: 'pointer' }}
                    />
                    <div className="font-mono-code" style={{ fontSize: 28, fontWeight: 800, width: 80, textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 10, border: '1px solid var(--border-glass)', color: auditScore >= complianceThreshold ? 'var(--emerald-pass)' : 'var(--rose-fail)' }}>
                      {maskScore ? '***' : auditScore}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: 14, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                    <Lock size={18} color="var(--violet-bright)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong style={{ color: 'var(--violet-bright)' }}>Privacy Guarantee:</strong> Score <span className="font-mono-code" style={{ color: '#ffffff' }}>{maskScore ? '***' : auditScore}</span> is evaluated locally via ZK Compact circuit witness. Observers on Midnight blockchain can never see this numerical value.
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(2, 4, 10, 0.5)', border: '1px solid var(--border-glass)', padding: 24, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Circuit Outcome Evaluation</div>
                  
                  {auditScore >= complianceThreshold ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--emerald-pass)', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                      <CheckCircle2 size={22} /> SATISFIES THRESHOLD (PASS)
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--rose-fail)', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                      <XCircle size={22} /> BELOW THRESHOLD (FAIL)
                    </div>
                  )}

                  <div>
                    <button 
                      onClick={runAttestCompliance}
                      disabled={provingStage > 0 && provingStage < 4}
                      className="btn-cyan"
                      style={{ width: '100%', padding: '16px 24px', fontSize: 15, opacity: (provingStage > 0 && provingStage < 4) ? 0.6 : 1 }}
                    >
                      {provingStage > 0 && provingStage < 4 ? 'Generating ZK Proof...' : 'Attest Compliance via ZK Circuit'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ZK Pipeline */}
            <div className="glass-panel glass-panel-violet" style={{ padding: 28 }}>
              <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 20, fontWeight: 700 }}>
                3. Live Compact Zero-Knowledge Proving Pipeline
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, position: 'relative' }}>
                <div style={{ background: provingStage >= 1 ? 'rgba(0, 242, 254, 0.12)' : 'rgba(15, 23, 42, 0.6)', border: provingStage >= 1 ? '1px solid var(--cyan-bright)' : '1px solid var(--border-glass)', padding: 18, borderRadius: 14, transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STAGE 1</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Private Witness</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score {maskScore ? '***' : auditScore} loaded into prover memory</div>
                </div>

                <div style={{ background: provingStage >= 2 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.6)', border: provingStage >= 2 ? '1px solid var(--violet-bright)' : '1px solid var(--border-glass)', padding: 18, borderRadius: 14, transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STAGE 2</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>ZK SNARK Proof</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Executing arithmetic bounds check circuit</div>
                </div>

                <div style={{ background: provingStage >= 3 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.6)', border: provingStage >= 3 ? '1px solid var(--amber-warn)' : '1px solid var(--border-glass)', padding: 18, borderRadius: 14, transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STAGE 3</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Ledger Disclose</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>disclose(passesThreshold) outcome</div>
                </div>

                <div style={{ background: provingStage >= 4 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)', border: provingStage >= 4 ? '1px solid var(--emerald-pass)' : '1px solid var(--border-glass)', padding: 18, borderRadius: 14, transition: 'all 0.3s' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STAGE 4</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>On-Chain State</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Increment passCount &amp; verifiedTier</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ROLE 2: SUPPLIER VAULT */}
        {activeRole === 'supplier' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
            <div className="glass-panel glass-panel-violet" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                Confidential Supplier Credential Vault
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 800, lineHeight: 1.6 }}>
                Register enterprise supplier credentials (DIDs, ISO certificates) into Midnight ledger using private witness commitments. Raw credential details are never published on-chain.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 28 }}>
              <div style={{ maxWidth: 650 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
                  Supplier Identity Hash / Certificate DID:
                </label>
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <input 
                    type="text" 
                    value={supplierDID} 
                    onChange={(e) => setSupplierDID(e.target.value)}
                    className="font-mono-code"
                    style={{ flex: 1, background: 'rgba(2, 4, 10, 0.6)', border: '1px solid var(--border-glass)', color: '#ffffff', padding: '12px 16px', borderRadius: 12, fontSize: 13 }}
                  />
                  <button 
                    onClick={runRegisterSupplier}
                    disabled={isRegisteringSupplier}
                    className="btn-violet"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isRegisteringSupplier ? 'Committing...' : 'Register Supplier Privately'}
                  </button>
                </div>

                {registeredSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-pass)', padding: 14, borderRadius: 12, color: 'var(--emerald-pass)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} /> Supplier credential commitment registered! Total suppliers: <strong>{stats.supplierCount}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ROLE 3: GOVERNANCE CONTROLS */}
        {activeRole === 'governance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
            <div className="glass-panel" style={{ padding: 28, borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                On-Chain Governance Controls
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 800, lineHeight: 1.6 }}>
                Authorized compliance officers can adjust the minimum passing score dynamically using the updateComplianceThreshold circuit.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: 28 }}>
              <div style={{ maxWidth: 650 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: 12 }}>
                  Set New Passing Threshold (50 to 95):
                </label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <input 
                    type="range" 
                    min="50" 
                    max="95" 
                    value={complianceThreshold} 
                    onChange={(e) => setComplianceThreshold(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--amber-warn)', cursor: 'pointer' }}
                  />
                  <div className="font-mono-code" style={{ fontSize: 24, fontWeight: 800, width: 70, textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 10, border: '1px solid var(--border-glass)', color: 'var(--amber-warn)' }}>
                    {complianceThreshold}
                  </div>
                </div>

                <button 
                  onClick={runUpdateThreshold}
                  disabled={updatingThreshold}
                  className="btn-cyan"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#020617' }}
                >
                  {updatingThreshold ? 'Updating Threshold...' : 'Update On-Chain Threshold'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROLE 4: PUBLIC OBSERVER LEDGER */}
        {activeRole === 'observer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total Attestations</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--cyan-bright)' }}>{stats.totalCertifications}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Public Ledger Counter</div>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Passing Attestations</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--emerald-pass)' }}>{stats.passCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Pass Rate: {passRate}%</div>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Verified Top Tier (&gt;=90)</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--violet-bright)' }}>{stats.verifiedTierCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Enterprise Gold Tier</div>
              </div>

              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Registered Suppliers</div>
                <div className="font-mono-code" style={{ fontSize: 32, fontWeight: 800, color: 'var(--amber-warn)' }}>{stats.supplierCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>Confidential Identities</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>
                Zero-Knowledge Privacy Architecture Comparison
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: 12 }}>Data Point</th>
                      <th style={{ padding: 12 }}>Storage Layer</th>
                      <th style={{ padding: 12 }}>Disclosed To</th>
                      <th style={{ padding: 12 }}>Privacy Guarantee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: 12, fontWeight: 600, color: 'var(--cyan-bright)' }}>totalCertifications</td>
                      <td style={{ padding: 12 }}>Public Ledger</td>
                      <td style={{ padding: 12 }}>Everyone</td>
                      <td style={{ padding: 12, color: 'var(--text-muted)' }}>Macro compliance tracking</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: 12, fontWeight: 600, color: 'var(--emerald-pass)' }}>passCount</td>
                      <td style={{ padding: 12 }}>Public Ledger</td>
                      <td style={{ padding: 12 }}>Everyone</td>
                      <td style={{ padding: 12, color: 'var(--text-muted)' }}>Aggregate pass rate metric</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: 12, fontWeight: 600, color: 'var(--violet-bright)' }}>privateAuditScore</td>
                      <td style={{ padding: 12, color: 'var(--violet-bright)' }}>Private Witness</td>
                      <td style={{ padding: 12, color: 'var(--rose-fail)', fontWeight: 700 }}>NO ONE (HIDDEN)</td>
                      <td style={{ padding: 12, color: 'var(--emerald-pass)', fontWeight: 600 }}>100% Confidential ZK Secret</td>
                    </tr>
                    <tr>
                      <td style={{ padding: 12, fontWeight: 600, color: 'var(--amber-warn)' }}>supplierCredential</td>
                      <td style={{ padding: 12, color: 'var(--amber-warn)' }}>Private Witness</td>
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

      {/* CERTIFICATE MODAL */}
      {showCertModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 4, 10, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="glass-panel glass-panel-glow" style={{ maxWidth: 540, width: '100%', padding: 32, position: 'relative', textAlign: 'center' }}>
            
            <button 
              onClick={() => setShowCertModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}
            >
              X
            </button>

            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid var(--emerald-pass)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={36} color="var(--emerald-pass)" />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
              Verifiable ZK Compliance Badge
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
              Zero-Knowledge Proof verified on Midnight Preview Testnet
            </p>

            <div style={{ background: 'rgba(2, 4, 10, 0.6)', border: '1px solid var(--border-glass)', borderRadius: 14, padding: 16, textAlign: 'left', marginBottom: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: 'var(--emerald-pass)', fontWeight: 800 }}>PASSED (Threshold &gt;= {complianceThreshold})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Numerical Raw Score:</span>
                <span style={{ color: 'var(--violet-bright)', fontWeight: 700 }}>[100% CONFIDENTIAL]</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Standard:</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedPreset.name}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 8, marginTop: 8 }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Proof Hash Commitment:</span>
                <span className="font-mono-code" style={{ fontSize: 10, color: 'var(--cyan-bright)', wordBreak: 'break-all' }}>{lastCertHash}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setShowCertModal(false)}
                className="btn-cyan"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Download size={16} /> Download Badge (PNG)
              </button>
              <button 
                onClick={() => copyToClipboard(lastCertHash)}
                className="btn-outline"
                style={{ flex: 1 }}
              >
                Copy Proof Hash
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '24px 28px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
        Confidential Supply Chain Compliance Platform - Powered by <span style={{ color: 'var(--violet-bright)', fontWeight: 600 }}>Midnight Network Compact ZK Circuits</span> - August Release
      </footer>

    </div>
  );
}
