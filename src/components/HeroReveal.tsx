import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { scrollEngine, getPinnedScrollProgress } from '../lib/scroll';
import {
  clamp,
  easeInOutCubic,
  easeOutCubic,
  easeOutQuart,
  invLerp,
  lerp,
} from '../lib/math';
import { useCms } from '../lib/cms';

interface HeroRevealProps {
  reducedMotion: boolean;
}

const MOTION_PATH_LENGTH = 1280;
const SECONDARY_PATH_LENGTH = 920;

export const HeroReveal: React.FC<HeroRevealProps> = ({ reducedMotion }) => {
  const { settings, navigate } = useCms();

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const discoverPromptRef = useRef<HTMLDivElement | null>(null);
  const envLayerRef = useRef<HTMLDivElement | null>(null);
  const redGeoShapeRef = useRef<HTMLDivElement | null>(null);
  const athleteLayerRef = useRef<HTMLDivElement | null>(null);
  const detailLayerRef = useRef<HTMLDivElement | null>(null);
  const primaryTrailRef = useRef<SVGPathElement | null>(null);
  const secondaryTrailRef = useRef<SVGPathElement | null>(null);
  const headlineBlockRef = useRef<HTMLDivElement | null>(null);
  const supportingBlockRef = useRef<HTMLDivElement | null>(null);
  const markersBlockRef = useRef<HTMLDivElement | null>(null);
  const progressReadoutRef = useRef<HTMLSpanElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const unsubscribe = scrollEngine.subscribe(({ viewportHeight }) => {
      const container = sectionRef.current;
      if (!container) return;

      const p = getPinnedScrollProgress(container, viewportHeight);

      const veilClear = easeOutCubic(invLerp(0, 0.18, p));
      if (veilRef.current) {
        const veilOpacity = lerp(0.75, 0, veilClear);
        veilRef.current.style.opacity = veilOpacity.toFixed(3);
        veilRef.current.style.pointerEvents =
          veilOpacity < 0.05 ? 'none' : 'auto';
      }

      if (discoverPromptRef.current) {
        const promptFade = clamp(1 - invLerp(0, 0.15, p), 0, 1);
        const promptY = lerp(0, -18, easeOutCubic(invLerp(0, 0.16, p)));
        discoverPromptRef.current.style.opacity = promptFade.toFixed(3);
        discoverPromptRef.current.style.transform = `translate3d(0, ${promptY.toFixed(1)}px, 0)`;
      }

      if (envLayerRef.current) {
        const envScale = lerp(1.06, 1.0, easeOutCubic(invLerp(0, 0.65, p)));
        const envY = lerp(0, -24, p);
        envLayerRef.current.style.transform = `translate3d(0, ${envY.toFixed(1)}px, 0) scale(${envScale.toFixed(4)})`;
      }

      if (redGeoShapeRef.current) {
        const geoReveal = easeOutQuart(invLerp(0.05, 0.42, p));
        const geoShiftX = lerp(-24, 10, p);
        const geoScale = lerp(0.92, 1.02, geoReveal);
        redGeoShapeRef.current.style.opacity = lerp(
          0.25,
          1,
          geoReveal
        ).toFixed(3);
        redGeoShapeRef.current.style.transform = `translate3d(${geoShiftX.toFixed(1)}px, 0, 0) scale(${geoScale.toFixed(4)})`;
      }

      const athleteMove = easeOutQuart(invLerp(0.03, 0.45, p));
      if (athleteLayerRef.current) {
        const athleteX = lerp(-28, 8, athleteMove);
        const athleteY = lerp(16, -6, athleteMove);
        const athleteScale = lerp(0.96, 1.01, athleteMove);
        athleteLayerRef.current.style.transform = `translate3d(${athleteX.toFixed(1)}px, ${athleteY.toFixed(1)}px, 0) scale(${athleteScale.toFixed(4)})`;
      }

      const trailProgress = easeInOutCubic(invLerp(0.05, 0.45, p));
      if (primaryTrailRef.current) {
        const offset = MOTION_PATH_LENGTH * (1 - trailProgress);
        primaryTrailRef.current.style.strokeDashoffset = offset.toFixed(1);
      }

      const trail2Progress = easeInOutCubic(invLerp(0.12, 0.52, p));
      if (secondaryTrailRef.current) {
        const offset2 = SECONDARY_PATH_LENGTH * (1 - trail2Progress);
        secondaryTrailRef.current.style.strokeDashoffset = offset2.toFixed(1);
      }

      const headlineProgress = easeOutCubic(invLerp(0.1, 0.45, p));
      if (headlineBlockRef.current) {
        const headlineY = lerp(24, 0, headlineProgress);
        const headlineOpacity = lerp(0.32, 1, headlineProgress);
        headlineBlockRef.current.style.opacity = headlineOpacity.toFixed(3);
        headlineBlockRef.current.style.transform = `translate3d(0, ${headlineY.toFixed(1)}px, 0)`;
      }

      const detailProgress = easeOutCubic(invLerp(0.2, 0.56, p));
      if (detailLayerRef.current) {
        const detailY = lerp(34, -8, detailProgress);
        const detailOpacity = lerp(0, 1, detailProgress);
        detailLayerRef.current.style.opacity = detailOpacity.toFixed(3);
        detailLayerRef.current.style.transform = `translate3d(0, ${detailY.toFixed(1)}px, 0)`;
      }

      if (markersBlockRef.current) {
        const markerProgress = easeOutCubic(invLerp(0.16, 0.5, p));
        markersBlockRef.current.style.opacity = markerProgress.toFixed(3);
        markersBlockRef.current.style.transform = `translate3d(0, ${lerp(12, 0, markerProgress).toFixed(1)}px, 0)`;
      }

      const supportProgress = easeOutCubic(invLerp(0.22, 0.58, p));
      if (supportingBlockRef.current) {
        const supportY = lerp(20, 0, supportProgress);
        const supportOpacity = lerp(0.28, 1, supportProgress);
        supportingBlockRef.current.style.opacity = supportOpacity.toFixed(3);
        supportingBlockRef.current.style.transform = `translate3d(0, ${supportY.toFixed(1)}px, 0)`;
      }

      const exitProgress = easeInOutCubic(invLerp(0.82, 1.0, p));
      if (stageRef.current) {
        const stageY = lerp(0, -24, exitProgress);
        const stageOpacity = lerp(1, 0.9, exitProgress);
        stageRef.current.style.transform = `translate3d(0, ${stageY.toFixed(1)}px, 0)`;
        stageRef.current.style.opacity = stageOpacity.toFixed(3);
      }

      if (progressReadoutRef.current) {
        progressReadoutRef.current.textContent = `${Math.round(p * 100)
          .toString()
          .padStart(3, '0')}%`;
      }

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
    });

    return unsubscribe;
  }, [reducedMotion]);

  const handleDiscoverClick = () => {
    if (typeof window === 'undefined') return;
    scrollEngine.scrollTo(window.innerHeight * 0.72);
  };

  return (
    <>
      {/* SECTION 1 — HERO EXPERIENCE */}
      <section
        id="home"
        ref={sectionRef}
        aria-label="Hero — Build Skills. Discover Potential. Become Extraordinary."
        className={
          reducedMotion
            ? 'relative w-full min-h-screen pt-20 bg-[#FFFFFF] border-b border-[#E7E7E7]'
            : 'relative w-full h-[205vh] bg-[#FFFFFF] border-b border-[#E7E7E7]'
        }
      >
        <div
          className={
            reducedMotion
              ? 'relative w-full min-h-[calc(100vh-5rem)] flex items-center overflow-hidden'
              : 'sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center pt-18 sm:pt-20'
          }
        >
          <div ref={stageRef} className="relative w-full h-full flex items-center">
            {/* LAYER 1: Environmental Architectural Studio Photography */}
            <div
              ref={envLayerRef}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <picture>
                <source
                  srcSet="/images/hero/hero-environment.webp"
                  type="image/webp"
                />
                <img
                  src="/images/hero/hero-environment.jpg"
                  alt=""
                  className="w-full h-full object-cover object-center opacity-30"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF] via-[#FFFFFF]/88 to-[#FFFFFF]/42" />
              <div className="absolute inset-0 editorial-grid-bg opacity-55" />
            </div>

            {/* LAYER 2: Restrained Red Architectural Framing */}
            <div
              ref={redGeoShapeRef}
              aria-hidden="true"
              className="absolute right-[4%] sm:right-[7%] lg:right-[9%] top-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[390px] sm:h-[390px] lg:w-[470px] lg:h-[470px] pointer-events-none"
            >
              <div className="w-full h-full border border-[#D71920]/25 bg-[#D71920]/[0.03] relative">
                <div className="absolute -top-2.5 -left-2.5 w-5 h-5 border-t-2 border-l-2 border-[#D71920]" />
                <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 border-b-2 border-r-2 border-[#D71920]" />
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-[#D71920]" />
              </div>
            </div>

            {/* LAYER 3: Animated Red Motion Trail */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1440 800"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              <line
                x1="80"
                y1="650"
                x2="1360"
                y2="650"
                stroke="#E7E7E7"
                strokeWidth="1"
                strokeDasharray="6 6"
              />
              <path
                ref={primaryTrailRef}
                d="M 120 630 C 420 610, 690 470, 1290 210"
                fill="none"
                stroke="#D71920"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: MOTION_PATH_LENGTH,
                  strokeDashoffset: reducedMotion ? 0 : MOTION_PATH_LENGTH,
                }}
              />
              <path
                ref={secondaryTrailRef}
                d="M 260 665 C 540 625, 820 510, 1340 310"
                fill="none"
                stroke="#D71920"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                style={{
                  strokeDasharray: SECONDARY_PATH_LENGTH,
                  strokeDashoffset: reducedMotion ? 0 : SECONDARY_PATH_LENGTH,
                }}
              />
            </svg>

            {/* MAIN FOREGROUND EDITORIAL GRID */}
            <div className="relative z-20 max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT COLUMN: Typography & CTAs */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div
                  ref={markersBlockRef}
                  className="flex flex-wrap items-center gap-3 mb-4"
                >
                  <span className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#F5F5F5] border border-[#E7E7E7] font-mono-label text-[10px] sm:text-[11px] text-[#151515]">
                    <span
                      aria-hidden="true"
                      className="w-2 h-2 rounded-full bg-[#D71920]"
                    />
                    INVENTIVE SPORTS & PERFORMING ARTS
                  </span>
                </div>

                {/* Headline: BUILD SKILLS. DISCOVER POTENTIAL. BECOME EXTRAORDINARY. */}
                <div ref={headlineBlockRef}>
                  <h1 className="heading-hero text-[#151515] uppercase">
                    <span className="block">BUILD SKILLS.</span>
                    <span className="block">DISCOVER POTENTIAL.</span>
                    <span className="block text-[#D71920]">
                      BECOME EXTRAORDINARY.
                    </span>
                  </h1>
                </div>

                <div ref={supportingBlockRef} className="mt-5 sm:mt-6 max-w-xl">
                  <p className="body-lead text-[#626262]">
                    {settings.hero_subcopy ||
                      'Where sports, strategy, and performing arts come together to shape confident individuals and future champions.'}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4">
                    <a
                      href="#disciplines"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollEngine.scrollTo('#disciplines', -72);
                      }}
                      className="inline-flex items-center gap-3 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-4 hover:bg-[#151515] transition-colors duration-200 group"
                    >
                      <span>
                        {settings.hero_primary_cta || 'EXPLORE DISCIPLINES'}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </a>

                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/about');
                      }}
                      className="inline-flex items-center gap-3 bg-[#FFFFFF] text-[#151515] border border-[#151515] font-mono-label text-xs px-6 py-4 hover:border-[#D71920] hover:text-[#D71920] transition-colors duration-200"
                    >
                      <span>
                        {settings.hero_secondary_cta || 'DISCOVER OUR ACADEMY'}
                      </span>
                    </a>
                  </div>

                  {/* Three Academy Pillars Strip */}
                  <div className="mt-8 pt-5 border-t border-[#E7E7E7] grid grid-cols-3 gap-4">
                    <div>
                      <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
                        01 // SPORTS
                      </span>
                      <span className="block font-mono-label text-[10px] text-[#151515] mt-1">
                        FOOTBALL, CRICKET, SWIMMING, SKATING & BASKETBALL
                      </span>
                    </div>
                    <div>
                      <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
                        02 // STRATEGY
                      </span>
                      <span className="block font-mono-label text-[10px] text-[#151515] mt-1">
                        CLASSICAL & RAPID TOURNAMENT CHESS
                      </span>
                    </div>
                    <div>
                      <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
                        03 // ARTS
                      </span>
                      <span className="block font-mono-label text-[10px] text-[#151515] mt-1">
                        DANCE, MOVEMENT & STAGE SHOWCASES
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Layered Sports Photography */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                <div
                  ref={athleteLayerRef}
                  className="relative w-full max-w-[620px] aspect-[16/11] sm:aspect-[16/10] bg-[#F5F5F5] border border-[#E7E7E7] shadow-[0_24px_60px_rgba(21,21,21,0.1)] overflow-hidden"
                >
                  <picture>
                    <source
                      srcSet="/images/hero/hero-athlete.webp"
                      type="image/webp"
                    />
                    <img
                      src="/images/hero/hero-athlete.jpg"
                      alt="Athlete launching into an explosive sprint inside Inventive Sports studio"
                      fetchPriority="high"
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>

                  <div
                    aria-hidden="true"
                    className="absolute top-3 left-3 flex items-center gap-2 bg-[#FFFFFF]/92 px-2.5 py-1 border border-[#E7E7E7]"
                  >
                    <span className="w-1.5 h-1.5 bg-[#D71920]" />
                    <span className="font-tech-code text-[9px] text-[#151515] font-semibold">
                      INVENTIVE SPORTS // BANGALORE
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#D71920]"
                  />
                </div>

                {/* Secondary Detail Crop Layer */}
                <div
                  ref={detailLayerRef}
                  className="hidden sm:block absolute -bottom-6 -left-6 xl:-left-10 w-44 md:w-52 aspect-[4/3] bg-[#FFFFFF] p-1.5 border border-[#E7E7E7] shadow-[0_16px_36px_rgba(21,21,21,0.12)] z-30"
                >
                  <div className="relative w-full h-full overflow-hidden bg-[#F5F5F5]">
                    <picture>
                      <source
                        srcSet="/images/hero/hero-detail.webp"
                        type="image/webp"
                      />
                      <img
                        src="/images/hero/hero-detail.jpg"
                        alt="Track spike ground force detail"
                        className="w-full h-full object-cover object-center"
                      />
                    </picture>
                  </div>
                  <div className="pt-1.5 px-1 flex items-center justify-between">
                    <span className="font-tech-code text-[9px] text-[#151515] font-semibold">
                      PRECISION TRAINING
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-3 h-[2px] bg-[#D71920]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* INITIAL VEIL */}
            {!reducedMotion && (
              <>
                <div
                  ref={veilRef}
                  aria-hidden="true"
                  className="absolute inset-0 z-30 bg-[#FFFFFF] pointer-events-none"
                  style={{ opacity: 0.75 }}
                />
                <div
                  ref={discoverPromptRef}
                  className="absolute inset-x-0 top-24 sm:top-28 z-40 flex justify-center pointer-events-auto"
                >
                  <button
                    type="button"
                    onClick={handleDiscoverClick}
                    className="inline-flex items-center gap-3 bg-[#FFFFFF] border border-[#151515] px-5 py-2.5 shadow-xs hover:border-[#D71920] transition-colors cursor-pointer group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D71920]" />
                    <span className="font-mono-label text-xs text-[#151515] group-hover:text-[#D71920]">
                      SCROLL TO DISCOVER
                    </span>
                    <ArrowDown
                      aria-hidden="true"
                      className="w-3.5 h-3.5 text-[#D71920]"
                    />
                  </button>
                </div>
              </>
            )}

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-40 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-3 bg-[#FFFFFF]/92 px-3 py-1.5 border border-[#E7E7E7]">
                <span className="font-mono-label text-[10px] text-[#151515]">
                  SCROLL TO EXPLORE
                </span>
                <ArrowDown
                  aria-hidden="true"
                  className="w-3.5 h-3.5 text-[#D71920]"
                />
              </div>

              {!reducedMotion && (
                <div className="hidden sm:flex items-center gap-3 bg-[#FFFFFF]/92 px-3 py-1.5 border border-[#E7E7E7]">
                  <span className="font-tech-code text-[10px] text-[#626262]">
                    HERO SEQUENCE
                  </span>
                  <div className="w-24 h-1 bg-[#E7E7E7] overflow-hidden">
                    <div
                      ref={progressFillRef}
                      className="w-full h-full bg-[#D71920] origin-left"
                      style={{ transform: 'scaleX(0)' }}
                    />
                  </div>
                  <span
                    ref={progressReadoutRef}
                    className="font-tech-code text-[10px] font-semibold text-[#151515] w-9 text-right"
                  >
                    000%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ABOUT THE ACADEMY (EDITORIAL SPLIT LAYOUT) */}
      <section
        id="about-academy-preview"
        aria-labelledby="about-academy-heading"
        className="relative w-full py-20 sm:py-28 bg-[#F5F5F5] border-b border-[#E7E7E7]"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left 6 Columns: Large Academy Image */}
          <div data-reveal className="lg:col-span-6 relative">
            <div className="relative aspect-[16/11] w-full bg-[#FFFFFF] border border-[#E7E7E7] p-2 shadow-[0_16px_44px_rgba(21,21,21,0.08)]">
              <img
                src="/images/about/multi.png"
                alt="Multidisciplinary training at Inventive Sports Academy"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-5 left-5 bg-[#151515]/92 text-[#FFFFFF] px-4 py-2 border-l-2 border-[#D71920]">
                <span className="font-tech-code text-[10px] text-[#D71920] block">
                  ESTABLISHED 2018 // BANGALORE
                </span>
                <span className="font-display font-bold text-sm">
                  Holistic Sports & Performing Arts Ecosystem
                </span>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Animated Heading, Introduction, Selected Highlights & About Link */}
          <div data-reveal className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-6 h-[2px] bg-[#D71920]"
              />
              <span className="font-mono-label text-[11px] text-[#D71920]">
                ABOUT THE ACADEMY
              </span>
            </div>

            <h2
              id="about-academy-heading"
              className="heading-section text-[#151515] uppercase"
            >
              {settings.headline || 'MORE THAN A SPORTS ACADEMY.'}
            </h2>

            <p className="body-lead text-[#626262]">
              {settings.description ||
                'Inventive Sports brings together physical development, strategic thinking, creative expression, and teamwork in a multidisciplinary learning environment. We believe every discipline offers an opportunity to discover strengths, build confidence, and develop lifelong skills.'}
            </p>

            {/* Selected Highlights (No Invented Statistics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E7E7E7]">
              {[
                'Multidisciplinary training across field sports, chess & performing arts',
                'Specialist coaches dedicated to foundational technique and character',
                'Purpose-built centers in Kammanahalli & Hesaraghatta, Bangalore',
                'Structured progression from beginner discovery to tournament play',
              ].map((highlight) => (
                <div key={highlight} className="flex items-start gap-2.5">
                  <CheckCircle2
                    aria-hidden="true"
                    className="w-4 h-4 text-[#D71920] shrink-0 mt-1"
                  />
                  <span className="text-xs sm:text-sm text-[#151515] font-medium leading-snug">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
                className="inline-flex items-center gap-3 bg-[#151515] text-[#FFFFFF] font-mono-label text-xs px-6 py-4 hover:bg-[#D71920] transition-colors group"
              >
                <span>READ OUR STORY & MEET THE LEADERSHIP</span>
                <ArrowRight
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
