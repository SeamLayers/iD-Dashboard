"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { toast } from 'react-hot-toast';
import { Search, LogOut, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuth } from '@/shared/auth/AuthProvider';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TopNavbar() {
  const t = useTranslations('TopNavbar');
  const { user, roles, logout } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [profileOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setProfileOpen(false);
    try {
      await logout();
      toast.success(t('logoutSuccess'));
      router.replace('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const initials = getInitials(user?.name || t('ahmed'));
  const displayName = user?.name || t('ahmed');
  const displayRole = roles?.[0] ? roles[0].replace(/_/g, ' ') : t('superAdmin');

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

        <NotificationsDropdown />

        <div className="notification-wrap" ref={profileRef}>
          <button
            className="admin-profile transition-all duration-300"
            onClick={() => setProfileOpen((v) => !v)}
            type="button"
          >
            <div className="admin-info">
              <span className="admin-name">{displayName}</span>
              <span className="admin-tag text-gradient" style={{ textTransform: 'capitalize' }}>{displayRole}</span>
            </div>
            <div className="admin-avatar">{initials}</div>
            <ChevronDown size={14} style={{ marginInlineStart: 4, color: 'var(--text-muted)' }} />
          </button>

          {profileOpen && (
            <div className="notification-panel glass-panel" style={{ width: 220 }}>
              <div className="notification-panel-header">
                <span className="notification-panel-title">{displayName}</span>
              </div>
              <div className="notification-list">
                <Link
                  href="/settings"
                  className="notification-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <span className="title">Settings</span>
                </Link>
                <button
                  className="notification-item kebab-danger"
                  onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'start', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}
                  disabled={loggingOut}
                >
                  <LogOut size={14} />
                  <span className="title" style={{ color: '#ef4444' }}>
                    {loggingOut ? t('loggingOut') : t('logout')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
