"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Globe, Check, Moon, Sun, Loader2, BellRing, BellOff, Bell } from 'lucide-react';
import { authService } from '@/shared/api/services';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import ComingSoonPanel from '@/shared/components/ComingSoonPanel';
import { useUpdateDeviceToken } from '@/shared/api/hooks';
import {
  getFcmToken,
  getNotificationPermission,
  pushIsSupported,
} from '@/shared/firebase/firebaseClient';

export function SettingsTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="settings-tabs glass-panel">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Profile EDITING has no backend endpoint yet — show the current account
// read-only and mark editing as coming soon rather than faking a save.
export function ProfileSettingsSection({ t, user }) {
  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('profileInfo')}</h2>
      <div className="settings-readonly-grid">
        <div className="settings-field">
          <label>{t('fullName')}</label>
          <input value={user?.name || '—'} className="modal-input" disabled readOnly />
        </div>
        <div className="settings-field">
          <label>{t('emailLabel')}</label>
          <input value={user?.email || '—'} className="modal-input" disabled readOnly />
        </div>
      </div>
      <ComingSoonPanel
        title={t('profileEditTitle')}
        description={t('profileEditDesc')}
        badge={t('comingSoonTag')}
      />
    </div>
  );
}

// No organization-settings endpoint exists — honest coming-soon instead of a
// fake "saved" toast.
export function OrganizationSettingsSection({ t }) {
  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('orgInfo')}</h2>
      <ComingSoonPanel
        title={t('orgInfo')}
        description={t('orgComingSoonDesc')}
        badge={t('comingSoonTag')}
      />
    </div>
  );
}

export function AppearanceSettingsSection({ t, locale, switchLanguage, theme, setTheme }) {
  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('appearance')}</h2>

      <div className="settings-group">
        <h3 className="settings-group-label">{t('language')}</h3>
        <div className="settings-lang-toggle">
          <button className={`settings-lang-btn ${locale === 'en' ? 'active' : ''}`} onClick={() => switchLanguage('en')}>
            <Globe size={16} /><span>English</span>
          </button>
          <button className={`settings-lang-btn ${locale === 'ar' ? 'active' : ''}`} onClick={() => switchLanguage('ar')}>
            <Globe size={16} /><span>العربية</span>
          </button>
        </div>
      </div>

      <div className="settings-group">
        <h3 className="settings-group-label">{t('theme')}</h3>
        <div className="settings-theme-cards">
          <div className={`settings-theme-card ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
            <Moon size={20} />
            <span>{t('darkMode')}</span>
            {theme === 'dark' && <Check size={14} className="theme-check" />}
          </div>
          <div className={`settings-theme-card ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
            <Sun size={20} />
            <span>{t('lightMode')}</span>
            {theme === 'light' && <Check size={14} className="theme-check" />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Real browser push (FCM). Requests notification permission on demand, fetches
// the FCM web token and persists it via POST /auth/device-token so the backend
// (FirebaseService) can deliver notifications to this browser.
export function NotificationsSettingsSection({ t }) {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState('default');
  const [busy, setBusy] = useState(false);
  const { mutateAsync: saveToken } = useUpdateDeviceToken();

  useEffect(() => {
    let active = true;
    setPermission(getNotificationPermission());
    pushIsSupported().then((ok) => {
      if (active) setSupported(ok);
    });
    return () => {
      active = false;
    };
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      const token = await getFcmToken({ requestPermission: true });
      const perm = getNotificationPermission();
      setPermission(perm);
      if (token) {
        await saveToken(token);
        toast.success(t('pushEnabled'));
      } else if (perm === 'denied') {
        toast.error(t('pushBlocked'));
      } else {
        toast.error(t('pushUnsupported'));
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err) || t('pushUnsupported'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('notifications')}</h2>

      {!supported ? (
        <div className="settings-push-state">
          <BellOff size={22} />
          <div>
            <p className="settings-toggle-label">{t('pushUnsupportedTitle')}</p>
            <p className="settings-toggle-desc">{t('pushUnsupported')}</p>
          </div>
        </div>
      ) : permission === 'granted' ? (
        <div className="settings-push-state on">
          <BellRing size={22} />
          <div>
            <p className="settings-toggle-label">{t('pushOnTitle')}</p>
            <p className="settings-toggle-desc">{t('pushOnDesc')}</p>
          </div>
          <Check size={18} className="settings-push-check" />
        </div>
      ) : permission === 'denied' ? (
        <div className="settings-push-state">
          <BellOff size={22} />
          <div>
            <p className="settings-toggle-label">{t('pushBlockedTitle')}</p>
            <p className="settings-toggle-desc">{t('pushBlocked')}</p>
          </div>
        </div>
      ) : (
        <div className="settings-push-cta">
          <div className="settings-push-copy">
            <Bell size={22} />
            <div>
              <p className="settings-toggle-label">{t('pushEnableTitle')}</p>
              <p className="settings-toggle-desc">{t('pushEnableDesc')}</p>
            </div>
          </div>
          <button className="btn-primary" onClick={enable} disabled={busy}>
            {busy ? <Loader2 size={14} className="spinner" /> : <BellRing size={14} />}
            <span>{t('pushEnableAction')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function SecuritySettingsSection({ t }) {
  // Real self-service password change via the authenticated
  // POST /auth/change-password endpoint (same one the forced first-login reset
  // uses). Backend rules: current_password required, new min:8, must differ.
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!current) { toast.error(t('currentPasswordRequired')); return; }
    if (next.length < 8) { toast.error(t('passwordTooShort')); return; }
    if (next !== confirm) { toast.error(t('passwordMismatch')); return; }
    if (next === current) { toast.error(t('passwordSameAsCurrent')); return; }
    setPending(true);
    try {
      await authService.changePassword({
        current_password: current,
        password: next,
        password_confirmation: confirm,
      });
      toast.success(t('passwordChanged'));
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('security')}</h2>
      <form className="settings-form" onSubmit={submit}>
        <div className="settings-field">
          <label>{t('currentPassword')}</label>
          <input type="password" placeholder="••••••••" className="modal-input" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </div>
        <div className="settings-row">
          <div className="settings-field">
            <label>{t('newPassword')}</label>
            <input type="password" placeholder="••••••••" className="modal-input" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
          </div>
          <div className="settings-field">
            <label>{t('confirmPassword')}</label>
            <input type="password" placeholder="••••••••" className="modal-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
          <span>{t('updatePassword')}</span>
        </button>
      </form>
    </div>
  );
}

// Delegation has no backend route — the previous version only mutated local
// state and lost everything on reload. Shown as coming-soon instead.
export function DelegationSettingsSection({ t }) {
  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('delegationTitle')}</h2>
      <ComingSoonPanel
        title={t('delegationTitle')}
        description={t('delegationComingSoonDesc')}
        badge={t('comingSoonTag')}
      />
    </div>
  );
}
