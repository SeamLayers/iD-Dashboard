"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import {
  UserPlus,
  Mail,
  Lock,
  Shield,
  User as UserIcon,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useRegisterUser } from '@/shared/api/hooks';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

const USER_TYPE_ICONS = {
  superadmin: Shield,
  owner: Building2,
  employee: Briefcase,
};

export default function RegisterPage() {
  const t = useTranslations('Register');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { hasRole, isReady } = useAuth();
  const registerMutation = useRegisterUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  const isSuperadmin = hasRole('superadmin');
  const isOwner = hasRole('owner');
  const canAccess = isSuperadmin || isOwner;

  // Owners can only create employees within their own company. Superadmins
  // can create any user_type. The `user_type` dropdown is filtered accordingly.
  const allowedTypes = isSuperadmin
    ? ['superadmin', 'owner', 'employee']
    : ['employee'];

  if (isReady && !canAccess) {
    return (
      <div className="page-wrap">
        <div className="entity-empty glass-panel">
          <Shield size={48} />
          <h3>{tCommon('errorOccurred')}</h3>
          <p>{t('forbidden')}</p>
        </div>
      </div>
    );
  }

  const validate = () => {
    if (password.length < 8) {
      return t('passwordTooShort');
    }
    if (password !== confirmPassword) {
      return t('passwordMismatch');
    }
    if (!allowedTypes.includes(userType)) {
      return t('invalidUserType');
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessInfo(null);

    const error = validate();
    if (error) {
      setErrorMsg(error);
      toast.error(error);
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        password_confirmation: confirmPassword,
        user_type: userType,
      });

      const newUser = result?.user || result;
      toast.success(t('createSuccess'));
      setSuccessInfo({
        id: newUser?.id,
        name: newUser?.name,
        email: newUser?.email,
        user_type: newUser?.user_type,
      });

      // Reset form for the next entry, but keep userType so admins can
      // batch-create same-typed users without re-selecting every time.
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
      </div>

      <div className="register-grid">
        <form className="register-card glass-panel" onSubmit={handleSubmit}>
          <div className="auth-logo" style={{ marginBottom: '1.25rem' }}>
            <h2 className="auth-title" style={{ marginBottom: '0.25rem' }}>
              {t('formTitle')}
            </h2>
            <p className="auth-subtitle">{t('formSubtitle')}</p>
          </div>

          {errorMsg && <div className="auth-error">{errorMsg}</div>}

          <div className="auth-field">
            <label htmlFor="reg-name">
              <UserIcon size={14} className="field-icon" />
              {t('name')}
            </label>
            <input
              id="reg-name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              placeholder={t('namePlaceholder')}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">
              <Mail size={14} className="field-icon" />
              {t('email')}
            </label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-user-type">
              <Shield size={14} className="field-icon" />
              {t('userType')}
            </label>
            <div className="select-wrap">
              <select
                id="reg-user-type"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="auth-input"
                disabled={allowedTypes.length === 1}
              >
                {allowedTypes.map((type) => (
                  <option key={type} value={type}>
                    {t(`userTypes.${type}`)}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-caret" />
            </div>
            <small className="field-hint">{t(`userTypeHints.${userType}`)}</small>
          </div>

          <div className="auth-field-row">
            <div className="auth-field">
              <label htmlFor="reg-password">
                <Lock size={14} className="field-icon" />
                {t('password')}
              </label>
              <div className="password-wrap">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-confirm">
                <Lock size={14} className="field-icon" />
                {t('confirmPassword')}
              </label>
              <div className="password-wrap">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="password-toggle"
                  aria-label={showConfirm ? 'Hide' : 'Show'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="auth-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              {tCommon('cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              <UserPlus size={16} />
              <span>{isLoading ? t('creating') : t('createUser')}</span>
            </button>
          </div>
        </form>

        <aside className="register-aside glass-panel">
          <h3 className="aside-title">
            <Shield size={18} /> {t('aside.title')}
          </h3>
          <ul className="aside-list">
            {allowedTypes.map((type) => {
              const Icon = USER_TYPE_ICONS[type] || UserIcon;
              return (
                <li key={type}>
                  <Icon size={16} />
                  <div>
                    <strong>{t(`userTypes.${type}`)}</strong>
                    <p>{t(`userTypeDescriptions.${type}`)}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {successInfo && (
            <div className="aside-success">
              <h4>{t('aside.lastCreated')}</h4>
              <p>
                <strong>{successInfo.name}</strong>
              </p>
              <p className="muted">{successInfo.email}</p>
              <span className="pill pill-success">
                {t(`userTypes.${successInfo.user_type}`)}
              </span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
