"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, LayoutList, Kanban, Building2, User, Calendar, CreditCard } from 'lucide-react';

const LEADS_DATA = [
  { id: 1, name: 'Faisal Al-Rashid', company: 'Gulf Ventures', source: 'Ahmed', date: '2026-03-05', stage: 'new' },
  { id: 2, name: 'Huda Mansour', company: 'Noor Holdings', source: 'Sarah', date: '2026-03-04', stage: 'new' },
  { id: 3, name: 'Khalid Bashar', company: 'Apex Digital', source: 'Ahmed', date: '2026-03-03', stage: 'contacted' },
  { id: 4, name: 'Reem Taha', company: 'Zenith Corp', source: 'Laila', date: '2026-03-02', stage: 'contacted' },
  { id: 5, name: 'Majed Qasim', company: 'Lunar Tech', source: 'Omar', date: '2026-03-01', stage: 'contacted' },
  { id: 6, name: 'Dina Saad', company: 'Pinnacle Group', source: 'Sarah', date: '2026-02-28', stage: 'negotiation' },
  { id: 7, name: 'Yasser Hamdi', company: 'Atlas Partners', source: 'Ahmed', date: '2026-02-27', stage: 'negotiation' },
  { id: 8, name: 'Nadia Fares', company: 'Crystal Dynamics', source: 'Laila', date: '2026-02-25', stage: 'won' },
  { id: 9, name: 'Amr Shaker', company: 'Nova Industries', source: 'Omar', date: '2026-02-23', stage: 'won' },
  { id: 10, name: 'Lina Youssef', company: 'Vertex Solutions', source: 'Ahmed', date: '2026-02-20', stage: 'won' },
];

const STAGES = ['new', 'contacted', 'negotiation', 'won'];

export default function LeadsPage() {
  const t = useTranslations('CRM');
  const [view, setView] = useState('kanban');

  const getLeadsByStage = (stage) => LEADS_DATA.filter(l => l.stage === stage);

  const stageColors = {
    new: '#66FCF1',
    contacted: '#FFA726',
    negotiation: '#AB47BC',
    won: '#66BB6A',
  };

  return (
    <div className="crm-page">
      {/* ── Header ── */}
      <div className="crm-header">
        <div>
          <h1 className="crm-title text-gradient">{t('title')}</h1>
          <p className="crm-subtitle">{t('subtitle')}</p>
        </div>
        <div className="crm-header-actions">
          <button className="btn-outline">
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
        <span className="crm-lead-count">{t('totalLeads', { count: LEADS_DATA.length })}</span>
      </div>

      {/* ── Kanban Board ── */}
      {view === 'kanban' && (
        <div className="crm-kanban">
          {STAGES.map(stage => (
            <div className="crm-column" key={stage}>
              <div className="crm-col-header">
                <div className="crm-col-dot" style={{ background: stageColors[stage], boxShadow: `0 0 8px ${stageColors[stage]}` }} />
                <h3 className="crm-col-title">{t(`stage_${stage}`)}</h3>
                <span className="crm-col-count">{getLeadsByStage(stage).length}</span>
              </div>
              <div className="crm-col-cards">
                {getLeadsByStage(stage).map(lead => (
                  <div className="crm-card glass-panel" key={lead.id} style={{ '--card-accent': stageColors[stage] }}>
                    <div className="crm-card-top">
                      <div className="crm-card-avatar" style={{ borderColor: stageColors[stage] }}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="crm-card-name">{lead.name}</p>
                        <div className="crm-card-company">
                          <Building2 size={12} />
                          <span>{lead.company}</span>
                        </div>
                      </div>
                    </div>
                    <div className="crm-card-meta">
                      <div className="crm-card-source">
                        <CreditCard size={12} />
                        <span>{t('source')}: {lead.source}</span>
                      </div>
                      <div className="crm-card-date">
                        <Calendar size={12} />
                        <span>{lead.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View ── */}
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
              {LEADS_DATA.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div className="crm-list-user">
                      <div className="crm-list-avatar" style={{ borderColor: stageColors[lead.stage] }}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{lead.name}</span>
                    </div>
                  </td>
                  <td>{lead.company}</td>
                  <td>
                    <span className="crm-source-tag">
                      <CreditCard size={12} />
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <span className="crm-stage-pill" style={{ color: stageColors[lead.stage], background: `${stageColors[lead.stage]}18`, borderColor: `${stageColors[lead.stage]}33` }}>
                      {t(`stage_${lead.stage}`)}
                    </span>
                  </td>
                  <td className="crm-list-date">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
