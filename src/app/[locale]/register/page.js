"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import {
  UserPlus,
  Mail,
  Shield,
  User as UserIcon,
  Building2,
  Briefcase,
  ChevronDown,
  Phone,
  Copy,
  Key,
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

// The backend `out_message` is a free-form blob containing the temp password.
// We pull it out so the admin can copy it directly. Fingerprint must stay in
// sync with RegisteredUserController::store().
function extractTempPassword(message) {
  if (!message || typeof message !== 'string') return null;
  const m = message.match(/Temporary Password:\s*(\S+)/i);
  return m ? m[1] : null;
}

export default function RegisterPage() {
  const t = useTranslations('Register');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const { hasRole, isReady } = useAuth();
  const registerMutation = useRegisterUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('owner');
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
    if (!name.trim()) return t('nameRequired');
    if (!email.trim()) return t('emailRequired');
    if (!phone.trim()) return t('phoneRequired');
    if (!allowedTypes.includes(userType)) return t('invalidUserType');
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
        phone: phone.trim(),
        user_type: userType,
      });

      // Response shape: { user, token, out_message } — out_message carries the
      // temporary password for employees so the admin can hand it over.
      const newUser = result?.user || result;
      const tempPassword = extractTempPassword(result?.out_message);

      toast.success(t('createSuccess'));
      setSuccessInfo({
        id: newUser?.id,
        name: newUser?.name,
        email: newUser?.email,
        user_type: newUser?.user_type,
        phone: newUser?.phone,
        tempPassword,
      });

      // Reset for the next entry. Keep userType so admins can batch-create
      // same-typed users without re-selecting every time.
      setName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const copyTempPassword = async () => {
    if (!successInfo?.tempPassword) return;
    try {
      await navigator.clipboard.writeText(successInfo.tempPassword);
      toast.success(t('passwordCopied'));
    } catch {
      toast.error(tCommon('errorOccurred'));
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

          <div className="auth-info" style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            background: 'rgba(102, 252, 241, 0.08)',
            border: '1px solid rgba(102, 252, 241, 0.2)',
            padding: '0.7rem 0.9rem',
            borderRadius: '10px',
            marginBottom: '1rem',
          }}>
            <Key size={14} style={{ display: 'inline', marginInlineEnd: 6 }} />
            {t('passwordInfo')}
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
            <label htmlFor="reg-phone">
              <Phone size={14} className="field-icon" />
              {t('phone')}
            </label>
            <input
              id="reg-phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="auth-input"
              placeholder={t('phonePlaceholder')}
              dir="ltr"
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
              {successInfo.phone && (
                <p className="muted" dir="ltr">{successInfo.phone}</p>
              )}
              <span className="pill pill-success">
                {t(`userTypes.${successInfo.user_type}`)}
              </span>

              {successInfo.tempPassword && (
                <div
                  className="aside-temp-pass"
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.7rem',
                    background: 'rgba(102, 252, 241, 0.08)',
                    border: '1px dashed rgba(102, 252, 241, 0.4)',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                    {t('tempPasswordTitle')}
                  </strong>
                  <code style={{
                    display: 'block',
                    direction: 'ltr',
                    textAlign: 'left',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.4rem 0.55rem',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    letterSpacing: '0.5px',
                    marginBottom: '0.4rem',
                    wordBreak: 'break-all',
                  }}>
                    {successInfo.tempPassword}
                  </code>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={copyTempPassword}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', padding: '0.4rem' }}
                  >
                    <Copy size={12} />
                    <span>{t('copyPassword')}</span>
                  </button>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.4rem', display: 'block' }}>
                    {t('tempPasswordHint')}
                  </small>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
