import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, MapPin, ShieldCheck, Award } from 'lucide-react';
import { INITIAL_CMS_DATA } from '../content';
import { useCms } from '../lib/cms';
import { scrollEngine } from '../lib/scroll';
import { clamp } from '../lib/math';

interface AboutPageProps {
  reducedMotion: boolean;
}

const SQUAD_FILTERS = [
  'All',
  'Chess',
  'Cricket',
  'Football',
  'Swimming',
  'Skating',
  'Basketball',
] as const;

export const AboutPage: React.FC<AboutPageProps> = ({ reducedMotion }) => {
  const { milestones, leadership, squad, navigate } = useCms();
  const [squadFilter, setSquadFilter] = useState<string>('All');

  const timelineWrapRef = useRef<HTMLDivElement | null>(null);
  const activeSvgLineRef = useRef<SVGLineElement | null>(null);
  const travelerDotRef = useRef<SVGCircleElement | null>(null);
  const milestoneCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const milestoneNodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredSquad =
    squadFilter === 'All'
      ? squad
      : squad.filter(
          (member) =>
            member.discipline.toLowerCase() === squadFilter.toLowerCase()
        );

  useEffect(() => {
    if (reducedMotion) {
      if (activeSvgLineRef.current) {
        activeSvgLineRef.current.style.strokeDasharray = '1000';
        activeSvgLineRef.current.style.strokeDashoffset = '0';
      }
      milestoneCardRefs.current.forEach((el) => {
        if (el) el.dataset.active = 'true';
      });
      milestoneNodeRefs.current.forEach((el) => {
        if (el) el.dataset.active = 'true';
      });
      return;
    }

    const unsubscribe = scrollEngine.subscribe(({ viewportHeight }) => {
      const wrapEl = timelineWrapRef.current;
      const lineEl = activeSvgLineRef.current;
      if (!wrapEl || !lineEl) return;

      const rect = wrapEl.getBoundingClientRect();
      const start = viewportHeight * 0.72;
      const end = viewportHeight * 0.25 - rect.height;
      const progress = clamp(
        (start - rect.top) / Math.max(1, start - end),
        0,
        1
      );

      lineEl.style.strokeDasharray = '1000';
      lineEl.style.strokeDashoffset = `${(1000 * (1 - progress)).toFixed(1)}`;

      if (travelerDotRef.current) {
        travelerDotRef.current.setAttribute(
          'cy',
          `${(progress * 1000).toFixed(1)}`
        );
      }

      const thresholds = [0.06, 0.45, 0.8];
      milestones.forEach((_, idx) => {
        const threshold = thresholds[idx] ?? idx / Math.max(1, milestones.length);
        const reached = progress >= threshold;
        const card = milestoneCardRefs.current[idx];
        const node = milestoneNodeRefs.current[idx];
        if (card) card.dataset.active = reached ? 'true' : 'false';
        if (node) node.dataset.active = reached ? 'true' : 'false';
      });
    });

    return unsubscribe;
  }, [reducedMotion, milestones]);

  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      {/* SECTION 1 — ABOUT HERO */}
      <section className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#FFFFFF] border-b border-[#E7E7E7] overflow-hidden editorial-grid-bg">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <span
                  aria-hidden="true"
                  className="w-8 h-[2px] bg-[#D71920]"
                />
                <span className="font-mono-label text-xs text-[#D71920]">
                  OUR STORY
                </span>
              </div>
              <h1 className="heading-hero text-[#151515]">
                BUILDING PEOPLE.{' '}
                <span className="block text-[#D71920]">
                  NURTURING CHAMPIONS.
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4">
              <p className="text-base sm:text-lg text-[#626262] leading-relaxed">
                Inventive Sports &amp; Performing Arts was created to bring
                sports, games, strategy, fitness, and creative performance
                together in a structured and inspiring environment.
              </p>
              <div className="mt-6 pt-5 border-t border-[#E7E7E7] flex flex-wrap items-center gap-4 font-tech-code text-xs text-[#151515]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
                  KAMMANAHALLI &amp; HESARAGHATTA, BANGALORE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 2, 3, AND 4 — SCROLL-DRAWING TIMELINE EXPERIENCE */}
      <section
        aria-label="Inventive Sports Story Timeline"
        className="relative w-full py-24 sm:py-32 bg-[#F5F5F5] border-b border-[#E7E7E7]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                SCROLL-DRAWING TIMELINE // 2018 — PRESENT
              </span>
            </div>
            <h2 className="heading-section text-[#151515]">
              How Our Academy{' '}
              <span className="font-editorial italic font-normal text-[#D71920]">
                Took Shape.
              </span>
            </h2>
          </div>

          <div ref={timelineWrapRef} className="relative">
            {/* Continuous Vertical SVG Timeline Path */}
            <div
              aria-hidden="true"
              className="absolute left-5 sm:left-8 lg:left-1/2 top-4 bottom-4 w-[24px] -translate-x-1/2 pointer-events-none"
            >
              <svg
                viewBox="0 0 24 1000"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <line
                  x1="12"
                  y1="0"
                  x2="12"
                  y2="1000"
                  stroke="#D8D8D8"
                  strokeWidth="2"
                />
                <line
                  ref={activeSvgLineRef}
                  x1="12"
                  y1="0"
                  x2="12"
                  y2="1000"
                  stroke="#D71920"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle
                  ref={travelerDotRef}
                  cx="12"
                  cy="0"
                  r="7"
                  fill="#D71920"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Milestones 1, 2, 3 */}
            <div className="space-y-16 sm:space-y-24">
              {milestones.map((ms, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <article
                    key={ms.id}
                    ref={(el) => {
                      milestoneCardRefs.current[idx] = el as HTMLDivElement | null;
                    }}
                    data-active={idx === 0 ? 'true' : 'false'}
                    className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pl-14 sm:pl-20 lg:pl-0 transition-all duration-500 data-[active=false]:opacity-75 data-[active=true]:opacity-100"
                  >
                    {/* Milestone Marker Node */}
                    <div
                      ref={(el) => {
                        milestoneNodeRefs.current[idx] = el;
                      }}
                      data-active={idx === 0 ? 'true' : 'false'}
                      className="absolute left-5 sm:left-8 lg:left-1/2 top-10 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#FFFFFF] border-2 border-[#151515] data-[active=true]:bg-[#D71920] data-[active=true]:border-[#D71920] data-[active=true]:scale-110 transition-all duration-300 flex items-center justify-center shadow-md"
                    >
                      <span className="font-tech-code text-xs font-bold text-[#151515] group-data-[active=true]:text-[#FFFFFF]">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Text Block */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven
                          ? 'lg:col-start-1 lg:pr-8'
                          : 'lg:col-start-8 lg:pl-8 lg:order-2'
                      }`}
                    >
                      <div className="bg-[#FFFFFF] border border-[#E7E7E7] group-data-[active=true]:border-[#151515] p-7 sm:p-9 shadow-[0_14px_38px_rgba(21,21,21,0.05)]">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="w-5 h-[2px] bg-[#D71920]" />
                          <span className="font-mono-label text-[11px] text-[#D71920]">
                            {ms.eyebrow}
                          </span>
                        </div>
                        <h3 className="heading-scene text-[#151515]">
                          {ms.heading}
                        </h3>
                        <p className="mt-4 text-sm sm:text-base text-[#626262] leading-relaxed">
                          {ms.description}
                        </p>
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="hidden lg:block lg:col-span-2 lg:col-start-6"
                    />

                    {/* Milestone Image */}
                    <div
                      className={`lg:col-span-5 ${
                        isEven
                          ? 'lg:col-start-8 lg:pl-8'
                          : 'lg:col-start-1 lg:pr-8 lg:order-1'
                      }`}
                    >
                      <div className="bg-[#FFFFFF] border border-[#E7E7E7] p-3 shadow-[0_14px_38px_rgba(21,21,21,0.05)]">
                        <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#151515]">
                          <img
                            src={ms.image_url}
                            alt={ms.heading}
                            loading="lazy"
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-data-[active=true]:scale-105"
                          />
                          <div className="absolute bottom-3 left-3 bg-[#151515]/90 px-3 py-1 border border-[#FFFFFF]/15">
                            <span className="font-tech-code text-[10px] text-[#FFFFFF]">
                              {ms.year} // {ms.eyebrow}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — THE LEADERSHIP */}
      <section
        id="leadership"
        aria-labelledby="leadership-heading"
        className="relative w-full py-24 sm:py-32 bg-[#FFFFFF] border-b border-[#E7E7E7]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 sm:mb-16">
            <div>
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span
                  aria-hidden="true"
                  className="w-6 h-[2px] bg-[#D71920]"
                />
                <span className="font-mono-label text-[11px] text-[#D71920]">
                  LEADERSHIP
                </span>
              </div>
              <h2
                id="leadership-heading"
                className="heading-section text-[#151515]"
              >
                THE PEOPLE BEHIND{' '}
                <span className="font-editorial italic font-normal text-[#D71920]">
                  THE VISION.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm sm:text-base text-[#626262] leading-relaxed">
              Guided by founders, academic advisors, and operational leaders
              committed to grassroots sports and holistic youth development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {leadership.map((leader, idx) => (
              <article
                key={leader.id}
                className="group bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_rgba(21,21,21,0.04)] hover:shadow-[0_22px_48px_rgba(21,21,21,0.09)]"
              >
                {/* Top Red Accent Bar */}
                <div className="h-1.5 w-full bg-[#F5F5F5] overflow-hidden">
                  <div className="h-full w-1/3 bg-[#D71920] group-hover:w-full transition-all duration-500" />
                </div>

                {/* Official Uploaded Portrait */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={leader.portrait_url}
                    alt={`${leader.name} — ${leader.designation}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 px-2.5 py-1 border border-[#E7E7E7]">
                    <span className="font-tech-code text-[10px] font-bold text-[#D71920]">
                      0{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono-label text-[10px] text-[#D71920]">
                      {leader.designation}
                    </span>
                    <h3 className="mt-1 font-display font-bold text-xl text-[#151515]">
                      {leader.name}
                    </h3>
                    <div
                      aria-hidden="true"
                      className="w-8 h-[2px] bg-[#D71920] my-3"
                    />
                    <p className="text-xs sm:text-sm text-[#626262] leading-relaxed">
                      {leader.biography}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — OUR SQUAD */}
      <section
        id="our-squad"
        aria-labelledby="squad-heading"
        className="relative w-full py-24 sm:py-32 bg-[#F5F5F5] border-b border-[#E7E7E7]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span
                  aria-hidden="true"
                  className="w-6 h-[2px] bg-[#D71920]"
                />
                <span className="font-mono-label text-[11px] text-[#D71920]">
                  OUR SQUAD
                </span>
              </div>
              <h2
                id="squad-heading"
                className="heading-section text-[#151515]"
              >
                EXPERTISE THAT{' '}
                <span className="font-editorial italic font-normal text-[#D71920]">
                  INSPIRES PROGRESS.
                </span>
              </h2>
            </div>

            {/* Discipline Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {SQUAD_FILTERS.map((disc) => {
                const active = squadFilter === disc;
                return (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => setSquadFilter(disc)}
                    className={`px-3.5 py-2 font-mono-label text-[11px] border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#151515] text-[#FFFFFF] border-[#151515]'
                        : 'bg-[#FFFFFF] text-[#151515] border-[#E7E7E7] hover:border-[#D71920]'
                    }`}
                  >
                    {disc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSquad.map((coach, idx) => (
              <article
                key={coach.id}
                className="group bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] p-6 transition-all duration-300 flex items-start gap-5 shadow-[0_6px_22px_rgba(21,21,21,0.03)]"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-[#F5F5F5] border border-[#E7E7E7]">
                  <img
                    src={coach.portrait_url}
                    alt={`${coach.name} — ${coach.designation}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-tech-code text-[10px] font-bold text-[#D71920]">
                      {coach.discipline.toUpperCase()}
                    </span>
                    <span className="font-tech-code text-[10px] text-[#626262]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display font-bold text-lg text-[#151515]">
                    {coach.name}
                  </h3>
                  <p className="font-mono-label text-[10px] text-[#151515]/80 mt-0.5">
                    {coach.designation}
                  </p>
                  <p className="mt-2 text-xs text-[#626262] leading-relaxed">
                    {coach.biography}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS 7 & 8 — OUR MISSION & OUR VISION */}
      <section className="relative w-full py-24 sm:py-32 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Section 7: Our Mission */}
            <div className="bg-[#161616] border border-[#2A2A2A] p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <ShieldCheck className="w-4 h-4 text-[#D71920]" />
                  <span className="font-mono-label text-xs text-[#D71920]">
                    OUR MISSION
                  </span>
                </div>
                <h2 className="heading-scene text-[#FFFFFF]">
                  TO REVOLUTIONIZE GRASSROOTS SPORTS
                </h2>
                <div
                  aria-hidden="true"
                  className="w-12 h-[2px] bg-[#D71920] my-5"
                />
                <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed">
                  To provide accessible, high-quality sports and performing arts
                  education that empowers individuals to achieve their personal
                  best, fostering a lifelong love for fitness, strategy, and
                  creative expression.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#2A2A2A] font-tech-code text-[10px] text-[#8E8E8E]">
                GRASSROOTS ACCESSIBILITY // MULTIDISCIPLINARY EXCELLENCE
              </div>
            </div>

            {/* Section 8: Our Vision */}
            <div className="bg-[#161616] border border-[#2A2A2A] p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <Award className="w-4 h-4 text-[#D71920]" />
                  <span className="font-mono-label text-xs text-[#D71920]">
                    OUR VISION
                  </span>
                </div>
                <h2 className="heading-scene text-[#FFFFFF]">
                  THE GOLD STANDARD OF EXCELLENCE
                </h2>
                <div
                  aria-hidden="true"
                  className="w-12 h-[2px] bg-[#D71920] my-5"
                />
                <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed">
                  To be the premier multidisciplinary academy in India,
                  recognized for producing not just champions in sports and
                  arts, but well-rounded leaders who positively impact their
                  communities.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#2A2A2A] font-tech-code text-[10px] text-[#8E8E8E]">
                INDIA PREMIER ACADEMY // HOLISTIC LEADERSHIP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — OUR VALUES */}
      <section className="relative w-full py-24 sm:py-32 bg-[#FFFFFF] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                OUR CORE PRINCIPLES
              </span>
            </div>
            <h2 className="heading-section text-[#151515]">
              VALUES THAT GUIDE{' '}
              <span className="font-editorial italic font-normal text-[#D71920]">
                EVERY SESSION.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_CMS_DATA.values.map((val) => (
              <div
                key={val.code}
                className="bg-[#F5F5F5] border border-[#E7E7E7] hover:border-[#151515] p-7 sm:p-8 transition-colors"
              >
                <span className="font-tech-code text-xs font-bold text-[#D71920]">
                  {val.code}
                </span>
                <h3 className="mt-3 font-display font-bold text-xl text-[#151515]">
                  {val.title}
                </h3>
                <div
                  aria-hidden="true"
                  className="w-8 h-[2px] bg-[#D71920] my-3"
                />
                <p className="text-sm text-[#626262] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — ABOUT CTA */}
      <section className="relative w-full py-20 sm:py-28 bg-[#F5F5F5] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-[#151515] text-[#FFFFFF] p-8 sm:p-14 lg:p-16 border-l-4 border-[#D71920] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="font-mono-label text-xs text-[#D71920]">
                JOIN OUR COMMUNITY
              </span>
              <h2 className="mt-2 heading-section text-[#FFFFFF]">
                BE PART OF THE INVENTIVE JOURNEY.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#D4D4D4] leading-relaxed">
                Visit our Kammanahalli or Hesaraghatta centers in Bangalore and
                experience world-class coaching across 7 sports and performing
                arts disciplines.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-7 py-4 hover:bg-[#FFFFFF] hover:text-[#151515] transition-colors cursor-pointer"
              >
                <span>CONTACT US</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/sports')}
                className="inline-flex items-center gap-2.5 bg-transparent text-[#FFFFFF] border border-[#FFFFFF] font-mono-label text-xs px-7 py-4 hover:bg-[#FFFFFF] hover:text-[#151515] transition-colors cursor-pointer"
              >
                <span>EXPLORE PROGRAMS</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
