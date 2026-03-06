"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { User, Globe, Bell, Palette, Shield, Building2, Check, Moon, Sun } from 'lucide-react';

// Hook up next-themes
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

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
      {/* ...toast/header/tabs logic identical... */}
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

          {/* ── Organization & Projects ── */}
          {activeTab === 'organization' && (
            <div className="settings-section">
              <h2 className="settings-sec-title">{t('orgInfo')}</h2>
              <div className="settings-form" style={{ marginBottom: '2rem' }}>
                <div className="settings-row">
                  <div className="settings-field"><label>{t('companyName')}</label><input defaultValue="Mhawer Technologies" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('industry') || 'Business Type'}</label><input defaultValue="SaaS / Technology" className="modal-input" /></div>
                </div>
                <div className="settings-row">
                  <div className="settings-field"><label>{t('website')}</label><input defaultValue="https://mhawer.com" className="modal-input" /></div>
                  <div className="settings-field"><label>{t('address')}</label><input defaultValue="Riyadh, Saudi Arabia" className="modal-input" /></div>
                </div>
                <div className="settings-field">
                  <label>Departments</label>
                  <input defaultValue="Sales, Marketing, HR, IT" className="modal-input" placeholder="Comma separated departments" />
                </div>
                <button className="btn-primary" style={{ width: 'fit-content' }} onClick={() => showToast(t('saved'))}><Check size={14} /><span>{t('saveChanges')}</span></button>
              </div>

              {/* Projects Management Section */}
              <div className="settings-group" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '2rem' }}>
                <h3 className="settings-group-label" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Project Management</h3>
                <p className="settings-subtitle" style={{ marginBottom: '1.5rem' }}>Create business projects and assign team members.</p>

                <div className="settings-form">
                  <div className="settings-field">
                    <label>Project Name</label>
                    <input placeholder="e.g. Q3 Marketing Campaign" className="modal-input" />
                  </div>
                  <div className="settings-field">
                    <label>Assign Employees (Select multiple)</label>
                    <select multiple className="modal-input" style={{ height: '100px', backgroundColor: 'var(--bg-panel)' }}>
                      <option>Ahmed Mohamed (Sales)</option>
                      <option>Sara Ali (Marketing)</option>
                      <option>Omar Khalid (IT)</option>
                      <option>Noura Saad (HR)</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{ width: 'fit-content' }} onClick={() => showToast('Project Created & Members Assigned!')}>
                    <span>Create Project</span>
                  </button>
                </div>

                {/* Existing Projects List */}
                <div className="projects-list" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Riyadh Expo Booth</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assigned: Ahmed Mohamed, Sara Ali</p>
                    </div>
                    <span className="status-pill active-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '50px', background: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent-cyan)' }}>Active</span>
                  </div>
                </div>
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
