"use client";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { toast } from 'react-hot-toast';
import { Search, Bell, RotateCcw } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useDemoStore } from './DemoStoreProvider';

export default function TopNavbar() {
  const t = useTranslations('TopNavbar');
  const tDemo = useTranslations('Demo');
  const { resetDemoData } = useDemoStore();

  return (
    <header className="top-navbar glass-panel">
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder={t('searchPlaceholder')} 
          className="search-input"
        />
      </div>
      
      <div className="navbar-actions">
        <LanguageSwitcher />

        <button
          className="btn-outline transition-all duration-300"
          onClick={() => {
            resetDemoData();
            toast.success(tDemo('demoResetSuccess'));
          }}
          style={{ padding: '0.5rem 0.9rem' }}
          title={tDemo('demoReset')}
        >
          <RotateCcw size={16} />
          <span>{tDemo('demoReset')}</span>
        </button>

        <button className="notification-btn transition-all duration-300" onClick={() => toast.success(tDemo('boardSynced'))}>
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        
        <Link href="/settings" className="admin-profile transition-all duration-300">
          <div className="admin-info">
            <span className="admin-name">{t('ahmed')}</span>
            <span className="admin-tag text-gradient">{t('superAdmin')}</span>
          </div>
          <div className="admin-avatar">
            AM
          </div>
        </Link>
      </div>
    </header>
  );
}
