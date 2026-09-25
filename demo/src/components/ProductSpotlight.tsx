import { ShieldCheck, Zap, Sparkles, ExternalLink, Layers } from "lucide-react";
import type { DemoProduct } from "../data/products";

type ProductSpotlightProps = {
  product: DemoProduct;
  onBuyRedirect: () => void;
  onBuyModal: () => void;
};

export function ProductSpotlight({
  product,
  onBuyRedirect,
  onBuyModal,
}: ProductSpotlightProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] backdrop-blur-2xl">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">

        {/* Left: Product Info */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-[11px] font-semibold text-blue-800">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>Active Product Selection</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3.5 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>MoR Protection</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={15} className="text-amber-600" />
              <span>Instant Digital Access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={15} className="text-purple-600" />
              <span>14-day Guarantee</span>
            </span>
          </div>
        </div>

        {/* Right: Pricing & Dual Buy Options */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Amount Due
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              ${product.price}
            </span>
            <span className="text-xs font-semibold text-slate-500">USD</span>
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
              One-time
            </span>
          </div>

          <div className="my-4 border-t border-slate-200/70" />

          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Primary CTA: Embed Modal (Assignment Core) */}
            <button
              type="button"
              onClick={onBuyModal}
              className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
            >
              <Layers size={14} className="text-slate-300" />
              <span>Buy Now (Modal)</span>
            </button>

            {/* Secondary CTA: Hosted Redirect */}
            <button
              type="button"
              onClick={onBuyRedirect}
              className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-[0.98]"
            >
              <span>Redirect Flow</span>
              <ExternalLink size={13} className="text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
