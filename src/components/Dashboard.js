"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Users, CreditCard, ScanLine, TrendingUp, Activity, Target, CalendarCheck2, Building2, RefreshCcw } from 'lucide-react';
import { DashboardMetricsGrid, DashboardEngagementSection, DashboardAnalyticsGrid, DashboardPipelineSection } from '@/components/features/dashboard/DashboardSections';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const tAct = useTranslations('Activity');
  const locale = useLocale();

  const metrics = [
    { title: t('totalEmployees'), value: "248", trend: "+12%", trendUp: true, icon: <Users size={24} />, href: '/employees' },
    { title: t('activeSmartCards'), value: "195", trend: "+5%", trendUp: true, icon: <CreditCard size={24} />, href: '/templates' },
    { title: t('totalCardScans'), value: "8,432", trend: "+24%", trendUp: true, icon: <ScanLine size={24} />, href: null },
    { title: t('newCrmLeads'), value: "1,204", trend: "+18%", trendUp: true, icon: <TrendingUp size={24} />, href: null },
    { title: t('conversionRate'), value: "31.8%", trend: "+3.2%", trendUp: true, icon: <Target size={24} />, href: null },
    { title: t('meetingsBooked'), value: "286", trend: "+11%", trendUp: true, icon: <CalendarCheck2 size={24} />, href: null },
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
    { id: 2, text: tAct('newLead'), time: tAct('minsAgo', { count: 15 }), type: "lead", href: null },
    { id: 3, text: tAct('marketingRequest'), time: tAct('hourAgo', { count: 1 }), type: "request", href: '/templates' },
    { id: 4, text: tAct('sharedAppleWallet'), time: tAct('hoursAgo', { count: 3 }), type: "share", href: '/templates' },
  ];

  return (
    <div className="dashboard-container">
      <DashboardMetricsGrid metrics={metrics} />
      <DashboardEngagementSection chartData={chartData} recentActivity={recentActivity} t={t} tAct={tAct} locale={locale} />
      <DashboardAnalyticsGrid regionData={regionData} sourceData={sourceData} t={t} locale={locale} />
      <DashboardPipelineSection pipelineData={pipelineData} t={t} />
    </div>
  );
}
