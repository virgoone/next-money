"use client";

import * as React from "react";

import { Button, Drawer, Form, Input, InputNumber, Select, Space } from "antd";
import { FormListFieldData } from "antd/lib/form";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Currency } from "@/db/type";
import useForm from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/handle-error";
import { generateGifCode } from "@/lib/utils";

import { createAction } from "../_lib/actions";
import { createSchema, type CreateSchema } from "../_lib/validations";

const FormItem = Form.Item;

export function CreateDialog() {
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  function onSubmit(input: CreateSchema, error: FormListFieldData | null) {
    if (error) {
      const err = getErrorMessage(error);
      console.log("error-->", error);

      return toast.error(err + "");
    }
    startCreateTransition(() => {
      toast.promise(createAction(input), {
        loading: "Creating...",
        success: () => {
          formField.form.resetFields();
          setOpen(false);
          return "Created";
        },
        error: (error) => {
          console.log("create error--->", error);
          setOpen(false);
          return getErrorMessage(error);
        },
      });
    });
  }
  const { formField, inputField } = useForm<CreateSchema>({
    schema: createSchema,
    onSubmit,
  });

  return (
    <>
      <Button
        type="default"
        onClick={() => setOpen(true)}
        icon={<PlusIcon className="mr-2 size-4" aria-hidden="true" />}
      >
        New GiftCode
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Create GiftCode"
        size="large"
        footer={
          <Space className="flex w-full justify-end gap-2 pt-2 sm:space-x-0">
            <Button type="default" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              disabled={isCreatePending}
              onClick={formField.form.submit}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" {...formField}>
          <FormItem {...inputField} label="礼品码积分" name="creditAmount">
            <InputNumber
              className="!w-full"
              placeholder="Please input creditAmount..."
            />
          </FormItem>
          <FormItem
            {...inputField}
            className="!w-full"
            label="礼品码代码"
            name="code"
          >
            <Input.Search
              className="!w-full"
              placeholder="Please input..."
              enterButton={
                <Button
                  type="default"
                  onClick={() => {
                    formField.form.setFieldValue("code", generateGifCode(10));
                  }}
                >
                  生成
                </Button>
              }
            />
          </FormItem>
        </Form>
      </Drawer>
    </>
  );
}
