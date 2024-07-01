"use client";
import { ErrorTypes } from '@/src/types';

import { TableCell } from '../ui/table';
import { UpdateButton } from '../update/updateButton';
import { RemoveButton } from '@/src/components/remove/RemoveButton';

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
    {children && <UpdateButton>{children}</UpdateButton>}
    {handleRemoveItem && id && (
      <RemoveButton handleRemoveItem={handleRemoveItem} id={id} />
    )}
  </TableCell>;
}
