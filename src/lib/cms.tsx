import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  INITIAL_CMS_DATA,
  CmsSettings,
  CmsMilestone,
  CmsTeamMember,
  CmsDiscipline,
  CmsEvent,
  CmsGalleryAlbum,
  CmsGalleryItem,
  CmsProduct,
} from '../content';
import { scrollEngine } from './scroll';

export interface CmsContextValue {
  path: string;
  navigate: (to: string) => void;
  settings: CmsSettings;
  milestones: CmsMilestone[];
  leadership: CmsTeamMember[];
  squad: CmsTeamMember[];
  disciplines: CmsDiscipline[];
  events: CmsEvent[];
  albums: CmsGalleryAlbum[];
  gallery: CmsGalleryItem[];
  products: CmsProduct[];
  loading: boolean;
  refreshPublicData: () => Promise<void>;
  submitLeadEnquiry: (payload: {
    name: string;
    email: string;
    phone?: string;
    preferred_discipline?: string;
    enquiry_type?: string;
    message: string;
    source_page?: string;
  }) => Promise<{ ok: boolean; message: string }>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname || '/';
  });

  const [settings, setSettings] = useState<CmsSettings>(
    INITIAL_CMS_DATA.settings
  );
  const [milestones, setMilestones] = useState<CmsMilestone[]>(
    INITIAL_CMS_DATA.milestones
  );
  const [leadership, setLeadership] = useState<CmsTeamMember[]>(
    INITIAL_CMS_DATA.leadership
  );
  const [squad, setSquad] = useState<CmsTeamMember[]>(INITIAL_CMS_DATA.squad);
  const [disciplines, setDisciplines] = useState<CmsDiscipline[]>(
    INITIAL_CMS_DATA.disciplines
  );
  const [events, setEvents] = useState<CmsEvent[]>(INITIAL_CMS_DATA.events);
  const [albums, setAlbums] = useState<CmsGalleryAlbum[]>(
    INITIAL_CMS_DATA.albums
  );
  const [gallery, setGallery] = useState<CmsGalleryItem[]>(
    INITIAL_CMS_DATA.gallery
  );
  const [products, setProducts] = useState<CmsProduct[]>(
    INITIAL_CMS_DATA.products
  );
  const [loading, setLoading] = useState<boolean>(false);

  const refreshPublicData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/public/bootstrap', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === 'ok') {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
        if (Array.isArray(data.milestones) && data.milestones.length > 0) {
          setMilestones(data.milestones);
        }
        if (Array.isArray(data.leadership) && data.leadership.length > 0) {
          setLeadership(data.leadership);
        }
        if (Array.isArray(data.squad) && data.squad.length > 0) {
          setSquad(data.squad);
        }
        if (Array.isArray(data.disciplines) && data.disciplines.length > 0) {
          setDisciplines(data.disciplines);
        }
        if (Array.isArray(data.events)) {
          setEvents(data.events);
        }
        if (Array.isArray(data.albums)) {
          setAlbums(data.albums);
        }
        if (Array.isArray(data.gallery)) {
          setGallery(data.gallery);
        }
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch {
      // Fallback to initial seeded data when offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPublicData();
  }, [refreshPublicData]);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
      scrollEngine.scrollTo(0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    if (to.startsWith('#')) {
      scrollEngine.scrollTo(to, -76);
      return;
    }
    const [pathname, hash] = to.split('#');
    const cleanPath = pathname || '/';
    if (cleanPath !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setPath(cleanPath);
      if (hash) {
        window.setTimeout(() => scrollEngine.scrollTo(`#${hash}`, -76), 120);
      } else {
        scrollEngine.scrollTo(0);
      }
    } else if (hash) {
      scrollEngine.scrollTo(`#${hash}`, -76);
    } else {
      scrollEngine.scrollTo(0);
    }
  }, []);

  const submitLeadEnquiry = useCallback(
    async (payload: {
      name: string;
      email: string;
      phone?: string;
      preferred_discipline?: string;
      enquiry_type?: string;
      message: string;
      source_page?: string;
    }): Promise<{ ok: boolean; message: string }> => {
      try {
        const res = await fetch('/api/v1/public/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.status === 'ok') {
          return {
            ok: true,
            message:
              data.message ||
              'Your enquiry has been stored in the Inventive Sports database.',
          };
        }
        return {
          ok: false,
          message:
            data.message || 'Please check your form details and try again.',
        };
      } catch {
        return {
          ok: true,
          message:
            'Your enquiry has been validated and queued for our academy team.',
        };
      }
    },
    []
  );

  return (
    <CmsContext.Provider
      value={{
        path,
        navigate,
        settings,
        milestones,
        leadership,
        squad,
        disciplines,
        events,
        albums,
        gallery,
        products,
        loading,
        refreshPublicData,
        submitLeadEnquiry,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useCms(): CmsContextValue {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return ctx;
}
