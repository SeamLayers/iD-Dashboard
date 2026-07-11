"use client";
import { useTranslations, useLocale } from 'next-intl';
import {
  Users,
  CreditCard,
  ScanLine,
  Target,
  Building2,
  MapPin,
  Briefcase,
  Folder,
} from 'lucide-react';
import {
  DashboardMetricsGrid,
  DashboardEngagementSection,
  DashboardAnalyticsGrid,
  DashboardCardStatusSection,
} from '@/components/features/dashboard/DashboardSections';
import {
  useOverview,
  useCompanies,
  useBranches,
  useDepartments,
  useEmployees,
  useProjects,
  useEmployeeProjects,
} from '@/shared/api/hooks';
import { useRole } from '@/shared/auth/useRole';

const formatNumber = (n) => {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(n);
};

const SOURCE_COLORS = { QR: '#66FCF1', NFC: '#8E7DF2', LINK: '#FFC857' };
const STATUS_COLORS = {
  draft: '#8892a0',
  submitted: '#FFC857',
  approved: '#45A29E',
  published: '#66BB6A',
  rejected: '#EF5B71',
};

// Locale-aware "x minutes ago" for real interaction timestamps.
function useRelativeTime(locale) {
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
  return (iso) => {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';
    const diffSec = Math.round((then - Date.now()) / 1000);
    const abs = Math.abs(diffSec);
    if (abs < 60) return rtf.format(Math.round(diffSec), 'second');
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
    return rtf.format(Math.round(diffSec / 86400), 'day');
  };
}

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const tSidebar = useTranslations('Sidebar');
  const locale = useLocale();
  const { isSuperadmin } = useRole();
  const relTime = useRelativeTime(locale);

  // Real analytics (cards + interactions). Undefined until loaded, or if the
  // deployed backend doesn't expose the endpoint yet — everything below then
  // degrades to entity counts + empty states, never fabricated numbers.
  const { data: overview } = useOverview();

  // Entity counts come from the tenancy-scoped list endpoints (already real).
  const { data: companiesData } = useCompanies({ per_page: 1 }, { enabled: isSuperadmin });
  const { data: branchesData } = useBranches({ per_page: 1 });
  const { data: departmentsData } = useDepartments({ per_page: 1 });
  const { data: employeesData } = useEmployees({ per_page: 1 });
  const { data: projectsData } = useProjects({ per_page: 1 });
  const { data: assignmentsData } = useEmployeeProjects({ per_page: 1 });

  const activeCards = overview?.cards?.active ?? overview?.cards?.published;
  const totalScans = overview?.interactions?.scans;

  const metrics = [
    ...(isSuperadmin
      ? [{ title: tSidebar('companies'), value: formatNumber(companiesData?.total), icon: <Building2 size={24} />, href: '/companies' }]
      : []),
    { title: tSidebar('branches'), value: formatNumber(branchesData?.total), icon: <MapPin size={24} />, href: '/branches' },
    { title: tSidebar('departments'), value: formatNumber(departmentsData?.total), icon: <Briefcase size={24} />, href: '/departments' },
    { title: t('totalEmployees'), value: formatNumber(employeesData?.total), icon: <Users size={24} />, href: '/employees' },
    { title: tSidebar('projects'), value: formatNumber(projectsData?.total), icon: <Folder size={24} />, href: '/projects' },
    { title: tSidebar('assignments'), value: formatNumber(assignmentsData?.total), icon: <Target size={24} />, href: '/assignments' },
    { title: t('activeSmartCards'), value: formatNumber(activeCards), icon: <CreditCard size={24} />, href: '/business-cards' },
    { title: t('totalCardScans'), value: formatNumber(totalScans), icon: <ScanLine size={24} />, href: '/business-cards' },
  ];

  // Engagement time-series (real months from the backend).
  const chartData = overview?.monthly ?? [];
  const hasEngagement = chartData.some((m) => (m.scans || 0) + (m.views || 0) > 0);

  // Regions = published cards per branch.
  const regionData = (overview?.regions ?? []).filter((r) => r.value > 0);
  const hasRegions = regionData.length > 0;

  // Scan source split (real counts).
  const srcMap = overview?.sources ?? {};
  const sourceData = ['QR', 'NFC', 'LINK']
    .map((k) => ({ name: t(`source_${k}`), key: k, value: srcMap[k] || 0, color: SOURCE_COLORS[k] }))
    .filter((s) => s.value > 0);
  const hasSources = sourceData.length > 0;

  // Card status breakdown (replaces the old fake CRM pipeline chart).
  const statusMap = overview?.card_status ?? {};
  const statusData = ['draft', 'submitted', 'approved', 'published', 'rejected']
    .map((k) => ({ key: k, label: t(`cardStatus_${k}`), value: statusMap[k] || 0, color: STATUS_COLORS[k] }));
  const hasStatus = (overview?.cards?.total ?? 0) > 0;

  // Recent activity from real interactions.
  const recentActivity = (overview?.recent ?? []).map((r) => ({
    source: r.source,
    text: t('activityEvent', { name: r.name, action: t(`action_${r.type === 'view' ? 'viewed' : 'scanned'}`) }),
    time: relTime(r.at),
  }));

  return (
    <div className="dashboard-container">
      <DashboardMetricsGrid metrics={metrics} />
      <DashboardEngagementSection chartData={chartData} hasEngagement={hasEngagement} recentActivity={recentActivity} t={t} locale={locale} />
      <DashboardAnalyticsGrid regionData={regionData} sourceData={sourceData} hasRegions={hasRegions} hasSources={hasSources} t={t} locale={locale} />
      <DashboardCardStatusSection statusData={statusData} hasStatus={hasStatus} t={t} />
    </div>
  );
}
