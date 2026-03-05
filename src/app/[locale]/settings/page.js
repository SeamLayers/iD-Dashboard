"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { User, Globe, Bell, Palette, Shield, Building2, Check, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const switchLanguage = (lang) => {
    if (lang !== locale) {
      router.replace({ pathname }, { locale: lang });
    }
  };

  const tabs = [
    { key: 'profile', label: t('profile'), icon: <User size={18} /> },
    { key: 'organization', label: t('organization'), icon: <Building2 size={18} /> },
    { key: 'appearance', label: t('appearance'), icon: <Palette size={18} /> },
    { key: 'notifications', label: t('notifications'), icon: <Bell size={18} /> },
    { key: 'security', label: t('security'), icon: <Shield size={18} /> },
  ];

  return (
    <div className="settings-page">
      {toast && (
        <div className="toast-notification">
          <Check size={16} /><span>{toast}</span>
        </div>
      )}

      <div className="settings-header">
        <h1 className="settings-title text-gradient">{t('title')}</h1>
        <p className="settings-subtitle">{t('subtitle')}</p>
      </div>

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-tabs glass-panel">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content glass-panel">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2 className="settings-sec-title">{t('profileInfo')}</h2>
              <div className="settings-form">
                <div className="settings-row">
                  <div className="settings-field"><label>{t('fullName')}</label><input defaultValue="Ahmed Mohamed" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('emailLabel')}</label><input defaultValue="ahmed@mhawer.com" className="modal-input" /></div>
                </div>
                <div className="settings-row">
                  <div className="settings-field"><label>{t('phone')}</label><input defaultValue="+966 50 123 4567" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('jobTitle')}</label><input defaultValue="Chief Technology Officer" className="modal-input" /></div>
                </div>
                <button className="btn-primary" onClick={() => showToast(t('saved'))}><Check size={14}/><span>{t('saveChanges')}</span></button>
              </div>
            </div>
          )}

          {/* ── Organization ── */}
          {activeTab === 'organization' && (
            <div className="settings-section">
              <h2 className="settings-sec-title">{t('orgInfo')}</h2>
              <div className="settings-form">
                <div className="settings-row">
                  <div className="settings-field"><label>{t('companyName')}</label><input defaultValue="Mhawer Technologies" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('industry')}</label><input defaultValue="SaaS / Technology" className="modal-input" /></div>
                </div>
                <div className="settings-row">
                  <div className="settings-field"><label>{t('website')}</label><input defaultValue="https://mhawer.com" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('address')}</label><input defaultValue="Riyadh, Saudi Arabia" className="modal-input" /></div>
                </div>
                <button className="btn-primary" onClick={() => showToast(t('saved'))}><Check size={14}/><span>{t('saveChanges')}</span></button>
              </div>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'appearance' && (
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
                  <div className="settings-theme-card active">
                    <Moon size={20} />
                    <span>{t('darkMode')}</span>
                    <Check size={14} className="theme-check" />
                  </div>
                  <div className="settings-theme-card" onClick={() => showToast(t('comingSoon'))}>
                    <Sun size={20} />
                    <span>{t('lightMode')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="settings-sec-title">{t('notifications')}</h2>
              <div className="settings-toggles">
                {[
                  { key: 'notifyEmail', label: t('notifyEmail'), desc: t('notifyEmailDesc'), value: notifyEmail, set: setNotifyEmail },
                  { key: 'notifyPush', label: t('notifyPush'), desc: t('notifyPushDesc'), value: notifyPush, set: setNotifyPush },
                  { key: 'notifyWeekly', label: t('notifyWeekly'), desc: t('notifyWeeklyDesc'), value: notifyWeekly, set: setNotifyWeekly },
                ].map(item => (
                  <div className="settings-toggle-row" key={item.key}>
                    <div>
                      <p className="settings-toggle-label">{item.label}</p>
                      <p className="settings-toggle-desc">{item.desc}</p>
                    </div>
                    <button className={`cb-switch ${item.value ? 'on' : ''}`} onClick={() => item.set(!item.value)} role="switch" aria-checked={item.value}>
                      <span className="cb-switch-thumb" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => showToast(t('saved'))}><Check size={14}/><span>{t('saveChanges')}</span></button>
            </div>
          )}

          {/* ── Security ── */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2 className="settings-sec-title">{t('security')}</h2>
              <div className="settings-form">
                <div className="settings-field"><label>{t('currentPassword')}</label><input type="password" placeholder="••••••••" className="modal-input" /></div>
                <div className="settings-row">
                  <div className="settings-field"><label>{t('newPassword')}</label><input type="password" placeholder="••••••••" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('confirmPassword')}</label><input type="password" placeholder="••••••••" className="modal-input" /></div>
                </div>
                <button className="btn-primary" onClick={() => showToast(t('saved'))}><Check size={14}/><span>{t('updatePassword')}</span></button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
