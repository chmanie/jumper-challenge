import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/react';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

interface Props {
  isError?: boolean;
}

export const InfoCard = ({ children, isError }: PropsWithChildren<Props>) => (
  <Card className={clsx('border-default-200 border', { 'border-[#FF1CF7]': isError })}>
    {isError ? (
      <>
        <CardHeader>
          <h2 className="w-full text-center font-semibold text-[#FF1CF7]">Error</h2>
        </CardHeader>
        <Divider />
      </>
    ) : null}

    <CardBody className="p-10 text-center">
      <p className="text-default-800">{children}</p>
    </CardBody>
  </Card>
);
