"use client";
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Briefcase,
  Users,
  Folder,
  UserPlus,
  CreditCard,
  Settings,
  CheckSquare,
  UserCog,
  Palette,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/shared/auth/AuthProvider';

export default function Sidebar() {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const { hasAnyPermission, hasRole } = useAuth();

  const isSuperAdmin = hasRole('superadmin');
  const isOwner = hasRole('owner');

  const menuItems = [
    { name: t('dashboard'), path: '/', icon: <LayoutDashboard size={20} /> },
    // Owner-only landing page powered by GET /dashboard/owner/company.
    isOwner && {
      name: t('myCompany'),
      path: '/my-company',
      icon: <Building2 size={20} />,
    },
    isSuperAdmin && {
      name: t('companies'),
      path: '/companies',
      icon: <Building2 size={20} />,
      anyOf: ['company.view'],
    },
    {
      name: t('branches'),
      path: '/branches',
      icon: <MapPin size={20} />,
      anyOf: ['company_branch.view'],
    },
    {
      name: t('departments'),
      path: '/departments',
      icon: <Briefcase size={20} />,
      anyOf: ['department.view'],
    },
    {
      name: t('employees'),
      path: '/employees',
      icon: <Users size={20} />,
      anyOf: ['employee.view'],
    },
    {
      name: t('projects'),
      path: '/projects',
      icon: <Folder size={20} />,
      anyOf: ['project.view'],
    },
    {
      name: t('assignments'),
      path: '/assignments',
      icon: <UserPlus size={20} />,
      anyOf: ['employee_project.view'],
    },
    // POST /dashboard/register — admin creates user accounts.
    // Open to superadmin and owner.
    (isSuperAdmin || isOwner) && {
      name: t('register'),
      path: '/register',
      icon: <UserCog size={20} />,
    },
    { name: t('approvals'), path: '/approvals', icon: <CheckSquare size={20} /> },
    {
      name: t('businessCards'),
      path: '/business-cards',
      icon: <CreditCard size={20} />,
      anyOf: ['business_card.view'],
    },
    {
      name: t('businessCardTemplates'),
      path: '/business-card-templates',
      icon: <Palette size={20} />,
      anyOf: ['business_card_template.view'],
    },
    {
      name: t('roles'),
      path: '/roles',
      icon: <ShieldCheck size={20} />,
      anyOf: ['role.view'],
    },
    { name: t('templates'), path: '/templates', icon: <CreditCard size={20} /> },
    { name: t('settings'), path: '/settings', icon: <Settings size={20} /> },
  ].filter(Boolean);

  const visibleItems = menuItems.filter((item) => {
    if (!item.anyOf) return true;
    return hasAnyPermission(item.anyOf);
  });

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2 className="logo text-gradient text-glow">iD+</h2>
        <span className="by-mhawer">{t('by')}</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {visibleItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <li key={item.path} className={isActive ? 'active' : ''}>
                <Link href={item.path} className="nav-link">
                  <span className="icon">{item.icon}</span>
                  <span className="text">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="glowing-line shrink-line"></div>
        <p className="version">
          v1.0 -{' '}
          {isSuperAdmin
            ? t('superAdmin')
            : isOwner
              ? t('owner')
              : t('member')}
        </p>
      </div>
    </aside>
  );
}
