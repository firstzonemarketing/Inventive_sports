import React, { useState } from 'react';
import { ArrowRight, Maximize2, X } from 'lucide-react';
import { CmsGalleryItem } from '../content';
import { useCms } from '../lib/cms';

interface StatementProps {
  reducedMotion: boolean;
}

const CATEGORIES = [
  'All',
  'Training Sessions',
  'Competitions',
  'Performances',
  'Event Galleries',
] as const;

export const Statement: React.FC<StatementProps> = ({ reducedMotion }) => {
  const { gallery, navigate } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<CmsGalleryItem | null>(null);

  const publishedGallery = gallery.filter((g) => g.is_published);
  const filteredGallery =
    selectedCategory === 'All'
      ? publishedGallery.slice(0, 8)
      : publishedGallery.filter((g) => g.category === selectedCategory);

  const statements = [
    'EVERY GREAT ATHLETE BEGINS WITH CURIOSITY.',
    'EVERY SMART MOVE BEGINS WITH STRATEGY.',
    'EVERY STRONG PERFORMANCE BEGINS WITH PRACTICE.',
  ];

  return (
    <section
      id="gallery-preview"
      aria-labelledby="gallery-preview-heading"
      className="relative w-full py-24 sm:py-32 bg-[#F5F5F5] border-b border-[#E7E7E7] overflow-hidden"
    >
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section 7 Header */}
        <div
          data-reveal
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                INSIDE THE ACADEMY
              </span>
            </div>
            <h2
              id="gallery-preview-heading"
              className="heading-section text-[#151515]"
            >
              REAL MOMENTS.{' '}
              <span className="font-editorial italic font-normal text-[#D71920]">
                REAL PROGRESS.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#151515] transition-colors cursor-pointer"
            >
              <span>EXPLORE THE GALLERY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          data-reveal
          className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[#E7E7E7]"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-mono-label text-xs border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#151515] text-[#FFFFFF] border-[#151515]'
                    : 'bg-[#FFFFFF] text-[#151515] border-[#E7E7E7] hover:border-[#D71920]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {filteredGallery.map((item) => (
            <figure
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] p-2.5 shadow-xs cursor-pointer transition-all duration-300"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#151515]">
                <img
                  src={item.media_url}
                  alt={item.alt_text || item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#151515]/0 group-hover:bg-[#151515]/40 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-[#D71920] text-[#FFFFFF] flex items-center justify-center">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/95 px-2.5 py-0.5 border border-[#E7E7E7]">
                  <span className="font-tech-code text-[9px] font-bold text-[#D71920]">
                    {item.discipline.toUpperCase()}
                  </span>
                </div>
              </div>
              <figcaption className="pt-3 px-1.5 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-sm text-[#151515] truncate">
                    {item.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-3.5 h-[2px] bg-[#D71920] shrink-0"
                  />
                </div>
                <p className="mt-1 text-xs text-[#626262] line-clamp-2">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Sequential Editorial Statement Lines */}
        <div className="pt-12 border-t border-[#E7E7E7]">
          <div className="space-y-5 sm:space-y-6">
            {statements.map((line, index) => (
              <div
                key={line}
                data-statement-line
                className="group relative max-w-5xl"
              >
                <span className="line-clip-mask">
                  <span
                    className="line-clip-inner heading-section text-[#151515]"
                    style={{
                      transitionDelay: reducedMotion
                        ? '0ms'
                        : `${index * 150}ms`,
                    }}
                  >
                    <span className="font-tech-code text-xs sm:text-sm text-[#D71920] align-top mr-3 sm:mr-5 font-semibold">
                      0{index + 1}
                    </span>
                    {line}
                  </span>
                </span>

                <div
                  aria-hidden="true"
                  className="mt-3 w-full max-w-3xl h-[2px] bg-[#E7E7E7] overflow-hidden"
                >
                  <div
                    className="statement-underline w-full h-full bg-[#D71920]"
                    style={{
                      transitionDelay: reducedMotion
                        ? '0ms'
                        : `${index * 170 + 220}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-[90] bg-[#101010]/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#FFFFFF] border border-[#E7E7E7] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E7E7E7] bg-[#F5F5F5]">
              <div>
                <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
                  {lightboxItem.category.toUpperCase()} //{' '}
                  {lightboxItem.discipline.toUpperCase()}
                </span>
                <h3 className="font-display font-bold text-base text-[#151515]">
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close lightbox"
                className="w-9 h-9 bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#D71920] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#151515]" />
              </button>
            </div>
            <div className="aspect-[16/10] w-full bg-[#101010]">
              <img
                src={lightboxItem.media_url}
                alt={lightboxItem.alt_text || lightboxItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            {lightboxItem.caption && (
              <div className="px-6 py-4 bg-[#FFFFFF] text-sm text-[#626262]">
                {lightboxItem.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
