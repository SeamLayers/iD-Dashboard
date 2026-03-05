"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CloudUpload, Save, Building2, Phone, Mail, Linkedin, MapPin, RotateCcw } from 'lucide-react';

export default function TemplatesPage() {
  const t = useTranslations('CardBuilder');

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
              <img src={logoPreview} alt="Logo" className="cb-logo-preview" />
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

        {/* Displayed Fields */}
        <div className="cb-section">
          <h3 className="cb-section-title">{t('displayedFields')}</h3>
          <div className="cb-toggles">
            {[
              { key: 'phone', icon: <Phone size={16} />, label: t('phone') },
              { key: 'email', icon: <Mail size={16} />, label: t('email') },
              { key: 'linkedin', icon: <Linkedin size={16} />, label: t('linkedin') },
              { key: 'address', icon: <MapPin size={16} />, label: t('address') },
            ].map(item => (
              <div className="cb-toggle-row" key={item.key}>
                <div className="cb-toggle-info">
                  <span className="cb-toggle-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <button
                  className={`cb-switch ${fields[item.key] ? 'on' : ''}`}
                  onClick={() => toggleField(item.key)}
                  role="switch"
                  aria-checked={fields[item.key]}
                >
                  <span className="cb-switch-thumb" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cb-actions">
          <button className="btn-primary cb-btn-full">
            <Save size={16} />
            <span>{t('saveTemplate')}</span>
          </button>
          <button className="btn-outline cb-btn-full">
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
                      <img src={logoPreview} alt="Logo" className="cb-card-logo-img" />
                    ) : (
                      <span className="cb-card-logo-placeholder" style={{ color: primaryColor }}>iD+</span>
                    )}
                  </div>
                  <div className="cb-card-info">
                    <h3 className="cb-card-name">Ahmed Mohamed</h3>
                    <p className="cb-card-title" style={{ color: accentColor }}>Chief Technology Officer</p>
                  </div>
                  <div className="cb-card-fields">
                    {fields.phone && (
                      <div className="cb-card-field">
                        <Phone size={13} style={{ color: primaryColor }} />
                        <span>+966 50 123 4567</span>
                      </div>
                    )}
                    {fields.email && (
                      <div className="cb-card-field">
                        <Mail size={13} style={{ color: primaryColor }} />
                        <span>ahmed@mhawer.com</span>
                      </div>
                    )}
                    {fields.linkedin && (
                      <div className="cb-card-field">
                        <Linkedin size={13} style={{ color: primaryColor }} />
                        <span>linkedin.com/in/ahmed</span>
                      </div>
                    )}
                    {fields.address && (
                      <div className="cb-card-field">
                        <MapPin size={13} style={{ color: primaryColor }} />
                        <span>Riyadh, Saudi Arabia</span>
                      </div>
                    )}
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
