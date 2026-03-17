"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { CloudUpload, Save, Building2, RotateCcw } from 'lucide-react';

export default function TemplatesPage() {
  const t = useTranslations('CardBuilder');
  const tDemo = useTranslations('Demo');

  const [primaryColor, setPrimaryColor] = useState('#66FCF1');
  const [accentColor, setAccentColor] = useState('#45A29E');
  const [logoPreview, setLogoPreview] = useState(null);
  const [fields, setFields] = useState({
    phone: true,
    email: true,
    linkedin: true,
    address: false,
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleField = (key) => {
    setFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="cb-layout">
      {/* ══════ Left Panel ══════ */}
      <div className="cb-panel glass-panel">
        <div className="cb-panel-header">
          <h2 className="cb-panel-title text-gradient">{t('title')}</h2>
          <p className="cb-panel-sub">{t('subtitle')}</p>
        </div>

        {/* Brand Identity */}
        <div className="cb-section">
          <h3 className="cb-section-title">{t('brandIdentity')}</h3>
          <label className="cb-upload-area" htmlFor="logo-upload">
            {logoPreview ? (
              <Image src={logoPreview} alt="Company logo" className="cb-logo-preview" width={120} height={80} unoptimized />
            ) : (
              <>
                <CloudUpload size={32} className="cb-upload-icon" />
                <span className="cb-upload-text">{t('uploadLogo')}</span>
                <span className="cb-upload-hint">{t('uploadHint')}</span>
              </>
            )}
            <input type="file" id="logo-upload" accept="image/*" hidden onChange={handleLogoUpload} />
          </label>
        </div>

        {/* Color Theme */}
        <div className="cb-section">
          <h3 className="cb-section-title">{t('colorTheme')}</h3>
          <div className="cb-colors">
            <div className="cb-color-row">
              <span className="cb-color-label">{t('primaryColor')}</span>
              <div className="cb-color-pick">
                <div className="cb-swatch" style={{ background: primaryColor }} />
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="cb-color-input" />
                <span className="cb-color-hex">{primaryColor.toUpperCase()}</span>
              </div>
            </div>
            <div className="cb-color-row">
              <span className="cb-color-label">{t('accentColor')}</span>
              <div className="cb-color-pick">
                <div className="cb-swatch" style={{ background: accentColor }} />
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="cb-color-input" />
                <span className="cb-color-hex">{accentColor.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Displayed Fields (Removed for Base Template) */}
        <div className="cb-section">
          <h3 className="cb-section-title" style={{ color: 'var(--text-muted)' }}>{t('displayedFields')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.5' }}>
            Employees will customize their personal details (Phone, Email, LinkedIn, Address) directly from the mobile app.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="cb-actions">
          <button className="btn-primary cb-btn-full transition-all duration-300" onClick={() => toast.success(tDemo('templateSaved'))}>
            <Save size={16} />
            <span>{t('saveTemplate')}</span>
          </button>
          <button className="btn-outline cb-btn-full transition-all duration-300" onClick={() => toast.success(tDemo('templateAssigned'))}>
            <Building2 size={16} />
            <span>{t('assignDepartment')}</span>
          </button>
        </div>
      </div>

      {/* ══════ Right Panel – 3D Preview ══════ */}
      <div className="cb-preview">
        <div className="cb-preview-bg">
          {/* Ambient orbs */}
          <div className="cb-orb cb-orb-1" style={{ background: primaryColor }} />
          <div className="cb-orb cb-orb-2" style={{ background: accentColor }} />

          <div className="cb-stage">
            <button className="cb-flip-btn" onClick={() => setIsFlipped(!isFlipped)} title={t('flipCard')}>
              <RotateCcw size={18} />
            </button>
            <div className={`cb-card-3d ${isFlipped ? 'flipped' : ''}`}>
              {/* ─── Front ─── */}
              <div className="cb-card cb-card-front" style={{ borderColor: primaryColor, '--card-glow': primaryColor }}>
                <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }} />
                <div className="cb-card-body">
                  <div className="cb-card-logo-area">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Company logo" className="cb-card-logo-img" width={112} height={28} unoptimized />
                    ) : (
                      <span className="cb-card-logo-placeholder" style={{ color: primaryColor }}>iD+</span>
                    )}
                  </div>
                  <div className="cb-card-info">
                    <h3 className="cb-card-name" style={{ color: 'var(--text-primary)', opacity: 0.5 }}>[ Employee Name ]</h3>
                    <p className="cb-card-title" style={{ color: accentColor, opacity: 0.7 }}>[ Job Title ]</p>
                  </div>
                  <div className="cb-card-fields" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.5 }}>
                    <div className="cb-card-field" style={{ background: 'var(--overlay-white)', padding: '0.5rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>+ [ Phone Number ]</span>
                    </div>
                    <div className="cb-card-field" style={{ background: 'var(--overlay-white)', padding: '0.5rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@ [ Email Address ]</span>
                    </div>
                    <div className="cb-card-field" style={{ background: 'var(--overlay-white)', padding: '0.5rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>in/ [ LinkedIn Profile ]</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Back ─── */}
              <div className="cb-card cb-card-back" style={{ borderColor: primaryColor, '--card-glow': primaryColor }}>
                <div className="cb-card-top-line" style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor})` }} />
                <div className="cb-card-back-content">
                  <span className="cb-card-logo-placeholder cb-back-logo" style={{ color: primaryColor }}>iD+</span>
                  <div className="cb-qr-placeholder" style={{ borderColor: `${primaryColor}44` }}>
                    {/* QR Grid */}
                    <svg viewBox="0 0 80 80" className="cb-qr-svg">
                      <rect x="4" y="4" width="20" height="20" rx="3" fill={primaryColor} opacity="0.8" />
                      <rect x="56" y="4" width="20" height="20" rx="3" fill={primaryColor} opacity="0.8" />
                      <rect x="4" y="56" width="20" height="20" rx="3" fill={primaryColor} opacity="0.8" />
                      <rect x="30" y="4" width="8" height="8" rx="1" fill={accentColor} opacity="0.6" />
                      <rect x="42" y="4" width="8" height="8" rx="1" fill={accentColor} opacity="0.6" />
                      <rect x="30" y="16" width="8" height="8" rx="1" fill={accentColor} opacity="0.4" />
                      <rect x="4" y="30" width="8" height="8" rx="1" fill={accentColor} opacity="0.6" />
                      <rect x="16" y="30" width="8" height="8" rx="1" fill={accentColor} opacity="0.4" />
                      <rect x="30" y="30" width="20" height="20" rx="3" fill={primaryColor} opacity="0.7" />
                      <rect x="56" y="30" width="8" height="8" rx="1" fill={accentColor} opacity="0.5" />
                      <rect x="68" y="30" width="8" height="8" rx="1" fill={accentColor} opacity="0.4" />
                      <rect x="56" y="42" width="8" height="8" rx="1" fill={accentColor} opacity="0.6" />
                      <rect x="30" y="56" width="8" height="8" rx="1" fill={accentColor} opacity="0.5" />
                      <rect x="42" y="56" width="8" height="8" rx="1" fill={accentColor} opacity="0.4" />
                      <rect x="56" y="56" width="20" height="20" rx="3" fill={primaryColor} opacity="0.6" />
                      <rect x="30" y="68" width="8" height="8" rx="1" fill={accentColor} opacity="0.6" />
                      <rect x="4" y="42" width="8" height="8" rx="1" fill={accentColor} opacity="0.4" />
                      <rect x="68" y="56" width="8" height="8" rx="1" fill={accentColor} opacity="0.3" />
                      <rect x="42" y="42" width="8" height="8" rx="1" fill={accentColor} opacity="0.3" />
                    </svg>
                  </div>
                  <p className="cb-card-scan-text" style={{ color: accentColor }}>{t('scanToConnect')}</p>
                  <p className="cb-card-powered">Powered by <span style={{ color: primaryColor }}>iD+</span></p>
                </div>
              </div>
            </div>

            {/* Reflection */}
            <div className="cb-reflection" />
          </div>
        </div>
      </div>
    </div>
  );
}
