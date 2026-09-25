import { CreditCard, Loader2, ArrowLeft, Lock, AlertCircle } from "lucide-react";
import type { PaymentForm, CheckoutState } from "../types/checkout";
import type { Product } from "../data/products";

type PaymentStepProps = {
  product: Product;
  form: PaymentForm;
  error: string;
  checkoutState: CheckoutState;
  onFormChange: (fields: Partial<PaymentForm>) => void;
  onQuickFill: (cardNumber: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function PaymentStep({
  product,
  form,
  error,
  checkoutState,
  onFormChange,
  onQuickFill,
  onSubmit,
  onBack,
}: PaymentStepProps) {
  const isProcessing = checkoutState === "processing";

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    onFormChange({ cardNumber: formatted });
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    const formatted = raw.length >= 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    onFormChange({ expiry: formatted });
  };

  const handleCvvChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    onFormChange({ cvv: raw });
  };

  const cardBrand = form.cardNumber.startsWith("4")
    ? "Visa"
    : form.cardNumber.startsWith("5")
    ? "Mastercard"
    : form.cardNumber.startsWith("3")
    ? "Amex"
    : "Card";

  const isCardValid = form.cardNumber.replace(/\s/g, "").length >= 15;

  return (
    <div className="mt-5 space-y-4">
      {/* Quick Summary Pill */}
      <div className="flex items-center justify-between rounded-xl bg-slate-100/90 px-3.5 py-2 text-xs">
        <span className="font-medium text-slate-700 truncate max-w-[220px]">
          {product.name}
        </span>
        <span className="font-bold text-slate-900">
          ${product.price.toFixed(2)} USD
        </span>
      </div>

      {/* Quick Test Cards Chips */}
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3">
        <p className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
          <span>⚡ Quick Test Cards (Click to Autofill):</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onQuickFill("4242424242424242")}
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800 transition hover:bg-emerald-100 active:scale-95"
          >
            ✓ 4242... (Success)
          </button>
          <button
            type="button"
            onClick={() => onQuickFill("4000000000000002")}
            className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-800 transition hover:bg-rose-100 active:scale-95"
          >
            ✕ 4000...0002 (Declines)
          </button>
          <button
            type="button"
            onClick={() => onQuickFill("4000000000000341")}
            className="rounded-lg border border-blue-300 bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-800 transition hover:bg-blue-100 active:scale-95"
          >
            ⟳ 4000...0341 (Retry)
          </button>
        </div>
      </div>

      {/* Card Form */}
      <form
        className="space-y-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="card-number" className="text-xs font-semibold text-slate-700">
              Card number
            </label>
            <span className="text-[10px] font-medium text-slate-400">{cardBrand}</span>
          </div>
          <div className="relative">
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={form.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              maxLength={19}
              autoComplete="cc-number"
              disabled={isProcessing}
              className="h-10 w-full rounded-xl border border-slate-300 pl-3 pr-10 text-sm font-mono tracking-wide text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
            />
            <CreditCard size={16} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="card-expiry" className="block text-xs font-semibold text-slate-700 mb-1">
              Expires (MM/YY)
            </label>
            <input
              id="card-expiry"
              type="text"
              inputMode="numeric"
              placeholder="12/28"
              value={form.expiry}
              onChange={(e) => handleExpiryChange(e.target.value)}
              maxLength={5}
              autoComplete="cc-exp"
              disabled={isProcessing}
              className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label htmlFor="card-cvv" className="block text-xs font-semibold text-slate-700 mb-1">
              CVC / CVV
            </label>
            <input
              id="card-cvv"
              type="text"
              inputMode="numeric"
              placeholder="123"
              value={form.cvv}
              onChange={(e) => handleCvvChange(e.target.value)}
              maxLength={4}
              autoComplete="cc-csc"
              disabled={isProcessing}
              className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm font-mono text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div>
          <label htmlFor="card-name" className="block text-xs font-semibold text-slate-700 mb-1">
            Cardholder name
          </label>
          <input
            id="card-name"
            type="text"
            placeholder="Alex Morgan"
            value={form.nameOnCard}
            onChange={(e) => onFormChange({ nameOnCard: e.target.value })}
            autoComplete="cc-name"
            disabled={isProcessing}
            className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700"
          >
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !isCardValid}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Authorizing payment...</span>
            </>
          ) : (
            <span>Pay ${product.price.toFixed(2)} USD</span>
          )}
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition py-1"
        >
          <ArrowLeft size={13} />
          <span>Back to Details</span>
        </button>
      </form>

      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
        <Lock size={12} />
        <span>Encrypted with 256-bit AES · Card data never touches host server</span>
      </div>
    </div>
  );
}
