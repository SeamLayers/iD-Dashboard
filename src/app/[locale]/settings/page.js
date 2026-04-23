"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { User, Building2, Bell, Palette, Shield, Users } from 'lucide-react';
import { SettingsTabs, ProfileSettingsSection, OrganizationSettingsSection, AppearanceSettingsSection, NotificationsSettingsSection, SecuritySettingsSection, DelegationSettingsSection } from '@/components/features/settings/SettingsSections';

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
        <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="settings-content glass-panel">
          {activeTab === 'profile' && (
            <ProfileSettingsSection t={t} showToast={showToast} />
          )}

          {activeTab === 'organization' && (
            <OrganizationSettingsSection t={t} showToast={showToast} />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettingsSection t={t} locale={locale} switchLanguage={switchLanguage} theme={theme} setTheme={setTheme} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSettingsSection
              t={t}
              notifyEmail={notifyEmail}
              notifyPush={notifyPush}
              notifyWeekly={notifyWeekly}
              setNotifyEmail={setNotifyEmail}
              setNotifyPush={setNotifyPush}
              setNotifyWeekly={setNotifyWeekly}
              showToast={showToast}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettingsSection t={t} showToast={showToast} />
          )}

          {activeTab === 'delegation' && (
            <DelegationSettingsSection
              t={t}
              delegationForm={delegationForm}
              setDelegationForm={setDelegationForm}
              teamMembers={teamMembers}
              handleCreateDelegation={handleCreateDelegation}
              activeDelegations={activeDelegations}
              handleRevokeDelegation={handleRevokeDelegation}
            />
          )}

        </div>
      </div>
    </div>
  );
}
