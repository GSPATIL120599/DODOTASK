import { z } from "zod";

export const CheckoutMessageSchema = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal("DODO_READY"),
    }),

    z.object({
      type: z.literal("DODO_SUCCESS"),
      sessionId: z.string(),
    }),

    z.object({
      type: z.literal("DODO_CLOSE"),
      reason: z.enum([
        "user_closed",
        "payment_completed",
        "payment_failed",
      ]),
    }),

    z.object({
      type: z.literal("DODO_ERROR"),
      code: z.string(),
      message: z.string(),
    }),
  ]
);

export type CheckoutMessage = z.infer<
  typeof CheckoutMessageSchema
>;

export type CheckoutInitMessage = {
  type: "DODO_INIT";
  parentOrigin: string;
};

export type CheckoutOptions = {
  productId: string;
  checkoutUrl?: string;
  returnUrl?: string;

  onSuccess?: (data: {
    sessionId: string;
  }) => void;

  onClose?: (data: {
    reason: "user_closed" | "payment_completed" | "payment_failed";
  }) => void;

  onError?: (data: {
    code: string;
    message: string;
  }) => void;
};

export type CheckoutRedirectOptions = {
  productId: string;
  checkoutUrl?: string;
  returnUrl?: string;
};

let iframe: HTMLIFrameElement | null = null;
let currentOptions: CheckoutOptions | null = null;
let keydownListenerAttached = false;

const DEFAULT_CHECKOUT_URL = "http://localhost:5173";

function getCheckoutOrigin(url: string = DEFAULT_CHECKOUT_URL): string {
  try {
    return new URL(url).origin;
  } catch {
    return "http://localhost:5173";
  }
}

function handleMessage(event: MessageEvent) {
  const activeCheckoutUrl = currentOptions?.checkoutUrl ?? DEFAULT_CHECKOUT_URL;
  const expectedOrigin = getCheckoutOrigin(activeCheckoutUrl);

  // Security check: Only accept messages from our checkout host
  if (event.origin !== expectedOrigin) {
    return;
  }

  // Security check: Only accept messages from our iframe
  if (
    !iframe ||
    event.source !== iframe.contentWindow
  ) {
    return;
  }

  // Validate incoming data structure with Zod
  const result = CheckoutMessageSchema.safeParse(event.data);
  if (!result.success) {
    return;
  }

  const message: CheckoutMessage = result.data;

  switch (message.type) {
    case "DODO_READY":
      return;

    case "DODO_SUCCESS":
      currentOptions?.onSuccess?.({
        sessionId: message.sessionId,
      });
      return;

    case "DODO_CLOSE":
      cleanupModal();
      currentOptions?.onClose?.({
        reason: message.reason,
      });
      currentOptions = null;
      return;

    case "DODO_ERROR":
      currentOptions?.onError?.({
        code: message.code,
        message: message.message,
      });
      return;
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && iframe) {
    DodoCheckout.close("user_closed");
  }
}

function cleanupModal() {
  if (iframe) {
    iframe.remove();
    iframe = null;
  }
  if (keydownListenerAttached) {
    window.removeEventListener("keydown", handleKeyDown);
    keydownListenerAttached = false;
  }
}

// Global message listener
if (typeof window !== "undefined") {
  window.addEventListener("message", handleMessage);
}

export const DodoCheckout = {
  /**
   * Opens the checkout in an embedded secure iframe modal overlay.
   */
  open(options: CheckoutOptions) {
    // Prevent multiple modal instances
    if (iframe) {
      console.warn("[DodoCheckout] Checkout is already open.");
      return;
    }

    currentOptions = options;
    const checkoutBase = options.checkoutUrl ?? DEFAULT_CHECKOUT_URL;
    const checkoutOrigin = getCheckoutOrigin(checkoutBase);

    iframe = document.createElement("iframe");

    const url = new URL(checkoutBase);
    url.searchParams.set("productId", options.productId);
    url.searchParams.set("embedded", "true");
    if (options.returnUrl) {
      url.searchParams.set("returnUrl", options.returnUrl);
    } else if (typeof window !== "undefined") {
      url.searchParams.set("returnUrl", window.location.href);
    }

    iframe.src = url.toString();
    iframe.title = "Dodo Checkout";
    iframe.setAttribute("allow", "payment");
    iframe.setAttribute("aria-label", "Dodo Secure Checkout Modal");

    // Modal frame styling with backdrop blur
    iframe.style.position = "fixed";
    iframe.style.inset = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.zIndex = "999999";
    iframe.style.background = "rgba(15, 23, 42, 0.45)";
    iframe.style.backdropFilter = "blur(8px)";
    iframe.style.transition = "opacity 0.2s ease";

    iframe.addEventListener("load", () => {
      if (!iframe?.contentWindow) {
        return;
      }

      const initMessage: CheckoutInitMessage = {
        type: "DODO_INIT",
        parentOrigin: window.location.origin,
      };

      iframe.contentWindow.postMessage(initMessage, checkoutOrigin);
    });

    document.body.appendChild(iframe);

    // Escape key listener for accessibility
    if (!keydownListenerAttached) {
      window.addEventListener("keydown", handleKeyDown);
      keydownListenerAttached = true;
    }
  },

  /**
   * Programmatically closes the open checkout iframe.
   */
  close(reason: "user_closed" | "payment_completed" | "payment_failed" = "user_closed") {
    if (!iframe) {
      return;
    }

    const savedOptions = currentOptions;
    cleanupModal();
    savedOptions?.onClose?.({ reason });
    currentOptions = null;
  },

  /**
   * Redirects the customer to the hosted checkout page on the checkout domain.
   */
  redirectToCheckout(options: CheckoutRedirectOptions) {
    const checkoutBase = options.checkoutUrl ?? DEFAULT_CHECKOUT_URL;
    const cleanBase = checkoutBase.replace(/\/$/, "");
    const targetUrl = cleanBase.endsWith("/checkout") ? cleanBase : `${cleanBase}/checkout`;
    const url = new URL(
      targetUrl.startsWith("http")
        ? targetUrl
        : typeof window !== "undefined"
        ? `${window.location.origin}${targetUrl}`
        : targetUrl
    );
    url.searchParams.set("productId", options.productId);
    url.searchParams.set("mode", "redirect");

    const returnUrl = options.returnUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (returnUrl) {
      url.searchParams.set("returnUrl", returnUrl);
    }

    if (typeof window !== "undefined") {
      window.location.href = url.toString();
    }
  },
};
