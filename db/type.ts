import { Prisma } from "@prisma/client";

export enum Currency {
  CNY = "CNY",
  USD = "USD",
}

export enum OrderPhase {
  Pending = "Pending",
  Paid = "Paid",
  Canceled = "Canceled",
  Failed = "Failed",
}

export enum PaymentChannelType {
  Alipay = "Alipay",
  WeChat = "WeChat",
  Stripe = "Stripe",
  GiftCode = "GiftCode",
  InviteCode = "InviteCode",
  ActivityCredit = "Event Gift",
}

export enum BillingType {
  Refund = "Refund", // 退款
  Withdraw = "Withdraw",
}

export enum FluxTaskStatus {
  Processing = "processing",
  Succeeded = "succeeded",
  Failed = "failed",
  Canceled = "canceled",
}

export type UserCreditDto = Prisma.UserCreditGetPayload<any>;

export type UserCreditSchema = Prisma.UserCreditCreateInput;

export type UserCreditSelectDto = Omit<UserCreditDto, "id"> & { id: string };

export type ChargeProductDto = Prisma.ChargeProductGetPayload<any>;

export type ChargeProductSchema = Prisma.ChargeProductCreateInput;

export type ChargeProductSelectDto = Omit<ChargeProductDto, "id"> & {
  id: string;
};

export type ChargeOrderDto = Prisma.ChargeOrderGetPayload<any>;

export type GiftCodeDto = Prisma.GiftCodeGetPayload<any>;

export type GiftCodeSchema = Prisma.GiftCodeCreateInput;

export type GiftCodeSelectDto = Omit<GiftCodeDto, "id"> & { id: string };

export type FluxDto = Prisma.FluxDataGetPayload<any>;

export type FluxSchema = Prisma.FluxDataCreateInput;

export type FluxSelectDto = Omit<FluxDto, "id"> & { id: string };
