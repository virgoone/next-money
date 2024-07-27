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
}
