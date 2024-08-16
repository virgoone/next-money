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
  code: z.string().min(8),
  creditAmount: z.number().min(1),
});

export type CreateSchema = z.infer<typeof createSchema>;

export const updateSchema = z.object({
  code: z.string().min(8).optional(),
  creditAmount: z.number().min(1).optional(),
});

export type UpdateSchema = z.infer<typeof updateSchema>;
