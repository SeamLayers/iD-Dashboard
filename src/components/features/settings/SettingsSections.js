"use client";

import { Globe, Bell, Palette, Shield, Building2, Check, Moon, Sun, Users } from 'lucide-react';

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

export function ProfileSettingsSection({ t, showToast, user }) {
  // Bound to the real authenticated account (name/email come from the login
  // profile). Phone/job title aren't on the auth payload, so they stay blank
  // placeholders rather than showing invented values.
  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('profileInfo')}</h2>
      <div className="settings-form">
        <div className="settings-row">
          <div className="settings-field"><label>{t('fullName')}</label><input key={`n-${user?.id || 'x'}`} defaultValue={user?.name || ''} className="modal-input" /></div>
          <div className="settings-field"><label>{t('emailLabel')}</label><input key={`e-${user?.id || 'x'}`} defaultValue={user?.email || ''} className="modal-input" /></div>
        </div>
        <div className="settings-row">
          <div className="settings-field"><label>{t('phone')}</label><input defaultValue="" placeholder="05xxxxxxxx" className="modal-input" /></div>
          <div className="settings-field"><label>{t('jobTitle')}</label><input defaultValue="" placeholder={t('jobTitle')} className="modal-input" /></div>
        </div>
        <button className="btn-primary" onClick={() => showToast(t('saved'))}><Check size={14}/><span>{t('saveChanges')}</span></button>
      </div>
    </div>
  );
}

export function OrganizationSettingsSection({ t, showToast }) {
  // Blank placeholders instead of invented company data. Projects & member
  // assignment live on the real /projects and /assignments pages, so the old
  // mock "Project Management" block was removed.
  return (
    <div className="settings-section">
      <h2 className="settings-sec-title">{t('orgInfo')}</h2>
      <div className="settings-form">
        <div className="settings-row">
          <div className="settings-field"><label>{t('companyName')}</label><input defaultValue="" placeholder={t('companyName')} className="modal-input" /></div>
          <div className="settings-field"><label>{t('industry') || 'Business Type'}</label><input defaultValue="" placeholder={t('industry') || 'Business Type'} className="modal-input" /></div>
        </div>
        <div className="settings-row">
          <div className="settings-field"><label>{t('website')}</label><input defaultValue="" placeholder="https://" className="modal-input" /></div>
          <div className="settings-field"><label>{t('address')}</label><input defaultValue="" placeholder={t('address')} className="modal-input" /></div>
        </div>
        <button className="btn-primary" style={{ width: 'fit-content' }} onClick={() => showToast(t('saved'))}><Check size={14} /><span>{t('saveChanges')}</span></button>
      </div>
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

export function NotificationsSettingsSection({ t, notifyEmail, notifyPush, notifyWeekly, setNotifyEmail, setNotifyPush, setNotifyWeekly, showToast }) {
  return (
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
  );
}

export function SecuritySettingsSection({ t, showToast }) {
  return (
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
  );
}

export function DelegationSettingsSection({ t, delegationForm, setDelegationForm, teamMembers, handleCreateDelegation, activeDelegations, handleRevokeDelegation }) {
  return (
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
  );
}