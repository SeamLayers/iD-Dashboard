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
import { useRole } from '@/shared/auth/useRole';

const ROLE_LABEL_KEYS = {
  superadmin: 'superAdmin',
  owner: 'owner',
  member: 'member',
};

export default function Sidebar() {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const { hasAnyPermission, hasRole } = useAuth();
  const { role } = useRole();

  // Declarative menu: `roles` = any-of role gate, `anyOf` = any-of permission gate.
  // Items without gates are visible to every authenticated user.
  const menuItems = [
    { name: t('dashboard'), path: '/', icon: <LayoutDashboard size={20} /> },
    // Owner-only landing page powered by GET /dashboard/owner/company.
    {
      name: t('myCompany'),
      path: '/my-company',
      icon: <Building2 size={20} />,
      roles: ['owner'],
    },
    {
      name: t('companies'),
      path: '/companies',
      icon: <Building2 size={20} />,
      roles: ['superadmin'],
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
    // "Create User" (POST /dashboard/register) is hidden for now — accounts are
    // auto-provisioned when adding a company (owner) or an employee, so a
    // standalone user-creation screen only confuses admins. The /register page
    // is kept in the codebase for future use. Re-add this item to restore it.
    // {
    //   name: t('register'),
    //   path: '/register',
    //   icon: <UserCog size={20} />,
    //   roles: ['superadmin', 'owner'],
    // },
    {
      name: t('approvals'),
      path: '/approvals',
      icon: <CheckSquare size={20} />,
      anyOf: ['business_card.view'],
    },
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
    // Roles & Permissions manages the GLOBAL platform roles (superadmin, owner,
    // manager, employee) — editing them changes behaviour for every company, so
    // it's superadmin-only. An owner must never see or reach this screen.
    {
      name: t('roles'),
      path: '/roles',
      icon: <ShieldCheck size={20} />,
      roles: ['superadmin'],
      anyOf: ['role.view'],
    },
    // Settings stays visible to all authenticated users.
    { name: t('settings'), path: '/settings', icon: <Settings size={20} /> },
  ];

  const visibleItems = menuItems.filter(
    (item) =>
      (!item.roles || hasRole(item.roles)) &&
      (!item.anyOf || hasAnyPermission(item.anyOf))
  );

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
        <p className="version">v1.0 - {t(ROLE_LABEL_KEYS[role])}</p>
      </div>
    </aside>
  );
}
