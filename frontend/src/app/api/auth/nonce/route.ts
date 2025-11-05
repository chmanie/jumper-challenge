import { NextResponse } from 'next/server';

export const GET = async () => {
  // In proper BFF fashion we also proxy the nonce route
  const res = await fetch(`${process.env.API_URL}/auth/nonce`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to get nonce' }, { status: res.status });
  }

  const data = await res.json();
  const { nonce } = data.responseObject;

  return NextResponse.json({ nonce });
};
