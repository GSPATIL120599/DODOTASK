export type CheckoutMessage =
  | {
      type: "DODO_READY";
    }
  | {
      type: "DODO_SUCCESS";
      sessionId: string;
    }
  | {
      type: "DODO_CLOSE";
      reason:
        | "user_closed"
        | "payment_completed"
        | "payment_failed";
    }
  | {
      type: "DODO_ERROR";
      code: string;
      message: string;
    };

export function sendCheckoutMessage(
  message: CheckoutMessage,
  targetOrigin: string
) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, targetOrigin);
    }
  } catch (err) {
    console.error("[DodoCheckout] Failed to postMessage:", err);
  }
}
