"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft, User, Building2, Mail, Phone, Hash, IdCard, Briefcase,
  KeyRound, ImagePlus, Loader2, Check, X, Info, MapPin, AlertCircle,
} from 'lucide-react';
import { normalizeSaudiPhone } from '@/shared/utils/phone';

/** Inline validation message rendered under the field it belongs to. */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="empf-field-error" role="alert">
      <AlertCircle size={12} /> {message}
    </p>
  );
}

function getInitials(name = '') {
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

/**
 * Full-page create / edit employee screen (replaces the old cramped modal).
 *
 * Aligned with the backend contract (EmployeeRequest):
 *   required → name, position, iqama_number, email, branch_id, company_id, status
 *   optional → department_id, phone, employee_number (auto-generated when blank),
 *              password (temp one generated + emailed when blank), logo
 * The login account is provisioned server-side, so there is NO "user id" field
 * anymore — the admin just fills in the person's details.
 */
export default function EmployeeForm({
  mode = 'create',
  initial,
  companies = [],
  branches = [],
  departments = [],
  isSuperadmin = false,
  onSubmit,
  onCancel,
  isPending = false,
  fieldErrors,
}) {
  const t = useTranslations('Employees');
  const tCommon = useTranslations('Common');
  const isEdit = mode === 'edit';

  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [iqamaNumber, setIqamaNumber] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('active');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  // Validation messages, keyed by the same field names the API uses so a 422
  // can drop straight into the same map.
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  useEffect(() => {
    const initialCompanyId = initial?.company_id
      ? String(initial.company_id)
      : initial?.company?.id ? String(initial.company.id) : '';
    setCompanyId(initialCompanyId || (companies.length === 1 ? String(companies[0].id) : ''));
    setBranchId(initial?.branch_id ? String(initial.branch_id) : initial?.branch?.id ? String(initial.branch.id) : '');
    setDepartmentId(initial?.department_id ? String(initial.department_id) : initial?.department?.id ? String(initial.department.id) : '');
    setEmployeeNumber(initial?.employee_number || '');
    setIqamaNumber(initial?.iqama_number || '');
    setName(initial?.name || '');
    setPosition(initial?.position || '');
    setEmail(initial?.email || '');
    setPhone(initial?.phone || '');
    setStatus(initial?.status || 'active');
    setLogo(null);
    setLogoPreview(initial?.logo || null);
    setErrors({});
  }, [initial, companies]);

  // Server-side 422s arrive per field and are merged in, so every invalid
  // input is marked at once instead of only the first one reaching a toast.
  useEffect(() => {
    if (fieldErrors && Object.keys(fieldErrors).length) {
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  }, [fieldErrors]);

  const clearError = (field) => setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const showCompanyPicker = isSuperadmin && companies.length > 1;
  const filteredBranches = companyId ? branches.filter((b) => String(b.company_id) === String(companyId)) : branches;
  const filteredDepartments = companyId ? departments.filter((d) => String(d.company_id) === String(companyId)) : departments;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    clearError('logo');
    setLogo(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result || null);
    reader.readAsDataURL(file);
  };

  const validatePhone = (value) => {
    const { valid } = normalizeSaudiPhone(value);
    setErrors((prev) => ({ ...prev, phone: valid ? undefined : t('phoneInvalid') }));
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phone is optional, but if present it must be a valid (Saudi/E.164)
    // number — block submit and surface an inline error otherwise.
    const { valid: phoneValid, e164 } = normalizeSaudiPhone(phone);
    if (!phoneValid) {
      setErrors((prev) => ({ ...prev, phone: t('phoneInvalid') }));
      return;
    }
    // Never send user_id (provisioned server-side). Blank optional fields are
    // stripped by buildFormData, so the backend auto-generates the employee
    // number and a temporary password when they're left empty.
    const payload = {
      company_id: Number(companyId),
      branch_id: Number(branchId),
      department_id: departmentId ? Number(departmentId) : undefined,
      employee_number: employeeNumber || undefined,
      iqama_number: iqamaNumber,
      name,
      position,
      email,
      // Send the normalized E.164 form so stored numbers stay consistent.
      phone: e164,
      status,
    };
    if (!isEdit && password) payload.password = password;
    if (logo) payload.logo = logo;
    onSubmit(payload);
  };

  return (
    <form className="empf-page" onSubmit={handleSubmit}>
      {/* Sticky action header */}
      <div className="empf-topbar glass-panel">
        <div className="empf-topbar-left">
          <button type="button" className="empf-back" onClick={onCancel} aria-label={tCommon('cancel')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="empf-title text-gradient">{isEdit ? t('editEmployee') : t('newEmployeeTitle')}</h1>
            <p className="empf-subtitle">{isEdit ? t('editEmployeeDesc') : t('newEmployeeDesc')}</p>
          </div>
        </div>
        <div className="empf-topbar-actions">
          <button type="button" className="btn-outline" onClick={onCancel} disabled={isPending}>
            <X size={15} /><span>{tCommon('cancel')}</span>
          </button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? <Loader2 size={15} className="spinner" /> : <Check size={15} />}
            <span>{isPending ? tCommon('saving') : isEdit ? t('saveChanges') : t('addEmployee')}</span>
          </button>
        </div>
      </div>

      <div className="empf-grid">
        {/* Identity */}
        <section className="empf-card glass-panel">
          <div className="empf-card-head">
            <div className="empf-card-icon"><User size={18} /></div>
            <div>
              <h2>{t('sectionIdentity')}</h2>
              <span>{t('sectionIdentityHint')}</span>
            </div>
          </div>
          <div className="empf-fields">
            <div className="empf-field">
              <label>{t('name')} <em>*</em></label>
              <input className="empf-input" required value={name} onChange={(e) => { setName(e.target.value); clearError('name'); }} placeholder={t('namePlaceholder')} aria-invalid={Boolean(errors.name)} />
              <FieldError message={errors.name} />
            </div>
            <div className="empf-field">
              <label><Briefcase size={13} /> {t('jobTitle')} <em>*</em></label>
              <input className="empf-input" required value={position} onChange={(e) => { setPosition(e.target.value); clearError('position'); }} placeholder={t('jobTitlePlaceholder')} aria-invalid={Boolean(errors.position)} />
              <FieldError message={errors.position} />
            </div>
            <div className="empf-field">
              <label><IdCard size={13} /> {t('iqamaNumber')} <em>*</em></label>
              <input className="empf-input" required value={iqamaNumber} onChange={(e) => { setIqamaNumber(e.target.value); clearError('iqama_number'); }} placeholder="2xxxxxxxxx" aria-invalid={Boolean(errors.iqama_number)} />
              <FieldError message={errors.iqama_number} />
            </div>
            <div className="empf-field">
              <label><Hash size={13} /> {t('employeeNumber')}</label>
              <input className="empf-input" value={employeeNumber} onChange={(e) => { setEmployeeNumber(e.target.value); clearError('employee_number'); }} placeholder={t('employeeNumberAuto')} aria-invalid={Boolean(errors.employee_number)} />
              <FieldError message={errors.employee_number} />
              <small className="empf-hint">{t('employeeNumberHint')}</small>
            </div>
          </div>
        </section>

        {/* Organization */}
        <section className="empf-card glass-panel">
          <div className="empf-card-head">
            <div className="empf-card-icon"><Building2 size={18} /></div>
            <div>
              <h2>{t('sectionOrg')}</h2>
              <span>{t('sectionOrgHint')}</span>
            </div>
          </div>
          <div className="empf-fields">
            {showCompanyPicker && (
              <div className="empf-field">
                <label>{t('company')} <em>*</em></label>
                <select className="empf-input" required value={companyId} onChange={(e) => { setCompanyId(e.target.value); setBranchId(''); setDepartmentId(''); clearError('company_id'); }} aria-invalid={Boolean(errors.company_id)}>
                  <option value="">{t('filterByCompany')}</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <FieldError message={errors.company_id} />
              </div>
            )}
            <div className="empf-field">
              <label><MapPin size={13} /> {t('branch')} <em>*</em></label>
              <select className="empf-input" required value={branchId} onChange={(e) => { setBranchId(e.target.value); clearError('branch_id'); }} aria-invalid={Boolean(errors.branch_id)}>
                <option value="">{t('filterByBranch')}</option>
                {filteredBranches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <FieldError message={errors.branch_id} />
            </div>
            <div className="empf-field">
              <label>{t('department')}</label>
              <select className="empf-input" value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); clearError('department_id'); }} aria-invalid={Boolean(errors.department_id)}>
                <option value="">{t('departmentNone')}</option>
                {filteredDepartments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <FieldError message={errors.department_id} />
            </div>
            <div className="empf-field">
              <label>{t('status')}</label>
              <div className="empf-status-toggle">
                <button type="button" className={status === 'active' ? 'active' : ''} onClick={() => setStatus('active')}>{t('status_active')}</button>
                <button type="button" className={status === 'inactive' ? 'active' : ''} onClick={() => setStatus('inactive')}>{t('status_inactive')}</button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="empf-card glass-panel">
          <div className="empf-card-head">
            <div className="empf-card-icon"><Mail size={18} /></div>
            <div>
              <h2>{t('sectionContact')}</h2>
              <span>{t('sectionContactHint')}</span>
            </div>
          </div>
          <div className="empf-fields">
            <div className="empf-field">
              <label><Mail size={13} /> {t('email')} <em>*</em></label>
              <input className="empf-input" type="email" required value={email} onChange={(e) => { setEmail(e.target.value); clearError('email'); }} placeholder="name@company.com" aria-invalid={Boolean(errors.email)} />
              <FieldError message={errors.email} />
            </div>
            <div className="empf-field">
              <label><Phone size={13} /> {t('phone')}</label>
              <input
                className="empf-input"
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (errors.phone) validatePhone(e.target.value); }}
                onBlur={(e) => validatePhone(e.target.value)}
                placeholder="05XXXXXXXX / +9665XXXXXXXX"
                aria-invalid={Boolean(errors.phone)}
              />
              <FieldError message={errors.phone} />
            </div>
            {!isEdit && (
              <div className="empf-field empf-field-full">
                <label><KeyRound size={13} /> {t('password')}</label>
                <input className="empf-input" type="text" value={password} onChange={(e) => { setPassword(e.target.value); clearError('password'); }} placeholder={t('passwordAuto')} autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
                <FieldError message={errors.password} />
                <small className="empf-hint empf-hint-info"><Info size={12} /> {t('passwordHint')}</small>
              </div>
            )}
          </div>
        </section>

        {/* Photo */}
        <section className="empf-card glass-panel">
          <div className="empf-card-head">
            <div className="empf-card-icon"><ImagePlus size={18} /></div>
            <div>
              <h2>{t('sectionPhoto')}</h2>
              <span>{t('sectionPhotoHint')}</span>
            </div>
          </div>
          <div className="empf-photo-row">
            <div className="empf-avatar">
              {logoPreview ? <img src={logoPreview} alt={name} /> : <span>{getInitials(name) || <User size={22} />}</span>}
            </div>
            <label className="empf-file">
              <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFile} aria-invalid={Boolean(errors.logo)} />
              <ImagePlus size={16} />
              <span>{logo?.name || (logoPreview ? t('replacePhoto') : t('uploadPhoto'))}</span>
            </label>
            <small className="empf-hint">{t('uploadHint')}</small>
          </div>
          {/* Outside the photo row: the row is a flex line, so the message would
              otherwise sit beside the upload button instead of under it. */}
          <FieldError message={errors.logo} />
        </section>
      </div>
    </form>
  );
}
