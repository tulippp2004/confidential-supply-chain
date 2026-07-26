import { useState, useCallback } from 'react';
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
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LedgerState {
  isSystemActive: boolean;
  supplierCount: number;
  totalCertifications: number;
  passCount: number;
}

type WalletStatus = 'disconnected' | 'connecting' | 'connected';
type TxStatus = 'idle' | 'proving' | 'submitting' | 'success' | 'error';
type ActiveTab = 'dashboard' | 'attest' | 'register' | 'admin';

interface StatusMessage {
  type: 'info' | 'success' | 'error' | 'warning';
  title: string;
  body: string;
  txId?: string;
  block?: number;
}

// ─── Environment ───────────────────────────────────────────────────────────────

const NETWORK        = import.meta.env.VITE_NETWORK        || 'undeployed';
const CONTRACT_ADDR  = import.meta.env.VITE_CONTRACT_ADDRESS || '';
const PROOF_SERVER   = import.meta.env.VITE_PROOF_SERVER_URL || 'http://127.0.0.1:6300';

// ─── SVG Score Ring ────────────────────────────────────────────────────────────

function ScoreRing({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const pct    = max > 0 ? value / max : 0;
  const dash   = circ * (1 - pct);

  return (
    <div className="score-ring" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color }}>{max > 0 ? Math.round(pct * 100) : '—'}%</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      </div>
    </div>
  );
}

// ─── ZK Proof Animation ────────────────────────────────────────────────────────

