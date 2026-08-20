'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'primary' | 'warning';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  confirm: (options: ConfirmDialogOptions) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string, duration: number = 3500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, type, message, title, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => showToast(message, 'success', title), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast(message, 'error', title), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast(message, 'info', title), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast(message, 'warning', title), [showToast]);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    setConfirmLoading(true);
    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancelAction = () => {
    if (confirmDialog?.onCancel) {
      confirmDialog.onCancel();
    }
    setConfirmDialog(null);
  };

  const toastIcons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const toastStyles = {
    success: 'bg-white border-emerald-200 text-emerald-900 shadow-floating',
    error: 'bg-white border-rose-200 text-rose-900 shadow-floating',
    warning: 'bg-white border-amber-200 text-amber-900 shadow-floating',
    info: 'bg-white border-indigo-200 text-slate-900 shadow-floating',
  };

  const iconColors = {
    success: 'text-emerald-500 bg-emerald-50',
    error: 'text-rose-500 bg-rose-50',
    warning: 'text-amber-500 bg-amber-50',
    info: 'text-brand-600 bg-brand-50',
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm, success, error, info, warning }}>
      {children}

      {/* 1. CUSTOM TOAST NOTIFICATIONS (Animated slide-down) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          return (
            <div
              key={toast.id}
              className={`w-full pointer-events-auto p-3.5 rounded-2xl border flex items-start gap-3 animate-toast-slide backdrop-blur-lg ${toastStyles[toast.type]}`}
            >
              <div className={`p-1.5 rounded-xl flex-shrink-0 ${iconColors[toast.type]}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                {toast.title && (
                  <h4 className="text-xs font-bold leading-tight truncate">
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-slate-700 leading-snug mt-0.5">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* 2. CUSTOM CONFIRMATION DIALOG MODAL (Animated Pop-in, Replaces window.confirm) */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200/90 shadow-modal animate-modal-pop space-y-5">
            
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                confirmDialog.type === 'danger'
                  ? 'bg-rose-50 text-rose-600'
                  : confirmDialog.type === 'warning'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-brand-50 text-brand-600'
              }`}>
                {confirmDialog.type === 'danger' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <HelpCircle className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCancelAction}
                disabled={confirmLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              >
                {confirmDialog.cancelText || 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={confirmLoading}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5 ${
                  confirmDialog.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                    : 'bg-brand-600 hover:bg-brand-700 active:bg-brand-800'
                }`}
              >
                {confirmLoading ? 'Processing...' : confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>

          </div>
        </div>
      )}

    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
