import { CreditCard, X, ArrowLeft } from "lucide-react";
import type { CheckoutStep, CheckoutState } from "../types/checkout";

type HeaderProps = {
  step: CheckoutStep;
  checkoutState: CheckoutState;
  isEmbedded: boolean;
  onClose: () => void;
};

export function Header({ step, checkoutState, isEmbedded, onClose }: HeaderProps) {
  const title =
    step === "checkout"
      ? "Order Checkout"
      : step === "payment"
      ? "Secure Payment"
      : checkoutState === "success"
      ? "Order Confirmed"
      : "Payment Issue";

  return (
    <header className="flex items-center justify-between border-b border-slate-100 pb-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
          <CreditCard size={16} />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
            Dodo Payments
          </p>
          <h1 className="text-sm font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
        </div>
      </div>

      {isEmbedded ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close checkout"
          className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
        >
          <X size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={13} />
          <span>Store</span>
        </button>
      )}
    </header>
  );
}
