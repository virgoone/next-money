"use client";

import { useTransition } from "react";

import { Button, Popconfirm, Space, type TableColumnsType } from "antd";

import { type ChargeProductSelectDto } from "@/db/type";

import { deleteAction } from "../_lib/actions";
import { UpdateDialog } from "./update-dialog";
import { formatPrice } from "@/lib/utils";

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

export function getColumns(): TableColumnsType<ChargeProductSelectDto> {
  return [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "充值金额",
      dataIndex: "amount",
      render: (price) => formatPrice(price, "$"),
    },
    {
      title: "原价",
      dataIndex: "originalAmount",
      render: (price) => formatPrice(price, "$"),
    },
    {
      title: "赠送积分",
      dataIndex: "credit",
    },
    {
      title: "币种",
      dataIndex: "currency",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_date, row: ChargeProductSelectDto) => {
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
