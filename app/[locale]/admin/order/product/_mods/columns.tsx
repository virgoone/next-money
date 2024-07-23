"use client";

import { useTransition } from "react";

import { Button, Popconfirm, Space, type TableColumnsType } from "antd";

import { type ChargeProductDto } from "@/db/schema";

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

export function getColumns(): TableColumnsType<ChargeProductDto> {
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
      title: "奖励金额",
      dataIndex: "reward",
      render: (price) => formatPrice(price, "$"),
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
