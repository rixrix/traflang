'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const toastIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const toastStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

export function Toast({ toast, onRemove }: ToastProps) {
  const Icon = toastIcons[toast.type];
  
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm animate-in slide-in-from-right-full duration-300 ${toastStyles[toast.type]}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(toast.id)}
        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}