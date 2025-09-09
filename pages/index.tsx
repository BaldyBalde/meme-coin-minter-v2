import Head from "next/head";
import Link from "next/link";
import WalletConnectButton from "../components/WalletConnectButton";
import { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintToken } from "../lib/mintToken";
import { uploadToPinata } from "../lib/pinataUpload";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [mintSuccessLevel, setMintSuccessLevel] = useState(0);
  const [immutable, setImmutable] = useState(false);
  const [revokeMintAuthority, setRevokeMintAuthority] = useState(false);
  const [freezeAuthority, setFreezeAuthority] = useState(false);
  const [revokeFreezeAuthority, setRevokeFreezeAuthority] = useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!iconFile) {
      alert("Please upload an image.");
      return;
    }
    const iconUrl = await uploadToPinata(iconFile, name, symbol);
    await mintToken(
      connection,
      wallet,
      Number(amount),
      name.trim(),
      symbol.trim(),
      iconUrl,
      immutable,
      revokeMintAuthority,
      freezeAuthority,
      revokeFreezeAuthority
    );
    setMintSuccessLevel(1);
    const fadeInterval = setInterval(() => {
      setMintSuccessLevel((prev) => {
        if (prev <= 0) {
          clearInterval(fadeInterval);
          return 0;
        }
        return prev - 0.05;
      });
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Solana Meme Coin Minter</title>
        <meta name="description" content="Mint your own Solana meme coins" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.minter}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>MemeCoin Minter</div>

            <nav className={styles.nav}>
              <Link href="/" legacyBehavior>
                <a className={`${styles.btn} ${styles.btnPrimary}`}>Mint</a>
              </Link>
              <Link href="/volume-bot" legacyBehavior>
                <a className={`${styles.btn} ${styles.btnPrimary}`}>Volume Bot</a>
              </Link>
            </nav>

            <div>
              <WalletConnectButton />
            </div>
          </div>
        </header>

        {/* Card */}
        <section className={styles.card}>
          <h2 className={styles.cardHeader}>Create Solana Token</h2>

          <div className={styles.grid}>
            {/* Left column: form */}
            <div className={styles.left}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Token Name</label>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Token Name (Max 30)"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Token Symbol</label>
                <input
                  className={styles.input}
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  type="text"
                  placeholder="Token Symbol (Max 10)"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Supply</label>
                <input
                  className={styles.input}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  placeholder="Supply"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Token Image</label>
                <label className={styles.input} style={{ cursor: "pointer" }}>
                  {iconFile ? (
                    <img
                      src={URL.createObjectURL(iconFile)}
                      alt="Token Icon"
                      style={{ width: "100%", borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    <span>Choose Image</span>
                  )}
                  <input
                    type="file"
                    onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Description (Optional)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Add a short description"
                  rows={3}
                />
              </div>

              <div className={styles.ctaRow}>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnMint}`}
                  style={{
                    background:
                      mintSuccessLevel > 0
                        ? `rgba(0, 255, 0, ${mintSuccessLevel})`
                        : undefined,
                  }}
                >
                  Mint Token
                </button>
              </div>
            </div>

            {/* Right column: settings */}
            <div className={styles.right}>
              <div className={styles.settingCard}>
                <div className={styles.settingTitle}>Immutable Metadata</div>
                <div className={styles.settingDesc}>
                  Makes your token metadata unchangeable after creation, locking in name, symbol, and logo.
                </div>
                <div
                  className={`${styles.toggle} ${immutable ? styles.toggleActive : ""}`}
                  onClick={() => setImmutable(!immutable)}
                  role="switch"
                  aria-checked={immutable}
                  tabIndex={0}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>

              <div className={styles.settingCard}>
                <div className={styles.settingTitle}>Revoke Mint Authority</div>
                <div className={styles.settingDesc}>
                  Disables the ability to mint more tokens in the future, ensuring a fixed supply.
                </div>
                <div
                  className={`${styles.toggle} ${revokeMintAuthority ? styles.toggleActive : ""}`}
                  onClick={() => setRevokeMintAuthority(!revokeMintAuthority)}
                  role="switch"
                  aria-checked={revokeMintAuthority}
                  tabIndex={0}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>

              <div className={styles.settingCard}>
                <div className={styles.settingTitle}>Freeze Authority</div>
                <div className={styles.settingDesc}>
                  Allows the token to be frozen, preventing transfers if needed for security or control.
                </div>
                <div
                  className={`${styles.toggle} ${freezeAuthority ? styles.toggleActive : ""}`}
                  onClick={() => setFreezeAuthority(!freezeAuthority)}
                  role="switch"
                  aria-checked={freezeAuthority}
                  tabIndex={0}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>

              <div className={styles.settingCard}>
                <div className={styles.settingTitle}>Revoke Freeze Authority</div>
                <div className={styles.settingDesc}>
                  Removes the freeze control option, permanently enabling token transfers.
                </div>
                <div
                  className={`${styles.toggle} ${revokeFreezeAuthority ? styles.toggleActive : ""}`}
                  onClick={() => setRevokeFreezeAuthority(!revokeFreezeAuthority)}
                  role="switch"
                  aria-checked={revokeFreezeAuthority}
                  tabIndex={0}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}