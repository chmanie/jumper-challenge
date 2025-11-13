import { NextResponse } from 'next/server';

// FIXME: Could also use a server action instead (be consistent)
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
