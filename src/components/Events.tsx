import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Clock,
  CalendarX2,
} from 'lucide-react';
import { CmsEvent } from '../content';
import { useCms } from '../lib/cms';
import { scrollEngine } from '../lib/scroll';

interface EventsProps {
  onSelectEvent?: (eventTitle: string) => void;
}

export const Events: React.FC<EventsProps> = ({ onSelectEvent }) => {
  const { events, navigate } = useCms();
  const [previewEmpty, setPreviewEmpty] = useState(false);

  const publishedEvents = previewEmpty
    ? []
    : events.filter((ev) => ev.status === 'published');

  const handleRegisterInterest = (eventItem: CmsEvent) => {
    if (onSelectEvent) {
      onSelectEvent(eventItem.title);
    }
    scrollEngine.scrollTo('#enquiry-form', -84);
  };

  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="relative w-full py-24 sm:py-32 bg-[#FFFFFF] border-b border-[#E7E7E7]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div
          data-reveal
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                UPCOMING EVENTS
              </span>
            </div>
            <h2
              id="events-heading"
              className="heading-section text-[#151515]"
            >
              THE NEXT BIG MOMENT{' '}
              <span className="font-editorial italic font-normal text-[#D71920]">
                STARTS HERE.
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewEmpty((prev) => !prev)}
              className="px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E7E7E7] font-mono-label text-[10px] text-[#626262] hover:border-[#151515] hover:text-[#151515] transition-colors cursor-pointer"
            >
              {previewEmpty ? 'SHOW PUBLISHED EVENTS' : 'PREVIEW EMPTY STATE'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-xs px-5 py-3 hover:bg-[#D71920] transition-colors cursor-pointer"
            >
              <span>VIEW ALL EVENTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Empty State or Dynamic Events Cards */}
        {publishedEvents.length === 0 ? (
          <div className="border border-[#E7E7E7] bg-[#F5F5F5] p-10 sm:p-16 text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 mx-auto mb-5 bg-[#FFFFFF] border border-[#E7E7E7] flex items-center justify-center">
              <CalendarX2
                aria-hidden="true"
                className="w-5 h-5 text-[#D71920]"
              />
            </div>
            <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
              ACADEMY CALENDAR // NO SCHEDULED EVENTS AT THIS MOMENT
            </span>
            <h3 className="mt-2 heading-card text-[#151515]">
              Next Season Tournament &amp; Showcase Dates Coming Soon
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#626262] max-w-xl mx-auto leading-relaxed">
              We are finalizing the upcoming calendar for inter-center fixtures,
              chess championships, and performing arts showcases. Register your
              interest below to receive priority invitations.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollEngine.scrollTo('#enquiry-form', -84)}
                className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#151515] transition-colors cursor-pointer"
              >
                <span>REGISTER FOR EVENT UPDATES</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              {previewEmpty && (
                <button
                  type="button"
                  onClick={() => setPreviewEmpty(false)}
                  className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#151515] border border-[#151515] font-mono-label text-xs px-5 py-3.5 hover:border-[#D71920] hover:text-[#D71920] transition-colors cursor-pointer"
                >
                  <span>RESTORE LIVE EVENTS</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {publishedEvents.map((ev, idx) => (
              <article
                key={ev.id}
                className="group bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_28px_rgba(21,21,21,0.04)] hover:shadow-[0_20px_44px_rgba(21,21,21,0.09)]"
              >
                {/* Event Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#151515]">
                  <img
                    src={ev.cover_image}
                    alt={ev.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 px-3 py-1 border border-[#E7E7E7] flex items-center gap-2">
                    <span className="font-tech-code text-[10px] font-bold text-[#D71920]">
                      0{idx + 1}
                    </span>
                    <span className="text-[#E7E7E7]">•</span>
                    <span className="font-mono-label text-[10px] text-[#151515]">
                      {ev.discipline}
                    </span>
                  </div>
                  {ev.is_featured && (
                    <div className="absolute top-3 right-3 bg-[#D71920] text-[#FFFFFF] px-2.5 py-1 font-tech-code text-[9px] font-semibold">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#626262] mb-3">
                      <span className="inline-flex items-center gap-1.5 font-tech-code text-[10px] text-[#151515] font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#D71920]" />
                        {ev.start_date}
                      </span>
                      {ev.start_time && (
                        <span className="inline-flex items-center gap-1 font-tech-code text-[10px] text-[#626262]">
                          <Clock className="w-3.5 h-3.5 text-[#D71920]" />
                          {ev.start_time}
                        </span>
                      )}
                    </div>

                    <h3 className="heading-card text-[#151515] group-hover:text-[#D71920] transition-colors">
                      {ev.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-[#626262] leading-relaxed">
                      {ev.short_description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E7E7E7] flex items-center gap-2 text-xs text-[#626262]">
                      <MapPin className="w-3.5 h-3.5 text-[#D71920] shrink-0" />
                      <span>{ev.venue}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-4 border-t border-[#E7E7E7] flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/events/${ev.slug}`)}
                      className="font-mono-label text-[11px] text-[#151515] hover:text-[#D71920] transition-colors cursor-pointer"
                    >
                      EVENT DETAILS →
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRegisterInterest(ev)}
                      className="inline-flex items-center gap-1.5 bg-[#151515] group-hover:bg-[#D71920] text-[#FFFFFF] font-mono-label text-[11px] px-4 py-2.5 transition-colors cursor-pointer"
                    >
                      <span>REGISTER</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
