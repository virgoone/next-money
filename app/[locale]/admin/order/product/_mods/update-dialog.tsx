"use client";

import * as React from "react";

import { Button, Drawer, Form, Input, InputNumber, Select, Space } from "antd";
import { FormListFieldData } from "antd/lib/form";
import { toast } from "sonner";

import { Locale } from "@/config";
import { Currency, type ChargeProductSelectDto } from "@/db/type";
import useForm from "@/hooks/use-form";
import { getErrorMessage } from "@/lib/handle-error";

import { updateAction } from "../_lib/actions";
import { updateSchema, type UpdateSchema } from "../_lib/validations";

const FormItem = Form.Item;
export function UpdateDialog(props: { detail: ChargeProductSelectDto }) {
  const { detail } = props;
  const [open, setOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition();

  function onSubmit(input: UpdateSchema, error: FormListFieldData | null) {
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
      ...detail,
      currency: detail?.currency as Currency,
      tag: (detail?.tag || []) as string[],
      message: detail?.message || "",
      locale: detail?.locale as Locale,
      state: (detail?.state || "enable") as "enable" | "disabled",
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
        title="Update Charge Product"
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
          <FormItem {...inputField} label="Title" name="title">
            <Input className="!w-full" placeholder="Please input..." />
          </FormItem>
          <FormItem {...inputField} label="Amount" name="amount">
            <InputNumber className="!w-full" placeholder="Please input..." />
          </FormItem>

          <FormItem
            {...inputField}
            label="Original Amount"
            name="originalAmount"
          >
            <InputNumber className="!w-full" placeholder="Please input..." />
          </FormItem>

          <FormItem {...inputField} label="Credit" name="credit">
            <InputNumber className="!w-full" placeholder="Please input..." />
          </FormItem>

          <FormItem {...inputField} label="Currency" name="currency">
            <Select
              options={[
                {
                  label: "CNY",
                  value: "CNY",
                },
                {
                  label: "USD",
                  value: "USD",
                },
              ]}
            />
          </FormItem>
          <FormItem {...inputField} label="State" name="state">
            <Select
              options={[
                {
                  label: "启用",
                  value: "enable",
                },
                {
                  label: "禁用",
                  value: "disabled",
                },
              ]}
            />
          </FormItem>
          <FormItem {...inputField} label="Message" name="message">
            <Input.TextArea
              rows={3}
              className="!w-full"
              placeholder="Please input..."
            />
          </FormItem>
          <FormItem {...inputField} label="Locale" name="locale">
            <Select
              options={[
                {
                  label: "英文",
                  value: "en",
                },
                {
                  label: "中文",
                  value: "zh",
                },
                {
                  label: "法语",
                  value: "fr",
                },
                {
                  label: "繁体中文",
                  value: "tw",
                },
                {
                  label: "韩语",
                  value: "kr",
                },
                {
                  label: "日语",
                  value: "jp",
                },
                {
                  label: "西班牙语",
                  value: "es",
                },
              ]}
            />
          </FormItem>
          <FormItem {...inputField} label="Tag" name="tag">
            <Select
              mode="tags"
              className="!w-full"
              placeholder="Please input..."
            />
          </FormItem>
        </Form>
      </Drawer>
    </>
  );
}
