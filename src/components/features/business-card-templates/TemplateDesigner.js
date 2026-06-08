"use client";

import { useMemo, useRef, useState } from 'react';

const DEFAULT_DESIGN = {
  layout: 'modern',
  theme: { background: '#0B1220', text: '#FFFFFF', primary: '#0EA5E9', accent: '#22D3EE' },
  fields: { jobTitle: true, department: true, company: true, phone: true, email: true },
  logo: { show: true, position: 'top-left', url: '' },
  qr: { show: true, position: 'bottom-right' },
};

// Cap the inlined logo so the stored design_json stays small. A real logo
// belongs in object storage; data-URL inlining is fine for these templates.
const MAX_LOGO_BYTES = 300 * 1024;

const LAYOUTS = ['modern', 'classic', 'minimal'];
const LOGO_POSITIONS = ['top-left', 'top-center', 'top-right'];
const QR_POSITIONS = ['bottom-left', 'bottom-right'];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Merge a (possibly partial / legacy) parsed object over the defaults so old
// or incomplete design_json still renders. Does NOT mutate the user's stored
// JSON — only produces the object the controls/preview read from.
function mergeDefaults(parsed) {
  const base = deepClone(DEFAULT_DESIGN);
  if (!parsed || typeof parsed !== 'object') return base;

  if (LAYOUTS.includes(parsed.layout)) base.layout = parsed.layout;

  if (parsed.theme && typeof parsed.theme === 'object') {
    ['background', 'text', 'primary', 'accent'].forEach((k) => {
      if (typeof parsed.theme[k] === 'string' && parsed.theme[k]) base.theme[k] = parsed.theme[k];
    });
  }

  if (parsed.fields && typeof parsed.fields === 'object') {
    ['jobTitle', 'department', 'company', 'phone', 'email'].forEach((k) => {
      if (typeof parsed.fields[k] === 'boolean') base.fields[k] = parsed.fields[k];
    });
  }

  if (parsed.logo && typeof parsed.logo === 'object') {
    if (typeof parsed.logo.show === 'boolean') base.logo.show = parsed.logo.show;
    if (LOGO_POSITIONS.includes(parsed.logo.position)) base.logo.position = parsed.logo.position;
    if (typeof parsed.logo.url === 'string') base.logo.url = parsed.logo.url;
  }

  if (parsed.qr && typeof parsed.qr === 'object') {
    if (typeof parsed.qr.show === 'boolean') base.qr.show = parsed.qr.show;
    if (QR_POSITIONS.includes(parsed.qr.position)) base.qr.position = parsed.qr.position;
  }

  return base;
}

// Sample card content — mock data, intentionally NOT translated.
const SAMPLE = {
  name: 'Ahmed Al-Saud',
  jobTitle: 'Software Engineer',
  department: 'Engineering',
  company: 'Mimo',
  phone: '+966 55 010 0100',
  email: 'ahmed@mimo.com',
};

function ColorRow({ label, value, onChange }) {
  const inputRef = useRef(null);
  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') {
      el.showPicker();
      return;
    }
    el.click();
  };
  const safe = typeof value === 'string' && value ? value : '#000000';
  return (
    <div className="cb-color-row">
      <span className="cb-color-label">{label}</span>
      <button type="button" className="cb-color-pick" onClick={openPicker}>
        <div className="cb-swatch" style={{ background: safe }} />
        <input
          ref={inputRef}
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value)}
          className="cb-color-input"
        />
        <span className="cb-color-hex">{safe.toUpperCase()}</span>
      </button>
    </div>
  );
}

