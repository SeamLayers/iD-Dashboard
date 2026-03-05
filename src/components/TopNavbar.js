"use client";
import { useTranslations } from 'next-intl';
import { Search, Bell } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function TopNavbar() {
  const t = useTranslations('TopNavbar');

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

        <button className="notification-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="admin-profile">
          <div className="admin-info">
            <span className="admin-name">{t('ahmed')}</span>
            <span className="admin-tag text-gradient">{t('superAdmin')}</span>
          </div>
          <div className="admin-avatar">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
