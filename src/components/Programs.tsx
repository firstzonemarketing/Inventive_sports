import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { INITIAL_CMS_DATA } from '../content';
import { useCms } from '../lib/cms';
import { scrollEngine } from '../lib/scroll';

interface ProgramsProps {
  onSelectDiscipline?: (disciplineTitle: string) => void;
}

export const Programs: React.FC<ProgramsProps> = ({ onSelectDiscipline }) => {
  const { disciplines, navigate } = useCms();
  const skills = INITIAL_CMS_DATA.skillsBenefits;

  const handleEnquireDiscipline = (name: string) => {
    if (onSelectDiscipline) {
      onSelectDiscipline(name);
    }
    scrollEngine.scrollTo('#enquiry-form', -84);
  };

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="relative w-full py-24 sm:py-32 bg-[#FFFFFF] border-b border-[#E7E7E7]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div
          data-reveal
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 sm:mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                WHY INVENTIVE SPORTS
              </span>
            </div>
            <h2
              id="programs-heading"
              className="heading-section text-[#151515]"
            >
              TRAIN WITH PURPOSE.{' '}
              <span className="font-editorial italic font-normal text-[#D71920]">
                GROW WITH CONFIDENCE.
              </span>
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
              Every session at Inventive Sports &amp; Performing Arts is
              structured to build holistic capability—combining physical
              conditioning, tactical intelligence, teamwork, and creative
              self-expression.
            </p>
          </div>
        </div>

        {/* 8 Skills & Development Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {skills.map((skill, idx) => (
            <article
              key={skill.number}
              data-reveal
              data-reveal-delay={(idx % 4) * 70}
              className="group relative bg-[#F5F5F5] hover:bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-[0_6px_20px_rgba(21,21,21,0.02)] hover:shadow-[0_18px_36px_rgba(21,21,21,0.07)]"
            >
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[3px] bg-[#D71920] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-tech-code text-xs font-bold text-[#D71920] bg-[#FFFFFF] group-hover:bg-[#F5F5F5] px-2.5 py-1 border border-[#E7E7E7]">
                    {skill.number}
                  </span>
                  <CheckCircle2
                    aria-hidden="true"
                    className="w-4 h-4 text-[#151515]/30 group-hover:text-[#D71920] transition-colors"
                  />
                </div>
                <h3 className="font-display font-bold text-lg text-[#151515] group-hover:text-[#D71920] transition-colors">
                  {skill.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-[#626262] leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#E7E7E7] flex items-center justify-between">
                <span className="font-tech-code text-[10px] text-[#626262]">
                  CORE DEVELOPMENT PILLAR
                </span>
                <span
                  aria-hidden="true"
                  className="w-4 h-[2px] bg-[#D71920]"
                />
              </div>
            </article>
          ))}
        </div>

        {/* Quick Academy Programs Directory */}
        <div className="pt-12 border-t border-[#E7E7E7]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono-label text-[11px] text-[#D71920]">
                STRUCTURED ACADEMY PROGRAMS
              </span>
              <h3 className="mt-1 heading-scene text-[#151515]">
                Explore All 7 Training Tracks
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/sports')}
                className="inline-flex items-center gap-2 bg-[#151515] text-[#FFFFFF] font-mono-label text-xs px-5 py-3 hover:bg-[#D71920] transition-colors cursor-pointer"
              >
                <span>ALL SPORTS DIRECTORY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/performing-arts')}
                className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#151515] border border-[#151515] font-mono-label text-xs px-5 py-3 hover:border-[#D71920] hover:text-[#D71920] transition-colors cursor-pointer"
              >
                <span>PERFORMING ARTS</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((disc, idx) => {
              const targetHref =
                disc.slug === 'performing-arts'
                  ? '/performing-arts'
                  : `/sports/${disc.slug}`;

              return (
                <article
                  key={disc.id}
                  className="group bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#151515]">
                    <img
                      src={disc.cover_image}
                      alt={disc.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 px-2.5 py-1 border border-[#E7E7E7]">
                      <span className="font-tech-code text-[10px] font-bold text-[#D71920]">
                        0{idx + 1} // {disc.name.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-mono-label text-[10px] text-[#626262]">
                        {disc.tagline}
                      </span>
                      <h4 className="mt-1 font-display font-bold text-xl text-[#151515]">
                        {disc.name}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-[#626262] leading-relaxed">
                        {disc.short_description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E7E7E7] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleEnquireDiscipline(disc.name)}
                        className="font-mono-label text-[11px] text-[#151515] hover:text-[#D71920] transition-colors cursor-pointer"
                      >
                        ENQUIRE →
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(targetHref)}
                        className="inline-flex items-center gap-1.5 bg-[#F5F5F5] group-hover:bg-[#D71920] group-hover:text-[#FFFFFF] text-[#151515] font-mono-label text-[11px] px-4 py-2 transition-colors cursor-pointer"
                      >
                        <span>VIEW PROGRAM</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
