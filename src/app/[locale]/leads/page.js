"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { Download, LayoutList, Kanban, LockKeyhole } from 'lucide-react';

const STAGES = ['new', 'contacted', 'negotiation', 'won'];
const stageColors = {
  new: '#66FCF1',
  contacted: '#FFA726',
  negotiation: '#AB47BC',
  won: '#66BB6A',
};

// This is a locked "coming soon" teaser — the CRM feature isn't wired to the
// backend yet. The preview behind the blur uses neutral skeleton placeholders
// (never fabricated lead names/companies) so nothing on the dashboard looks
// like real data when it isn't.
const SKELETON_PER_STAGE = { new: 2, contacted: 3, negotiation: 2, won: 3 };

export default function LeadsPage() {
  const t = useTranslations('CRM');
  const tDemo = useTranslations('Demo');
  const [view, setView] = useState('kanban');
  const [notifyRequested, setNotifyRequested] = useState(false);

  return (
    <div className="crm-page">
      {/* ── Header ── */}
      <div className="crm-header">
        <div>
          <h1 className="crm-title text-gradient">{t('title')}</h1>
          <p className="crm-subtitle">{t('subtitle')}</p>
        </div>
        <div className="crm-header-actions">
          <button className="btn-outline transition-all duration-300" disabled>
            <Download size={16} />
            <span>{t('export')}</span>
          </button>
        </div>
      </div>

      {/* ── View Toggle ── */}
      <div className="crm-toggle-bar">
        <div className="crm-view-toggle">
          <button
            className={`crm-toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <LayoutList size={16} />
            <span>{t('listView')}</span>
          </button>
          <button
            className={`crm-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => setView('kanban')}
          >
            <Kanban size={16} />
            <span>{t('kanbanView')}</span>
          </button>
        </div>
        <span className="crm-lead-count">{t('comingSoonBadge')}</span>
      </div>

      <div className="crm-premium-shell">
        <div className="crm-premium-content" aria-hidden="true">
          {/* ── Kanban skeleton preview ── */}
          {view === 'kanban' && (
            <div className="crm-kanban">
              {STAGES.map(stage => (
                <div className="crm-column" key={stage}>
                  <div className="crm-col-header">
                    <div className="crm-col-dot" style={{ background: stageColors[stage], boxShadow: `0 0 8px ${stageColors[stage]}` }} />
                    <h3 className="crm-col-title">{t(`stage_${stage}`)}</h3>
                  </div>
                  <div className="crm-col-cards">
                    {Array.from({ length: SKELETON_PER_STAGE[stage] }).map((_, i) => (
                      <div className="crm-card glass-panel crm-skel-card" key={i} style={{ '--card-accent': stageColors[stage] }}>
                        <div className="crm-card-top">
                          <div className="crm-skel crm-skel-avatar" />
                          <div className="crm-skel-lines">
                            <div className="crm-skel crm-skel-line w-70" />
                            <div className="crm-skel crm-skel-line w-45" />
                          </div>
                        </div>
                        <div className="crm-skel crm-skel-line w-90" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── List skeleton preview ── */}
          {view === 'list' && (
            <div className="crm-list-wrap glass-panel">
              <table className="crm-list-table">
                <thead>
                  <tr>
                    <th>{t('colLead')}</th>
                    <th>{t('colCompany')}</th>
                    <th>{t('colSource')}</th>
                    <th>{t('colStage')}</th>
                    <th>{t('colDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="crm-list-user">
                          <div className="crm-skel crm-skel-avatar" />
                          <div className="crm-skel crm-skel-line w-70" />
                        </div>
                      </td>
                      <td><div className="crm-skel crm-skel-line w-80" /></td>
                      <td><div className="crm-skel crm-skel-line w-50" /></td>
                      <td><div className="crm-skel crm-skel-line w-45" /></td>
                      <td><div className="crm-skel crm-skel-line w-60" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="crm-premium-overlay backdrop-blur-md">
          <div className="crm-locked-modal glass-panel" role="dialog" aria-modal="true" aria-labelledby="crm-lock-title">
            <div className="crm-lock-icon-wrap">
              <LockKeyhole size={28} />
            </div>
            <h3 id="crm-lock-title" className="crm-lock-title">{t('paywallTitle')}</h3>
            <p className="crm-lock-desc">{t('paywallDescription')}</p>
            <button
              className="btn-primary"
              onClick={() => {
                setNotifyRequested(true);
                toast.success(tDemo('waitlistJoined'));
              }}
              disabled={notifyRequested}
            >
              <span>{notifyRequested ? t('notifyRequested') : t('notifyMe')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
