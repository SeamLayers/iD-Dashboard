"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTheme } from 'next-themes';
import { User, Building2, Bell, Palette, Shield, Users } from 'lucide-react';
import { SettingsTabs, ProfileSettingsSection, OrganizationSettingsSection, AppearanceSettingsSection, NotificationsSettingsSection, SecuritySettingsSection, DelegationSettingsSection } from '@/components/features/settings/SettingsSections';
import { useAuth } from '@/shared/auth/AuthProvider';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  const switchLanguage = (lang) => {
    if (lang !== locale) {
      // Persist the choice for the .htaccess root redirect on the static host
      // (middleware locale negotiation is unavailable with `output: 'export'`).
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      router.replace({ pathname }, { locale: lang });
    }
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
            <ProfileSettingsSection t={t} user={user} />
          )}

          {activeTab === 'organization' && (
            <OrganizationSettingsSection t={t} />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettingsSection t={t} locale={locale} switchLanguage={switchLanguage} theme={theme} setTheme={setTheme} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsSettingsSection t={t} />
          )}

          {activeTab === 'security' && (
            <SecuritySettingsSection t={t} />
          )}

          {activeTab === 'delegation' && (
            <DelegationSettingsSection t={t} />
          )}

        </div>
      </div>
    </div>
  );
}
