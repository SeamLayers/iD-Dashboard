"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Pagination({ meta, onPageChange }) {
  const t = useTranslations('Common');
  if (!meta) return null;

  const { current_page = 1, last_page = 1, from = 0, to = 0, total = 0 } = meta;
  if (last_page <= 1) return null;

  const pages = [];
  const start = Math.max(1, current_page - 2);
  const end = Math.min(last_page, current_page + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="pagination">
      <span className="pagination-info">
        {t('showing', { from, to, total })}
      </span>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
          aria-label={t('previous')}
        >
          <ChevronLeft size={16} />
        </button>
        {start > 1 && (
          <>
            <button className="pagination-btn" onClick={() => onPageChange(1)}>1</button>
            {start > 2 && <span className="pagination-btn" style={{ border: 'none' }}>…</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === current_page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {end < last_page && (
          <>
            {end < last_page - 1 && <span className="pagination-btn" style={{ border: 'none' }}>…</span>}
            <button className="pagination-btn" onClick={() => onPageChange(last_page)}>{last_page}</button>
          </>
        )}
        <button
          className="pagination-btn"
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
          aria-label={t('next')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
