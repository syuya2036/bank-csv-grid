'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

/* ---------- 型 ---------- */
type ToastPayload = {
  title: string;
  description?: string;
  variant?: 'destructive'; // 今回は成功 or エラー（destructive）だけ
};

type Toast = ToastPayload & { id: number };

interface ToastCtx {
  toast: (p: ToastPayload) => void;
}

/* ---------- Context ---------- */
const ToastContext = createContext<ToastCtx | undefined>(undefined);

/* ---------- Provider ---------- */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((p: ToastPayload) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...p }]);
    /* 3 秒で自動消滅 */
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* --- 描画部 --- */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(({ id, title, description, variant }) => (
          <div
            key={id}
            className={`rounded border px-4 py-2 shadow-md bg-white ${
              variant === 'destructive'
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <div className="font-semibold">{title}</div>
            {description && <div className="text-sm">{description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Hook ---------- */
export function useToast(): ToastCtx {
  const ctx = useContext(ToastContext);
  /* Provider が無い場合は Fallback で alert */
  if (!ctx) {
    return {
      toast: ({ title, description }) =>
        alert(`${title}\n${description ?? ''}`),
    };
  }
  return ctx;
}
