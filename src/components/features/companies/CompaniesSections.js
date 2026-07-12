"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Mail, Phone, Pencil, Trash2, Upload, X, Plus, Check, Loader2, User, KeyRound, Hash, ImagePlus, Info } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function CompanyCard({ t, company, onEdit, onDelete }) {
  const initials = getInitials(company.name);
  return (
    <div className="entity-card glass-panel">
      <div className="entity-card-header">
        <div className="entity-avatar">
          {company.logo ? <img src={company.logo} alt={company.name} /> : initials}
        </div>
        <div>
          <p className="entity-name">{company.name}</p>
          <p className="entity-meta">{company.commercial_register || '—'}</p>
        </div>
      </div>
      <div className="entity-card-body">
        <div className="entity-card-row">
          <span className="label"><Mail size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('email')}</span>
          <span className="value">{company.email}</span>
        </div>
        <div className="entity-card-row">
          <span className="label"><Phone size={13} style={{ display: 'inline', marginInlineEnd: 4 }} />{t('phone')}</span>
          <span className="value" dir="ltr">{company.phone}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">{t('owner')}</span>
          <span className="value">{company.owner?.name || '—'}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">{t('branches')}</span>
          <span className="value">{company.branches?.length ?? 0}</span>
        </div>
        <div className="entity-card-row">
          <span className="label">{t('employees')}</span>
          <span className="value">{company.employees?.length ?? 0}</span>
        </div>
      </div>
      <div className="entity-card-actions">
        <button className="btn-outline" onClick={() => onEdit(company)}>
          <Pencil size={14} />
          <span>{t('editCompany')}</span>
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(company)} aria-label="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function CompanyFormDialog({ t, isOpen, onClose, initial, onSubmit, isPending }) {
  const tCommon = useTranslations('Common');
  const isEdit = Boolean(initial?.id);
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [commercialRegister, setCommercialRegister] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name || '');
    setEmail(initial?.email || '');
    setPhone(initial?.phone || '');
    setCommercialRegister(initial?.commercial_register || '');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPhone('');
    setLogo(null);
    setLogoPreview(initial?.logo || null);
  }, [isOpen, initial]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result || null);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      phone,
      commercial_register: commercialRegister || undefined,
    };
    // The owner LOGIN account is provisioned server-side on create only — the
    // superadmin no longer types a raw user id.
    if (!isEdit) {
      payload.owner_name = ownerName;
      payload.owner_email = ownerEmail;
      payload.owner_phone = ownerPhone || undefined;
    }
    if (logo) payload.logo = logo;
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form modal-wide">
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editCompany') : t('addCompany')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit} className="modal-sections">
        {/* Company info */}
        <section className="modal-section">
          <div className="modal-section-head">
            <div className="modal-section-icon"><Building2 size={16} /></div>
            <div>
              <h4>{t('sectionCompany')}</h4>
              <span>{t('sectionCompanyHint')}</span>
            </div>
          </div>
          <div className="modal-grid">
            <div className="modal-field">
              <label>{t('name')} <em>*</em></label>
              <input className="modal-input" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="modal-field">
              <label><Mail size={12} /> {t('email')} <em>*</em></label>
              <input className="modal-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="modal-field">
              <label><Phone size={12} /> {t('phone')} <em>*</em></label>
              <input className="modal-input" required value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
            </div>
            <div className="modal-field">
              <label><Hash size={12} /> {t('commercialRegister')}</label>
              <input className="modal-input" value={commercialRegister} onChange={(e) => setCommercialRegister(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Owner account — create only */}
        {!isEdit && (
          <section className="modal-section">
            <div className="modal-section-head">
              <div className="modal-section-icon"><KeyRound size={16} /></div>
              <div>
                <h4>{t('sectionOwner')}</h4>
                <span>{t('sectionOwnerHint')}</span>
              </div>
            </div>
            <div className="modal-grid">
              <div className="modal-field">
                <label><User size={12} /> {t('ownerName')} <em>*</em></label>
                <input className="modal-input" required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder={t('ownerNamePlaceholder')} />
              </div>
              <div className="modal-field">
                <label><Mail size={12} /> {t('ownerEmail')} <em>*</em></label>
                <input className="modal-input" type="email" required value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="owner@company.com" />
              </div>
              <div className="modal-field modal-field-full">
                <label><Phone size={12} /> {t('ownerPhone')}</label>
                <input className="modal-input" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="05xxxxxxxx" dir="ltr" />
              </div>
            </div>
            <p className="modal-hint-info"><Info size={13} /> {t('ownerAccountNote')}</p>
          </section>
        )}

        {/* Logo */}
        <section className="modal-section">
          <div className="modal-section-head">
            <div className="modal-section-icon"><ImagePlus size={16} /></div>
            <div>
              <h4>{t('logo')}</h4>
              <span>{t('uploadHint')}</span>
            </div>
          </div>
          <label className="file-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFile}
              required={!isEdit}
            />
            <div className="file-upload-icon"><Upload size={20} /></div>
            <div className="file-upload-text">
              <span>{logo?.name || (logoPreview ? t('replaceLogo') : t('uploadLogo'))}</span>
            </div>
          </label>
          {logoPreview && (
            <div className="file-preview">
              <img src={logoPreview} alt="Preview" />
              <small style={{ color: 'var(--text-muted)' }}>{logo?.name || t('currentLogo')}</small>
            </div>
          )}
        </section>

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose} disabled={isPending}>{tCommon('cancel')}</button>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? (
              <Loader2 size={14} className="spinner" />
            ) : isEdit ? (
              <Check size={14} />
            ) : (
              <Plus size={14} />
            )}
            <span>
              {isPending
                ? tCommon('saving')
                : isEdit
                ? t('editCompany')
                : t('addCompany')}
            </span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function DeleteCompanyDialog({ t, isOpen, onClose, onConfirm, isPending }) {
  const tCommon = useTranslations('Common');
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">{t('deleteCompany')}</h3>
      <p className="modal-desc">{t('deleteCompanyDesc')}</p>
      <div className="modal-actions">
        <button className="btn-outline" onClick={onClose}>{tCommon('cancel')}</button>
        <button className="btn-danger" onClick={onConfirm} disabled={isPending}>
          <Trash2 size={14} /><span>{tCommon('delete')}</span>
        </button>
      </div>
    </Dialog>
  );
}
