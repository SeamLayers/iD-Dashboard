"use client";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Users, CreditCard, ScanLine, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const tAct = useTranslations('Activity');

  const metrics = [
    { title: t('totalEmployees'), value: "248", trend: "+12%", trendUp: true, icon: <Users size={24} />, href: '/employees' },
    { title: t('activeSmartCards'), value: "195", trend: "+5%", trendUp: true, icon: <CreditCard size={24} />, href: '/templates' },
    { title: t('totalCardScans'), value: "8,432", trend: "+24%", trendUp: true, icon: <ScanLine size={24} />, href: '/leads' },
    { title: t('newCrmLeads'), value: "1,204", trend: "+18%", trendUp: true, icon: <TrendingUp size={24} />, href: '/leads' },
  ];

  const chartData = [
    { name: 'Jan', scans: 1200, leads: 300 },
    { name: 'Feb', scans: 2100, leads: 450 },
    { name: 'Mar', scans: 1800, leads: 400 },
    { name: 'Apr', scans: 2800, leads: 600 },
    { name: 'May', scans: 3400, leads: 850 },
    { name: 'Jun', scans: 4200, leads: 1100 },
    { name: 'Jul', scans: 5100, leads: 1204 },
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
          <Link key={idx} href={metric.href} className="metric-card glass-panel" style={{ textDecoration: 'none' }}>
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

      <div className="dashboard-content">
        <div className="chart-section glass-panel">
          <div className="section-header">
            <h3>{t('engagementOverTime')}</h3>
            <span className="subtitle">{t('engagementSubtitle')}</span>
          </div>
          <div className="chart-container" style={{ height: '350px', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} direction="ltr">
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
                  contentStyle={{ backgroundColor: 'rgba(11, 12, 16, 0.9)', border: '1px solid rgba(102, 252, 241, 0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="scans" stroke="#66FCF1" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" dataKey="leads" stroke="#45A29E" strokeWidth={2} fillOpacity={0.3} fill="#45A29E" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activity-section glass-panel">
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
    </div>
  );
}
