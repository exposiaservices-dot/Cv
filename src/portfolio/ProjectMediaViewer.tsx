import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { safeImageUrl } from './content';
import type { GalleryLabels, PortfolioImage } from './types';

export default function ProjectMediaViewer({ images, index, onClose, lang, direction, labels }: {
  images: PortfolioImage[]; index: number; onClose: () => void; lang: string; direction: 'rtl' | 'ltr'; labels: GalleryLabels;
}) {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const change = () => setReduced(media.matches);
    media.addEventListener?.('change', change);
    return () => media.removeEventListener?.('change', change);
  }, []);
  return <Lightbox open close={onClose} index={index} slides={images.map(image => ({ src: safeImageUrl(image.src)!, alt: image.alt }))}
    labels={{ Previous: labels.previous, Next: labels.next, Close: labels.close, Slide: labels.slide, Carousel: labels.carousel,
      Lightbox: labels.viewer, 'Photo gallery': labels.gallery, '{index} of {total}': labels.position }}
    portal={{ container: { dir: direction, lang } }} animation={reduced ? { fade: 0, swipe: 0, navigation: 0 } : undefined} />;
}
