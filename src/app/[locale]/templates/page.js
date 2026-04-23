"use client";
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { TemplateEditorPanel, TemplatePreviewPanel } from '@/components/features/templates/TemplateSections';

export default function TemplatesPage() {
  const t = useTranslations('CardBuilder');
  const tDemo = useTranslations('Demo');

  const [primaryColor, setPrimaryColor] = useState('#66FCF1');
  const [accentColor, setAccentColor] = useState('#45A29E');
  const [logoPreview, setLogoPreview] = useState(null);
  const primaryColorInputRef = useRef(null);
  const accentColorInputRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openColorPicker = (inputRef) => {
    if (!inputRef.current) {
      return;
    }
    if (typeof inputRef.current.showPicker === 'function') {
      inputRef.current.showPicker();
      return;
    }
    inputRef.current.click();
  };

  return (
    <div className="cb-layout">
      <TemplateEditorPanel
        t={t}
        tDemo={tDemo}
        logoPreview={logoPreview}
        primaryColor={primaryColor}
        accentColor={accentColor}
        primaryColorInputRef={primaryColorInputRef}
        accentColorInputRef={accentColorInputRef}
        handleLogoUpload={handleLogoUpload}
        openColorPicker={openColorPicker}
        setPrimaryColor={setPrimaryColor}
        setAccentColor={setAccentColor}
      />

      <TemplatePreviewPanel
        t={t}
        logoPreview={logoPreview}
        primaryColor={primaryColor}
        accentColor={accentColor}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />
    </div>
  );
}
