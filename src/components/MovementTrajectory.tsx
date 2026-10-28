import React, { useEffect, useRef } from 'react';
import { INITIAL_CMS_DATA } from '../content';
import { scrollEngine } from '../lib/scroll';
import { clamp } from '../lib/math';

interface MovementTrajectoryProps {
  reducedMotion: boolean;
}

export const MovementTrajectory: React.FC<MovementTrajectoryProps> = ({
  reducedMotion,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackWrapRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<SVGLineElement | null>(null);
  const travelerRef = useRef<SVGCircleElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressReadoutRef = useRef<HTMLSpanElement | null>(null);

  const stages = INITIAL_CMS_DATA.journeyStages;

  useEffect(() => {
    if (reducedMotion) {
      if (activeLineRef.current) {
        activeLineRef.current.style.strokeDasharray = '1000';
        activeLineRef.current.style.strokeDashoffset = '0';
      }
      cardRefs.current.forEach((card) => {
        if (card) card.dataset.active = 'true';
      });
      nodeRefs.current.forEach((node) => {
        if (node) node.dataset.active = 'true';
      });
      return;
    }

    const unsubscribe = scrollEngine.subscribe(({ viewportHeight }) => {
      const trackEl = trackWrapRef.current;
      const lineEl = activeLineRef.current;
      if (!trackEl || !lineEl) return;

      const rect = trackEl.getBoundingClientRect();
      const start = viewportHeight * 0.72;
      const end = viewportHeight * 0.25 - rect.height;
      const rawProgress = clamp(
        (start - rect.top) / Math.max(1, start - end),
        0,
        1
      );

      lineEl.style.strokeDasharray = '1000';
      lineEl.style.strokeDashoffset = `${(1000 * (1 - rawProgress)).toFixed(1)}`;

      if (travelerRef.current) {
        travelerRef.current.setAttribute(
          'cy',
          `${(rawProgress * 1000).toFixed(1)}`
        );
      }

      let currentIdx = 0;
      stages.forEach((stage, idx) => {
        const reached = rawProgress >= stage.threshold;
        if (reached) currentIdx = idx;

        const nodeEl = nodeRefs.current[idx];
        if (nodeEl) {
          nodeEl.dataset.active = reached ? 'true' : 'false';
        }
        const cardEl = cardRefs.current[idx];
        if (cardEl) {
          cardEl.dataset.active = reached ? 'true' : 'false';
        }
      });

      if (progressReadoutRef.current && stages[currentIdx]) {
        progressReadoutRef.current.textContent = `STAGE ${stages[currentIdx].number} — ${stages[currentIdx].title.toUpperCase()}`;
      }
    });

    return unsubscribe;
  }, [reducedMotion, stages]);

  return (
    <section
      id="trajectory"
      ref={sectionRef}
      aria-labelledby="trajectory-heading"
      className="relative w-full py-24 sm:py-32 bg-[#F5F5F5] border-b border-[#E7E7E7] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div
          data-reveal
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 sm:mb-20"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                THE ACADEMY JOURNEY
              </span>
            </div>
            <h2
              id="trajectory-heading"
              className="heading-section text-[#151515]"
            >
              EVERY CHAMPION{' '}
              <span className="font-editorial italic font-normal text-[#D71920]">
                STARTS SOMEWHERE.
              </span>
            </h2>
          </div>

          <div className="max-w-md flex flex-col lg:items-end">
            <p className="text-sm sm:text-base text-[#626262] lg:text-right leading-relaxed">
              Follow the six-stage development pathway that guides every student
              from their very first orientation session to competitive and stage
              excellence.
            </p>
            <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E7E7E7]">
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full bg-[#D71920]"
              />
              <span
                ref={progressReadoutRef}
                className="font-tech-code text-[10px] font-semibold text-[#151515]"
              >
                STAGE 01 — DISCOVER
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Scroll-Drawing Timeline Track */}
        <div ref={trackWrapRef} className="relative">
          {/* Single Continuous Vertical SVG Line */}
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
                stroke="#DCDCDC"
                strokeWidth="2"
              />
              <line
                ref={activeLineRef}
                x1="12"
                y1="0"
                x2="12"
                y2="1000"
                stroke="#D71920"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle
                ref={travelerRef}
                cx="12"
                cy="0"
                r="6"
                fill="#D71920"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* 6 Journey Stages */}
          <div className="space-y-12 sm:space-y-16">
            {stages.map((stage, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={stage.number}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-active={idx === 0 ? 'true' : 'false'}
                  className="group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center pl-14 sm:pl-20 lg:pl-0 transition-opacity duration-500 data-[active=false]:opacity-75 data-[active=true]:opacity-100"
                >
                  {/* Center Milestone Marker */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[idx] = el;
                    }}
                    data-active={idx === 0 ? 'true' : 'false'}
                    className="absolute left-5 sm:left-8 lg:left-1/2 top-8 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#FFFFFF] border-2 border-[#151515] data-[active=true]:bg-[#D71920] data-[active=true]:border-[#D71920] data-[active=true]:scale-110 transition-all duration-300 flex items-center justify-center shadow-sm"
                  >
                    <span className="font-tech-code text-[11px] font-bold text-[#151515] group-data-[active=true]:text-[#FFFFFF]">
                      {stage.number}
                    </span>
                  </div>

                  {/* Content Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven
                        ? 'lg:col-start-1 lg:text-right lg:pr-8'
                        : 'lg:col-start-8 lg:pl-8 lg:order-2'
                    }`}
                  >
                    <div className="bg-[#FFFFFF] border border-[#E7E7E7] group-data-[active=true]:border-[#151515] p-6 sm:p-8 shadow-[0_10px_30px_rgba(21,21,21,0.04)] transition-all duration-300">
                      <div
                        className={`flex items-center gap-2.5 mb-2 ${
                          isEven ? 'lg:justify-end' : 'justify-start'
                        }`}
                      >
                        <span className="font-tech-code text-[10px] font-semibold text-[#D71920]">
                          STAGE {stage.number}
                        </span>
                        <span className="text-[#E7E7E7]">•</span>
                        <span className="font-mono-label text-[10px] text-[#626262]">
                          {stage.subtitle}
                        </span>
                      </div>

                      <h3 className="heading-card text-[#151515] text-xl sm:text-2xl">
                        {stage.title}
                      </h3>

                      <div
                        aria-hidden="true"
                        className={`w-10 h-[2px] bg-[#D71920] my-3 ${
                          isEven ? 'lg:ml-auto' : ''
                        }`}
                      />

                      <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for center line */}
                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:col-span-2 lg:col-start-6"
                  />

                  {/* Supporting Image Column */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven
                        ? 'lg:col-start-8 lg:pl-8'
                        : 'lg:col-start-1 lg:pr-8 lg:order-1'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FFFFFF] border border-[#E7E7E7] p-2 shadow-xs">
                      <div className="relative w-full h-full overflow-hidden bg-[#151515]">
                        <img
                          src={stage.image}
                          alt={`${stage.title} — ${stage.subtitle}`}
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-data-[active=true]:scale-105"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#151515]/85 backdrop-blur-xs px-3 py-1 border border-[#FFFFFF]/15">
                          <span className="font-tech-code text-[10px] text-[#FFFFFF]">
                            {stage.number} // {stage.title.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
