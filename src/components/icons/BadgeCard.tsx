import React, { memo } from 'react';
import { ManifestEntry, useIconStore } from '@/store/useIconStore';

interface BadgeCardProps {
  entry: ManifestEntry;
  onOpenModal: (entry: ManifestEntry) => void;
}

export const BadgeCard = memo(({ entry, onOpenModal }: BadgeCardProps) => {
  const { selectedIds, toggleSelect, getIcon, iconColor, showBorder, borderWidth } = useIconStore();
  const isSelected = selectedIds.has(entry.id);
  const iconData = getIcon(entry.id);

  // Clean title for display
  const title = entry.n.replace(/^Badge\s+/i, '');

  return (
    <div
      onClick={() => onOpenModal(entry)}
      className={`
        group relative flex flex-col items-center justify-between p-3.5 rounded-2xl
        bg-[var(--bg-card)] hover:bg-white/[0.08] transition-all duration-300 cursor-pointer
        text-center overflow-hidden h-44 w-36 select-none rounded-2xl
        ${isSelected ? 'ring-2 ring-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : ''}
        hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--accent)]/10
      `}
      style={{
        borderWidth: '0px',
      }}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-10 -left-10 w-28 h-28 bg-[var(--accent)]/10 rounded-full blur-xl group-hover:bg-[var(--accent)]/20 transition-all" />

      {/* Select checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSelect(entry.id);
        }}
        className={`
          absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-md flex items-center justify-center
          transition-all text-xs font-bold
          ${isSelected ? 'bg-[var(--accent)] text-black shadow-md' : 'opacity-0 group-hover:opacity-100 bg-white/10 text-white/70 hover:bg-white/20'}
        `}
        aria-label={`Select ${entry.n}`}
      >
        {isSelected && '✓'}
      </button>

      {/* Badge Graphic Rendering Container */}
      <div className="relative z-0 flex-1 flex items-center justify-center w-full py-2">
        {iconData?.svgContent ? (
          <div
            className="w-20 h-20 flex items-center justify-center drop-shadow-md group-hover:scale-110 transition-transform duration-300"
            dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${iconData.viewBox || '0 0 100 100'}" class="w-full h-full">${iconData.svgContent}</svg>`
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-white/5 animate-pulse flex items-center justify-center text-xs text-[var(--text-muted)]">
            🛡️
          </div>
        )}
      </div>

      {/* Label and Badge Tag */}
      <div className="w-full pt-1 z-10 flex flex-col items-center">
        <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-full group-hover:text-[var(--accent)] transition-colors">
          {title}
        </span>
        <span className="text-[10px] text-[var(--text-muted)] tracking-tight font-mono mt-0.5 opacity-80">
          Badge SVG
        </span>
      </div>
    </div>
  );
});

BadgeCard.displayName = 'BadgeCard';
export default BadgeCard;
