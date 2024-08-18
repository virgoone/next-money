import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
  sort: z.string().optional(),
  from: z.string().optional(),
  state: z.enum(["enable", "disable"]).optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});
export const getSchema = searchParamsSchema;

export type GetSchema = z.infer<typeof getSchema>;

export const createSchema = z.object({
  amount: z.number().min(100),
  credit: z.number().min(0),
  originalAmount: z.number(),
  currency: z.enum(["CNY", "USD"]),
  message: z.string().optional(),
  state: z.enum(["enable", "disabled"]),
  locale: z.enum(["en", "zh", "fr", "tw"]),
  tag: z.array(z.string()).optional(),
  title: z.string(),
});

export type CreateSchema = z.infer<typeof createSchema>;

export const updateSchema = z.object({
  amount: z.number().optional(),
  credit: z.number().optional(),
  title: z.string().optional(),
  originalAmount: z.number(),
  currency: z.enum(["CNY", "USD"]).optional(),
  locale: z.enum(["en", "zh", "fr", "tw"]).optional(),
  message: z.string().optional(),
  state: z.enum(["enable", "disabled"]).optional(),
  tag: z.array(z.string()).optional(),
});

export type UpdateSchema = z.infer<typeof updateSchema>;
