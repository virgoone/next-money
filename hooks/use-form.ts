import { useCallback, useMemo } from "react";
import type { Rule } from "antd/es/form";
import Form, { FormInstance, FormListFieldData } from "antd/lib/form";
import { z } from "zod";

type UseFormProps<T extends object> = {
  form?: FormInstance<T>;
  schema: z.ZodSchema<T> | null;
  onSubmit: (data: T | null, error: FormListFieldData | null) => void;
};

type UseFormTypes<T> = {
  formField: {
    form: FormInstance<T>;
    onFinish: (values: T) => void;
    onChange: React.FormEventHandler<HTMLFormElement>;
  };
  inputField: {
    rules: Rule[];
  };
};

const mapErrorFromZodIssue = (issues) =>
  issues.reduce((obj, issue) => {
    const fieldName = issue.path.join(".");
    if (!obj[fieldName]) {
      obj[fieldName] = [issue.message];
    } else {
      obj[fieldName] = [...obj[fieldName], issue.message];
    }
    return obj;
  }, {});

const zodValidator = <T extends z.AnyZodObject>(
  schema: z.ZodSchema<T>,
  getFieldsValue: () => T,
) => ({
  async validator({ field }: Record<string, string>) {
    await schema.parseAsync(getFieldsValue()).catch((e) => {
      const errorMap = mapErrorFromZodIssue(e.issues);

      if (errorMap[field]?.length) {
        throw new Error(errorMap[field].pop());
      }
    });
  },
});

export default function useForm<T extends Record<string, any>>({
  form: propsForm,
  schema,
  onSubmit,
}: UseFormProps<T>): UseFormTypes<T> {
  const [form] = Form.useForm<T>(propsForm);
  const { getFieldsValue, getFieldsError } = form;

  const rules = useMemo(
    () => (schema ? zodValidator(schema, getFieldsValue) : {}),
    [getFieldsValue, schema],
  );

  const onChange = useCallback((e) => {
    const arrIdField = e.target.id.split("_");
    const fieldName = arrIdField
      .slice(1, arrIdField.length)
      .map((p: string) => (/^\d+$/.test(p) ? Number(p) : p));

    const errors =
      form
        .getFieldsError()
        .find((err) => fieldName.every((n) => err.name.includes(n)))?.errors ??
      [];

    if (errors.length) form.setFields([{ name: fieldName, errors: [] }]);
  }, []);

  const onFinish = useCallback(
    (data: T) => {
      if (!schema) return onSubmit(data, null);

      schema
        .parseAsync(data)
        .then(() => onSubmit(data, null))
        .catch((e) => {
          const errorMap = mapErrorFromZodIssue(e.issues);

          const fields = Object.keys(errorMap).map((field) => ({
            name: field
              .split(".")
              .map((p: string) => (/^\d+$/.test(p) ? Number(p) : p)),
            errors: errorMap[field],
          }));
          console.log(fields);
          form.setFields(fields);
          onSubmit(null, e);
        });
    },
    [onSubmit, schema],
  );

  return {
    formField: { form, onFinish, onChange },
    inputField: { rules: [rules] },
  };
}
