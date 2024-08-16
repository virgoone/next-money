"use client";

import * as React from "react";

import { Button, Drawer, Form, Input, InputNumber, Select, Space } from "antd";
import { FormListFieldData } from "antd/lib/form";
import { toast } from "sonner";

import { GiftCodeDto } from "@/db/schema";
import useForm from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/handle-error";
import { generateGifCode } from "@/lib/utils";

import { updateAction } from "../_lib/actions";
import { updateSchema, type UpdateSchema } from "../_lib/validations";

const FormItem = Form.Item;
export function UpdateDialog(props: { detail: GiftCodeDto }) {
  const { detail } = props;
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  function onSubmit(input: UpdateSchema, error: FormListFieldData | null) {
    if (detail.used) {
      return toast.error("已使用不允许修改");
    }
    if (error) {
      const err = getErrorMessage(error);
      console.log("error-->", err);

      return toast.error(err + "");
    }
    startCreateTransition(() => {
      toast.promise(updateAction({ ...input, id: detail.id }), {
        loading: "Update...",
        success: () => {
          formField.form.resetFields();
          setOpen(false);
          return "Updated";
        },
        error: (error) => {
          setOpen(false);
          return getErrorMessage(error);
        },
      });
    });
  }
  const { formField, inputField } = useForm<UpdateSchema>({
    schema: updateSchema,
    onSubmit,
  });

  React.useEffect(() => {
    formField.form.setFieldsValue({
      code: detail?.code ?? "",
      creditAmount: detail?.creditAmount,
    });
  }, [detail, open]);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Update GiftCode"
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
        <Form layout="vertical" {...formField} disabled={!!detail?.used}>
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
                  disabled={!!detail?.used}
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
