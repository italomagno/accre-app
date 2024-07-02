"use client";
import { ErrorTypes } from '@/src/types';

import { TableCell } from '../ui/table';
import { RemoveButton } from '@/src/components/remove/RemoveButton';
import { UpdateTrigger } from '../update/UpdateTrigger';

type ActionsCellProps = {
  handleRemoveItem?: (id: string) => Promise<ErrorTypes>;
  id?: string;
  children?: React.ReactNode;
};

export default function ActionsCell({
  handleRemoveItem,
  id,
  children
}: ActionsCellProps) {
  return <TableCell className="flex items-center gap-4 justify-center">
    {children && <UpdateTrigger>{children}</UpdateTrigger>}
    {handleRemoveItem && id && (
      <RemoveButton handleRemoveItem={handleRemoveItem} id={id} />
    )}
  </TableCell>;
}
