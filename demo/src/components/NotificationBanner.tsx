import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type ReturnNotification = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  sessionId?: string;
  productId?: string;
} | null;

type NotificationBannerProps = {
  notification: ReturnNotification;
  onDismiss: () => void;
};

export function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  if (!notification) return null;

  const isSuccess = notification.type === "success";
  const isError = notification.type === "error";

  return (
    <div
      className={`relative flex items-start justify-between gap-4 rounded-2xl border p-3 shadow-sm backdrop-blur-xl animate-in slide-in-from-top-3 duration-200 ${isSuccess
        ? "border-emerald-200 bg-emerald-50/90 text-emerald-950"
        : isError
          ? "border-rose-200 bg-rose-50/90 text-rose-950"
          : "border-blue-200 bg-blue-50/90 text-blue-950"
        }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 size={19} className="text-emerald-600" />}
          {isError && <XCircle size={19} className="text-rose-600" />}
          {!isSuccess && !isError && <Info size={19} className="text-blue-600" />}
        </div>
        <div>
          <h4 className="text-sm font-semibold">{notification.title}</h4>
          <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
            {notification.message}
          </p>
          {notification.sessionId && (
            <p className="mt-1.5 text-[11px] font-mono font-medium text-emerald-700 bg-white/70 px-2 py-0.5 rounded-md inline-block border border-emerald-200">
              Session: {notification.sessionId}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-black/5"
        title="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}
