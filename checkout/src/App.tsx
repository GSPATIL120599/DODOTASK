import { useEffect, useState, useRef } from "react";
import { products } from "./data/products";
import { processPayment, type PaymentResult } from "./lib/payment";
import { sendCheckoutMessage } from "./lib/messages";
import type { CheckoutStep, CheckoutState, CustomerInfo, PaymentForm } from "./types/checkout";
import { Header } from "./components/Header";
import { StepIndicator } from "./components/StepIndicator";
import { CustomerStep } from "./components/CustomerStep";
import { PaymentStep } from "./components/PaymentStep";
import { ResultStep } from "./components/ResultStep";

export default function App() {
  const [parentOrigin, setParentOrigin] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId") ?? "prod_123";
  const defaultReturnUrl =
    typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5175"
      : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:5175";
  const returnUrlParam = searchParams.get("returnUrl") || defaultReturnUrl;
  const initialStep = (searchParams.get("step") as CheckoutStep) || "checkout";
  const isEmbedParam = searchParams.get("embedded") === "true";

  const [isEmbedded, setIsEmbedded] = useState(false);
  useEffect(() => {
    setIsEmbedded(window.self !== window.top || isEmbedParam);
  }, [isEmbedParam]);

  const product = products[productId as keyof typeof products] ?? products.prod_123;

  const [step, setStep] = useState<CheckoutStep>(initialStep);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [attempt, setAttempt] = useState(0);
  const [lastPaymentResult, setLastPaymentResult] = useState<PaymentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const [customer, setCustomer] = useState<CustomerInfo>({ email: "", name: "" });
  const [customerErrors, setCustomerErrors] = useState<{ email?: string; name?: string }>({});
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  // postMessage bridge with host window
  useEffect(() => {
    const handleInit = (e: MessageEvent) => {
      if (e.data?.type === "DODO_INIT" && typeof e.data.parentOrigin === "string") {
        setParentOrigin(e.data.parentOrigin);
      }
    };
    window.addEventListener("message", handleInit);
    return () => window.removeEventListener("message", handleInit);
  }, []);

  useEffect(() => {
    if (parentOrigin) {
      sendCheckoutMessage({ type: "DODO_READY" }, parentOrigin);
    }
  }, [parentOrigin]);

  const goToStep = (next: CheckoutStep) => {
    setStep(next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("step", next);
      window.history.pushState({ step: next }, "", url.toString());
    } catch {}
  };

  const returnToStore = (
    status: "success" | "declined" | "cancelled",
    details?: { sessionId?: string; code?: string; message?: string }
  ) => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isEmbedded) {
      const reason =
        status === "success"
          ? "payment_completed"
          : status === "declined"
          ? "payment_failed"
          : "user_closed";
      sendCheckoutMessage({ type: "DODO_CLOSE", reason }, parentOrigin || "*");
      return;
    }

    try {
      const target = new URL(returnUrlParam);
      target.searchParams.set("status", status);
      target.searchParams.set("productId", product.id);
      if (details?.sessionId) target.searchParams.set("sessionId", details.sessionId);
      if (details?.code) target.searchParams.set("code", details.code);
      if (details?.message) target.searchParams.set("message", details.message);
      window.location.href = target.toString();
    } catch {
      window.location.href = returnUrlParam;
    }
  };

  const handleProceedToPayment = () => {
    const errors: { email?: string; name?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email.trim()) errors.email = "Email is required.";
    else if (!emailRegex.test(customer.email.trim())) errors.email = "Valid email is required.";
    if (!customer.name.trim()) errors.name = "Name is required.";

    setCustomerErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPaymentForm((prev) => ({ ...prev, nameOnCard: prev.nameOnCard || customer.name }));
    goToStep("payment");
  };

  const handlePayment = async () => {
    const rawCard = paymentForm.cardNumber.replace(/\s/g, "");
    if (rawCard.length < 15 || checkoutState === "processing") return;

    setCheckoutState("processing");
    setErrorMessage("");

    await new Promise((r) => setTimeout(r, 1200));

    const nextAttempt = attempt + 1;
    setAttempt(nextAttempt);

    const result = processPayment(rawCard, nextAttempt);
    setLastPaymentResult(result);

    if (result.status === "success") {
      setCheckoutState("success");
      goToStep("result");
      if (parentOrigin) {
        sendCheckoutMessage({ type: "DODO_SUCCESS", sessionId: result.sessionId }, parentOrigin);
      }

      setCountdown(4);
      timerRef.current = window.setInterval(() => {
        setCountdown((c) => {
          if (c !== null && c <= 1) {
            clearInterval(timerRef.current!);
            returnToStore("success", { sessionId: result.sessionId });
            return 0;
          }
          return c !== null ? c - 1 : null;
        });
      }, 1000);
      return;
    }

    setCheckoutState(result.status === "declined" ? "declined" : "error");
    setErrorMessage(result.message);
    goToStep("result");

    if (parentOrigin) {
      sendCheckoutMessage({ type: "DODO_ERROR", code: result.code, message: result.message }, parentOrigin);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-3 text-[#0f172a] sm:p-6">
      <div className="relative w-full max-w-[480px]">
        <section className="relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-7">
          <Header
            step={step}
            checkoutState={checkoutState}
            isEmbedded={isEmbedded}
            onClose={() => returnToStore("cancelled")}
          />

          <StepIndicator step={step} />

          {step === "checkout" && (
            <CustomerStep
              product={product}
              customer={customer}
              errors={customerErrors}
              onChange={(f) => setCustomer((c) => ({ ...c, ...f }))}
              onProceed={handleProceedToPayment}
            />
          )}

          {step === "payment" && (
            <PaymentStep
              product={product}
              form={paymentForm}
              error={errorMessage}
              checkoutState={checkoutState}
              onFormChange={(f) => setPaymentForm((p) => ({ ...p, ...f }))}
              onQuickFill={(num) =>
                setPaymentForm((p) => ({ ...p, cardNumber: num, expiry: "12/28", cvv: "888" }))
              }
              onSubmit={handlePayment}
              onBack={() => goToStep("checkout")}
            />
          )}

          {step === "result" && (
            <ResultStep
              product={product}
              customer={customer}
              checkoutState={checkoutState}
              paymentResult={lastPaymentResult}
              errorMessage={errorMessage}
              attempt={attempt}
              countdown={countdown}
              onRetry={() => {
                setCheckoutState("idle");
                goToStep("payment");
              }}
              onReturn={() => {
                if (lastPaymentResult?.status === "success") {
                  returnToStore("success", { sessionId: lastPaymentResult.sessionId });
                } else {
                  const code = lastPaymentResult && "code" in lastPaymentResult ? lastPaymentResult.code : "FAILED";
                  returnToStore("declined", { code, message: errorMessage });
                }
              }}
            />
          )}
        </section>
      </div>
    </main>
  );
}
