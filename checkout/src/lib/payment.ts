export type PaymentResult =
  | {
      status: "success";
      sessionId: string;
    }
  | {
      status: "declined";
      code: "CARD_DECLINED";
      message: string;
    }
  | {
      status: "error";
      code: "PAYMENT_FAILED";
      message: string;
    };

export function processPayment(
  cardNumber: string,
  attempt: number
): PaymentResult {
  const card = cardNumber.replace(/\s/g, "");

  // Successful test card
  if (card === "4242424242424242") {
    return {
      status: "success",
      sessionId: `sess_${Date.now()}`,
    };
  }

  // Always declined
  if (card === "4000000000000002") {
    return {
      status: "declined",
      code: "CARD_DECLINED",
      message:
        "Your card was declined. Please try another card.",
    };
  }

  // Fails once, succeeds on retry
  if (card === "4000000000000341") {
    if (attempt === 1) {
      return {
        status: "error",
        code: "PAYMENT_FAILED",
        message:
          "We couldn't process your payment. Please try again.",
      };
    }

    return {
      status: "success",
      sessionId: `sess_${Date.now()}`,
    };
  }

  // Any other card
  return {
    status: "error",
    code: "PAYMENT_FAILED",
    message:
      "This test card is not supported.",
  };
}
