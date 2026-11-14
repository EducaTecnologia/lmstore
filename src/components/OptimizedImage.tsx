import React, { useEffect, useRef, useState } from 'react';
import { Package } from 'lucide-react';
import {
  buildImageSrcSet,
  getCategoryFallbackImage,
  isImageCachedInSession,
  markImageLoaded,
  optimizeImageUrl,
  releaseImageSlot,
  sanitizeImageUrl,
  scheduleImageLoad,
} from '../utils/imageOptimizer';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  sizes?: string;
  priority?: boolean;
  categoryHint?: string;
  fallbackSrc?: string;
  className?: string;
  imgClassName?: string;
  fit?: 'crop' | 'max' | 'clip';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 480,
  height,
  quality = 75,
  sizes,
  priority = false,
  categoryHint,
  fallbackSrc,
  className = '',
  imgClassName = 'w-full h-full object-cover object-center',
  fit = 'crop',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slotAcquiredRef = useRef(false);

  const sanitizedPrimary = sanitizeImageUrl(src, categoryHint);
  const optimizedPrimary = optimizeImageUrl(sanitizedPrimary, { width, height, quality, fit });
  const fallbackTarget = optimizeImageUrl(
    fallbackSrc || getCategoryFallbackImage(categoryHint),
    { width, height, quality: Math.max(65, quality - 5), fit }
  );

  const alreadyCached = isImageCachedInSession(optimizedPrimary);

  const [inView, setInView] = useState<boolean>(priority || alreadyCached);
  const [canFetch, setCanFetch] = useState<boolean>(priority || alreadyCached);
  const [activeSrc, setActiveSrc] = useState<string>(optimizedPrimary);
  const [triedFallback, setTriedFallback] = useState<boolean>(false);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    alreadyCached ? 'loaded' : 'loading'
  );

  // Sync when src prop changes (e.g. carousel slide switch)
  useEffect(() => {
    const nextPrimary = optimizeImageUrl(sanitizeImageUrl(src, categoryHint), {
      width,
      height,
      quality,
      fit,
    });
    const cached = isImageCachedInSession(nextPrimary);
    setActiveSrc(nextPrimary);
    setTriedFallback(false);
    setStatus(cached ? 'loaded' : 'loading');
    if (priority || cached) {
      setInView(true);
      setCanFetch(true);
    }
  }, [src, width, height, quality, fit, categoryHint, priority]);

  // IntersectionObserver lazy-loading trigger
  useEffect(() => {
    if (inView || priority) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, priority]);

  // Bounded concurrency queue to avoid browser socket congestion
  useEffect(() => {
    if (!inView || canFetch) return;

    const cancel = scheduleImageLoad(priority, () => {
      slotAcquiredRef.current = true;
      setCanFetch(true);
    });

    return () => {
      cancel();
      if (slotAcquiredRef.current) {
        slotAcquiredRef.current = false;
        releaseImageSlot();
      }
    };
  }, [inView, canFetch, priority]);

  const handleLoad = () => {
    markImageLoaded(activeSrc);
    setStatus('loaded');
    if (slotAcquiredRef.current) {
      slotAcquiredRef.current = false;
      releaseImageSlot();
    }
  };

  const handleError = () => {
    if (!triedFallback && activeSrc !== fallbackTarget) {
      setTriedFallback(true);
      setActiveSrc(fallbackTarget);
      return;
    }
    setStatus('error');
    if (slotAcquiredRef.current) {
      slotAcquiredRef.current = false;
      releaseImageSlot();
    }
  };

  const srcSet = canFetch
    ? buildImageSrcSet(triedFallback ? fallbackTarget : sanitizedPrimary, width, height, quality)
    : undefined;

  const hasPosition = /\b(absolute|fixed|sticky)\b/.test(className);

  return (
    <div ref={containerRef} className={`${hasPosition ? '' : 'relative '}overflow-hidden bg-slate-100 ${className}`}>
      {/* Clean Neutral Skeleton while fetching */}
      {status === 'loading' && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200/70 to-slate-100"
        />
      )}

      {/* Permanent architectural SVG fallback if offline or both images fail */}
      {status === 'error' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-3 text-center">
          <Package className="w-7 h-7 text-slate-300 mb-1" />
          <span className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-tight">
            {alt}
          </span>
        </div>
      ) : (
        canFetch && (
          <img
            src={activeSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            referrerPolicy="no-referrer"
            onLoad={handleLoad}
            onError={handleError}
            className={`${imgClassName} transition-opacity duration-300 ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )
      )}
    </div>
  );
};
