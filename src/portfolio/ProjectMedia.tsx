import { lazy, Suspense, useRef, useState } from 'react';
import type { GalleryLabels, PortfolioImage } from './types';
import { safeImageUrl, validImage } from './content';
import { resolveGalleryLabels } from './gallery-labels';
import { MediaBoundary } from './MediaBoundary';

// The viewer and its stylesheet are fetched only after a visitor opens an image.
const MediaViewer = lazy(() => import('./ProjectMediaViewer'));

export function ProjectMedia({ images, lang, direction, galleryLabels }: { images: PortfolioImage[]; lang: string; direction: 'rtl' | 'ltr'; galleryLabels?: Partial<GalleryLabels> }) {
  const usable = images.filter(validImage);
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  if (!usable.length) return null;
  const labels = resolveGalleryLabels(lang, galleryLabels);
  const close = () => {
    setIndex(null);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  return <>
    <div className="portfolio-media">{usable.map((image, i) =>
      <button key={`${image.src}-${i}`} type="button" className="portfolio-media-button"
        aria-label={`${labels.open}: ${image.alt}`}
        onClick={event => { trigger.current = event.currentTarget; setIndex(i); }}>
        <img src={safeImageUrl(image.src)} alt={image.alt} loading="lazy" decoding="async" />
      </button>,
    )}</div>
    {index !== null && <MediaBoundary labels={labels} onClose={close}>
      <Suspense fallback={<div role="status"><span>{labels.loading}</span> <button type="button" onClick={close}>{labels.cancel}</button></div>}>
        <MediaViewer images={usable} index={index} onClose={close} lang={lang} direction={direction} labels={labels} />
      </Suspense>
    </MediaBoundary>}
  </>;
}
