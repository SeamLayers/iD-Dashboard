"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Mail, Phone, Pencil, Trash2, Upload, X, Plus, Check, Loader2 } from 'lucide-react';
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
  const [userId, setUserId] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name || '');
    setEmail(initial?.email || '');
    setPhone(initial?.phone || '');
    setCommercialRegister(initial?.commercial_register || '');
    setUserId(initial?.owner?.id ? String(initial.owner.id) : (initial?.user_id ? String(initial.user_id) : ''));
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
      user_id: userId || undefined,
    };
    if (logo) payload.logo = logo;
    onSubmit(payload);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} panelClassName="modal-box glass-panel modal-form">
      <div className="modal-header">
        <h3 className="modal-title">{isEdit ? t('editCompany') : t('addCompany')}</h3>
        <button className="modal-close" onClick={onClose} type="button"><X size={18} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label>{t('name')}</label>
          <input className="modal-input" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('email')}</label>
          <input className="modal-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('phone')}</label>
          <input className="modal-input" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('commercialRegister')}</label>
          <input className="modal-input" value={commercialRegister} onChange={(e) => setCommercialRegister(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>{t('userId')}</label>
          <input className="modal-input" type="number" required={!isEdit} value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="2" />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('userIdHint')}</small>
        </div>
        <div className="modal-field">
          <label>{t('logo')}</label>
          <label className="file-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFile}
            />
            <div className="file-upload-icon"><Upload size={20} /></div>
            <div className="file-upload-text">
              <span>{logo?.name || (logoPreview ? 'Replace logo' : t('uploadLogo'))}</span>
              <small>{t('uploadHint')}</small>
            </div>
          </label>
          {logoPreview && (
            <div className="file-preview">
              <img src={logoPreview} alt="Preview" />
              <small style={{ color: 'var(--text-muted)' }}>{logo?.name || 'Current logo'}</small>
            </div>
          )}
        </div>
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
