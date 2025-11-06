import { Avatar } from '@heroui/avatar';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';
import { formatUnits, Hex, hexToBigInt } from 'viem';

interface Props {
  address: string;
  balance: string;
  decimals?: number;
  icon?: string;
  name?: string;
  symbol?: string;
}

export const BalanceCard = ({ address, balance, decimals = 18, icon, name, symbol }: Props) => {
  const balanceNum = parseFloat(formatUnits(hexToBigInt(balance as Hex), decimals));
  const displayBalance = parseFloat(balanceNum.toFixed(3));

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-5">
        <Avatar
          isBordered
          radius="full"
          size="md"
          src={icon}
          name={name || symbol}
          fallback={name || symbol ? undefined : '$'}
        />
        <h2 className="text-default-600 text-2xl font-semibold">
          {displayBalance}{' '}
          <span className="inline-block max-w-40 overflow-hidden align-bottom text-ellipsis whitespace-nowrap">
            {symbol || '???'}
          </span>
        </h2>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-default-600 font-semibold">{name}</p>
        <p className="text-small text-default-400">{address}</p>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export const BalanceSkeletonCard = () => (
  <Card>
    <CardHeader className="flex items-center justify-between gap-5">
      <Skeleton className="rounded-full">
        <Avatar isBordered radius="full" size="md" />
      </Skeleton>
      <Skeleton className="rounded-sm">
        <h2 className="text-2xl font-semibold">00000000</h2>
      </Skeleton>
    </CardHeader>
    <CardBody className="px-3 py-0">
      <Skeleton className="rounded-sm">
        <p>.</p>
        <p>.</p>
      </Skeleton>
    </CardBody>
    <CardFooter></CardFooter>
  </Card>
);
