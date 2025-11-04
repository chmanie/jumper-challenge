import { ConnectButton } from '@/components/ConnectButton';

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl justify-center text-center">
        <h1 className="text-4xl font-semibold tracking-tight lg:text-6xl">
          <span>Get</span>
          <br />
          <span className="bg-linear-to-b from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent">
            Token Balances
          </span>
          <br />
          <span>effortlessly</span>
        </h1>
      </div>

      <div className="mt-6 flex gap-3">
        <ConnectButton />
      </div>
    </section>
  );
}
