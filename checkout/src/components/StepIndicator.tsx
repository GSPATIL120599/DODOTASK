import type { CheckoutStep } from "../types/checkout";

type StepIndicatorProps = {
  step: CheckoutStep;
};

export function StepIndicator({ step }: StepIndicatorProps) {
  if (step === "result") return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-xs">
      <div
        className={`flex flex-1 items-center gap-2 pb-2 border-b-2 font-medium transition-colors ${
          step === "checkout"
            ? "border-slate-900 text-slate-900"
            : "border-emerald-500 text-emerald-600"
        }`}
      >
        <span
          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
            step === "checkout" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {step === "payment" ? "✓" : "1"}
        </span>
        <span>1. Customer Info</span>
      </div>

      <div
        className={`flex flex-1 items-center gap-2 pb-2 border-b-2 font-medium transition-colors ${
          step === "payment"
            ? "border-slate-900 text-slate-900"
            : "border-slate-200 text-slate-400"
        }`}
      >
        <span
          className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
            step === "payment" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
          }`}
        >
          2
        </span>
        <span>2. Payment</span>
      </div>
    </div>
  );
}
