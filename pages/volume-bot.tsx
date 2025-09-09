import React, { useState } from 'react';
import Link from 'next/link';
import WalletConnectButton from '../components/WalletConnectButton';

export default function VolumeBot() {
  const [volumePerHour, setVolumePerHour] = useState(100);
  const [slippage, setSlippage] = useState(1);
  const [tokenAddress, setTokenAddress] = useState('');
  const [buySellRatio, setBuySellRatio] = useState(50);
  const [minDelay, setMinDelay] = useState(3);
  const [maxDelay, setMaxDelay] = useState(10);
  const [randomize, setRandomize] = useState(true);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background:
            'linear-gradient(180deg, rgba(5,4,15,0.85) 0%, rgba(5,4,15,0.60) 60%, rgba(5,4,15,0.00) 100%)',
          backdropFilter: 'saturate(140%) blur(8px)',
          WebkitBackdropFilter: 'saturate(140%) blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '12px 20px',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center'
          }}
        >
          {/* Left: Brand */}
          <div style={{ justifySelf: 'start', fontSize: '1.25rem', fontWeight: 700, color: '#b7a8ff' }}>
            MemeCoin Minter
          </div>

          {/* Center: Nav */}
          <nav style={{ justifySelf: 'center', display: 'flex', gap: '10px' }}>
            <Link href="/">
              <button
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  background: 'linear-gradient(180deg, #7E3FF2 0%, #5B36E9 100%)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(126,63,242,0.35)'
                }}
              >
                Mint
              </button>
            </Link>
            <Link href="/volume-bot">
              <button
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  background: 'linear-gradient(180deg, #7E3FF2 0%, #5B36E9 100%)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(126,63,242,0.35)'
                }}
              >
                Volume Bot
              </button>
            </Link>
          </nav>

          {/* Right: Wallet */}
          <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center' }}>
            <WalletConnectButton />
          </div>
        </div>
      </header>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#0d0b1f', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#151327',
          padding: '2rem',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Solana Volume Bot</h1>
          <p style={{ color: '#b0a6d4', marginBottom: '1rem' }}>
            The cost of running the bot is 0.025 SOL for each 100 makers. Once you run the bot, it will start boosting the token you selected.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button style={{ flex: 1, padding: '1rem', backgroundColor: '#262626', border: '2px solid #7e3ff2', color: '#fff', borderRadius: '8px', fontWeight: 600 }}>
              Boost Token
            </button>
            <button style={{ flex: 1, padding: '1rem', backgroundColor: '#262626', border: '2px solid #333', color: '#aaa', borderRadius: '8px', fontWeight: 600 }}>
              Target Price / Bumps
            </button>
            <button style={{ flex: 1, padding: '1rem', backgroundColor: '#262626', border: '2px solid #333', color: '#aaa', borderRadius: '8px', fontWeight: 600 }}>
              Advanced Bot
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', color: '#c2bbf5', fontSize: '0.875rem' }}>Token Address:</label>
            <input
              type="text"
              value={tokenAddress}
              onChange={e => setTokenAddress(e.target.value)}
              placeholder="Enter Token Address"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                backgroundColor: '#1c1a2e',
                border: '1px solid #2d2a4a',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#c2bbf5', fontSize: '0.875rem' }}>How much Makers you want to generate:</label>
              <input
                type="number"
                value={volumePerHour}
                onChange={e => setVolumePerHour(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#1c1a2e',
                  border: '1px solid #2d2a4a',
                  color: '#fff'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#c2bbf5', fontSize: '0.875rem' }}>How much Volume you want to generate:</label>
              <input
                type="number"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#1c1a2e',
                  border: '1px solid #2d2a4a',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#c2bbf5', fontSize: '0.875rem' }}>How much SOL you want to spend:</label>
              <input
                type="number"
                step="0.001"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#1c1a2e',
                  border: '1px solid #2d2a4a',
                  color: '#fff'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', color: '#c2bbf5', fontSize: '0.875rem' }}>How many minutes you want the bot to run:</label>
              <input
                type="number"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#1c1a2e',
                  border: '1px solid #2d2a4a',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <button
            style={{
              marginTop: '2rem',
              width: '100%',
              padding: '1rem',
              backgroundColor: '#7e3ff2',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Start Volume Bot
          </button>
        </div>
      </main>
    </>
  );
}