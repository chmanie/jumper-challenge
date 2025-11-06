import { redirect } from 'next/navigation';

import { NetworkName } from '@/components/NetworkName';
import { getLoggedInUser } from '@/lib/auth';
import { LeaderboardTable } from '@/components/LeaderboardTable';

const LeaderboardPage = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  return (
    <main>
      <div className="text-center">
        <h1 className="mb-12 text-2xl font-semibold tracking-normal lg:text-4xl">
          <span className="bg-linear-to-b from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent">Leaderboard </span>
          <span>on </span>
          <span className="bg-linear-to-b from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent">
            <NetworkName />
          </span>
        </h1>
      </div>
      <LeaderboardTable />
    </main>
  );
};

export default LeaderboardPage;
