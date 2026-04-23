"use client";

import { Link } from '@/i18n/routing';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function DashboardMetricsGrid({ metrics }) {
  return (
    <div className="metrics-grid">
      {metrics.map((metric, idx) => (
        metric.href ? (
          <Link key={metric.title} href={metric.href} className="metric-card glass-panel dashboard-anim" style={{ textDecoration: 'none', animationDelay: `${idx * 0.04}s` }}>
            <div className="metric-header">
              <div className="icon-wrapper text-glow">{metric.icon}</div>
              <span className={`trend ${metric.trendUp ? 'trend-up' : 'trend-down'}`}>
                {metric.trend}
              </span>
            </div>
            <div className="metric-content">
              <h3 className="metric-title">{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
          </Link>
        ) : (
          <div key={metric.title} className="metric-card glass-panel dashboard-anim is-static" style={{ textDecoration: 'none', animationDelay: `${idx * 0.04}s` }}>
            <div className="metric-header">
              <div className="icon-wrapper text-glow">{metric.icon}</div>
              <span className={`trend ${metric.trendUp ? 'trend-up' : 'trend-down'}`}>
                {metric.trend}
              </span>
            </div>
            <div className="metric-content">
              <h3 className="metric-title">{metric.title}</h3>
              <p className="metric-value">{metric.value}</p>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

function DashboardActivityList({ recentActivity, tAct }) {
  return (
    <ul className="activity-list">
      {recentActivity.map((activity) => (
        <li key={activity.id}>
          {activity.href ? (
            <Link href={activity.href} className="activity-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="activity-icon text-glow">
                <Activity size={18} />
              </div>
              <div className="activity-details">
                <p className="activity-text">{activity.text}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </Link>
          ) : (
            <div className="activity-item is-static" style={{ color: 'inherit' }}>
              <div className="activity-icon text-glow">
                <Activity size={18} />
              </div>
              <div className="activity-details">
                <p className="activity-text">{activity.text}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function DashboardEngagementSection({ chartData, recentActivity, t, tAct, locale }) {
  return (
    <div className="dashboard-content dashboard-anim" style={{ animationDelay: '0.2s' }}>
      <div className="chart-section glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('engagementOverTime')}</h3>
          <span className="subtitle">{t('engagementSubtitle')}</span>
        </div>
        <div className="chart-block-lg">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} direction={locale === 'ar' ? 'rtl' : 'ltr'}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66FCF1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#66FCF1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888' }} />
              <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(var(--color-black-rgb), 0.92)', border: '1px solid rgba(102, 252, 241, 0.2)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="scans" stroke="#66FCF1" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
              <Area type="monotone" dataKey="leads" stroke="#45A29E" strokeWidth={2} fillOpacity={0.3} fill="#45A29E" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activity-section glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('recentActivity')}</h3>
          <span className="subtitle">{t('recentActivitySubtitle')}</span>
        </div>
        <DashboardActivityList recentActivity={recentActivity} tAct={tAct} />
      </div>
    </div>
  );
}

export function DashboardAnalyticsGrid({ regionData, sourceData, t, locale }) {
  return (
    <div className="dashboard-analytics-grid dashboard-anim" style={{ animationDelay: '0.3s' }}>
      <div className="analytics-panel glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('regionalPerformance')}</h3>
          <span className="subtitle">{t('regionalPerformanceSubtitle')}</span>
        </div>
        <div className="chart-block">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" stroke="#888888" tick={{ fill: '#888888' }} />
              <YAxis type="category" dataKey="region" stroke="#888888" tick={{ fill: '#888888' }} width={locale === 'ar' ? 96 : 80} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(var(--color-black-rgb), 0.92)', border: '1px solid rgba(102, 252, 241, 0.2)', borderRadius: '8px' }} />
              <Bar dataKey="deals" fill="url(#barGradient)" radius={[8, 8, 8, 8]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#45A29E" />
                  <stop offset="100%" stopColor="#66FCF1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-panel glass-panel transition-all duration-300">
        <div className="section-header">
          <h3>{t('sourceMix')}</h3>
          <span className="subtitle">{t('sourceMixSubtitle')}</span>
        </div>
        <div className="chart-block">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={58} outerRadius={90} dataKey="value" stroke="none" paddingAngle={3}>
                {sourceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(var(--color-black-rgb), 0.92)', border: '1px solid rgba(102, 252, 241, 0.2)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="source-legend">
          {sourceData.map((source) => (
            <div key={source.name} className="source-legend-item">
              <span className="source-legend-dot" style={{ background: source.color }} />
              <span>{source.name}</span>
              <strong>{source.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPipelineSection({ pipelineData, t }) {
  return (
    <div className="dashboard-wide-panel glass-panel dashboard-anim" style={{ animationDelay: '0.38s' }}>
      <div className="section-header">
        <h3>{t('pipelineHealth')}</h3>
        <span className="subtitle">{t('pipelineHealthSubtitle')}</span>
      </div>
      <div className="chart-block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pipelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#888888" tick={{ fill: '#888888' }} />
            <YAxis stroke="#888888" tick={{ fill: '#888888' }} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(var(--color-black-rgb), 0.92)', border: '1px solid rgba(102, 252, 241, 0.2)', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="pipeline" stroke="#66FCF1" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="won" stroke="#FFC857" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}