function PreviewCard({ t, design }) {
  const { theme, fields, logo, qr } = design;
  const layout = LAYOUTS.includes(design.layout) ? design.layout : 'modern';
  const isMinimal = layout === 'minimal';
  const isClassic = layout === 'classic';

  const logoStyle = (() => {
    if (logo.position === 'top-center') return { top: 12, left: '50%', transform: 'translateX(-50%)' };
    if (logo.position === 'top-right') return { top: 12, right: 12 };
    return { top: 12, left: 12 };
  })();

  const qrStyle = qr.position === 'bottom-left' ? { bottom: 12, left: 12 } : { bottom: 12, right: 12 };

  const textBlock = (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: isClassic ? 'center' : 'flex-start',
        textAlign: isClassic ? 'center' : 'start',
        maxWidth: '78%',
      }}
    >
      <span
        className="bcd-name"
        style={{
          color: theme.text,
          fontFamily: isClassic ? 'Georgia, "Times New Roman", serif' : 'inherit',
          borderBottom: layout === 'modern' ? `2px solid ${theme.accent}` : 'none',
          paddingBottom: layout === 'modern' ? 3 : 0,
        }}
      >
        {SAMPLE.name}
      </span>
      {fields.jobTitle && (
        <span className="bcd-line" style={{ color: theme.primary, fontWeight: 600 }}>{SAMPLE.jobTitle}</span>
      )}
      {fields.department && (
        <span className="bcd-line" style={{ color: theme.text, opacity: 0.85 }}>{SAMPLE.department}</span>
      )}
      {fields.company && (
        <span className="bcd-line" style={{ color: theme.text, opacity: 0.85 }}>{SAMPLE.company}</span>
      )}
      {fields.phone && (
        <span className="bcd-line" style={{ color: theme.text, opacity: 0.7 }}>{SAMPLE.phone}</span>
      )}
      {fields.email && (
        <span className="bcd-line" style={{ color: theme.text, opacity: 0.7 }}>{SAMPLE.email}</span>
      )}
    </div>
  );

  return (
    <div className="bcd-preview-wrap">
      <span className="bcd-preview-caption">{t('preview')}</span>
      <div
        className="bcd-preview-card"
        style={{
          background: theme.background,
          color: theme.text,
          justifyContent: isClassic ? 'center' : 'flex-end',
          alignItems: isClassic ? 'center' : 'flex-start',
        }}
      >
        {layout === 'modern' && (
          <span style={{ position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: 6, background: theme.accent }} />
        )}
        {isClassic && (
          <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: theme.primary }} />
        )}

        {logo.show && (logo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.url}
            alt="logo"
            className="bcd-logo-img"
            style={{ position: 'absolute', ...logoStyle }}
          />
        ) : (
          <div className="bcd-logo-ph" style={{ ...logoStyle, borderColor: theme.accent, color: theme.accent }}>
            LOGO
          </div>
        ))}

        {qr.show && (
          <div className="bcd-qr-ph" style={{ ...qrStyle, borderColor: theme.text }} aria-hidden="true">
            <span /><span /><span /><span />
          </div>
        )}

        {textBlock}
      </div>
    </div>
  );
}

