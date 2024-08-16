"use client";

import { CreateDialog } from "./create-dialog";

export function TableToolbarActions({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <CreateDialog />
      {/* <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'tags',
            excludeColumns: ['select', 'actions'],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button> */}
      {/**
       * Other actions can be added here.
       * For example, export, import, etc.
       */}
    </div>
  );
}
