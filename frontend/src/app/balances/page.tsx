import { redirect } from 'next/navigation';
import { getLoggedInUser } from '@/lib/auth';

const BalancesPage = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  return (
    <main>
      <h1>Balances</h1>
      <p>This is the balances page for our application</p>
    </main>
  );
};

export default BalancesPage;
