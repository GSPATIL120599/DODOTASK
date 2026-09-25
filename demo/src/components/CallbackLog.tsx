import { Terminal, RotateCcw, CheckCircle2, XCircle, Code2 } from "lucide-react";

export type LogEntry = {
  id: number;
  type: "success" | "error" | "close" | "info";
  title: string;
  message: string;
  time: string;
};

type CallbackLogProps = {
  logs: LogEntry[];
  onClear: () => void;
};

export function CallbackLog({ logs, onClear }: CallbackLogProps) {
  return (
    <aside className="relative flex flex-col rounded-[26px] border border-white/80 bg-white/70 shadow-[0_15px_40px_rgba(15,23,42,0.04)] backdrop-blur-2xl overflow-hidden min-h-[440px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-700">
            <Terminal size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Callback & Event Log
            </h3>
            <p className="text-[10px] text-slate-400">
              Live SDK and redirect events
            </p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            <RotateCcw size={10} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Log Feed */}
      <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto max-h-[500px]">
        {logs.length === 0 ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center p-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-400 mb-2">
              <Terminal size={16} />
            </div>
            <p className="text-xs font-semibold text-slate-700">No events logged yet</p>
            <p className="mt-0.5 text-[10px] text-slate-400 max-w-[180px] leading-relaxed">
              Launch checkout via redirect or modal to inspect incoming callbacks.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-xs space-y-1 animate-in fade-in-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {log.type === "success" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 uppercase">
                      <CheckCircle2 size={10} /> {log.title}
                    </span>
                  )}
                  {log.type === "error" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-800 uppercase">
                      <XCircle size={10} /> {log.title}
                    </span>
                  )}
                  {log.type === "close" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700 uppercase">
                      {log.title}
                    </span>
                  )}
                  {log.type === "info" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800 uppercase">
                      {log.title}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-400">{log.time}</span>
              </div>
              <p className="text-[10px] text-slate-600 font-mono leading-relaxed pt-0.5">
                {log.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/80 bg-slate-50/60 px-3.5 py-2 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Code2 size={12} /> Dodo Checkout SDK
        </span>
        <span>Secure cross-origin bridge</span>
      </div>
    </aside>
  );
}
