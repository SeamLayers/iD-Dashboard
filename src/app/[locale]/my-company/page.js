"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import {
  Building2,
  Mail,
  Phone,
  FileText,
  Users,
  MapPin,
  ShieldAlert,
  Pencil,
} from 'lucide-react';
import { useMyCompany, useUpdateMyCompany } from '@/shared/api/hooks';
import { useAuth } from '@/shared/auth/AuthProvider';
import { getApiErrorMessage } from '@/shared/api/axios.instance';
import { Link } from '@/i18n/routing';
import RetryButton from '@/shared/components/RetryButton';
import { CompanyFormDialog } from '@/components/features/companies/CompaniesSections';

/**
 * Owner-only landing page backed by `GET /dashboard/owner/company`.
 *
 * Renders the authenticated owner's company with logo, contact details,
 * commercial register, and counts pulled from the eager-loaded
 * `employees` and `branches` relations.
 */
export default function MyCompanyPage() {
  const t = useTranslations('MyCompany');
  const tCommon = useTranslations('Common');
  // The edit dialog reuses the Companies form component, so it needs the
  // Companies namespace (its labels/keys live there).
  const tc = useTranslations('Companies');
  const { hasRole, isReady } = useAuth();
  const isOwner = hasRole('owner');
  const [showEdit, setShowEdit] = useState(false);
  // This page is backed by the owner-only `/dashboard/owner/company` route, so
  // it only fetches for owners. Superadmins would 403 there (role middleware
  // doesn't honour the superadmin Gate bypass) — they use the Companies list.
  const { data, isLoading, isError, error, refetch } = useMyCompany({
    enabled: isReady && isOwner,
  });
  const updateMine = useUpdateMyCompany();

  const handleUpdate = async (payload) => {
    try {
      await updateMine.mutateAsync(payload);
      toast.success(tc('updateSuccess'));
      setShowEdit(false);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isReady && !isOwner) {
    return (
      <div className="page-wrap">
        <div className="entity-empty glass-panel">
          <ShieldAlert size={48} />
          <h3>{t('title')}</h3>
          <p>{hasRole('superadmin') ? t('superadminHint') : t('forbidden')}</p>
          {hasRole('superadmin') && (
            <Link href="/companies" className="btn-primary" style={{ marginTop: '1rem' }}>
              <Building2 size={16} />
              <span>{t('goToCompanies')}</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const company = data || null;
  const employees = Array.isArray(company?.employees) ? company.employees : [];
  const branches = Array.isArray(company?.branches) ? company.branches : [];

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">{t('title')}</h1>
          <p className="page-subtitle">{t('subtitle')}</p>
        </div>
        <div className="page-actions">
          {company && (
            <button className="btn-primary" onClick={() => setShowEdit(true)}>
              <Pencil size={16} />
              <span>{tc('editCompany')}</span>
            </button>
          )}
          <RetryButton onClick={() => refetch()} loading={isLoading} variant="solid" />
        </div>
      </div>

      {isLoading && (
        <div className="entity-loading glass-panel">{tCommon('loading')}</div>
      )}

      {isError && (
        <div className="entity-empty glass-panel">
          <ShieldAlert size={48} />
          <h3>{tCommon('errorOccurred')}</h3>
          <p>{getApiErrorMessage(error)}</p>
        </div>
      )}

      {!isLoading && !isError && !company && (
        <div className="entity-empty glass-panel">
          <Building2 size={48} />
          <h3>{t('notLinkedTitle')}</h3>
          <p>{t('notLinkedSubtitle')}</p>
        </div>
      )}

      {!isLoading && !isError && company && (
        <div className="my-company">
          <section className="my-company-hero glass-panel">
            <div className="my-company-logo">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  width={96}
                  height={96}
                />
              ) : (
                <div className="logo-fallback">
                  <Building2 size={42} />
                </div>
              )}
            </div>
            <div className="my-company-headline">
              <h2 className="my-company-name">{company.name}</h2>
              {company.commercial_register && (
                <span className="pill pill-info">
                  <FileText size={12} />
                  {company.commercial_register}
                </span>
              )}
            </div>
            <div className="my-company-stats">
              <div className="stat-tile">
                <Users size={18} />
                <span className="stat-value">{employees.length}</span>
                <span className="stat-label">{t('stats.employees')}</span>
              </div>
              <div className="stat-tile">
                <MapPin size={18} />
                <span className="stat-value">{branches.length}</span>
                <span className="stat-label">{t('stats.branches')}</span>
              </div>
            </div>
          </section>

          <section className="my-company-grid">
            <article className="glass-panel my-company-card">
              <h3>
                <Mail size={16} /> {t('sections.contact')}
              </h3>
              <ul className="kv-list">
                <li>
                  <Mail size={14} />
                  <div>
                    <span className="kv-label">{t('fields.email')}</span>
                    <a href={`mailto:${company.email}`} className="kv-value">
                      {company.email || '—'}
                    </a>
                  </div>
                </li>
                <li>
                  <Phone size={14} />
                  <div>
                    <span className="kv-label">{t('fields.phone')}</span>
                    <a href={`tel:${company.phone}`} className="kv-value">
                      {company.phone || '—'}
                    </a>
                  </div>
                </li>
              </ul>
            </article>

            <article className="glass-panel my-company-card">
              <h3>
                <Building2 size={16} /> {t('sections.owner')}
              </h3>
              <ul className="kv-list">
                <li>
                  <Users size={14} />
                  <div>
                    <span className="kv-label">{t('fields.ownerName')}</span>
                    <span className="kv-value">{company.owner?.name || '—'}</span>
                  </div>
                </li>
                <li>
                  <Mail size={14} />
                  <div>
                    <span className="kv-label">{t('fields.ownerEmail')}</span>
                    <span className="kv-value">{company.owner?.email || '—'}</span>
                  </div>
                </li>
              </ul>
            </article>
          </section>

          <section className="glass-panel my-company-card">
            <h3>
              <MapPin size={16} /> {t('sections.branches')}
            </h3>
            {branches.length === 0 ? (
              <p className="muted">
                {t('emptyBranches')}{' '}
                <Link href="/branches" className="auth-link">
                  {t('manageBranches')}
                </Link>
              </p>
            ) : (
              <ul className="resource-list">
                {branches.slice(0, 8).map((b) => (
                  <li key={b.id}>
                    <MapPin size={14} />
                    <div>
                      <strong>{b.name}</strong>
                      {b.address && <p className="muted">{b.address}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass-panel my-company-card">
            <h3>
              <Users size={16} /> {t('sections.employees')}
            </h3>
            {employees.length === 0 ? (
              <p className="muted">
                {t('emptyEmployees')}{' '}
                <Link href="/employees" className="auth-link">
                  {t('manageEmployees')}
                </Link>
              </p>
            ) : (
              <ul className="resource-list">
                {employees.slice(0, 8).map((e) => (
                  <li key={e.id}>
                    <Users size={14} />
                    <div>
                      <strong>{e.name || e.employee_number}</strong>
                      {e.email && <p className="muted">{e.email}</p>}
                    </div>
                    {e.status && (
                      <span
                        className={`pill ${
                          e.status === 'active'
                            ? 'pill-success'
                            : 'pill-muted'
                        }`}
                      >
                        {e.status}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <CompanyFormDialog
        t={tc}
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        initial={company}
        onSubmit={handleUpdate}
        isPending={updateMine.isPending}
      />
    </div>
  );
}
