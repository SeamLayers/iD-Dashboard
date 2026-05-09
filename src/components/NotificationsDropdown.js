"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell } from 'lucide-react';
import { Link } from '@/i18n/routing';
import {
  useNotifications,
  useMarkNotificationRead,
} from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';

function timeAgo(value) {
  if (!value) return '';
  const diff = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function NotificationsDropdown() {
  const t = useTranslations('TopNavbar');
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const { data, isLoading } = useNotifications();
  const markMutation = useMarkNotificationRead();

  const items = Array.isArray(data) ? data : [];
  const unreadCount = items.filter((n) => !n.is_read).length;

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!isAuthenticated) return null;

  const handleMarkRead = (item) => {
    if (item.is_read) return;
    markMutation.mutate(item.id);
  };

  return (
    <div className="notification-wrap" ref={wrapRef}>
      <button
        className="notification-btn transition-all duration-300"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('notifications')}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-dot" />}
      </button>

      {open && (
        <div className="notification-panel glass-panel">
          <div className="notification-panel-header">
            <span className="notification-panel-title">{t('notifications')}</span>
            <Link
              href="/notifications"
              className="auth-link"
              style={{ fontSize: '0.8rem' }}
              onClick={() => setOpen(false)}
            >
              {t('viewAll')}
            </Link>
          </div>

          <div className="notification-list">
            {isLoading && (
              <div className="notification-empty">…</div>
            )}
            {!isLoading && items.length === 0 && (
              <div className="notification-empty">{t('noNotifications')}</div>
            )}
            {items.slice(0, 8).map((item) => (
              <button
                key={item.id}
                className={`notification-item ${item.is_read ? '' : 'unread'}`}
                onClick={() => handleMarkRead(item)}
                style={{ width: '100%', textAlign: 'start', background: 'transparent', border: 'none' }}
              >
                <span className="title">{item.title}</span>
                <span className="message">{item.message}</span>
                <span className="time">{timeAgo(item.created_at)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
