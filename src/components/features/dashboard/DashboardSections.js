"use client";

import { Link } from '@/i18n/routing';
import { Activity, QrCode, Nfc, LinkIcon, Eye, Inbox } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(var(--color-black-rgb), 0.92)',
  border: '1px solid rgba(102, 252, 241, 0.2)',
  borderRadius: '8px',
};

// Shown wherever real data hasn't been captured yet — never fabricate numbers.
function ChartEmpty({ label }) {
  return (
    <div className="chart-empty">
      <Inbox size={26} />
      <span>{label}</span>
    </div>
  );
}

// Placeholder tiles matching the real grid's shape, so the layout doesn't jump
// when the numbers arrive.
export function DashboardMetricsSkeleton({ count = 8 }) {
  return (
    <div className="metrics-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="metric-card glass-panel is-static dashboard-skeleton-card">
          <div className="dashboard-skeleton-line" style={{ width: 34, height: 34, borderRadius: 10 }} />
          <div className="dashboard-skeleton-line" style={{ width: '60%', height: 12, marginTop: 18 }} />
          <div className="dashboard-skeleton-line" style={{ width: '38%', height: 26, marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}

export function DashboardMetricsGrid({ metrics }) {
  return (
    <div className="metrics-grid">
      {metrics.map((metric, idx) => {
        const Inner = (
          <>
            <div className="metric-header">
              <div className="icon-wrapper text-glow">{metric.icon}</div>
              {metric.trend ? (
                <span className={`trend ${metric.trendUp ? 'trend-up' : 'trend-down'}`}>{metric.trend}</span>
              ) : null}
            </div>
            <div className="metric-content">
              <h3 className="metric-title">{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
          </>
        );
        return metric.href ? (
          <Link key={metric.title} href={metric.href} className="metric-card glass-panel dashboard-anim" style={{ textDecoration: 'none', animationDelay: `${idx * 0.04}s` }}>
            {Inner}
          </Link>
        ) : (
          <div key={metric.title} className="metric-card glass-panel dashboard-anim is-static" style={{ animationDelay: `${idx * 0.04}s` }}>
            {Inner}
          </div>
        );
      })}
    </div>
  );
}

const ACTIVITY_ICON = {
  QR: <QrCode size={18} />,
  NFC: <Nfc size={18} />,
  LINK: <LinkIcon size={18} />,
};

function DashboardActivityList({ recentActivity, emptyLabel }) {
  if (!recentActivity.length) {
    return <ChartEmpty label={emptyLabel} />;
  }
  return (
    <ul className="activity-list">
      {recentActivity.map((activity, i) => (
        <li key={i}>
          <div className="activity-item is-static" style={{ color: 'inherit' }}>
            <div className="activity-icon text-glow">
              {ACTIVITY_ICON[activity.source] || <Eye size={18} />}
            </div>
            <div className="activity-details">
              <p className="activity-text">{activity.text}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DashboardEngagementSection({ chartData, hasEngagement, recentActivity, t, locale }) {
  return (
    <div className="dashboard-content dashboard-anim" style={{ animationDelay: '0.2s' }}>
      <div className="chart-section glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('engagementOverTime')}</h3>
          <span className="subtitle">{t('engagementSubtitle')}</span>
        </div>
        <div className="chart-block-lg">
          {hasEngagement ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66FCF1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#66FCF1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="#888888" tick={{ fill: '#888888' }} reversed={locale === 'ar'} />
                <YAxis stroke="#888888" tick={{ fill: '#888888' }} allowDecimals={false} orientation={locale === 'ar' ? 'right' : 'left'} />
                <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: 'var(--text-primary)' }} />
                <Area type="monotone" name={t('scansLabel')} dataKey="scans" stroke="#66FCF1" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" name={t('viewsLabel')} dataKey="views" stroke="#45A29E" strokeWidth={2} fillOpacity={0.3} fill="#45A29E" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty label={t('noEngagementData')} />
          )}
        </div>
      </div>

      <div className="activity-section glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('recentActivity')}</h3>
          <span className="subtitle">{t('recentActivitySubtitle')}</span>
        </div>
        <DashboardActivityList recentActivity={recentActivity} emptyLabel={t('noActivityData')} />
      </div>
    </div>
  );
}

export function DashboardAnalyticsGrid({ regionData, sourceData, hasRegions, hasSources, t, locale }) {
  return (
    <div className="dashboard-analytics-grid dashboard-anim" style={{ animationDelay: '0.3s' }}>
      <div className="analytics-panel glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('regionalPerformance')}</h3>
          <span className="subtitle">{t('regionalPerformanceSubtitle')}</span>
        </div>
        <div className="chart-block">
          {hasRegions ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke="#888888" tick={{ fill: '#888888' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="#888888" tick={{ fill: '#888888' }} width={locale === 'ar' ? 110 : 96} orientation={locale === 'ar' ? 'right' : 'left'} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="value" name={t('cardsLabel')} fill="url(#barGradient)" radius={[8, 8, 8, 8]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#45A29E" />
                    <stop offset="100%" stopColor="#66FCF1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty label={t('noRegionData')} />
          )}
        </div>
      </div>

      <div className="analytics-panel glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('sourceMix')}</h3>
          <span className="subtitle">{t('sourceMixSubtitle')}</span>
        </div>
        {hasSources ? (
          <>
            <div className="chart-block">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={58} outerRadius={90} dataKey="value" stroke="none" paddingAngle={3}>
                    {sourceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="source-legend">
              {sourceData.map((source) => (
                <div key={source.name} className="source-legend-item">
                  <span className="source-legend-dot" style={{ background: source.color }} />
                  <span>{source.name}</span>
                  <strong>{source.value}</strong>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="chart-block"><ChartEmpty label={t('noSourceData')} /></div>
        )}
      </div>
    </div>
  );
}

export function DashboardCardStatusSection({ statusData, hasStatus, t }) {
  return (
    <div className="dashboard-wide-panel glass-panel dashboard-anim" style={{ animationDelay: '0.38s' }}>
      <div className="section-header">
        <h3>{t('cardStatusTitle')}</h3>
        <span className="subtitle">{t('cardStatusSubtitle')}</span>
      </div>
      <div className="chart-block">
        {hasStatus ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" stroke="#888888" tick={{ fill: '#888888' }} />
              <YAxis stroke="#888888" tick={{ fill: '#888888' }} allowDecimals={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" name={t('cardsLabel')} radius={[8, 8, 0, 0]}>
                {statusData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartEmpty label={t('noCardData')} />
        )}
      </div>
    </div>
  );
}
