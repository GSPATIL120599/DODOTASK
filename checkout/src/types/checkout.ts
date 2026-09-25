export type CheckoutStep = "checkout" | "payment" | "result";

export type CheckoutState =
  | "idle"
  | "processing"
  | "success"
  | "declined"
  | "error";

export type CustomerInfo = {
  email: string;
  name: string;
};

export type PaymentForm = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
};