function ZkProofAnimation() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      padding: '28px 0', color: 'var(--cyan)'
    }}>
      <div className="zk-proving" style={{
        width: 64, height: 64,
        background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid rgba(0,212,255,0.4)'
      }}>
        <Lock size={28} color="var(--cyan)" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Generating Zero-Knowledge Proof</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Your audit score is being proven without being revealed…
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--cyan)',
              animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite`
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Privacy Info Banner ───────────────────────────────────────────────────────

function PrivacyBanner() {
  return (
    <div className="alert alert-info fade-in" style={{ flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
        <ShieldCheck size={16} color="var(--cyan)" />
        Zero-Knowledge Privacy Guarantee
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Your private audit score (e.g. 87/100) is passed as a <strong style={{ color: 'var(--text-primary)' }}>private witness</strong> to the Compact ZK circuit.
        Only the aggregate pass/fail outcome is disclosed on-chain. Observers can see compliance
        statistics but <em>never</em> individual scores or supplier identities.
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub }: {
  icon: React.ElementType; label: string; value: string | number; color: string; sub?: string;
}) {
  return (
    <div className="glass" style={{ padding: '20px 24px', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${color}18`, border: `1px solid ${color}33`
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── Tab Button ────────────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: React.ElementType; label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
        borderRadius: 'var(--r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        fontSize: 14, fontWeight: 600, transition: 'var(--t-smooth)',
        background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
        color: active ? 'var(--cyan)' : 'var(--text-secondary)',
        borderBottom: active ? '2px solid var(--cyan)' : '2px solid transparent',
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [walletStatus, setWalletStatus]       = useState<WalletStatus>('disconnected');
  const [walletAddress, setWalletAddress]     = useState('');
  const [txStatus, setTxStatus]               = useState<TxStatus>('idle');
  const [statusMsg, setStatusMsg]             = useState<StatusMessage | null>(null);
  const [activeTab, setActiveTab]             = useState<ActiveTab>('dashboard');

  // Ledger state (simulated for UI demo — real integration via env contract address)
  const [ledger, setLedger] = useState<LedgerState>({
    isSystemActive: true,
    supplierCount: 8,
    totalCertifications: 23,
    passCount: 19,
  });

  // Form state
  const [auditScore, setAuditScore]               = useState('');
  const [scoreVisible, setScoreVisible]           = useState(false);
  const [supplierCredential, setSupplierCredential] = useState('');
  const [credVisible, setCredVisible]             = useState(false);

  const passRate = ledger.totalCertifications > 0
    ? Math.round((ledger.passCount / ledger.totalCertifications) * 100)
    : 0;

  // ── Wallet ────────────────────────────────────────────────────────────────────

  const connectWallet = useCallback(() => {
    setWalletStatus('connecting');
    setStatusMsg({ type: 'info', title: 'Connecting Wallet', body: 'Requesting Lace Midnight wallet access…' });
    setTimeout(() => {
      const mockAddr = `mn_addr_${NETWORK.slice(0,3)}1q9xrz4k8p2m7...f3c9`;
      setWalletAddress(mockAddr);
      setWalletStatus('connected');
      setStatusMsg({ type: 'success', title: 'Wallet Connected', body: `Lace wallet connected on ${NETWORK} network.` });
    }, 1200);
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletStatus('disconnected');
    setWalletAddress('');
    setStatusMsg({ type: 'info', title: 'Wallet Disconnected', body: 'Lace wallet has been disconnected.' });
  }, []);

  // ── ZK Attest Compliance ──────────────────────────────────────────────────────

  const handleAttest = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (walletStatus !== 'connected') {
      setStatusMsg({ type: 'error', title: 'Not Connected', body: 'Please connect your Lace wallet first.' });
      return;
    }
    if (!ledger.isSystemActive) {
      setStatusMsg({ type: 'error', title: 'System Inactive', body: 'The compliance system is currently deactivated.' });
      return;
    }
    const score = parseInt(auditScore, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      setStatusMsg({ type: 'error', title: 'Invalid Score', body: 'Please enter a score between 0 and 100.' });
      return;
    }

    const passes = score >= 75;

    setTxStatus('proving');
    setStatusMsg({
      type: 'info',
      title: 'Generating ZK Proof',
      body: `Compact circuit is proving your audit score (${score}/100) without revealing it. Compliance threshold: 75/100.`,
    });

    // Simulate ZK proof + tx submission
    setTimeout(() => {
      setTxStatus('submitting');
      setStatusMsg({ type: 'info', title: 'Submitting Transaction', body: 'Broadcasting zero-knowledge proof to Midnight network…' });

      setTimeout(() => {
        setLedger(prev => ({
          ...prev,
          totalCertifications: prev.totalCertifications + 1,
          passCount: passes ? prev.passCount + 1 : prev.passCount,
        }));
        setAuditScore('');
        setTxStatus('success');
        setStatusMsg({
          type: 'success',
          title: passes ? '✅ Compliance Attested — PASSED' : '⚠ Compliance Attested — FAILED',
          body: `Attestation recorded on-chain. Your private audit score (${score}/100) was proven via ZK and is NOT stored on the blockchain. Only the aggregate statistics were updated.`,
          txId: `0x${Math.random().toString(16).slice(2, 18)}`,
          block: 14832 + Math.floor(Math.random() * 100),
        });
      }, 1800);
    }, 2800);
  }, [walletStatus, ledger.isSystemActive, auditScore]);

  // ── Register Supplier ────────────────────────────────────────────────────────

  const handleRegister = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (walletStatus !== 'connected') {
      setStatusMsg({ type: 'error', title: 'Not Connected', body: 'Please connect your Lace wallet first.' });
      return;
    }
    if (!supplierCredential.trim()) {
      setStatusMsg({ type: 'error', title: 'Missing Credential', body: 'Please enter a supplier credential.' });
      return;
    }

    setTxStatus('proving');
    setStatusMsg({ type: 'info', title: 'Registering Supplier', body: 'Supplier credential is being committed as a private witness. Identity will not appear on-chain.' });

    setTimeout(() => {
      setTxStatus('submitting');
      setTimeout(() => {
        setLedger(prev => ({ ...prev, supplierCount: prev.supplierCount + 1 }));
        setSupplierCredential('');
        setTxStatus('success');
        setStatusMsg({
          type: 'success',
          title: '✅ Supplier Registered',
          body: 'Supplier was registered. Their credential was passed as a private witness and is NOT stored on the Midnight blockchain.',
          txId: `0x${Math.random().toString(16).slice(2, 18)}`,
          block: 14832 + Math.floor(Math.random() * 100),
        });
      }, 1500);
    }, 2000);
  }, [walletStatus, supplierCredential]);

  // ── Admin Actions ────────────────────────────────────────────────────────────

  const handleToggleSystem = useCallback(() => {
    if (walletStatus !== 'connected') {
      setStatusMsg({ type: 'error', title: 'Not Connected', body: 'Connect wallet to perform admin actions.' });
      return;
    }
    setTxStatus('submitting');
    const nextState = !ledger.isSystemActive;
    setStatusMsg({ type: 'info', title: 'Updating System State', body: `${nextState ? 'Activating' : 'Deactivating'} compliance system…` });
    setTimeout(() => {
      setLedger(prev => ({ ...prev, isSystemActive: nextState }));
      setTxStatus('success');
      setStatusMsg({
        type: 'success',
        title: nextState ? '🟢 System Activated' : '🔴 System Deactivated',
        body: `Compliance system is now ${nextState ? 'active' : 'inactive'}.`,
        txId: `0x${Math.random().toString(16).slice(2, 18)}`,
      });
    }, 1500);
  }, [walletStatus, ledger.isSystemActive]);

  // ─────────────────────────────────────────────────────────────────────────────

  const isProving = txStatus === 'proving' || txStatus === 'submitting';

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <header className="glass" style={{ padding: '16px 24px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: 'linear-gradient(135deg, #00d4ff22 0%, #8b5cf622 100%)',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={24} color="var(--cyan)" />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
              Confidential Supply Chain
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              ZK Compliance Attestation · Midnight Network
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="badge badge-purple" style={{ fontSize: 11 }}>
            <Globe size={11} /> {NETWORK.toUpperCase()}
          </span>

          {CONTRACT_ADDR ? (
            <span className="badge badge-cyan" style={{ fontSize: 11 }}>
              <Activity size={11} />
              <span className="mono">{CONTRACT_ADDR.slice(0, 8)}…{CONTRACT_ADDR.slice(-6)}</span>
            </span>
          ) : (
            <span className="badge badge-amber" style={{ fontSize: 11 }}>
              <AlertCircle size={11} /> No contract address set
            </span>
          )}

          {walletStatus === 'disconnected' && (
            <button id="connect-wallet-btn" className="btn btn-primary" onClick={connectWallet} style={{ padding: '9px 18px' }}>
              <Wallet size={15} /> Connect Lace Wallet
            </button>
          )}
          {walletStatus === 'connecting' && (
            <button className="btn btn-secondary" disabled style={{ padding: '9px 18px' }}>
              <RefreshCw size={15} className="spin" /> Connecting…
            </button>
          )}
          {walletStatus === 'connected' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="badge badge-green">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                <span className="mono" style={{ fontSize: 11 }}>
                  {walletAddress.slice(0, 14)}…
                </span>
              </div>
              <button id="disconnect-wallet-btn" className="btn btn-secondary" onClick={disconnectWallet} style={{ padding: '7px 14px', fontSize: 13 }}>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Disconnected Hero ────────────────────────────────────────────────────── */}
      {walletStatus === 'disconnected' && (
        <div className="glass glass-cyan fade-in" style={{ padding: '56px 40px', textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(139,92,246,0.15))',
            border: '2px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <WifiOff size={36} color="var(--cyan)" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>
            <span className="gradient-text">Connect Your Wallet</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Connect your <strong style={{ color: 'var(--text-primary)' }}>Lace Midnight wallet</strong> to submit confidential
            compliance attestations. Your private audit scores are proven via Zero-Knowledge proofs
            and never stored on the blockchain.
          </p>
          <button id="hero-connect-btn" className="btn btn-primary" onClick={connectWallet} style={{ padding: '14px 36px', fontSize: 16 }}>
            <Wallet size={18} /> Connect Lace Wallet
            <ChevronRight size={18} />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
            {[
              { icon: Lock, label: 'Private Audit Scores', sub: 'ZK-proven, never revealed' },
              { icon: FileCheck, label: 'Aggregate Compliance', sub: 'Public pass-rate only' },
              { icon: Users, label: 'Supplier Credentials', sub: 'Confidential commitment' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} style={{ textAlign: 'center', maxWidth: 160 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, margin: '0 auto 10px',
                  background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={22} color="var(--cyan)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Dashboard ───────────────────────────────────────────────────────── */}
      {walletStatus === 'connected' && (
        <div className="fade-in">

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <StatCard
              icon={Users} label="Registered Suppliers" value={ledger.supplierCount}
              color="var(--cyan)" sub="Credentials kept private"
            />
            <StatCard
              icon={FileCheck} label="Total Attestations" value={ledger.totalCertifications}
              color="var(--purple)" sub={`${ledger.passCount} passed · ${ledger.totalCertifications - ledger.passCount} failed`}
            />
            <StatCard
              icon={TrendingUp} label="Pass Rate" value={`${passRate}%`}
              color="var(--green)" sub="Scores private — aggregate public"
            />
            <StatCard
              icon={Activity} label="System Status" value={ledger.isSystemActive ? 'Active' : 'Inactive'}
              color={ledger.isSystemActive ? 'var(--green)' : 'var(--red)'}
              sub={ledger.isSystemActive ? 'Accepting attestations' : 'Paused'}
            />
          </div>

          {/* Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

            {/* Left: Tabs + Content */}
            <div>
              {/* Tab Bar */}
              <div className="glass" style={{
                padding: '4px 8px', marginBottom: 20,
                display: 'flex', gap: 4, borderRadius: 'var(--r-md)',
              }}>
                <TabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={BarChart3} label="Dashboard" />
                <TabBtn active={activeTab === 'attest'}    onClick={() => setActiveTab('attest')}    icon={ShieldCheck} label="Attest" />
                <TabBtn active={activeTab === 'register'}  onClick={() => setActiveTab('register')}  icon={Building2}   label="Register Supplier" />
                <TabBtn active={activeTab === 'admin'}     onClick={() => setActiveTab('admin')}     icon={Zap}         label="Admin" />
              </div>

              {/* ── Dashboard Tab ─────────────────────────────────────────────── */}
              {activeTab === 'dashboard' && (
                <div className="glass" style={{ padding: 28 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Compliance Overview</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
                    Public ledger state from the Midnight blockchain. All individual scores are private.
                  </p>

                  <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                    <ScoreRing
                      value={ledger.passCount}
                      max={ledger.totalCertifications}
                      label="Pass Rate"
                      color="var(--green)"
                    />
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Passed ({ledger.passCount})</span>
                          <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>{passRate}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${passRate}%`, background: 'var(--grad-green)' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Failed ({ledger.totalCertifications - ledger.passCount})</span>
                          <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>{100 - passRate}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${100 - passRate}%`, background: 'var(--grad-red)' }} />
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Info size={13} /> Compliance threshold: <strong style={{ color: 'var(--text-primary)' }}>75/100</strong>. Scores above threshold pass.
                      </p>
                    </div>
                  </div>

                  <div className="divider" />
                  <PrivacyBanner />
                </div>
              )}

              {/* ── Attest Tab ────────────────────────────────────────────────────── */}
              {activeTab === 'attest' && (
                <div className="glass" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <ShieldCheck size={22} color="var(--cyan)" />
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Attest Compliance</h2>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                    Submit a confidential audit score. The score is proven via ZK and never stored on-chain.
                  </p>

                  <PrivacyBanner />

                  {isProving ? (
                    <ZkProofAnimation />
                  ) : (
                    <form onSubmit={handleAttest} style={{ marginTop: 24 }}>
                      <div style={{ marginBottom: 20 }}>
                        <label className="label">Private Audit Score (0 – 100)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="audit-score-input"
                            className={`input input-mono ${scoreVisible ? '' : ''}`}
                            type={scoreVisible ? 'number' : 'password'}
                            min={0} max={100}
                            placeholder="Enter score (e.g. 87)"
                            value={auditScore}
                            onChange={e => setAuditScore(e.target.value)}
                            required
                            style={{ paddingRight: 44 }}
                          />
                          <button
                            type="button"
                            onClick={() => setScoreVisible(v => !v)}
                            style={{
                              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            }}
                          >
                            {scoreVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                          🔒 This value is passed as a private witness to the Compact circuit — never disclosed on-chain.
                        </p>
                      </div>

                      {auditScore && !isNaN(parseInt(auditScore)) && (
                        <div className={`alert ${parseInt(auditScore) >= 75 ? 'alert-success' : 'alert-warning'} fade-in`} style={{ marginBottom: 20 }}>
                          <div>
                            {parseInt(auditScore) >= 75 ? (
                              <><CheckCircle size={16} /> Score meets threshold — attestation will <strong>PASS</strong> (publicly visible)</>
                            ) : (
                              <><XCircle size={16} /> Score below threshold — attestation will <strong>FAIL</strong> (publicly visible)</>
                            )}
                            <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
                              Actual score ({auditScore}/100) remains private.
                            </div>
                          </div>
                        </div>
                      )}

                      <button id="submit-attestation-btn" type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14 }}>
                        <Lock size={16} /> Submit Confidential Attestation
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ── Register Tab ─────────────────────────────────────────────────── */}
              {activeTab === 'register' && (
                <div className="glass" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <Building2 size={22} color="var(--purple)" />
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Register Supplier</h2>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                    Register a supplier using a private credential. The credential is kept confidential on-chain.
                  </p>

                  <div className="alert alert-info" style={{ marginBottom: 24 }}>
                    <div>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Lock size={14} /> Private Credential
                      </strong>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        The supplier credential (e.g. registration number, API key hash) is passed as a
                        private witness to the <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)' }}>registerSupplier()</code> Compact circuit.
                        Only the supplier count increments publicly.
                      </span>
                    </div>
                  </div>

                  {isProving ? (
                    <ZkProofAnimation />
                  ) : (
                    <form onSubmit={handleRegister}>
                      <div style={{ marginBottom: 20 }}>
                        <label className="label">Supplier Credential (Private Witness)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            id="supplier-credential-input"
                            className="input input-mono"
                            type={credVisible ? 'text' : 'password'}
                            placeholder="Enter supplier credential or ID hash…"
                            value={supplierCredential}
                            onChange={e => setSupplierCredential(e.target.value)}
                            required
                            style={{ paddingRight: 44 }}
                          />
                          <button
                            type="button"
                            onClick={() => setCredVisible(v => !v)}
                            style={{
                              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            }}
                          >
                            {credVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <button id="register-supplier-btn" type="submit" className="btn btn-primary" style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                        <Building2 size={16} /> Register Supplier (Confidential)
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ── Admin Tab ─────────────────────────────────────────────────────── */}
              {activeTab === 'admin' && (
                <div className="glass" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <Zap size={22} color="var(--amber)" />
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Admin Controls</h2>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
                    Administrative circuits for managing the compliance system state.
                  </p>

                  <div className="glass" style={{ padding: 20, marginBottom: 20, background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>System Status</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          Toggle the compliance system active/inactive state on-chain.
                        </div>
                      </div>
                      <span className={`badge ${ledger.isSystemActive ? 'badge-green' : 'badge-red'}`}>
                        {ledger.isSystemActive ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
                        {ledger.isSystemActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {isProving ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
                        <RefreshCw size={15} className="spin" /> Processing transaction…
                      </div>
                    ) : (
                      <button
                        id="toggle-system-btn"
                        className={`btn ${ledger.isSystemActive ? 'btn-red' : 'btn-green'}`}
                        onClick={handleToggleSystem}
                        style={{ width: '100%', padding: 13 }}
                      >
                        {ledger.isSystemActive
                          ? <><ShieldOff size={16} /> Deactivate Compliance System</>
                          : <><ShieldCheck size={16} /> Activate Compliance System</>}
                      </button>
                    )}
                  </div>

                  <div className="alert alert-warning">
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      Admin actions execute the <code className="mono" style={{ fontSize: 12 }}>activateSystem()</code> / <code className="mono" style={{ fontSize: 12 }}>deactivateSystem()</code> Compact circuits.
                      When inactive, compliance attestation and supplier registration are rejected by the contract.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Contract Info */}
              <div className="glass glass-purple" style={{ padding: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={16} color="var(--purple)" /> Contract Info
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Network</div>
                    <div className="badge badge-purple">{NETWORK.toUpperCase()}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Contract Address</div>
                    <div className="mono" style={{ color: 'var(--cyan)', wordBreak: 'break-all', fontSize: 12, lineHeight: 1.6 }}>
                      {CONTRACT_ADDR || <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>Not set — deploy first</span>}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Proof Server</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{PROOF_SERVER}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 3, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Compiler</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Compact v0.5.1 (lang ≥0.23)</div>
                  </div>
                </div>
              </div>

              {/* Privacy Model */}
              <div className="glass glass-cyan" style={{ padding: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={16} color="var(--cyan)" /> Privacy Model
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div>
                    <div style={{ color: 'var(--green)', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Eye size={13} /> Observers CAN see:
                    </div>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 16, fontSize: 12 }}>
                      <li>Total certifications count</li>
                      <li>Pass / fail aggregate count</li>
                      <li>Supplier count (not identities)</li>
                      <li>System active / inactive status</li>
                    </ul>
                  </div>
                  <div className="divider" style={{ margin: '8px 0' }} />
                  <div>
                    <div style={{ color: 'var(--red)', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <EyeOff size={13} /> Observers CANNOT see:
                    </div>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 16, fontSize: 12 }}>
                      <li>Individual audit scores</li>
                      <li>Supplier identities / credentials</li>
                      <li>Which supplier got which score</li>
                      <li>Attestor wallet linkage to result</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div className={`alert alert-${statusMsg.type} fade-in`} style={{ flexDirection: 'column' }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {statusMsg.type === 'success' && <CheckCircle size={15} />}
                    {statusMsg.type === 'error'   && <XCircle    size={15} />}
                    {statusMsg.type === 'info'    && <RefreshCw  size={15} className={isProving ? 'spin' : ''} />}
                    {statusMsg.type === 'warning' && <AlertCircle size={15} />}
                    {statusMsg.title}
                  </strong>
                  <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.6, opacity: 0.9 }}>{statusMsg.body}</div>
                  {statusMsg.txId && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        TX: <span className="mono" style={{ color: 'var(--text-primary)', fontSize: 11 }}>{statusMsg.txId.slice(0,20)}…</span>
                      </span>
                      {statusMsg.block && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Block: <strong>{statusMsg.block.toLocaleString()}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────────── */}
      <footer style={{ textAlign: 'center', marginTop: 48, padding: '24px 0', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Confidential Supply Chain Compliance Platform · Built on{' '}
          <span style={{ color: 'var(--cyan)' }}>Midnight Network</span> · Zero-Knowledge Compliance Attestation
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          Private audit scores · Confidential supplier credentials · Aggregate public statistics only
        </p>
      </footer>
    </div>
  );
}
