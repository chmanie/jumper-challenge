import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// FIXME: Could also use a server action instead (be consistent)
export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return NextResponse.json({ success: true });
};
