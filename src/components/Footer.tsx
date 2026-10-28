import React from 'react';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import { scrollEngine } from '../lib/scroll';
import { useCms } from '../lib/cms';

export const Footer: React.FC = () => {
  const { navigate, settings, disciplines } = useCms();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    navigate(href);
  };

  const handleBackToTop = () => {
    scrollEngine.scrollTo(0);
  };

  return (
    <footer className="bg-[#FFFFFF] text-[#151515] border-t border-[#E7E7E7]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#E7E7E7]">
          {/* Column 1: Official Inventive Sports Logo & Identity */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-block"
              aria-label="Inventive Sports & Performing Arts — Home"
            >
              <img
                src={
                  settings.logo_url || '/images/brand/inventive-sports-logo.png'
                }
                alt="Inventive Sports Official Logo"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </a>

            <p className="text-sm text-[#626262] max-w-sm leading-relaxed">
              Where sports, strategy, and performing arts come together to shape
              confident individuals and future champions.
            </p>

            <div className="pt-1 font-tech-code text-[11px] text-[#151515]">
              CENTERS: {settings.centers || 'Kammanahalli & Hesaraghatta, Bangalore'}
            </div>
          </div>

          {/* Column 2: Website Pages */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-mono-label text-xs text-[#151515]">
              EXPLORE
            </h2>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'All Sports', href: '/sports' },
                { label: 'Performing Arts', href: '/performing-arts' },
                { label: 'Events', href: '/events' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Shop', href: '/shop' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className="text-sm text-[#626262] hover:text-[#D71920] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Sports & Performing Arts Detail Pages */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="font-mono-label text-xs text-[#151515]">
              DISCIPLINES
            </h2>
            <ul className="space-y-2.5">
              {disciplines.map((disc, idx) => {
                const targetHref =
                  disc.slug === 'performing-arts'
                    ? '/performing-arts'
                    : `/sports/${disc.slug}`;
                return (
                  <li key={disc.slug}>
                    <a
                      href={targetHref}
                      onClick={(e) => handleLinkClick(e, targetHref)}
                      className="text-sm text-[#626262] hover:text-[#D71920] transition-colors inline-flex items-center gap-2"
                    >
                      <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
                        0{idx + 1}
                      </span>
                      <span>{disc.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Centers, Legal & Admin CMS Access */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-mono-label text-xs text-[#151515]">
              ACADEMY CENTERS & LEGAL
            </h2>
            <div className="space-y-2 text-xs text-[#626262] leading-relaxed">
              <p className="text-[#151515] font-semibold">
                Inventive Sports & Performing Arts
              </p>
              <p>Kammanahalli & Hesaraghatta Centers, Bangalore</p>
              <p>
                Official Website:{' '}
                <a
                  href="https://www.inventivesports.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D71920] underline"
                >
                  inventivesports.co
                </a>
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3 text-xs text-[#626262]">
              <a
                href="/privacy-policy"
                onClick={(e) => handleLinkClick(e, '/privacy-policy')}
                className="hover:text-[#D71920] underline"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/terms"
                onClick={(e) => handleLinkClick(e, '/terms')}
                className="hover:text-[#D71920] underline"
              >
                Terms & Conditions
              </a>
            </div>

            <div className="pt-2">
              <a
                href="/admin"
                onClick={(e) => handleLinkClick(e, '/admin')}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F5F5F5] border border-[#E7E7E7] font-tech-code text-[10px] font-semibold text-[#151515] hover:border-[#D71920] hover:text-[#D71920] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
                <span>LARAVEL ADMIN CMS (/admin)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back-to-Top Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-tech-code text-[11px] text-[#626262]">
            © {new Date().getFullYear()} Inventive Sports & Performing Arts. All
            rights reserved.
          </p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-2 font-mono-label text-xs text-[#151515] hover:text-[#D71920] transition-colors cursor-pointer group"
          >
            <span>BACK TO TOP</span>
            <span className="w-7 h-7 border border-[#E7E7E7] group-hover:border-[#D71920] flex items-center justify-center">
              <ArrowUp
                className="w-3.5 h-3.5 text-[#D71920]"
                aria-hidden="true"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};
