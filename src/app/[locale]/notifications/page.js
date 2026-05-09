"use client";

import { useTranslations } from 'next-intl';
import { Bell, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNotifications, useMarkNotificationRead } from '@/shared/api/hooks';
import { getApiErrorMessage } from '@/shared/api/axios.instance';

function timeAgo(value) {
  if (!value) return '';
  const diff = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsPage() {
  const t = useTranslations('Notifications');
  const tCommon = useTranslations('Common');
  const { data, isLoading, isError, error, refetch } = useNotifications();
  const markMutation = useMarkNotificationRead();

  const items = Array.isArray(data) ? data : [];

  const handleMark = async (id) => {
    try {
      await markMutation.mutateAsync(id);
      toast.success(t('markedRead'));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
      </div>

      {isLoading && <div className="entity-loading glass-panel">{tCommon('loading')}</div>}

      {isError && (
        <div className="entity-error glass-panel">
          {getApiErrorMessage(error)}
          <div style={{ marginTop: 12 }}>
            <button className="btn-outline" onClick={() => refetch()}>{tCommon('retry')}</button>
          </div>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="entity-empty glass-panel">
          <Bell size={36} style={{ opacity: 0.4, marginBottom: 12 }} />
          <p>{t('noNotifications')}</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="emp-table-wrap glass-panel">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Received</th>
                <th style={{ textAlign: 'end' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id}>
                  <td><strong>{n.title}</strong></td>
                  <td>{n.message}</td>
                  <td dir="ltr">{timeAgo(n.created_at)}</td>
                  <td style={{ textAlign: 'end' }}>
                    {n.is_read ? (
                      <span className="pill pill-green">Read</span>
                    ) : (
                      <button className="btn-outline" onClick={() => handleMark(n.id)} disabled={markMutation.isPending}>
                        <Check size={14} />
                        <span>{t('markRead')}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
