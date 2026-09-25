import { ArrowRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import type { CustomerInfo } from "../types/checkout";
import type { Product } from "../data/products";

type CustomerStepProps = {
  product: Product;
  customer: CustomerInfo;
  errors: { email?: string; name?: string };
  onChange: (fields: Partial<CustomerInfo>) => void;
  onProceed: () => void;
};

export function CustomerStep({
  product,
  customer,
  errors,
  onChange,
  onProceed,
}: CustomerStepProps) {
  return (
    <div className="mt-5 space-y-5">
      {/* Product Summary */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 uppercase">
              Item Details
            </span>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {product.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">
              {product.currency}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200/60 pt-2.5 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-slate-200 shadow-2xs">
            <Sparkles size={11} className="text-amber-500" /> Instant Access
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-slate-200 shadow-2xs">
            <ShieldCheck size={11} className="text-emerald-500" /> Money-back guarantee
          </span>
        </div>
      </div>

      {/* Customer Form */}
      <div className="space-y-3.5">
        <div>
          <label htmlFor="customer-email" className="block text-xs font-semibold text-slate-700 mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="customer-email"
            type="email"
            placeholder="alex@example.com"
            value={customer.email}
            onChange={(e) => onChange({ email: e.target.value })}
            autoComplete="email"
            className={`h-10 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
              errors.email
                ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="customer-name"
            type="text"
            placeholder="Alex Morgan"
            value={customer.name}
            onChange={(e) => onChange({ name: e.target.value })}
            autoComplete="name"
            className={`h-10 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
              errors.name
                ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600 space-y-1.5">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-slate-800">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Estimated Tax</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between border-t border-slate-200/80 pt-1.5 text-sm font-semibold text-slate-900">
          <span>Total Due</span>
          <span>${product.price.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onProceed}
        className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.99]"
      >
        <span>Proceed to Payment</span>
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
        <Lock size={12} />
        <span>256-bit encrypted checkout powered by Dodo Payments</span>
      </div>
    </div>
  );
}
