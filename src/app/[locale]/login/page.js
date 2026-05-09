"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useRouter, Link } from '@/i18n/routing';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const data = await login({ email, password });
      toast.success(t('loginSuccess', { name: data.name || '' }));
      router.replace('/');
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

        <h2 className="auth-title">{t('welcome')}</h2>
        <p className="auth-subtitle">{t('signInSubtitle')}</p>

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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              <Lock size={14} style={{ display: 'inline', marginInlineEnd: 6, verticalAlign: 'middle' }} />
              {t('password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                style={{ paddingInlineEnd: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  insetInlineEnd: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              <LogIn size={16} />
              <span>{loading ? t('signingIn') : t('signIn')}</span>
            </button>
          </div>

          <div className="auth-link-row">
            <Link href="/forgot-password" className="auth-link">
              {t('forgotPassword')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
