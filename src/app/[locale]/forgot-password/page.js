"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { Mail, ArrowRight } from 'lucide-react';
import { authService } from '@/shared/api/services';
import { useRouter, Link } from '@/i18n/routing';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success(t('otpSent'));
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
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

        <h2 className="auth-title">{t('forgotTitle')}</h2>
        <p className="auth-subtitle">{t('forgotSubtitle')}</p>

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
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              <span>{loading ? t('sending') : t('sendOtp')}</span>
              <ArrowRight size={16} />
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
