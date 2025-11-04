import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BalancesPage = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    // Don't cache auth checks
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/');
  }

  const result = await res.json();
  const { me } = result.responseObject;

  return (
    <main>
      <h1>Balances</h1>
      <p>This is the balances page for our application: {me}</p>
    </main>
  );
};

export default BalancesPage;
