/**
 * IconCard.tsx
 * Matches the reference style:
 *   - Rounded square with 2px solid neon border
 *   - Very dark background with subtle neon colour tint inside
 *   - Large icon centred, coloured in the card's neon colour
 *   - Small label underneath
 *   - Checkbox top-left on hover, download top-right on hover
 */
import React, { memo, useState, useCallback } from 'react';
import { useIconStore, type ManifestEntry } from '@/store/useIconStore';
import { NEON_HEX } from '@/data/iconTypes';

interface Props {
  entry: ManifestEntry;
  onOpenModal: (entry: ManifestEntry) => void;
}


function PlaceholderIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3"
        stroke={color} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.3"/>
    </svg>
  );
}

const IconCard = memo(({ entry, onOpenModal }: Props) => {
  const [hovered, setHovered]           = useState(false);

  const { selectedIds, toggleSelect, getIcon, iconColor, showBorder } = useIconStore();

  const isSelected = selectedIds.has(entry.id);
  const fullIcon   = getIcon(entry.id);
  const neonColor  = NEON_HEX[entry.l] ?? '#00B4FF';
  // Use global color override if set, else use per-card neon colour
  const svgColor   = iconColor || neonColor;

  const handleCheck = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelect(entry.id);
  }, [entry.id, toggleSelect]);

  const handleClick = useCallback(() => {
    onOpenModal(entry);
  }, [entry, onOpenModal]);

  return (
    <div
      className={`flex flex-col items-center gap-1.5 cursor-pointer relative ${hovered ? 'z-40' : 'z-0'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${entry.n} icon`}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      {/* ── Card ─────────────────────────────────────────── */}
      <div
        className={`relative flex items-center justify-center transition-all duration-200 ${
          showBorder ? 'rounded-[18px] border-[3px]' : 'rounded-xl'
        }`}
        style={{
          width:  '88px',
          height: '88px',
          borderColor: showBorder ? svgColor : 'transparent',
          background: showBorder
            ? isSelected
              ? `${svgColor}28`
              : `linear-gradient(135deg, ${svgColor}14 0%, var(--bg-card) 60%)`
            : isSelected
              ? `${svgColor}22`
              : 'transparent',
          boxShadow: showBorder
            ? hovered
              ? `0 0 18px 3px ${svgColor}44, inset 0 0 12px ${svgColor}10`
              : isSelected
                ? `0 0 12px 2px ${svgColor}55`
                : 'none'
            : hovered
              ? `0 0 12px 2px ${svgColor}22`
              : 'none',
          transform: hovered ? 'scale(1.06)' : isSelected ? 'scale(0.96)' : 'scale(1)',
        }}
      >
        {/* Checkbox — top-left on hover/select */}
        <div
          className={`absolute top-1.5 left-1.5 z-10 transition-opacity duration-150 ${hovered || isSelected ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleCheck}
        >
          <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${
            isSelected
              ? 'border-white bg-white'
              : 'border-white/40 bg-black/30 hover:border-white/70'
          }`}>
            {isSelected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>


        {/* Icon SVG — large, coloured */}
        {fullIcon ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={fullIcon.viewBox}
            width="54"
            height="54"
            fill="currentColor"
            style={{ color: svgColor }}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: fullIcon.svgContent }}
          />
        ) : (
          <PlaceholderIcon color={neonColor} />
        )}
      </div>

      {/* ── Label ──────────────────────────────────────────── */}
      <span
        className="text-[10px] font-semibold text-center leading-tight max-w-[88px] truncate block"
        style={{ color: neonColor }}
        title={entry.n}
      >
        {entry.n}
      </span>
    </div>
  );
});

IconCard.displayName = 'IconCard';
export default IconCard;
