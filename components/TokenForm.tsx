'use client';

import { useState } from 'react';

export default function TokenForm() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, symbol, iconFile });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Token Name" />
      <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Token Symbol" />
      <input type="file" onChange={e => setIconFile(e.target.files?.[0] ?? null)} />
      <button type="submit">Mint Token</button>
    </form>
  );
}