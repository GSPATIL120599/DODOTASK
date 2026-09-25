import { CheckCircle2, AlertCircle, Copy, Check, ExternalLink, CreditCard } from "lucide-react";
import { useState } from "react";
import type { CheckoutState, CustomerInfo } from "../types/checkout";
import type { Product } from "../data/products";
import type { PaymentResult } from "../lib/payment";

type ResultStepProps = {
  product: Product;
  customer: CustomerInfo;
  checkoutState: CheckoutState;
  paymentResult: PaymentResult | null;
  errorMessage: string;
  attempt: number;
  countdown: number | null;
  onRetry: () => void;
  onReturn: () => void;
};

export function ResultStep({
  product,
  customer,
  checkoutState,
  paymentResult,
  errorMessage,
  attempt,
  countdown,
  onRetry,
  onReturn,
}: ResultStepProps) {
  const [copied, setCopied] = useState(false);
  const isSuccess = checkoutState === "success";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sessionId =
    paymentResult && paymentResult.status === "success"
      ? paymentResult.sessionId
      : "sess_verified";

  if (isSuccess) {
    return (
      <div className="mt-5 text-center space-y-4">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm animate-in zoom-in-75">
          <CheckCircle2 size={32} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Payment Successful!
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Your purchase of <strong className="text-slate-800">{product.name}</strong> was authorized.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <span className="text-slate-500">Session ID</span>
            <div className="flex items-center gap-1.5">
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-800 border border-slate-200">
                {sessionId}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(sessionId)}
                className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700"
                title="Copy Session ID"
              >
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Amount Paid</span>
            <strong className="text-slate-900 font-semibold">${product.price.toFixed(2)} USD</strong>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Receipt Email</span>
            <span className="text-slate-800 font-medium truncate max-w-[180px]">
              {customer.email || "customer@example.com"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Completed
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.99]"
        >
          <span>Return to Store</span>
          <ExternalLink size={14} />
        </button>

        {countdown !== null && countdown > 0 && (
          <p className="text-[11px] text-slate-400">
            Automatically redirecting to store in {countdown}s...
          </p>
        )}
      </div>
    );
  }

  // Declined / Error View
  const errorCode =
    paymentResult && "code" in paymentResult ? paymentResult.code : "ERROR";

  return (
    <div className="mt-5 text-center space-y-4">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-600 shadow-sm animate-in zoom-in-75">
        <AlertCircle size={32} />
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {checkoutState === "declined" ? "Payment Declined" : "Payment Failed"}
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          {errorMessage || "The card was declined by the simulated card issuer."}
        </p>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 text-left text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-rose-700">Attempt:</span>
          <span className="font-semibold text-rose-900">#{attempt}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-rose-700">Error Code:</span>
          <span className="font-mono text-rose-900 font-medium">{errorCode}</span>
        </div>
        <p className="text-[10px] text-rose-600 pt-1 border-t border-rose-200/80">
          Tip: If testing card 4000...0341, clicking "Try Again" will succeed on attempt #2.
        </p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={onRetry}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.99]"
        >
          <CreditCard size={15} />
          <span>Try Again / Change Card</span>
        </button>

        <button
          type="button"
          onClick={onReturn}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <span>Return to Store (Report Failed)</span>
        </button>
      </div>
    </div>
  );
}
