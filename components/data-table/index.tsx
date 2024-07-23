"use client";

import React, { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button, Table as DataTable, Modal, TableColumnsType } from "antd";
import { TrashIcon } from "lucide-react";

import { PageProps } from "./types";

interface TableProps<TData = any> {
  searchPromise: ReturnType<() => Promise<PageProps<TData>>>;
  deleteAction?: (ids: string[]) => Promise<void>;
  toolbarElement?: JSX.Element;
  getColumns: () => TableColumnsType<TData>;
}
const { confirm } = Modal;
export function Table({
  searchPromise,
  deleteAction,
  toolbarElement,
  getColumns,
}: TableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const { data, page, total, pageSize } = React.use(searchPromise);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const columns = React.useMemo(() => getColumns(), []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const deleteConfirmAction = () => {
    console.log("selectedRowKeys", selectedRowKeys);
    confirm({
      title: "Do you want to delete these items?",
      icon: <TrashIcon />,
      content: "After deletion, it will not be recoverable",
      onOk() {
        startDeleteTransition(() => {
          deleteAction?.(selectedRowKeys as string[]);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <div className="flex w-full items-center justify-between space-y-2.5 overflow-auto px-1 py-2">
        <div className="flex-1">
          {hasSelected && Boolean(deleteAction) && (
            <Button
              danger
              type="default"
              disabled={isDeletePending}
              loading={isDeletePending}
              icon={<TrashIcon className="mr-2 size-4" aria-hidden="true" />}
              onClick={() => deleteConfirmAction()}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
        </div>
        {toolbarElement}
      </div>

      <DataTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize,
          current: page,
          total,
          position: ["bottomRight"],
          pageSizeOptions: [10, 20, 30, 40, 50],
          onChange(page, pageSize) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("page", page + "");
            newSearchParams.set("pageSize", pageSize + "");
            router.push(`${pathname}?${newSearchParams.toString()}`, {
              scroll: false,
            });
          },
          onShowSizeChange(current, size) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("page", "1");
            newSearchParams.set("pageSize", size + "");
            router.push(`${pathname}?${newSearchParams.toString()}`, {
              scroll: false,
            });
          },
        }}
      />
    </div>
  );
}
