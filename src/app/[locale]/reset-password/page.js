"use client";

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { Mail, Lock, KeyRound, Check } from 'lucide-react';
import { authService } from '@/shared/api/services';
import { useRouter, Link } from '@/i18n/routing';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

function ResetPasswordForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password !== passwordConfirmation) {
      setErrorMsg(t('passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success(t('resetSuccess'));
      router.replace('/login');
    } catch (error) {
      const msg = getApiErrorMessage(error);
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-logo">
          <h1 className="logo text-gradient text-glow">iD+</h1>
          <p>{t('byMhawer')}</p>
        </div>

        <h2 className="auth-title">{t('resetTitle')}</h2>
        <p className="auth-subtitle">{t('resetSubtitle')}</p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">
              <Mail size={14} style={{ display: 'inline', marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="otp">
              <KeyRound size={14} style={{ display: 'inline', marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {t('otp')}
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="auth-input"
              placeholder="123456"
              style={{ letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.05rem' }}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              <Lock size={14} style={{ display: 'inline', marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {t('newPassword')}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password_confirmation">
              <Lock size={14} style={{ display: 'inline', marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {t('confirmPassword')}
            </label>
            <input
              id="password_confirmation"
              type="password"
              required
              minLength={8}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="auth-input"
              placeholder="••••••••"
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              <Check size={16} />
              <span>{loading ? t('resetting') : t('resetPassword')}</span>
            </button>
          </div>

          <div className="auth-link-row">
            <Link href="/login" className="auth-link">{t('backToLogin')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card glass-panel">Loading…</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
