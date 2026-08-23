import React, { useState } from 'react';
import { Mail, ShieldCheck, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface UserEmailModalProps {
  isOpen: boolean;
  currentEmail?: string;
  onSaveEmail: (email: string) => void;
  onClose?: () => void;
  canCancel?: boolean;
}

export const UserEmailModal: React.FC<UserEmailModalProps> = ({
  isOpen,
  currentEmail = '',
  onSaveEmail,
  onClose,
  canCancel = false,
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim().toLowerCase();

    if (!trimmed) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onSaveEmail(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {/* Decorative Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

        <div className="text-center mb-6 pt-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {currentEmail ? 'Switch User Email' : 'Welcome to TaskFlow'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your email address to access your private tasks and workspaces.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-300">
            <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              Your tasks and workspaces are completely private to your email. Other users will not see your work.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {canCancel && onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Continue to Workspace
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
