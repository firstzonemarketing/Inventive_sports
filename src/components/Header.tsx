import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { scrollEngine } from '../lib/scroll';
import { useCms } from '../lib/cms';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Sports', href: '/sports', hasSportsMenu: true },
  { label: 'Performing Arts', href: '/performing-arts' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const { path, navigate, settings, disciplines } = useCms();
  const headerRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sportsDropdownOpen, setSportsDropdownOpen] = useState(false);

  const sportsDisciplines = disciplines.filter(
    (d) => d.category === 'sports' || d.slug !== 'performing-arts'
  );

  useEffect(() => {
    const unsubscribe = scrollEngine.subscribe(({ scrollY, viewportHeight }) => {
      const headerEl = headerRef.current;
      if (headerEl) {
        const isPastThreshold = scrollY > viewportHeight * 0.08;
        headerEl.dataset.scrolled = isPastThreshold ? 'true' : 'false';
      }

      const barEl = progressBarRef.current;
      if (barEl && typeof document !== 'undefined') {
        const docHeight = Math.max(
          1,
          document.documentElement.scrollHeight - viewportHeight
        );
        const ratio = Math.min(1, Math.max(0, scrollY / docHeight));
        barEl.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setSportsDropdownOpen(false);
    navigate(href);
  };

  const isRouteActive = (href: string) => {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF]/96 backdrop-blur-xs border-b border-[#E7E7E7] transition-shadow duration-300 data-[scrolled=true]:shadow-[0_4px_24px_rgba(21,21,21,0.06)]"
    >
      {/* Top Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        className="w-full h-[2px] bg-[#F5F5F5] overflow-hidden"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full bg-[#D71920] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Official Inventive Sports Logo (Image 1 — Preserving Original Aspect Ratio & Colors) */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="inline-flex items-center gap-3 py-1 focus-visible:outline-[#D71920] shrink-0"
          aria-label="Inventive Sports & Performing Arts — Home"
        >
          <img
            src={settings.logo_url || '/images/brand/inventive-sports-logo.png'}
            alt="Inventive Sports Official Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Primary Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-6"
        >
          {NAV_LINKS.map((item) => {
            const active = isRouteActive(item.href);

            if (item.hasSportsMenu) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setSportsDropdownOpen(true)}
                  onMouseLeave={() => setSportsDropdownOpen(false)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={`inline-flex items-center gap-1 py-2 text-xs font-mono-label transition-colors duration-200 ${
                      active
                        ? 'text-[#D71920]'
                        : 'text-[#151515] hover:text-[#D71920]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>

                  {sportsDropdownOpen && (
                    <div className="absolute left-0 top-full pt-2 w-60 z-50">
                      <div className="bg-[#FFFFFF] border border-[#E7E7E7] shadow-xl py-2 divide-y divide-[#F5F5F5]">
                        <a
                          href="/sports"
                          onClick={(e) => handleLinkClick(e, '/sports')}
                          className="block px-4 py-2.5 text-[11px] font-mono-label text-[#D71920] hover:bg-[#F5F5F5]"
                        >
                          ALL SPORTS OVERVIEW →
                        </a>
                        {sportsDisciplines.map((sport) => (
                          <a
                            key={sport.slug}
                            href={
                              sport.slug === 'performing-arts'
                                ? '/performing-arts'
                                : `/sports/${sport.slug}`
                            }
                            onClick={(e) =>
                              handleLinkClick(
                                e,
                                sport.slug === 'performing-arts'
                                  ? '/performing-arts'
                                  : `/sports/${sport.slug}`
                              )
                            }
                            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-[#151515] hover:bg-[#F5F5F5] hover:text-[#D71920] transition-colors"
                          >
                            <span>{sport.name}</span>
                            <span className="font-tech-code text-[10px] text-[#626262]">
                              0{sport.display_order}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`relative py-1 text-xs font-mono-label transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#D71920] after:origin-left after:transition-transform after:duration-200 ${
                  active
                    ? 'text-[#D71920] after:scale-x-100'
                    : 'text-[#151515] hover:text-[#D71920] after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Admin CMS Shortcut + Enquire CTA + Mobile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="/admin"
            onClick={(e) => handleLinkClick(e, '/admin')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 border border-[#E7E7E7] bg-[#F5F5F5] text-[#151515] hover:border-[#D71920] hover:text-[#D71920] font-tech-code text-[10px] font-semibold transition-colors"
            title="Admin CMS Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
            <span>ADMIN CMS</span>
          </a>

          <a
            href="/contact"
            onClick={(e) => handleLinkClick(e, '/contact')}
            className="hidden sm:inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-4 sm:px-5 py-2.5 hover:bg-[#151515] transition-colors duration-200 group"
          >
            <span>ENQUIRE NOW</span>
            <ArrowUpRight
              aria-hidden="true"
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-menu"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 border border-[#E7E7E7] bg-[#FFFFFF] text-[#151515] hover:border-[#D71920] hover:text-[#D71920] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Panel with Official Logo */}
      {mobileMenuOpen && (
        <nav
          id="mobile-primary-menu"
          aria-label="Mobile Navigation"
          className="xl:hidden bg-[#FFFFFF] border-b border-[#E7E7E7] px-4 sm:px-8 py-6 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E7E7]">
            <img
              src={
                settings.logo_url || '/images/brand/inventive-sports-logo.png'
              }
              alt="Inventive Sports Official Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="font-tech-code text-[10px] text-[#626262]">
              NAVIGATION MENU
            </span>
          </div>

          <ul className="flex flex-col divide-y divide-[#E7E7E7]">
            {NAV_LINKS.map((item, idx) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="flex items-center justify-between py-3 text-sm font-mono-label text-[#151515] hover:text-[#D71920] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="font-tech-code text-[11px] text-[#626262]">
                    0{idx + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Quick Sports Links on Mobile */}
          <div className="mt-4 pt-4 border-t border-[#E7E7E7]">
            <span className="block font-tech-code text-[10px] text-[#626262] mb-2">
              INDIVIDUAL SPORTS PAGES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sportsDisciplines.map((s) => (
                <a
                  key={s.slug}
                  href={
                    s.slug === 'performing-arts'
                      ? '/performing-arts'
                      : `/sports/${s.slug}`
                  }
                  onClick={(e) =>
                    handleLinkClick(
                      e,
                      s.slug === 'performing-arts'
                        ? '/performing-arts'
                        : `/sports/${s.slug}`
                    )
                  }
                  className="px-2.5 py-1 bg-[#F5F5F5] border border-[#E7E7E7] text-xs font-medium text-[#151515] hover:border-[#D71920]"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E7E7E7] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, '/contact')}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-5 py-3.5 hover:bg-[#151515] transition-colors"
            >
              <span>ENQUIRE NOW</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/admin"
              onClick={(e) => handleLinkClick(e, '/admin')}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F5F5] text-[#151515] border border-[#E7E7E7] font-mono-label text-xs px-5 py-3.5 hover:border-[#D71920]"
            >
              <ShieldCheck className="w-4 h-4 text-[#D71920]" />
              <span>ADMIN CMS DASHBOARD</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
