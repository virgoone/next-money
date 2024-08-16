"use client";

import { useTransition } from "react";

import { Button, Popconfirm, Space, type TableColumnsType } from "antd";

import { type ChargeProductDto } from "@/db/type";
import { formatPrice } from "@/lib/utils";

import { deleteAction } from "../_lib/actions";
import { UpdateDialog } from "./update-dialog";

const DeleteAction = (props: { id: string }) => {
  const [isDeletePending, startDeleteTransition] = useTransition();

  const confirm = () => {
    startDeleteTransition(() => {
      deleteAction({ id: props.id });
    });
  };

  return (
    <Popconfirm
      title="Do you want to delete these item?"
      description="After deletion, it will not be recoverable"
      onConfirm={confirm}
      onCancel={() => {}}
      okText="Yes"
      cancelText="No"
    >
      <Button
        danger
        type="default"
        disabled={isDeletePending}
        loading={isDeletePending}
      >
        Delete
      </Button>
    </Popconfirm>
  );
};

export function getColumns(): TableColumnsType<ChargeProductDto> {
  return [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "充值积分",
      dataIndex: "creditAmount",
    },
    {
      title: "礼品码",
      dataIndex: "code",
    },
    {
      title: "状态",
      dataIndex: "used",
      render: (used) => (used ? "已使用" : "未使用"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_date, row: ChargeProductDto) => {
        return (
          <Space>
            <UpdateDialog detail={row} />
            <DeleteAction id={row.id} />
          </Space>
        );
      },
    },
  ];
}
