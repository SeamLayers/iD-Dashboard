"use client";
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, CreditCard, TrendingUp, Settings, CheckSquare } from 'lucide-react';

export default function Sidebar() {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  const menuItems = [
    { name: t('dashboard'), path: '/', icon: <LayoutDashboard size={20} /> },
    { name: t('employees'), path: '/employees', icon: <Users size={20} /> },
    { name: t('approvals'), path: '/approvals', icon: <CheckSquare size={20} /> },
    { name: t('templates'), path: '/templates', icon: <CreditCard size={20} /> },
    { name: t('crmLeads'), path: '/leads', icon: <TrendingUp size={20} /> },
    { name: t('settings'), path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2 className="logo text-gradient text-glow">iD+</h2>
        <span className="by-mhawer">{t('by')}</span>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
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
        <p className="version">v1.0 - {t('superAdmin')}</p>
      </div>
    </aside>
  );
}
