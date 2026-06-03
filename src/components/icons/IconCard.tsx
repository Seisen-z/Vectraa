import React, { memo, useState, useCallback } from 'react';
import { useIconStore, type ManifestEntry } from '@/store/useIconStore';
import { NEON_HEX } from '@/data/iconTypes';

interface Props {
  entry: ManifestEntry;
  onOpenModal: (entry: ManifestEntry) => void;
}

function PlaceholderIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3"
        stroke={color} strokeWidth="1" strokeDasharray="3 2" opacity="0.25"/>
    </svg>
  );
}

const IconCard = memo(({ entry, onOpenModal }: Props) => {
  const [hovered, setHovered] = useState(false);
  const { selectedIds, toggleSelect, getIcon, iconColor, showBorder } = useIconStore();

  const isSelected = selectedIds.has(entry.id);
  const fullIcon   = getIcon(entry.id);
  const neonColor  = NEON_HEX[entry.l] ?? '#00B4FF';
  const svgColor   = iconColor || neonColor;

  const handleCheck = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelect(entry.id);
  }, [entry.id, toggleSelect]);

  const handleClick = useCallback(() => onOpenModal(entry), [entry, onOpenModal]);

  const borderStyle = showBorder
    ? `1.5px solid ${hovered || isSelected ? svgColor : `${svgColor}50`}`
    : `1.5px solid ${hovered ? `${svgColor}25` : isSelected ? `${svgColor}40` : 'transparent'}`;

  const bgStyle = isSelected
    ? `${svgColor}18`
    : hovered
      ? `${svgColor}0C`
      : 'transparent';

  return (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${entry.n} icon`}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      {/* Card */}
      <div
        className="relative flex items-center justify-center rounded-xl transition-all duration-150"
        style={{
          width: '72px',
          height: '72px',
          background: bgStyle,
          border: borderStyle,
          transform: hovered ? 'scale(1.05)' : isSelected ? 'scale(0.96)' : 'scale(1)',
        }}
      >
        {/* Checkbox */}
        <div
          className={`absolute top-1 left-1 z-10 transition-opacity duration-100 ${hovered || isSelected ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleCheck}
        >
          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
            isSelected ? 'border-white bg-white' : 'border-white/30 bg-black/20 hover:border-white/60'
          }`}>
            {isSelected && (
              <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>

        {/* Icon */}
        {fullIcon ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={fullIcon.viewBox}
            width="38"
            height="38"
            fill="currentColor"
            style={{ color: svgColor }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: fullIcon.svgContent }}
          />
        ) : (
          <PlaceholderIcon color={neonColor} />
        )}
      </div>

      {/* Label */}
      <span
        className="text-[9px] font-medium text-center leading-tight max-w-[80px] truncate block transition-colors duration-150"
        style={{ color: hovered ? 'var(--text-secondary)' : 'var(--text-muted)' }}
        title={entry.n}
      >
        {entry.n}
      </span>
    </div>
  );
});

IconCard.displayName = 'IconCard';
export default IconCard;
