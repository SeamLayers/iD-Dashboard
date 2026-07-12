"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { KeyRound, Loader2, Info, LogOut } from 'lucide-react';
import { useAuth } from '@/shared/auth/AuthProvider';
import { authService } from '@/shared/api/services';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

/**
 * Blocking first-login gate. When the account was created with a temporary
 * password (must_reset_password), the user must set their own password before
 * they can use the dashboard — mirroring how a bank card ships with a default
 * PIN you have to change. The temp password expires 48h after creation.
 */
export default function ForcePasswordResetModal() {
  const { mustResetPassword, clearMustReset, logout, isReady } = useAuth();
  const t = useTranslations('ForceReset');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState(false);

  if (!isReady || !mustResetPassword) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (next.length < 8) { toast.error(t('tooShort')); return; }
    if (next !== confirm) { toast.error(t('mismatch')); return; }
    setPending(true);
    try {
      await authService.changePassword({
        current_password: current,
        password: next,
        password_confirmation: confirm,
      });
      clearMustReset();
      toast.success(t('success'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="force-reset-overlay">
      <div className="force-reset-modal glass-panel">
        <div className="force-reset-icon"><KeyRound size={22} /></div>
        <h2 className="text-gradient">{t('title')}</h2>
        <p className="force-reset-sub">{t('subtitle')}</p>
        <div className="force-reset-note"><Info size={14} /><span>{t('expiryNote')}</span></div>

        <form onSubmit={submit}>
          <div className="modal-field">
            <label>{t('currentPassword')}</label>
            <input className="modal-input" type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" placeholder={t('currentPasswordPlaceholder')} />
          </div>
          <div className="modal-field">
            <label>{t('newPassword')}</label>
            <input className="modal-input" type="password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="modal-field">
            <label>{t('confirmPassword')}</label>
            <input className="modal-input" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </div>
          <button type="submit" className="btn-primary force-reset-submit" disabled={pending}>
            {pending ? <Loader2 size={15} className="spinner" /> : <KeyRound size={15} />}
            <span>{t('submit')}</span>
          </button>
        </form>

        <button type="button" className="force-reset-signout" onClick={() => logout()}>
          <LogOut size={13} /> <span>{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
}
