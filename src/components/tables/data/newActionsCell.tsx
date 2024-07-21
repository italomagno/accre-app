

"use client";
import { ErrorTypes } from '@/src/types';

import { RemoveButton } from '@/src/components/remove/RemoveButton';
import { UpdateTrigger } from '../../update/UpdateTrigger';

type ActionsCellProps = {
  handleRemoveItem?: (id: string) => Promise<ErrorTypes>| void;
  id?: string;
  children?: React.ReactNode;
};

export default function NewActionsCell({
  handleRemoveItem,
  id,
  children
}: ActionsCellProps) {
  return <div className="flex items-center gap-4 justify-center">
    {children && <UpdateTrigger>{children}</UpdateTrigger>}
    {handleRemoveItem && id && (
      <RemoveButton handleRemoveItem={handleRemoveItem} id={id} />
    )}
  </div>;
}
