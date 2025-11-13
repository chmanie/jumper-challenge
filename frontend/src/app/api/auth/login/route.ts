import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

// FIXME: Could also use a server action instead (be consistent)
export const POST = async (request: Request) => {
  const body = await request.json();

  // Forward the post body to the backend
  const res = await fetch(`${process.env.API_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Login failed' }, { status: res.status });
  }

  const data = await res.json();

  const decodedToken = decodeJwt(data.responseObject.token);

  if (!decodedToken.exp) {
    return NextResponse.json({ error: 'API token has no expiry date' }, { status: res.status });
  }

  const expires = decodedToken.exp ? new Date(decodedToken.exp * 1000) : Date.now() + 24 * 60 * 60 * 1000;

  const cookieStore = await cookies();
  // Store token in httpOnly cookie
  cookieStore.set('auth_token', data.responseObject.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
  });

  return NextResponse.json({ success: true });
};
