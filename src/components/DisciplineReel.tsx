import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
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
import { CmsDiscipline } from '../content';

interface DisciplineReelProps {
  reducedMotion: boolean;
}

export const DisciplineReel: React.FC<DisciplineReelProps> = ({
  reducedMotion,
}) => {
  const { disciplines, navigate } = useCms();

  const wrapperRef = useRef<HTMLElement | null>(null);
  const activeNumBadgeRef = useRef<HTMLSpanElement | null>(null);
  const activeLabelBadgeRef = useRef<HTMLSpanElement | null>(null);
  const overallProgressFillRef = useRef<HTMLDivElement | null>(null);
  const navPillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const sceneStageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageElRefs = useRef<(HTMLImageElement | null)[]>([]);
  const svgPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const svgSecondaryPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const ballMarkerRefs = useRef<(SVGGElement | null)[]>([]);
  const stadiumLightsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textBlockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    const unsubscribe = scrollEngine.subscribe(
      ({ viewportHeight, viewportWidth }) => {
        const wrapperEl = wrapperRef.current;
        if (!wrapperEl || disciplines.length === 0) return;

        const isDesktop = viewportWidth >= 1024;
        let activeIdx = 0;
        const progresses: number[] = [];

        sceneRefs.current.forEach((sceneEl, idx) => {
          if (!sceneEl) {
            progresses.push(0);
            return;
          }
          const rect = sceneEl.getBoundingClientRect();
          if (rect.top <= viewportHeight * 0.45) {
            activeIdx = idx;
          }

          if (isDesktop) {
            progresses.push(getPinnedScrollProgress(sceneEl, viewportHeight));
          } else {
            const start = viewportHeight * 0.85;
            const end = viewportHeight * 0.15;
            progresses.push(
              clamp((start - rect.top) / Math.max(1, start - end), 0, 1)
            );
          }
        });

        const currentDiscipline = disciplines[activeIdx];
        if (activeNumBadgeRef.current) {
          activeNumBadgeRef.current.textContent = String(
            activeIdx + 1
          ).padStart(2, '0');
        }
        if (activeLabelBadgeRef.current && currentDiscipline) {
          activeLabelBadgeRef.current.textContent = currentDiscipline.name;
        }
        if (overallProgressFillRef.current) {
          const totalRatio = clamp(
            (activeIdx + (progresses[activeIdx] ?? 0)) /
              Math.max(1, disciplines.length),
            0,
            1
          );
          overallProgressFillRef.current.style.transform = `scaleX(${totalRatio.toFixed(4)})`;
        }

        navPillRefs.current.forEach((pill, idx) => {
          if (!pill) return;
          pill.dataset.active = idx === activeIdx ? 'true' : 'false';
        });

        // Animate each discipline scene according to its distinct animation_style
        disciplines.forEach((disc, idx) => {
          const p = progresses[idx] ?? 0;
          const m = easeOutQuart(invLerp(0.0, 0.56, p));
          const pathP = easeInOutCubic(invLerp(0.1, 0.72, p));

          const imgWrap = imageWrapRefs.current[idx];
          const imgEl = imageElRefs.current[idx];
          const svgPath = svgPathRefs.current[idx];
          const svgSecPath = svgSecondaryPathRefs.current[idx];
          const ballMarker = ballMarkerRefs.current[idx];
          const stadiumLights = stadiumLightsRefs.current[idx];
          const textBlock = textBlockRefs.current[idx];
          const stageEl = sceneStageRefs.current[idx];

          if (textBlock) {
            const tReveal = easeOutCubic(invLerp(0.04, 0.42, p));
            textBlock.style.opacity = lerp(0.25, 1, tReveal).toFixed(3);
            textBlock.style.transform = `translate3d(0, ${lerp(22, 0, tReveal).toFixed(1)}px, 0)`;
          }

          if (stageEl && isDesktop) {
            const exitP = easeInOutCubic(invLerp(0.85, 1.0, p));
            stageEl.style.opacity = lerp(1, 0.88, exitP).toFixed(3);
            stageEl.style.transform = `translate3d(0, ${lerp(0, -18, exitP).toFixed(1)}px, 0)`;
          } else if (stageEl) {
            stageEl.style.opacity = '1';
            stageEl.style.transform = 'none';
          }

          // Distinct Image Reveal Masks per Discipline Style
          if (imgWrap) {
            switch (disc.animation_style) {
              case 'football-stadium': {
                const insetY = lerp(14, 0, m);
                const insetX = lerp(16, 0, m);
                imgWrap.style.clipPath = `inset(${insetY.toFixed(1)}% ${insetX.toFixed(1)}% ${insetY.toFixed(1)}% ${insetX.toFixed(1)}%)`;
                break;
              }
              case 'cricket-sweep': {
                // Sweeping batting arc reveal from left to right
                const rightX = lerp(22, 100, m);
                const botRightX = lerp(8, 100, m);
                imgWrap.style.clipPath = `polygon(0% 0%, ${rightX.toFixed(1)}% 0%, ${botRightX.toFixed(1)}% 100%, 0% 100%)`;
                break;
              }
              case 'chess-strategy': {
                const inset = lerp(12, 0, m);
                imgWrap.style.clipPath = `inset(${inset.toFixed(1)}% ${inset.toFixed(1)}% ${inset.toFixed(1)}% ${inset.toFixed(1)}%)`;
                break;
              }
              case 'swimming-fluid': {
                const topBottom = lerp(18, 0, m);
                imgWrap.style.clipPath = `inset(${topBottom.toFixed(1)}% 0% ${topBottom.toFixed(1)}% 0%)`;
                break;
              }
              case 'skating-diagonal': {
                const lTop = lerp(35, 0, m);
                const rTop = lerp(70, 100, m);
                const rBot = lerp(65, 100, m);
                const lBot = lerp(30, 0, m);
                imgWrap.style.clipPath = `polygon(${lTop.toFixed(1)}% 0%, ${rTop.toFixed(1)}% 0%, ${rBot.toFixed(1)}% 100%, ${lBot.toFixed(1)}% 100%)`;
                break;
              }
              case 'basketball-arc': {
                const bInset = lerp(15, 0, m);
                imgWrap.style.clipPath = `inset(${bInset.toFixed(1)}% ${bInset.toFixed(1)}% 0% ${bInset.toFixed(1)}%)`;
                break;
              }
              case 'dance-curtain':
              default: {
                const hCurtain = lerp(24, 0, m);
                imgWrap.style.clipPath = `inset(0% ${hCurtain.toFixed(1)}% 0% ${hCurtain.toFixed(1)}%)`;
                break;
              }
            }
          }

          if (imgEl) {
            const scale = lerp(1.16, 1.0, m);
            imgEl.style.transform = `scale(${scale.toFixed(4)})`;
          }

          // Stadium floodlights intensity for Football
          if (stadiumLights) {
            const lightIntensity = easeOutCubic(invLerp(0.08, 0.55, p));
            stadiumLights.style.opacity = lerp(0.15, 1, lightIntensity).toFixed(
              3
            );
          }

          // SVG Path Drawing & Ball Trajectory Marker
          if (svgPath) {
            const totalLen = svgPath.getTotalLength
              ? svgPath.getTotalLength()
              : 720;
            svgPath.style.strokeDasharray = `${totalLen}`;
            svgPath.style.strokeDashoffset = `${(totalLen * (1 - pathP)).toFixed(1)}`;

            if (ballMarker && svgPath.getPointAtLength) {
              const pt = svgPath.getPointAtLength(totalLen * pathP);
              ballMarker.setAttribute(
                'transform',
                `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`
              );
            }
          }

          if (svgSecPath) {
            const secLen = svgSecPath.getTotalLength
              ? svgSecPath.getTotalLength()
              : 520;
            const secP = easeInOutCubic(invLerp(0.22, 0.78, p));
            svgSecPath.style.strokeDasharray = `${secLen}`;
            svgSecPath.style.strokeDashoffset = `${(secLen * (1 - secP)).toFixed(1)}`;
          }
        });
      }
    );

    return unsubscribe;
  }, [reducedMotion, disciplines]);

  const handleJumpToScene = (index: number) => {
    const sceneEl = sceneRefs.current[index];
    if (!sceneEl) return;
    scrollEngine.scrollTo(sceneEl, -72);
  };

  const getDisciplineRoute = (disc: CmsDiscipline) => {
    if (
      disc.slug === 'performing-arts' ||
      disc.category === 'performing-arts'
    ) {
      return '/performing-arts';
    }
    return `/sports/${disc.slug}`;
  };

  return (
    <section
      id="disciplines"
      ref={wrapperRef}
      aria-labelledby="interactive-sports-heading"
      className="relative w-full bg-[#FFFFFF] border-b border-[#E7E7E7]"
    >
      {/* SECTION 3 INTRODUCTION */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12 sm:pb-16">
        <div data-reveal className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-4">
            <span
              aria-hidden="true"
              className="w-8 h-[2px] bg-[#D71920]"
            />
            <span className="font-mono-label text-[11px] text-[#D71920]">
              INTERACTIVE SPORTS & PERFORMING ARTS
            </span>
          </div>

          <h2
            id="interactive-sports-heading"
            className="heading-section text-[#151515]"
          >
            Find Your Game.{' '}
            <span className="font-editorial italic font-normal text-[#D71920]">
              Define Your Greatness.
            </span>
          </h2>

          <p className="mt-5 body-lead text-[#626262]">
            Experience our core sports, strategic board games, and performing
            arts below. Each discipline features its own scroll-controlled
            visual scene and dedicated detail page.
          </p>

          <div className="mt-6 inline-flex items-center gap-2.5 text-xs font-mono-label text-[#151515]">
            <ArrowDown
              aria-hidden="true"
              className="w-4 h-4 text-[#D71920]"
            />
            <span>SCROLL THROUGH ALL {disciplines.length} DISCIPLINES</span>
          </div>
        </div>
      </div>

      {/* STICKY DISCIPLINE PROGRESS BAR */}
      <div className="sticky top-18 sm:top-20 z-30 bg-[#FFFFFF]/95 backdrop-blur-xs border-y border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#D71920] text-[#FFFFFF] font-tech-code text-xs font-semibold">
              <span ref={activeNumBadgeRef}>01</span>
            </span>
            <div className="flex flex-col">
              <span className="font-tech-code text-[9px] text-[#626262]">
                ACTIVE DISCIPLINE
              </span>
              <span
                ref={activeLabelBadgeRef}
                className="font-mono-label text-xs text-[#151515]"
              >
                {disciplines[0]?.name || 'Football'}
              </span>
            </div>
          </div>

          <div
            role="navigation"
            aria-label="Discipline scene selector"
            className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 no-scrollbar"
          >
            {disciplines.map((disc, idx) => (
              <button
                key={disc.slug}
                type="button"
                ref={(el) => {
                  navPillRefs.current[idx] = el;
                }}
                data-active={idx === 0 ? 'true' : 'false'}
                onClick={() => handleJumpToScene(idx)}
                className="px-3 py-1.5 border border-[#E7E7E7] bg-[#F5F5F5] text-[#151515] font-mono-label text-[10px] transition-colors cursor-pointer shrink-0 hover:border-[#D71920] data-[active=true]:bg-[#151515] data-[active=true]:text-[#FFFFFF] data-[active=true]:border-[#151515]"
              >
                0{idx + 1} // {disc.name}
              </button>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-3 w-40">
            <div className="w-full h-1 bg-[#E7E7E7] overflow-hidden">
              <div
                ref={overallProgressFillRef}
                className="w-full h-full bg-[#D71920] origin-left"
                style={{ transform: 'scaleX(0.14)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL SCROLL SCENES FOR EACH DISCIPLINE */}
      {disciplines.map((disc, idx) => {
        const isDarkScene = disc.animation_style === 'football-stadium';
        const isSoftGrey = !isDarkScene && idx % 2 === 1;
        const isImageLeft = idx % 2 === 1;
        const routeHref = getDisciplineRoute(disc);

        return (
          <article
            key={disc.slug}
            id={`scene-${disc.slug}`}
            ref={(el) => {
              sceneRefs.current[idx] = el;
            }}
            className={`${
              reducedMotion
                ? 'relative w-full py-16 lg:py-24 border-b border-[#E7E7E7]'
                : 'relative w-full lg:h-[155vh] py-16 lg:py-0 border-b border-[#E7E7E7]'
            } ${
              isDarkScene
                ? 'bg-[#101010] text-[#FFFFFF]'
                : isSoftGrey
                  ? 'bg-[#F5F5F5] text-[#151515]'
                  : 'bg-[#FFFFFF] text-[#151515]'
            }`}
          >
            {/* FOOTBALL STADIUM FLOODLIGHT BEAMS & PITCH REFLECTION */}
            {isDarkScene && (
              <div
                ref={(el) => {
                  stadiumLightsRefs.current[idx] = el;
                }}
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none overflow-hidden"
              >
                {/* Left & Right Stadium Floodlight Cones */}
                <div
                  className="absolute -top-24 left-[8%] w-[480px] h-[520px] opacity-35"
                  style={{
                    background:
                      'radial-gradient(ellipse at top, rgba(255,255,255,0.34), rgba(255,255,255,0.05) 55%, transparent 75%)',
                  }}
                />
                <div
                  className="absolute -top-24 right-[10%] w-[520px] h-[540px] opacity-40"
                  style={{
                    background:
                      'radial-gradient(ellipse at top, rgba(255,255,255,0.38), rgba(215,25,32,0.08) 50%, transparent 75%)',
                  }}
                />
                {/* Subtle Pitch Horizon Reflection */}
                <div
                  className="absolute bottom-0 inset-x-0 h-36 opacity-35"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(215,25,32,0.16), transparent)',
                  }}
                />
              </div>
            )}

            <div
              ref={(el) => {
                sceneStageRefs.current[idx] = el;
              }}
              className={
                reducedMotion
                  ? 'max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12'
                  : 'lg:sticky lg:top-[7.75rem] lg:h-[calc(100vh-7.75rem)] flex items-center overflow-hidden'
              }
            >
              <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* TEXT COLUMN */}
                <div
                  ref={(el) => {
                    textBlockRefs.current[idx] = el;
                  }}
                  className={`lg:col-span-5 space-y-5 ${
                    isImageLeft ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="font-display font-extrabold text-3xl text-[#D71920]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`w-7 h-[1.5px] ${
                          isDarkScene ? 'bg-[#FFFFFF]/40' : 'bg-[#151515]'
                        }`}
                      />
                      <span
                        className={`font-mono-label text-[10px] ${
                          isDarkScene ? 'text-[#FFFFFF]/75' : 'text-[#626262]'
                        }`}
                      >
                        {disc.tagline}
                      </span>
                    </div>

                    <span className="inline-block font-tech-code text-[11px] font-semibold text-[#D71920] mb-1">
                      {disc.name.toUpperCase()}
                    </span>

                    <h3
                      className={`heading-scene uppercase ${
                        isDarkScene ? 'text-[#FFFFFF]' : 'text-[#151515]'
                      }`}
                    >
                      {disc.scene_heading}
                    </h3>

                    <p
                      className={`mt-3 text-sm sm:text-base leading-relaxed ${
                        isDarkScene ? 'text-[#FFFFFF]/80' : 'text-[#626262]'
                      }`}
                    >
                      {disc.short_description}
                    </p>
                  </div>

                  {/* Skills & Benefits */}
                  {disc.benefits && disc.benefits.length > 0 && (
                    <ul
                      className={`space-y-2.5 pt-3 border-t ${
                        isDarkScene
                          ? 'border-[#FFFFFF]/15'
                          : 'border-[#E7E7E7]'
                      }`}
                    >
                      {disc.benefits.slice(0, 3).map((benefit) => (
                        <li
                          key={benefit}
                          className={`flex items-start gap-2.5 text-xs sm:text-sm font-medium ${
                            isDarkScene ? 'text-[#FFFFFF]' : 'text-[#151515]'
                          }`}
                        >
                          <Check
                            aria-hidden="true"
                            className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5"
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Training Highlights Pills */}
                  {disc.highlights && disc.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {disc.highlights.map((hl) => (
                        <span
                          key={hl}
                          className={`px-2.5 py-1 text-[10px] font-tech-code border ${
                            isDarkScene
                              ? 'bg-[#FFFFFF]/5 border-[#FFFFFF]/20 text-[#FFFFFF]/90'
                              : 'bg-[#F5F5F5] border-[#E7E7E7] text-[#151515]'
                          }`}
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Individual Detail Page CTA */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={routeHref}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(routeHref);
                      }}
                      className="inline-flex items-center gap-3 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#FFFFFF] hover:text-[#151515] border border-[#D71920] transition-colors group"
                    >
                      <span>{disc.cta_text || `EXPLORE ${disc.name}`}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      />
                    </a>

                    <a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/contact');
                      }}
                      className={`inline-flex items-center gap-2 font-mono-label text-xs px-5 py-3.5 border transition-colors ${
                        isDarkScene
                          ? 'border-[#FFFFFF]/35 text-[#FFFFFF] hover:border-[#FFFFFF]'
                          : 'border-[#151515] text-[#151515] hover:border-[#D71920] hover:text-[#D71920]'
                      }`}
                    >
                      <span>BOOK TRIAL</span>
                    </a>
                  </div>
                </div>

                {/* VISUAL SCENE COLUMN WITH BESPOKE SVG OVERLAY PER SPORT */}
                <div
                  className={`lg:col-span-7 relative ${
                    isImageLeft ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div
                    ref={(el) => {
                      imageWrapRefs.current[idx] = el;
                    }}
                    className={`relative aspect-[16/10] w-full overflow-hidden border ${
                      isDarkScene
                        ? 'border-[#FFFFFF]/20 bg-[#151515] shadow-[0_28px_70px_rgba(0,0,0,0.65)]'
                        : 'border-[#E7E7E7] bg-[#F5F5F5] shadow-[0_20px_50px_rgba(21,21,21,0.1)]'
                    }`}
                  >
                    <img
                      ref={(el) => {
                        imageElRefs.current[idx] = el;
                      }}
                      src={disc.cover_image}
                      alt={`${disc.name} at Inventive Sports Academy`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center will-change-transform"
                    />

                    {/* SPORT-SPECIFIC SVG TRAJECTORY & GRAPHIC OVERLAY */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 800 500"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      {disc.animation_style === 'football-stadium' && (
                        <>
                          {/* Stadium Floodlight Glare Nodes */}
                          <circle
                            cx="120"
                            cy="38"
                            r="24"
                            fill="#FFFFFF"
                            fillOpacity="0.22"
                          />
                          <circle
                            cx="690"
                            cy="42"
                            r="28"
                            fill="#FFFFFF"
                            fillOpacity="0.25"
                          />
                          {/* Secondary Red Kinetic Pitch Trail */}
                          <path
                            ref={(el) => {
                              svgSecondaryPathRefs.current[idx] = el;
                            }}
                            d="M 520 435 C 390 385, 250 280, 95 145"
                            fill="none"
                            stroke="#D71920"
                            strokeOpacity="0.55"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                          />
                          {/* Primary Football Flight Trajectory Arc */}
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 515 430 C 370 310, 240 185, 85 110"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          {/* Traveling Football Trajectory Marker */}
                          <g
                            ref={(el) => {
                              ballMarkerRefs.current[idx] = el;
                            }}
                            transform="translate(515, 430)"
                          >
                            <circle
                              r="12"
                              fill="#D71920"
                              fillOpacity="0.3"
                            />
                            <circle
                              r="6"
                              fill="#FFFFFF"
                              stroke="#D71920"
                              strokeWidth="2.5"
                            />
                          </g>
                        </>
                      )}

                      {disc.animation_style === 'cricket-sweep' && (
                        <>
                          {/* Pitch Crease Reference & Cover Drive Trajectory */}
                          <line
                            x1="120"
                            y1="420"
                            x2="680"
                            y2="420"
                            stroke="#FFFFFF"
                            strokeOpacity="0.45"
                            strokeWidth="1.5"
                          />
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 220 410 Q 430 240, 720 155"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <g
                            ref={(el) => {
                              ballMarkerRefs.current[idx] = el;
                            }}
                            transform="translate(220, 410)"
                          >
                            <circle
                              r="6"
                              fill="#D71920"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </g>
                        </>
                      )}

                      {disc.animation_style === 'chess-strategy' && (
                        <>
                          {/* Clean Chessboard Tactical Grid & Calculation Vectors */}
                          {[200, 350, 500, 650].map((x) => (
                            <line
                              key={`v-${x}`}
                              x1={x}
                              y1="60"
                              x2={x}
                              y2="440"
                              stroke="#FFFFFF"
                              strokeOpacity="0.22"
                              strokeDasharray="4 4"
                            />
                          ))}
                          {[140, 250, 360].map((y) => (
                            <line
                              key={`h-${y}`}
                              x1="120"
                              y1={y}
                              x2="680"
                              y2={y}
                              stroke="#FFFFFF"
                              strokeOpacity="0.22"
                              strokeDasharray="4 4"
                            />
                          ))}
                          <rect
                            x="350"
                            y="250"
                            width="150"
                            height="110"
                            fill="#D71920"
                            fillOpacity="0.16"
                            stroke="#D71920"
                            strokeWidth="1.5"
                          />
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 200 360 L 350 250 L 500 250 L 650 140"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="3"
                          />
                          <g
                            ref={(el) => {
                              ballMarkerRefs.current[idx] = el;
                            }}
                            transform="translate(200, 360)"
                          >
                            <rect
                              x="-6"
                              y="-6"
                              width="12"
                              height="12"
                              fill="#D71920"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </g>
                        </>
                      )}

                      {disc.animation_style === 'swimming-fluid' && (
                        <>
                          {/* Hydrodynamic Wave Curves */}
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 60 350 C 220 290, 360 410, 520 340 C 620 295, 700 350, 750 320"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            ref={(el) => {
                              svgSecondaryPathRefs.current[idx] = el;
                            }}
                            d="M 60 390 C 220 330, 360 450, 520 380 C 620 335, 700 390, 750 360"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeOpacity="0.7"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </>
                      )}

                      {disc.animation_style === 'skating-diagonal' && (
                        <>
                          {/* Speed Skating Banking Track Vector */}
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 70 430 C 290 420, 510 290, 730 90"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <g
                            ref={(el) => {
                              ballMarkerRefs.current[idx] = el;
                            }}
                            transform="translate(70, 430)"
                          >
                            <circle
                              r="6"
                              fill="#D71920"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </g>
                        </>
                      )}

                      {disc.animation_style === 'basketball-arc' && (
                        <>
                          {/* Restrained Court Key & High Parabolic Shot Arc */}
                          <circle
                            cx="640"
                            cy="170"
                            r="28"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeOpacity="0.55"
                            strokeWidth="2"
                          />
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 140 410 Q 390 25, 640 170"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <g
                            ref={(el) => {
                              ballMarkerRefs.current[idx] = el;
                            }}
                            transform="translate(140, 410)"
                          >
                            <circle
                              r="7"
                              fill="#D71920"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />
                          </g>
                        </>
                      )}

                      {disc.animation_style === 'dance-curtain' && (
                        <>
                          {/* Expressive Stage Movement Ribbon */}
                          <path
                            ref={(el) => {
                              svgPathRefs.current[idx] = el;
                            }}
                            d="M 85 415 Q 390 55, 715 245"
                            fill="none"
                            stroke="#D71920"
                            strokeWidth="2.75"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>

                    {/* Top Corner Scene Label */}
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 border font-tech-code text-[10px] font-semibold ${
                        isDarkScene
                          ? 'bg-[#101010]/90 border-[#FFFFFF]/20 text-[#FFFFFF]'
                          : 'bg-[#FFFFFF]/95 border-[#E7E7E7] text-[#151515]'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')} //{' '}
                      {disc.name.toUpperCase()}
                    </div>

                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#D71920]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};
