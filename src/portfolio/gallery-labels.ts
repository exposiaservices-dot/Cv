import type { GalleryLabels } from './types';
const english: GalleryLabels = {
  open: 'View image', loading: 'Opening image', cancel: 'Cancel', close: 'Close', previous: 'Previous image',
  next: 'Next image', slide: 'Image', carousel: 'Gallery', viewer: 'Image viewer', gallery: 'Photo gallery',
  position: '{index} of {total}', error: 'The image viewer could not be opened.',
};
const arabic: GalleryLabels = {
  open: 'عرض الصورة', loading: 'جارٍ فتح الصورة', cancel: 'إلغاء', close: 'إغلاق', previous: 'الصورة السابقة',
  next: 'الصورة التالية', slide: 'صورة', carousel: 'معرض', viewer: 'عارض الصور', gallery: 'معرض الصور',
  position: '{index} من {total}', error: 'تعذّر فتح عارض الصور.',
};
export function resolveGalleryLabels(lang: string, overrides?: Partial<GalleryLabels>): GalleryLabels {
  return { ...(lang.toLowerCase().startsWith('ar') ? arabic : english), ...overrides };
}
