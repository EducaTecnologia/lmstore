/**
 * Image optimization, automatic resizing, responsive srcSet generation,
 * verified construction fallbacks, and bounded concurrent image loading queue
 * to prevent mobile browser socket saturation and broken image cards.
 */

export interface ImageOptimizeOptions {
  width: number;
  height?: number;
  quality?: number;
  fit?: 'crop' | 'max' | 'clip';
}

const VERIFIED_CATEGORY_FALLBACKS: Record<string, string> = {
  'cat-estrutura': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=75',
  'estrutura': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=75',
  'cat-hidraulica': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=75',
  'hidraulica': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=75',
  'cat-eletrica': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=75',
  'eletrica': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=75',
  'cat-acabamento': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=75',
  'acabamento': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=75',
  'cat-tintas': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=75',
  'tintas': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=75',
  'cat-coberturas': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=75',
  'coberturas': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=75',
  'cat-ferramentas': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=75',
  'ferramentas': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=75',
  'banner': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=75',
};

// Known dead/broken Unsplash URLs mapped automatically to verified construction assets
const KNOWN_BROKEN_URL_MAP: Record<string, string> = {
  'photo-1541888946425-d0fbb186a5b3': VERIFIED_CATEGORY_FALLBACKS['cat-estrutura'],
  'photo-1541888946425-d0fbb18615f3': VERIFIED_CATEGORY_FALLBACKS['banner'],
  'photo-1581092335397-9583fe92d232': VERIFIED_CATEGORY_FALLBACKS['cat-tintas'],
  'photo-1542838132-92c53300491e': VERIFIED_CATEGORY_FALLBACKS['banner'],
};

export function getCategoryFallbackImage(hint?: string): string {
  if (!hint) return VERIFIED_CATEGORY_FALLBACKS.default;
  const lower = hint.toLowerCase();
  if (VERIFIED_CATEGORY_FALLBACKS[lower]) return VERIFIED_CATEGORY_FALLBACKS[lower];
  if (lower.includes('hidr') || lower.includes('cano') || lower.includes('louc')) return VERIFIED_CATEGORY_FALLBACKS['cat-hidraulica'];
  if (lower.includes('elet') || lower.includes('fio') || lower.includes('cabo')) return VERIFIED_CATEGORY_FALLBACKS['cat-eletrica'];
  if (lower.includes('piso') || lower.includes('porcel') || lower.includes('acab')) return VERIFIED_CATEGORY_FALLBACKS['cat-acabamento'];
  if (lower.includes('tint') || lower.includes('pint') || lower.includes('quim')) return VERIFIED_CATEGORY_FALLBACKS['cat-tintas'];
  if (lower.includes('cober') || lower.includes('telh') || lower.includes('esquad')) return VERIFIED_CATEGORY_FALLBACKS['cat-coberturas'];
  if (lower.includes('ferr') || lower.includes('epi') || lower.includes('maqu')) return VERIFIED_CATEGORY_FALLBACKS['cat-ferramentas'];
  if (lower.includes('banner') || lower.includes('hero')) return VERIFIED_CATEGORY_FALLBACKS['banner'];
  return VERIFIED_CATEGORY_FALLBACKS.default;
}

export function sanitizeImageUrl(rawUrl?: string, categoryHint?: string): string {
  if (!rawUrl || !rawUrl.trim()) {
    return getCategoryFallbackImage(categoryHint);
  }
  const trimmed = rawUrl.trim();
  for (const [brokenId, replacement] of Object.entries(KNOWN_BROKEN_URL_MAP)) {
    if (trimmed.includes(brokenId)) {
      return replacement;
    }
  }
  return trimmed;
}

export function optimizeImageUrl(rawUrl: string, options: ImageOptimizeOptions): string {
  const safeUrl = sanitizeImageUrl(rawUrl);

  // Skip inline data URLs, blobs, or relative local assets
  if (safeUrl.startsWith('data:') || safeUrl.startsWith('blob:') || safeUrl.startsWith('/')) {
    return safeUrl;
  }

  try {
    const parsed = new URL(safeUrl);
    if (parsed.hostname.includes('images.unsplash.com')) {
      parsed.searchParams.set('w', String(Math.round(options.width)));
      if (options.height) {
        parsed.searchParams.set('h', String(Math.round(options.height)));
      }
      parsed.searchParams.set('fit', options.fit || 'crop');
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('q', String(options.quality ?? 75));
      return parsed.toString();
    }
    return safeUrl;
  } catch {
    return safeUrl;
  }
}

export function buildImageSrcSet(
  rawUrl: string,
  baseWidth: number,
  baseHeight?: number,
  quality = 75
): string | undefined {
  const safeUrl = sanitizeImageUrl(rawUrl);
  if (!safeUrl.includes('images.unsplash.com')) return undefined;

  const url1x = optimizeImageUrl(safeUrl, { width: baseWidth, height: baseHeight, quality });
  const url2x = optimizeImageUrl(safeUrl, {
    width: Math.min(1600, baseWidth * 2),
    height: baseHeight ? Math.min(1600, baseHeight * 2) : undefined,
    quality: Math.max(65, quality - 5),
  });

  return `${url1x} 1x, ${url2x} 2x`;
}

// Bounded concurrent image download queue to avoid HTTP/browser connection contention on large catalogs
const MAX_CONCURRENT_IMAGE_LOADS = 5;
let activeLoads = 0;
const waitQueue: Array<{ priority: boolean; start: () => void }> = [];

// Track URLs already successfully decoded in this session so cached images render instantaneously
const loadedUrlCache = new Set<string>();

export function markImageLoaded(url: string) {
  loadedUrlCache.add(url);
}

export function isImageCachedInSession(url: string): boolean {
  return loadedUrlCache.has(url);
}

export function scheduleImageLoad(priority: boolean, onReady: () => void): () => void {
  let cancelled = false;

  const start = () => {
    if (cancelled) return;
    activeLoads += 1;
    onReady();
  };

  if (priority || activeLoads < MAX_CONCURRENT_IMAGE_LOADS) {
    start();
  } else {
    if (priority) {
      waitQueue.unshift({ priority, start });
    } else {
      waitQueue.push({ priority, start });
    }
  }

  let released = false;
  return () => {
    cancelled = true;
    if (!released) {
      released = true;
      // Only decrement if start() ran
    }
  };
}

export function releaseImageSlot() {
  if (activeLoads > 0) {
    activeLoads -= 1;
  }
  while (activeLoads < MAX_CONCURRENT_IMAGE_LOADS && waitQueue.length > 0) {
    const next = waitQueue.shift();
    if (next) {
      next.start();
    }
  }
}
