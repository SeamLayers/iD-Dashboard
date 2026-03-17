"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Users, CreditCard, ScanLine, TrendingUp, Activity, Target, CalendarCheck2, Building2, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const tAct = useTranslations('Activity');
  const locale = useLocale();

  const metrics = [
    { title: t('totalEmployees'), value: "248", trend: "+12%", trendUp: true, icon: <Users size={24} />, href: '/employees' },
    { title: t('activeSmartCards'), value: "195", trend: "+5%", trendUp: true, icon: <CreditCard size={24} />, href: '/templates' },
    { title: t('totalCardScans'), value: "8,432", trend: "+24%", trendUp: true, icon: <ScanLine size={24} />, href: '/leads' },
    { title: t('newCrmLeads'), value: "1,204", trend: "+18%", trendUp: true, icon: <TrendingUp size={24} />, href: '/leads' },
    { title: t('conversionRate'), value: "31.8%", trend: "+3.2%", trendUp: true, icon: <Target size={24} />, href: '/leads' },
    { title: t('meetingsBooked'), value: "286", trend: "+11%", trendUp: true, icon: <CalendarCheck2 size={24} />, href: '/leads' },
    { title: t('enterpriseAccounts'), value: "74", trend: "+9%", trendUp: true, icon: <Building2 size={24} />, href: '/employees' },
    { title: t('renewalPipeline'), value: "SAR 2.9M", trend: "-2%", trendUp: false, icon: <RefreshCcw size={24} />, href: '/settings' },
  ];

  const chartData = [
    { name: t('monthJan'), scans: 1200, leads: 300 },
    { name: t('monthFeb'), scans: 2100, leads: 450 },
    { name: t('monthMar'), scans: 1800, leads: 400 },
    { name: t('monthApr'), scans: 2800, leads: 600 },
    { name: t('monthMay'), scans: 3400, leads: 850 },
    { name: t('monthJun'), scans: 4200, leads: 1100 },
    { name: t('monthJul'), scans: 5100, leads: 1204 },
  ];

  const pipelineData = [
    { name: t('monthJan'), pipeline: 34, won: 11 },
    { name: t('monthFeb'), pipeline: 38, won: 13 },
    { name: t('monthMar'), pipeline: 36, won: 14 },
    { name: t('monthApr'), pipeline: 42, won: 15 },
    { name: t('monthMay'), pipeline: 49, won: 17 },
    { name: t('monthJun'), pipeline: 53, won: 18 },
    { name: t('monthJul'), pipeline: 57, won: 21 },
  ];

  const regionData = [
    { region: t('riyadh'), deals: 112 },
    { region: t('jeddah'), deals: 84 },
    { region: t('dammam'), deals: 56 },
    { region: t('khobar'), deals: 42 },
  ];

  const sourceData = [
    { name: t('sourceScan'), value: 42, color: '#66FCF1' },
    { name: t('sourceReferral'), value: 27, color: '#45A29E' },
    { name: t('sourceCampaign'), value: 19, color: '#FFC857' },
    { name: t('sourcePartner'), value: 12, color: '#8E7DF2' },
  ];

  const recentActivity = [
    { id: 1, text: tAct('updateCard'), time: tAct('minsAgo', { count: 2 }), type: "update", href: '/templates' },
    { id: 2, text: tAct('newLead'), time: tAct('minsAgo', { count: 15 }), type: "lead", href: '/leads' },
    { id: 3, text: tAct('marketingRequest'), time: tAct('hourAgo', { count: 1 }), type: "request", href: '/templates' },
    { id: 4, text: tAct('sharedAppleWallet'), time: tAct('hoursAgo', { count: 3 }), type: "share", href: '/templates' },
  ];

  return (
    <div className="dashboard-container">
      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
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
        ))}
      </div>

      <div className="dashboard-content dashboard-anim" style={{ animationDelay: '0.2s' }}>
        <div className="chart-section glass-panel transition-all duration-300">
          <div className="section-header">
            <h3>{t('engagementOverTime')}</h3>
            <span className="subtitle">{t('engagementSubtitle')}</span>
          </div>
          <div className="chart-container" style={{ height: '350px', marginTop: '1.5rem' }}>
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
          <ul className="activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id}>
                <Link href={activity.href} className="activity-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="activity-icon text-glow">
                    <Activity size={18} />
                  </div>
                  <div className="activity-details">
                    <p className="activity-text">{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-analytics-grid dashboard-anim" style={{ animationDelay: '0.3s' }}>
        <div className="analytics-panel glass-panel transition-all duration-300">
          <div className="section-header">
            <h3>{t('regionalPerformance')}</h3>
            <span className="subtitle">{t('regionalPerformanceSubtitle')}</span>
          </div>
          <div style={{ height: '300px', marginTop: '1.25rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke="#888888" tick={{ fill: '#888888' }} />
                <YAxis type="category" dataKey="region" stroke="#888888" tick={{ fill: '#888888' }} width={80} />
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
          <div style={{ height: '300px', marginTop: '1.25rem' }}>
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

      <div className="dashboard-wide-panel glass-panel dashboard-anim" style={{ animationDelay: '0.38s' }}>
        <div className="section-header">
          <h3>{t('pipelineHealth')}</h3>
          <span className="subtitle">{t('pipelineHealthSubtitle')}</span>
        </div>
        <div style={{ height: '300px', marginTop: '1.25rem' }}>
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
    </div>
  );
}
