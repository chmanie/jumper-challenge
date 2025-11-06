import { redirect } from 'next/navigation';

import { BalanceGrid } from '@/components/BalanceGrid';
import { NetworkName } from '@/components/NetworkName';
import { getLoggedInUser } from '@/lib/auth';

const BalancesPage = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  return (
    <main>
      <div className="text-center">
        <h1 className="mb-12 text-2xl font-semibold tracking-normal lg:text-4xl">
          <span>Your </span>
          <span className="bg-linear-to-b from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent">
            Token Balances{' '}
          </span>
          <span>on </span>
          <span
            className="bg-linear-to-b from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent"
            suppressHydrationWarning
          >
            <NetworkName />
          </span>
        </h1>
      </div>
      <BalanceGrid address={user.address} />
    </main>
  );
};

export default BalancesPage;
