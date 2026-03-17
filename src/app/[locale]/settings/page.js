"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { toast } from 'react-hot-toast';
import { User, Globe, Bell, Palette, Shield, Building2, Check, Moon, Sun, Users } from 'lucide-react';

// Hook up next-themes
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);
  const [delegationForm, setDelegationForm] = useState({
    delegateTo: '2',
    fromDate: '',
    toDate: '',
    temporaryRole: 'temporary_admin',
  });
  const [activeDelegations, setActiveDelegations] = useState([
    {
      id: 1,
      delegateName: 'Sarah Khalid',
      fromDate: '2026-03-16',
      toDate: '2026-03-23',
      temporaryRole: 'temporary_admin',
    },
    {
      id: 2,
      delegateName: 'Omar Farouk',
      fromDate: '2026-03-18',
      toDate: '2026-03-25',
      temporaryRole: 'temporary_manager',
    },
    {
      id: 3,
      delegateName: 'Laila Hassan',
      fromDate: '2026-03-19',
      toDate: '2026-03-24',
      temporaryRole: 'temporary_admin',
    },
    {
      id: 4,
      delegateName: 'Nora Ali',
      fromDate: '2026-03-20',
      toDate: '2026-03-26',
      temporaryRole: 'temporary_manager',
    },
    {
      id: 5,
      delegateName: 'Faisal Al-Rashid',
      fromDate: '2026-03-21',
      toDate: '2026-03-27',
      temporaryRole: 'temporary_admin',
    },
  ]);

  const teamMembers = [
    { id: '2', name: 'Sarah Khalid' },
    { id: '3', name: 'Omar Farouk' },
    { id: '4', name: 'Laila Hassan' },
    { id: '6', name: 'Nora Ali' },
  ];

  const showToast = (msg) => {
    toast.success(msg);
  };

  const switchLanguage = (lang) => {
    if (lang !== locale) {
      router.replace({ pathname }, { locale: lang });
    }
  };

  const handleCreateDelegation = (e) => {
    e.preventDefault();

    if (!delegationForm.fromDate || !delegationForm.toDate || delegationForm.fromDate > delegationForm.toDate) {
      showToast(t('delegationDateError'));
      return;
    }

    const selectedMember = teamMembers.find(member => member.id === delegationForm.delegateTo);
    if (!selectedMember) {
      return;
    }

    setActiveDelegations(prev => [
      {
        id: Date.now(),
        delegateName: selectedMember.name,
        fromDate: delegationForm.fromDate,
        toDate: delegationForm.toDate,
        temporaryRole: delegationForm.temporaryRole,
      },
      ...prev,
    ]);

    setDelegationForm({
      delegateTo: delegationForm.delegateTo,
      fromDate: '',
      toDate: '',
      temporaryRole: 'temporary_admin',
    });
    showToast(t('delegationCreated'));
  };

  const handleRevokeDelegation = (delegationId) => {
    setActiveDelegations(prev => prev.filter(item => item.id !== delegationId));
    showToast(t('delegationRevoked'));
  };

  const tabs = [
    { key: 'profile', label: t('profile'), icon: <User size={18} /> },
    { key: 'organization', label: t('organization'), icon: <Building2 size={18} /> },
    { key: 'appearance', label: t('appearance'), icon: <Palette size={18} /> },
    { key: 'notifications', label: t('notifications'), icon: <Bell size={18} /> },
    { key: 'security', label: t('security'), icon: <Shield size={18} /> },
    { key: 'delegation', label: t('delegation'), icon: <Users size={18} /> },
  ];

  return (
    <div className="settings-page">
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

          {/* ── Delegation ── */}
          {activeTab === 'delegation' && (
            <div className="settings-section">
              <h2 className="settings-sec-title">{t('delegationTitle')}</h2>
              <p className="settings-subtitle" style={{ marginBottom: '1.5rem' }}>{t('delegationSubtitle')}</p>

              <form className="settings-form" onSubmit={handleCreateDelegation}>
                <div className="settings-field">
                  <label>{t('delegationSelectUser')}</label>
                  <select
                    value={delegationForm.delegateTo}
                    onChange={(e) => setDelegationForm(prev => ({ ...prev, delegateTo: e.target.value }))}
                    className="modal-input"
                  >
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>

                <div className="settings-row">
                  <div className="settings-field">
                    <label>{t('delegationFrom')}</label>
                    <input
                      type="date"
                      value={delegationForm.fromDate}
                      onChange={(e) => setDelegationForm(prev => ({ ...prev, fromDate: e.target.value }))}
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="settings-field">
                    <label>{t('delegationTo')}</label>
                    <input
                      type="date"
                      value={delegationForm.toDate}
                      onChange={(e) => setDelegationForm(prev => ({ ...prev, toDate: e.target.value }))}
                      className="modal-input"
                      required
                    />
                  </div>
                </div>

                <div className="settings-field">
                  <label>{t('delegationRole')}</label>
                  <select
                    value={delegationForm.temporaryRole}
                    onChange={(e) => setDelegationForm(prev => ({ ...prev, temporaryRole: e.target.value }))}
                    className="modal-input"
                  >
                    <option value="temporary_admin">{t('delegationRole_temporary_admin')}</option>
                    <option value="temporary_manager">{t('delegationRole_temporary_manager')}</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>
                  <Check size={14} />
                  <span>{t('delegationAssign')}</span>
                </button>
              </form>

              <div className="delegation-table-wrap glass-panel">
                <div className="delegation-table-head">
                  <h3>{t('activeDelegations')}</h3>
                </div>
                {activeDelegations.length === 0 ? (
                  <p className="delegation-empty">{t('delegationEmpty')}</p>
                ) : (
                  <table className="delegation-table">
                    <thead>
                      <tr>
                        <th>{t('delegationUser')}</th>
                        <th>{t('delegationPeriod')}</th>
                        <th>{t('delegationRole')}</th>
                        <th>{t('delegationActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDelegations.map(item => (
                        <tr key={item.id}>
                          <td>{item.delegateName}</td>
                          <td>{item.fromDate} - {item.toDate}</td>
                          <td>
                            <span className="delegation-role-pill">
                              {t(`delegationRole_${item.temporaryRole}`)}
                            </span>
                          </td>
                          <td>
                            <button className="btn-danger delegation-revoke-btn" onClick={() => handleRevokeDelegation(item.id)}>
                              {t('delegationRevoke')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
