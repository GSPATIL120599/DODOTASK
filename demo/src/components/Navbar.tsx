import { useState, useRef, useEffect } from "react";
import { CreditCard, LockKeyhole, Copy, Check, X, Sparkles } from "lucide-react";

export function Navbar() {
  const [showTestCards, setShowTestCards] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const testCards = [
    { number: "4242 4242 4242 4242", tag: "Success", desc: "Always succeeds", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { number: "4000 0000 0000 0002", tag: "Declines", desc: "Always declined by issuer", color: "text-rose-700 bg-rose-50 border-rose-200" },
    { number: "4000 0000 0000 0341", tag: "Retry Test", desc: "Fails attempt #1, succeeds attempt #2", color: "text-blue-700 bg-blue-50 border-blue-200" },
  ];

  const handleCopy = (card: string, idx: number) => {
    navigator.clipboard.writeText(card.replace(/\s/g, ""));
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowTestCards(false);
      }
    }
    if (showTestCards) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTestCards]);

  return (
    <header className="relative z-30 px-4 pt-4 sm:px-8 sm:pt-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">
              Acme Digital Store
            </p>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Demo Merchant · Powered by Dodo
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2.5">
          {/* Test Cards Reference Toggle in Header */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setShowTestCards(!showTestCards)}
              className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 shadow-2xs active:scale-95"
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>Test Cards</span>
            </button>

            {/* Test Cards Dropdown Popover */}
            {showTestCards && (
              <div className="absolute right-0 top-11 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CreditCard size={14} />
                    <span>Test Cards Reference</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowTestCards(false)}
                    className="rounded p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  {testCards.map((card, idx) => (
                    <div
                      key={card.number}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${card.color}`}>
                          {card.tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(card.number, idx)}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800"
                        >
                          {copiedIndex === idx ? (
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <Check size={11} /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5">
                              <Copy size={11} /> Copy
                            </span>
                          )}
                        </button>
                      </div>

                      <p className="font-mono text-xs font-semibold text-slate-800">
                        {card.number}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
            <LockKeyhole size={13} className="text-slate-500" />
            <span>MoR Protected</span>
          </div>
        </div>

      </nav>
    </header>
  );
}
