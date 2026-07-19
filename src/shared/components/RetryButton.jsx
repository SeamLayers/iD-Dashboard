"use client";

import { useTranslations } from 'next-intl';
import { RefreshCcw } from 'lucide-react';

/**
 * Branded, consistent retry button for every list/section error state.
 *
 * Replaces the old inconsistent retry controls: a low-contrast text-only
 * `.btn-outline` in error panels and an *undefined* `.btn-secondary` (which
 * fell back to the raw browser button) in page headers.
 *
 * @param {() => void} onClick   usually a React Query refetch()
 * @param {boolean} loading      spins the icon and blocks repeat clicks
 * @param {'solid'|'ghost'} variant  'solid' for header actions, 'ghost' inside an error panel
 */
export default function RetryButton({ onClick, loading = false, variant = 'ghost', className = '' }) {
  const tCommon = useTranslations('Common');
  return (
    <button
      type="button"
      className={`btn-retry btn-retry-${variant}${loading ? ' is-loading' : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={loading}
    >
      <RefreshCcw size={16} className="btn-retry-icon" aria-hidden="true" />
      <span>{tCommon('retry')}</span>
    </button>
  );
}