export function TemplateDesigner({ t, value, onChange, error }) {
  const [tab, setTab] = useState('design');
  const [logoError, setLogoError] = useState(null);

  const { design, parseOk } = useMemo(() => {
    const raw = typeof value === 'string' ? value : '';
    if (!raw.trim()) {
      return { design: deepClone(DEFAULT_DESIGN), parseOk: true };
    }
    try {
      const parsed = JSON.parse(raw);
      return { design: mergeDefaults(parsed), parseOk: true };
    } catch {
      return { design: deepClone(DEFAULT_DESIGN), parseOk: false };
    }
  }, [value]);

  // Build the next object from the current working design, then push the
  // stringified result up to the parent. The parent's string stays the single
  // source of truth, so the JSON tab and Design tab can never diverge.
  const emit = (next) => {
    onChange(JSON.stringify(next, null, 2));
  };

  const setLayout = (layout) => emit({ ...design, layout });
  const setTheme = (key, val) => emit({ ...design, theme: { ...design.theme, [key]: val } });
  const setField = (key, val) => emit({ ...design, fields: { ...design.fields, [key]: val } });
  const setLogoShow = (val) => emit({ ...design, logo: { ...design.logo, show: val } });
  const setLogoPos = (val) => emit({ ...design, logo: { ...design.logo, position: val } });
  const setLogoUrl = (val) => emit({ ...design, logo: { ...design.logo, url: val } });

  const onLogoFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // let the same file be re-picked after a remove
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError(t('logoTooLarge'));
      return;
    }
    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };
  const setQrShow = (val) => emit({ ...design, qr: { ...design.qr, show: val } });
  const setQrPos = (val) => emit({ ...design, qr: { ...design.qr, position: val } });

  const fieldRows = [
    ['jobTitle', t('fieldJobTitle')],
    ['department', t('fieldDepartment')],
    ['company', t('fieldCompany')],
    ['phone', t('fieldPhone')],
    ['email', t('fieldEmail')],
  ];

  return (
    <div className="bcd-root">
      <div className="bcd-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'design'}
          className={`bcd-tab${tab === 'design' ? ' active' : ''}`}
          onClick={() => setTab('design')}
        >
          {t('tabDesign')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'json'}
          className={`bcd-tab${tab === 'json' ? ' active' : ''}`}
          onClick={() => setTab('json')}
        >
          {t('tabJson')}
        </button>
      </div>

      {tab === 'design' ? (
        <div className="bcd-grid">
          <div className="bcd-controls">
            {!parseOk && (
              <p className="bcd-parse-warning">{t('designJsonInvalid')}</p>
            )}

            <div className="bcd-section">
              <span className="bcd-section-label">{t('layout')}</span>
              <div className="bcd-seg" role="group">
                {LAYOUTS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`bcd-seg-btn${design.layout === l ? ' active' : ''}`}
                    onClick={() => setLayout(l)}
                  >
                    {t(`layout${l.charAt(0).toUpperCase()}${l.slice(1)}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bcd-section">
              <span className="bcd-section-label">{t('themeColors')}</span>
              <div className="cb-colors">
                <ColorRow label={t('bgColor')} value={design.theme.background} onChange={(v) => setTheme('background', v)} />
                <ColorRow label={t('textColor')} value={design.theme.text} onChange={(v) => setTheme('text', v)} />
                <ColorRow label={t('primaryColor')} value={design.theme.primary} onChange={(v) => setTheme('primary', v)} />
                <ColorRow label={t('accentColor')} value={design.theme.accent} onChange={(v) => setTheme('accent', v)} />
              </div>
            </div>

            <div className="bcd-section">
              <span className="bcd-section-label">{t('fieldsSection')}</span>
              <div className="bcd-checks">
                <label className="modal-checkbox bcd-check-locked">
                  <input type="checkbox" checked disabled readOnly />
                  <span>{t('nameAlwaysShown')}</span>
                </label>
                {fieldRows.map(([key, label]) => (
                  <label className="modal-checkbox" key={key}>
                    <input
                      type="checkbox"
                      checked={Boolean(design.fields[key])}
                      onChange={(e) => setField(key, e.target.checked)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bcd-section">
              <span className="bcd-section-label">{t('logoSection')}</span>
              <label className="modal-checkbox">
                <input type="checkbox" checked={Boolean(design.logo.show)} onChange={(e) => setLogoShow(e.target.checked)} />
                <span>{t('showLogo')}</span>
              </label>
              {design.logo.show && (
                <>
                  <div className="bcd-logo-upload">
                    {design.logo.url ? (
                      <div className="bcd-logo-current">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={design.logo.url} alt="logo" className="bcd-logo-thumb" />
                        <button type="button" className="btn-outline bcd-logo-remove" onClick={() => setLogoUrl('')}>
                          {t('removeLogo')}
                        </button>
                      </div>
                    ) : (
                      <label className="btn-outline bcd-logo-btn">
                        {t('uploadLogo')}
                        <input type="file" accept="image/*" hidden onChange={onLogoFile} />
                      </label>
                    )}
                  </div>
                  {logoError && <small className="bcd-logo-error">{logoError}</small>}
                  <select className="modal-input bcd-pos-select" value={design.logo.position} onChange={(e) => setLogoPos(e.target.value)}>
                    <option value="top-left">{t('posTopLeft')}</option>
                    <option value="top-center">{t('posTopCenter')}</option>
                    <option value="top-right">{t('posTopRight')}</option>
                  </select>
                </>
              )}
            </div>

            <div className="bcd-section">
              <span className="bcd-section-label">{t('qrSection')}</span>
              <label className="modal-checkbox">
                <input type="checkbox" checked={Boolean(design.qr.show)} onChange={(e) => setQrShow(e.target.checked)} />
                <span>{t('showQr')}</span>
              </label>
              {design.qr.show && (
                <select className="modal-input bcd-pos-select" value={design.qr.position} onChange={(e) => setQrPos(e.target.value)}>
                  <option value="bottom-left">{t('posBottomLeft')}</option>
                  <option value="bottom-right">{t('posBottomRight')}</option>
                </select>
              )}
            </div>
          </div>

          <PreviewCard t={t} design={design} />
        </div>
      ) : (
        <div className="bcd-json">
          <textarea
            className="modal-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={'{\n  "layout": "modern"\n}'}
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t('designJsonHint')}</small>
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4 }}>{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
