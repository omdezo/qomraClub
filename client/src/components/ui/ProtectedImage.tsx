'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProtectedImageProps {
  src: string;
  alt?: string;
  className?: string;
  /** Aspect ratio like "16/9", "4/5", "1/1". If omitted, fills parent. */
  aspectRatio?: string;
  /** object-fit value for the background image. Default: cover */
  fit?: 'cover' | 'contain' | 'fill';
  /** Watermark text overlay (subtle, repeated) */
  watermark?: string;
  /** Use eager loading (above-the-fold images) */
  eager?: boolean;
  style?: CSSProperties;
}

/**
 * Photo display that blocks the common ways to save images:
 *  - Renders via CSS background-image (no draggable <img> source in DOM tree)
 *  - Transparent overlay catches right-click, drag, long-press
 *  - oncontextmenu / ondragstart / -webkit-touch-callout blocked
 *  - Optional repeating watermark for visible deterrent
 */
export default function ProtectedImage({
  src,
  alt = '',
  className,
  aspectRatio,
  fit = 'cover',
  watermark,
  eager = false,
  style,
}: ProtectedImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Preload (so background-image shows fast even though it's not in <img>)
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    if (eager) img.fetchPriority = 'high' as any;
  }, [src, eager]);

  const baseStyle: CSSProperties = {
    backgroundImage: `url(${src})`,
    backgroundSize: fit,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    aspectRatio: aspectRatio || undefined,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    ...style,
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt}
      className={cn('protected-image relative', className)}
      style={baseStyle}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Transparent shield — catches right-click + long-press on top of the image */}
      <div
        className="absolute inset-0"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          // Block middle-click "open in new tab"
          if (e.button === 1) e.preventDefault();
        }}
      />

      {/* Optional repeating watermark */}
      {watermark && (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="text-white/[0.07] text-xs tracking-[0.4em] uppercase whitespace-nowrap"
            style={{
              transform: 'rotate(-30deg) scale(2)',
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent 0, transparent 60px, rgba(255,255,255,0.04) 60px, rgba(255,255,255,0.04) 61px)',
            }}
          >
            {`${watermark}  ·  ${watermark}  ·  ${watermark}  ·  ${watermark}`}
          </div>
        </div>
      )}
    </div>
  );
}
