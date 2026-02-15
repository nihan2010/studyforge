/**
 * StudyForge logo. Uses /logo.png when available; falls back to inline SVG.
 * Responsive, maintains aspect ratio, works in dark mode.
 */
import { useState } from 'react';

const GREEN = '#52C37E';
const GREEN_DARK = '#2d8a54';

function LogoIconSVG({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden
    >
      <path d="M8 6v28l4-2 8 2 8-2 4 2V6l-4 2-8-2-8 2-4-2z" stroke={GREEN_DARK} strokeWidth="1.5" fill="none" />
      <path d="M12 8h6v20h-6z" fill={GREEN} opacity="0.9" />
      <path d="M22 8h6v8l-2 6 2 6v8h-6V8z" fill={GREEN} />
      <path d="M24 12l2 4-2 4-2-4 2-4z" fill="#0f0f0f" opacity="0.2" />
    </svg>
  );
}

export function Logo({ variant = 'full', className = '' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const isCompact = variant === 'compact';
  const size = isCompact ? 28 : 36;

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      <span className="inline-block shrink-0" style={{ width: size, height: size }}>
        {!imgFailed ? (
          <img
            src="/logo.png"
            alt=""
            width={size}
            height={size}
            className="w-full h-full object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <LogoIconSVG size={size} />
        )}
      </span>
      {variant !== 'icon' && (
        <span className="font-brand font-bold text-white uppercase tracking-tight text-base whitespace-nowrap">
          StudyForge
        </span>
      )}
    </div>
  );
}
