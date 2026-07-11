"use client";
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { User, Building2, Bell, Palette, Shield, Users } from 'lucide-react';
import { SettingsTabs, ProfileSettingsSection, OrganizationSettingsSection, AppearanceSettingsSection, NotificationsSettingsSection, SecuritySettingsSection, DelegationSettingsSection } from '@/components/features/settings/SettingsSections';
import { useAuth } from '@/shared/auth/AuthProvider';
import { useEmployees } from '@/shared/api/hooks';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  // Real colleagues for the delegation picker (no more hardcoded names).
  const { data: employeesData } = useEmployees({ per_page: 200 });
  const teamMembers = (Array.isArray(employeesData?.data) ? employeesData.data : [])
    .map((e) => ({ id: String(e.user?.id || e.id), name: e.name || e.email || `#${e.id}` }))
    .filter((m) => m.name);

  const [delegationForm, setDelegationForm] = useState({
    delegateTo: '',
    fromDate: '',
    toDate: '',
    temporaryRole: 'temporary_admin',
  });
  // Delegations start empty — real entries are created by the user below.
  const [activeDelegations, setActiveDelegations] = useState([]);

  // Default the delegate picker to the first real colleague once loaded.
  useEffect(() => {
    if (!delegationForm.delegateTo && teamMembers.length > 0) {
      setDelegationForm((prev) => ({ ...prev, delegateTo: teamMembers[0].id }));
    }
  }, [teamMembers, delegationForm.delegateTo]);

  const showToast = (msg) => {
    toast.success(msg);
  };

  const switchLanguage = (lang) => {
    if (lang !== locale) {
      // Persist the choice for the .htaccess root redirect on the static host
      // (middleware locale negotiation is unavailable with `output: 'export'`).
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
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
            <ProfileSettingsSection t={t} showToast={showToast} user={user} />
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
