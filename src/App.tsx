import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroReveal } from './components/HeroReveal';
import { DisciplineReel } from './components/DisciplineReel';
import { MovementTrajectory } from './components/MovementTrajectory';
import { Programs } from './components/Programs';
import { Statement } from './components/Statement';
import { Events } from './components/Events';
import { JoinAcademy } from './components/JoinAcademy';
import { Footer } from './components/Footer';
import { AboutPage } from './components/AboutPage';
import {
  SportsDirectoryPage,
  SportDetailPage,
  EventsPage,
  GalleryPage,
  ShopPage,
  ContactPage,
  LegalPage,
} from './components/PublicPages';
import { AdminDashboard } from './components/AdminDashboard';
import { CmsProvider, useCms } from './lib/cms';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useReveals } from './hooks/useReveals';
import { scrollEngine } from './lib/scroll';

const AppViews: React.FC = () => {
  const { path } = useCms();
  const prefersReducedMotion = useReducedMotion();
  const [selectedDiscipline, setSelectedDiscipline] = useState<
    string | undefined
  >(undefined);
  const [selectedEventNote, setSelectedEventNote] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    scrollEngine.init(prefersReducedMotion);
    return () => {
      scrollEngine.destroy();
    };
  }, [prefersReducedMotion]);

  useReveals(prefersReducedMotion);

  // Admin Portal Route (/admin)
  if (path.startsWith('/admin')) {
    return <AdminDashboard />;
  }

  const renderMainRoute = () => {
    if (path === '/about') {
      return <AboutPage reducedMotion={prefersReducedMotion} />;
    }
    if (path === '/sports') {
      return <SportsDirectoryPage />;
    }
    if (path.startsWith('/sports/')) {
      const slug = path.replace('/sports/', '');
      return <SportDetailPage slug={slug} />;
    }
    if (path === '/performing-arts') {
      return <SportDetailPage slug="performing-arts" />;
    }
    if (path === '/events') {
      return <EventsPage />;
    }
    if (path.startsWith('/events/')) {
      const slug = path.replace('/events/', '');
      return <EventsPage slug={slug} />;
    }
    if (path === '/gallery') {
      return <GalleryPage />;
    }
    if (path === '/shop') {
      return <ShopPage />;
    }
    if (path.startsWith('/shop/')) {
      const slug = path.replace('/shop/', '');
      return <ShopPage slug={slug} />;
    }
    if (path === '/contact') {
      return <ContactPage />;
    }
    if (path === '/privacy-policy') {
      return <LegalPage type="privacy" />;
    }
    if (path === '/terms') {
      return <LegalPage type="terms" />;
    }

    // Default: Complete 8-Section Homepage
    return (
      <>
        <HeroReveal reducedMotion={prefersReducedMotion} />
        <DisciplineReel reducedMotion={prefersReducedMotion} />
        <MovementTrajectory reducedMotion={prefersReducedMotion} />
        <Programs onSelectDiscipline={setSelectedDiscipline} />
        <Events onSelectEvent={setSelectedEventNote} />
        <Statement reducedMotion={prefersReducedMotion} />
        <JoinAcademy
          selectedDiscipline={selectedDiscipline}
          selectedEventNote={selectedEventNote}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#151515] flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[#D71920] focus:text-[#FFFFFF] focus:px-4 focus:py-2 focus:font-mono-label focus:text-xs"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        {renderMainRoute()}
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CmsProvider>
      <AppViews />
    </CmsProvider>
  );
};

export default App;
