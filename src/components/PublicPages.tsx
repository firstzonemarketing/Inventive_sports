import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { CmsGalleryItem, CmsProduct } from '../content';
import { useCms } from '../lib/cms';
import { JoinAcademy } from './JoinAcademy';

/* ============================================================================
 * 1. SPORTS DIRECTORY PAGE (/sports)
 * ========================================================================== */
export const SportsDirectoryPage: React.FC = () => {
  const { disciplines, squad, navigate } = useCms();

  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      <section className="py-20 sm:py-28 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[2px] bg-[#D71920]" />
            <span className="font-mono-label text-xs text-[#D71920]">
              SPORTS, GAMES &amp; PERFORMING ARTS
            </span>
          </div>
          <h1 className="heading-hero text-[#FFFFFF] max-w-4xl">
            CHOOSE YOUR ARENA.{' '}
            <span className="block text-[#D71920]">TRAIN WITH EXPERTS.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#D4D4D4] max-w-2xl leading-relaxed">
            Explore our seven specialized training tracks across Football,
            Cricket, Chess, Swimming, Skating, Basketball, and Dance &amp;
            Performing Arts at our Kammanahalli and Hesaraghatta centers.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#FFFFFF] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
          {disciplines.map((disc, idx) => {
            const isEven = idx % 2 === 0;
            const href =
              disc.slug === 'performing-arts'
                ? '/performing-arts'
                : `/sports/${disc.slug}`;
            const coaches = squad.filter(
              (s) =>
                s.discipline.toLowerCase() === disc.name.toLowerCase() ||
                disc.name.toLowerCase().includes(s.discipline.toLowerCase())
            );

            return (
              <article
                key={disc.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-[#E7E7E7] bg-[#F5F5F5] p-6 sm:p-10"
              >
                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#101010] border border-[#E7E7E7]">
                    <img
                      src={disc.cover_image}
                      alt={disc.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-4 left-4 bg-[#101010]/90 text-[#FFFFFF] px-3 py-1 font-tech-code text-xs">
                      0{idx + 1} // {disc.name.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  } space-y-5`}
                >
                  <div>
                    <span className="font-mono-label text-xs text-[#D71920]">
                      {disc.tagline}
                    </span>
                    <h2 className="mt-1 heading-scene text-[#151515]">
                      {disc.name} — {disc.scene_heading}
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
                    {disc.full_description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-[#E7E7E7]">
                    {disc.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[#151515]"
                      >
                        <Check className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {coaches.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="font-tech-code text-[10px] text-[#626262]">
                        ACADEMY EXPERTS:
                      </span>
                      {coaches.map((c) => (
                        <span
                          key={c.id}
                          className="px-2.5 py-0.5 bg-[#FFFFFF] border border-[#E7E7E7] font-mono-label text-[10px] text-[#151515]"
                        >
                          {c.name} ({c.designation})
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(href)}
                      className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#151515] transition-colors cursor-pointer"
                    >
                      <span>{disc.cta_text}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="inline-flex items-center gap-2 bg-[#FFFFFF] text-[#151515] border border-[#151515] font-mono-label text-xs px-5 py-3.5 hover:border-[#D71920] hover:text-[#D71920] transition-colors cursor-pointer"
                    >
                      <span>BOOK TRIAL SESSION</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <JoinAcademy />
    </div>
  );
};

/* ============================================================================
 * 2. INDIVIDUAL SPORT / PERFORMING ARTS DETAIL PAGE (/sports/:slug & /performing-arts)
 * ========================================================================== */
export const SportDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { disciplines, squad, gallery, navigate } = useCms();

  const discipline =
    disciplines.find((d) => d.slug === slug) ||
    disciplines.find((d) =>
      slug === 'performing-arts' ? d.slug === 'performing-arts' : false
    ) ||
    disciplines[0];

  const isFootball = discipline.slug === 'football';

  const matchingSquad = squad.filter(
    (member) =>
      member.discipline.toLowerCase() === discipline.name.toLowerCase() ||
      discipline.name.toLowerCase().includes(member.discipline.toLowerCase())
  );

  const matchingGallery = gallery.filter(
    (g) =>
      g.discipline.toLowerCase() === discipline.name.toLowerCase() ||
      discipline.name.toLowerCase().includes(g.discipline.toLowerCase())
  );

  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      {/* Hero Banner */}
      <section className="relative py-20 sm:py-28 bg-[#101010] text-[#FFFFFF] border-b border-[#242424] overflow-hidden">
        {isFootball && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 20%, rgba(215,25,32,0.22), transparent 50%)',
            }}
          />
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate('/sports')}
            className="inline-flex items-center gap-2 font-mono-label text-xs text-[#D4D4D4] hover:text-[#D71920] mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL DISCIPLINES</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-8 h-[2px] bg-[#D71920]" />
                <span className="font-mono-label text-xs text-[#D71920]">
                  {discipline.tagline}
                </span>
              </div>

              <h1 className="heading-hero text-[#FFFFFF]">
                {discipline.name.toUpperCase()}
                <span className="block text-[#D71920] text-2xl sm:text-4xl mt-2">
                  {discipline.scene_heading}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed">
                {discipline.full_description}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-6 py-3.5 hover:bg-[#FFFFFF] hover:text-[#151515] transition-colors"
                >
                  <span>ENQUIRE ABOUT {discipline.name.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#2A2A2A] bg-[#161616]">
                <img
                  src={discipline.cover_image}
                  alt={discipline.name}
                  className="w-full h-full object-cover object-center"
                />
                {isFootball && (
                  <svg
                    viewBox="0 0 800 500"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <path
                      d="M 90 420 Q 380 90 710 155"
                      fill="none"
                      stroke="#D71920"
                      strokeWidth="3.5"
                      strokeDasharray="8 6"
                    />
                    <circle
                      cx="710"
                      cy="155"
                      r="10"
                      fill="#D71920"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & Highlights */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 bg-[#F5F5F5] border border-[#E7E7E7] p-8 sm:p-10">
            <span className="font-mono-label text-xs text-[#D71920]">
              CURRICULUM &amp; TRAINING METHODOLOGY
            </span>
            <h2 className="mt-2 heading-scene text-[#151515]">
              What Students Master in {discipline.name}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#626262] leading-relaxed">
              {discipline.short_description}
            </p>

            <div className="mt-8 space-y-4">
              {discipline.benefits.map((benefit, i) => (
                <div
                  key={benefit}
                  className="bg-[#FFFFFF] border border-[#E7E7E7] p-5 flex items-start gap-4"
                >
                  <span className="font-tech-code text-xs font-bold text-[#D71920] bg-[#F5F5F5] px-2.5 py-1 border border-[#E7E7E7]">
                    0{i + 1}
                  </span>
                  <p className="text-sm sm:text-base font-medium text-[#151515]">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#151515] text-[#FFFFFF] p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="font-mono-label text-xs text-[#D71920]">
                PROGRAM HIGHLIGHTS
              </span>
              <h3 className="mt-2 heading-scene text-[#FFFFFF]">
                Structured Progression
              </h3>
              <ul className="mt-6 space-y-4">
                {discipline.highlights.map((hl) => (
                  <li
                    key={hl}
                    className="flex items-start gap-3 text-sm text-[#E5E5E5]"
                  >
                    <Sparkles className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#2A2A2A] space-y-2 text-xs text-[#A0A0A0]">
              <div className="font-mono-label text-[#FFFFFF]">
                AVAILABLE AT BOTH CENTERS
              </div>
              <p>Kammanahalli Center &amp; Hesaraghatta Center, Bangalore</p>
              <p>Beginner, Intermediate &amp; Competitive Squad Batches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist Coaches for this Discipline */}
      {matchingSquad.length > 0 && (
        <section className="py-20 bg-[#F5F5F5] border-b border-[#E7E7E7]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <span className="font-mono-label text-xs text-[#D71920]">
              COACHING FACULTY
            </span>
            <h2 className="mt-1 heading-scene text-[#151515] mb-8">
              {discipline.name} Specialist Mentors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingSquad.map((coach) => (
                <div
                  key={coach.id}
                  className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 flex items-center gap-4"
                >
                  <img
                    src={coach.portrait_url}
                    alt={coach.name}
                    className="w-20 h-20 object-cover object-top border border-[#E7E7E7]"
                  />
                  <div>
                    <span className="font-tech-code text-[10px] text-[#D71920] font-bold">
                      {coach.designation.toUpperCase()}
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#151515]">
                      {coach.name}
                    </h3>
                    <p className="text-xs text-[#626262] mt-1">{coach.biography}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discipline Gallery */}
      {matchingGallery.length > 0 && (
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E7E7E7]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <span className="font-mono-label text-xs text-[#D71920]">
              TRAINING MOMENTS
            </span>
            <h2 className="mt-1 heading-scene text-[#151515] mb-8">
              {discipline.name} in Action
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchingGallery.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#E7E7E7] bg-[#F5F5F5] p-3"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#101010]">
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-3 px-2">
                    <h3 className="font-display font-bold text-base text-[#151515]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#626262] mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <JoinAcademy selectedDiscipline={discipline.name} />
    </div>
  );
};

/* ============================================================================
 * 3. EVENTS PAGE (/events and /events/:slug)
 * ========================================================================== */
export const EventsPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const { events, navigate } = useCms();
  const [filterDiscipline, setFilterDiscipline] = useState<string>('All');

  const published = events.filter((e) => e.status === 'published');

  if (slug) {
    const singleEvent =
      published.find((e) => e.slug === slug) || events[0];
    return (
      <div className="bg-[#FFFFFF] text-[#151515]">
        <section className="py-20 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 font-mono-label text-xs text-[#D4D4D4] hover:text-[#D71920] mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO ALL EVENTS</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="font-mono-label text-xs text-[#D71920]">
                  OFFICIAL ACADEMY EVENT // {singleEvent.discipline.toUpperCase()}
                </span>
                <h1 className="heading-section text-[#FFFFFF]">
                  {singleEvent.title}
                </h1>
                <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed">
                  {singleEvent.description}
                </p>
                <div className="pt-4 flex flex-wrap gap-6 text-xs text-[#FFFFFF]">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D71920]" />
                    {singleEvent.start_date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D71920]" />
                    {singleEvent.start_time} – {singleEvent.end_time}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D71920]" />
                    {singleEvent.venue}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="aspect-[16/10] w-full overflow-hidden border border-[#2A2A2A]">
                  <img
                    src={singleEvent.cover_image}
                    alt={singleEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <JoinAcademy selectedEventNote={singleEvent.title} />
      </div>
    );
  }

  const disciplines = ['All', 'Chess', 'Football', 'Dance and Performing Arts'];
  const filtered =
    filterDiscipline === 'All'
      ? published
      : published.filter((e) => e.discipline === filterDiscipline);

  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      <section className="py-20 sm:py-28 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[2px] bg-[#D71920]" />
            <span className="font-mono-label text-xs text-[#D71920]">
              TOURNAMENTS, CHAMPIONSHIPS &amp; SHOWCASES
            </span>
          </div>
          <h1 className="heading-hero text-[#FFFFFF]">
            UPCOMING ACADEMY{' '}
            <span className="block text-[#D71920]">EVENTS.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#D4D4D4] max-w-2xl">
            Compete in rapid chess tournaments, inter-center football and
            basketball meets, and live stage showcases.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#FFFFFF] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[#E7E7E7]">
            {disciplines.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setFilterDiscipline(d)}
                className={`px-4 py-2 font-mono-label text-xs border cursor-pointer ${
                  filterDiscipline === d
                    ? 'bg-[#151515] text-[#FFFFFF] border-[#151515]'
                    : 'bg-[#F5F5F5] text-[#151515] border-[#E7E7E7] hover:border-[#D71920]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filtered.map((ev) => (
              <article
                key={ev.id}
                className="bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] flex flex-col justify-between overflow-hidden shadow-xs"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#151515]">
                  <img
                    src={ev.cover_image}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-tech-code text-[10px] font-bold text-[#D71920]">
                      {ev.discipline.toUpperCase()} // {ev.start_date}
                    </span>
                    <h2 className="mt-2 heading-card text-[#151515]">
                      {ev.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#626262]">
                      {ev.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-[#E7E7E7] text-xs text-[#626262] space-y-1">
                      <div>
                        <strong>Time:</strong> {ev.start_time} – {ev.end_time}
                      </div>
                      <div>
                        <strong>Venue:</strong> {ev.venue}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E7E7E7] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigate(`/events/${ev.slug}`)}
                      className="inline-flex items-center gap-2 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-5 py-2.5 hover:bg-[#151515] transition-colors cursor-pointer"
                    >
                      <span>VIEW &amp; REGISTER</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JoinAcademy />
    </div>
  );
};

/* ============================================================================
 * 4. GALLERY PAGE (/gallery)
 * ========================================================================== */
export const GalleryPage: React.FC = () => {
  const { albums, gallery } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<CmsGalleryItem | null>(null);

  const categories = [
    'All',
    'Training Sessions',
    'Competitions',
    'Performances',
    'Event Galleries',
  ];
  const disciplines = [
    'All',
    'Football',
    'Cricket',
    'Chess',
    'Swimming',
    'Skating',
    'Basketball',
    'Dance and Performing Arts',
  ];

  const filtered = gallery
    .filter((g) => g.is_published)
    .filter((g) =>
      selectedCategory === 'All' ? true : g.category === selectedCategory
    )
    .filter((g) =>
      selectedDiscipline === 'All' ? true : g.discipline === selectedDiscipline
    );

  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      <section className="py-20 sm:py-28 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[2px] bg-[#D71920]" />
            <span className="font-mono-label text-xs text-[#D71920]">
              PHOTOGRAPHY &amp; ARCHIVE
            </span>
          </div>
          <h1 className="heading-hero text-[#FFFFFF]">
            INSIDE THE{' '}
            <span className="block text-[#D71920]">INVENTIVE ARENA.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#D4D4D4] max-w-2xl">
            Browse authentic moments from daily training sessions, rapid chess
            tournaments, swimming lanes, skating rinks, and stage performances.
          </p>
        </div>
      </section>

      {/* Featured Albums */}
      <section className="py-16 bg-[#F5F5F5] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <span className="font-mono-label text-xs text-[#D71920]">
            CURATED ALBUMS
          </span>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-[#FFFFFF] border border-[#E7E7E7] p-6 flex flex-col sm:flex-row gap-6 items-center"
              >
                <img
                  src={album.cover_image}
                  alt={album.title}
                  className="w-full sm:w-44 h-32 object-cover border border-[#E7E7E7]"
                />
                <div>
                  <h2 className="font-display font-bold text-xl text-[#151515]">
                    {album.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#626262]">
                    {album.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filterable Gallery Grid */}
      <section className="py-20 bg-[#FFFFFF] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#E7E7E7]">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 font-mono-label text-xs border cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#151515] text-[#FFFFFF] border-[#151515]'
                      : 'bg-[#F5F5F5] text-[#151515] border-[#E7E7E7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#D71920]" />
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                aria-label="Filter gallery by discipline"
                className="px-3.5 py-2 bg-[#F5F5F5] border border-[#E7E7E7] font-mono-label text-xs text-[#151515]"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Disciplines' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <figure
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] p-2.5 cursor-pointer transition-all"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#101010]">
                  <img
                    src={item.media_url}
                    alt={item.alt_text || item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#FFFFFF]/95 px-2.5 py-0.5 border border-[#E7E7E7]">
                    <span className="font-tech-code text-[9px] font-bold text-[#D71920]">
                      {item.discipline.toUpperCase()}
                    </span>
                  </div>
                </div>
                <figcaption className="pt-3 px-1.5 pb-1">
                  <div className="font-display font-bold text-sm text-[#151515]">
                    {item.title}
                  </div>
                  <p className="mt-1 text-xs text-[#626262]">{item.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[90] bg-[#101010]/90 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#FFFFFF] border border-[#E7E7E7] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E7E7E7]">
              <h3 className="font-display font-bold text-base">
                {lightboxItem.title}
              </h3>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="p-1.5 border border-[#E7E7E7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[16/10] bg-[#101010]">
              <img
                src={lightboxItem.media_url}
                alt={lightboxItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 text-sm text-[#626262]">
              {lightboxItem.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 5. SHOP PAGE (/shop and /shop/:slug)
 * ========================================================================== */
export const ShopPage: React.FC<{ slug?: string }> = ({ slug }) => {
  const { products, submitLeadEnquiry, navigate } = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [enquiryProduct, setEnquiryProduct] = useState<CmsProduct | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'done'>(
    'idle'
  );

  const publishedProducts = products.filter((p) => p.is_published);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryProduct || !buyerName || !buyerEmail) return;
    setOrderStatus('submitting');
    await submitLeadEnquiry({
      name: buyerName,
      email: buyerEmail,
      phone: buyerPhone,
      preferred_discipline: `Shop Order: ${enquiryProduct.name}`,
      enquiry_type: `Product Reservation (${enquiryProduct.sku})`,
      message:
        buyerNotes ||
        `Product enquiry for ${enquiryProduct.name} (SKU: ${enquiryProduct.sku}) at ₹${
          enquiryProduct.sale_price ?? enquiryProduct.price
        }.`,
      source_page: '/shop',
    });
    setOrderStatus('done');
  };

  if (slug) {
    const product =
      publishedProducts.find((p) => p.slug === slug) || publishedProducts[0];
    return (
      <div className="bg-[#FFFFFF] text-[#151515] py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 font-mono-label text-xs text-[#626262] hover:text-[#D71920] mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ACADEMY SHOP</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 bg-[#F5F5F5] border border-[#E7E7E7] p-4">
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#101010]">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="font-tech-code text-xs font-bold text-[#D71920]">
                  {product.category_name.toUpperCase()} // SKU: {product.sku}
                </span>
                <h1 className="mt-2 heading-scene text-[#151515]">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-3xl text-[#151515]">
                  ₹{product.sale_price ?? product.price}
                </span>
                {product.sale_price && (
                  <span className="font-tech-code text-base text-[#626262] line-through">
                    ₹{product.price}
                  </span>
                )}
                <span className="px-2.5 py-1 bg-[#F5F5F5] border border-[#E7E7E7] font-tech-code text-[10px] text-[#151515]">
                  {product.stock_quantity > 0
                    ? `IN STOCK (${product.stock_quantity} AVAILABLE)`
                    : 'OUT OF STOCK'}
                </span>
              </div>

              <p className="text-base text-[#626262] leading-relaxed">
                {product.description}
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryProduct(product);
                    setOrderStatus('idle');
                  }}
                  className="inline-flex items-center gap-2.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs px-7 py-4 hover:bg-[#151515] transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>RESERVE / ENQUIRE THIS ITEM</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    'All',
    ...Array.from(new Set(publishedProducts.map((p) => p.category_name))),
  ];

  const filteredProducts = publishedProducts
    .filter((p) =>
      selectedCategory === 'All' ? true : p.category_name === selectedCategory
    )
    .filter((p) =>
      !searchQuery.trim()
        ? true
        : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      <section className="py-20 sm:py-28 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[2px] bg-[#D71920]" />
            <span className="font-mono-label text-xs text-[#D71920]">
              OFFICIAL ACADEMY MERCHANDISE &amp; GEAR
            </span>
          </div>
          <h1 className="heading-hero text-[#FFFFFF]">
            INVENTIVE PRO{' '}
            <span className="block text-[#D71920]">ACADEMY SHOP.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#D4D4D4] max-w-2xl">
            Official training jerseys, tournament-grade Staunton chess sets,
            thermo-bonded footballs, and inline skating gear curated by our
            coaching squad.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#FFFFFF] border-b border-[#E7E7E7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#E7E7E7]">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-mono-label text-xs border cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#151515] text-[#FFFFFF] border-[#151515]'
                      : 'bg-[#F5F5F5] text-[#151515] border-[#E7E7E7]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#626262] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gear or apparel..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-[#E7E7E7] text-xs text-[#151515]"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-[#FFFFFF] border border-[#E7E7E7] hover:border-[#151515] flex flex-col justify-between overflow-hidden transition-all shadow-xs"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#101010]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.sale_price && (
                    <div className="absolute top-3 left-3 bg-[#D71920] text-[#FFFFFF] px-2.5 py-0.5 font-tech-code text-[10px] font-bold">
                      SALE
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-tech-code text-[10px] text-[#626262]">
                      {product.category_name} // {product.sku}
                    </span>
                    <h2 className="mt-1 font-display font-bold text-lg text-[#151515]">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-xs text-[#626262] line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E7E7E7]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-extrabold text-xl text-[#151515]">
                          ₹{product.sale_price ?? product.price}
                        </span>
                        {product.sale_price && (
                          <span className="font-tech-code text-xs text-[#626262] line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      <span className="font-tech-code text-[10px] text-[#D71920] font-semibold">
                        {product.stock_quantity} IN STOCK
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/shop/${product.slug}`)}
                        className="py-2.5 px-3 border border-[#151515] font-mono-label text-[10px] text-[#151515] hover:border-[#D71920] hover:text-[#D71920] cursor-pointer"
                      >
                        DETAILS
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEnquiryProduct(product);
                          setOrderStatus('idle');
                        }}
                        className="py-2.5 px-3 bg-[#D71920] text-[#FFFFFF] font-mono-label text-[10px] hover:bg-[#151515] cursor-pointer"
                      >
                        ENQUIRE / BUY
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Product Enquiry Modal */}
      {enquiryProduct && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[90] bg-[#101010]/85 flex items-center justify-center p-4"
          onClick={() => setEnquiryProduct(null)}
        >
          <div
            className="max-w-lg w-full bg-[#FFFFFF] border border-[#E7E7E7] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E7E7]">
              <div>
                <span className="font-tech-code text-[10px] text-[#D71920]">
                  ACADEMY SHOP RESERVATION
                </span>
                <h3 className="font-display font-bold text-lg text-[#151515]">
                  {enquiryProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryProduct(null)}
                className="p-1.5 border border-[#E7E7E7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderStatus === 'done' ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#D71920] mx-auto" />
                <h4 className="font-display font-bold text-lg">
                  Product Reservation Received!
                </h4>
                <p className="text-xs text-[#626262]">
                  Our academy desk has logged your order enquiry for{' '}
                  <strong>{enquiryProduct.name}</strong> and will confirm pickup
                  at your preferred Bangalore center.
                </p>
                <button
                  type="button"
                  onClick={() => setEnquiryProduct(null)}
                  className="mt-4 px-6 py-2.5 bg-[#151515] text-[#FFFFFF] font-mono-label text-xs cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block font-mono-label text-[11px] mb-1">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E7E7E7] text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono-label text-[11px] mb-1">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E7E7E7] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-label text-[11px] mb-1">
                      PHONE
                    </label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E7E7E7] text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono-label text-[11px] mb-1">
                    SIZE / QUANTITY / PICKUP NOTES
                  </label>
                  <textarea
                    rows={3}
                    value={buyerNotes}
                    onChange={(e) => setBuyerNotes(e.target.value)}
                    placeholder="Specify jersey size, quantity, or preferred Bangalore center pickup..."
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E7E7E7] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={orderStatus === 'submitting'}
                  className="w-full py-3.5 bg-[#D71920] text-[#FFFFFF] font-mono-label text-xs hover:bg-[#151515] transition-colors cursor-pointer"
                >
                  {orderStatus === 'submitting'
                    ? 'SUBMITTING RESERVATION...'
                    : `CONFIRM ENQUIRY (₹${
                        enquiryProduct.sale_price ?? enquiryProduct.price
                      })`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 6. CONTACT PAGE (/contact) & LEGAL PAGES (/privacy-policy, /terms)
 * ========================================================================== */
export const ContactPage: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] text-[#151515]">
      <section className="py-20 bg-[#101010] text-[#FFFFFF] border-b border-[#242424]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-8 h-[2px] bg-[#D71920]" />
            <span className="font-mono-label text-xs text-[#D71920]">
              GET IN TOUCH // BANGALORE CENTERS
            </span>
          </div>
          <h1 className="heading-hero text-[#FFFFFF]">
            CONTACT INVENTIVE{' '}
            <span className="block text-[#D71920]">ACADEMY.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#D4D4D4] max-w-2xl">
            Schedule an assessment session, enquire about batch timings at
            Kammanahalli or Hesaraghatta, or register for upcoming tournaments.
          </p>
        </div>
      </section>

      <JoinAcademy />
    </div>
  );
};

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({
  type,
}) => {
  return (
    <div className="bg-[#FFFFFF] text-[#151515] py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <span className="font-mono-label text-xs text-[#D71920]">
          INVENTIVE SPORTS &amp; PERFORMING ARTS // LEGAL
        </span>
        <h1 className="mt-2 heading-section text-[#151515]">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
        </h1>
        <div className="mt-8 space-y-6 text-sm sm:text-base text-[#626262] leading-relaxed border-t border-[#E7E7E7] pt-8">
          <p>
            Inventive Sports &amp; Performing Arts is committed to safeguarding
            the personal information of our students, parents, coaches, and
            website visitors across our Kammanahalli and Hesaraghatta centers in
            Bangalore.
          </p>
          <p>
            Information submitted through our enquiry, event registration, or
            shop reservation forms is stored securely in our academy management
            database solely for program coordination, batch scheduling, and
            official academy communication.
          </p>
        </div>
      </div>
    </div>
  );
};
