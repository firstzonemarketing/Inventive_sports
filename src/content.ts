export interface CmsSettings {
  logo_url: string;
  site_name: string;
  hero_headline: string;
  hero_subcopy: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  headline: string;
  description: string;
  hero_eyebrow: string;
  hero_description: string;
  mission_heading: string;
  mission_body: string;
  vision_heading: string;
  vision_body: string;
  centers: string;
  website_ref: string;
  default_meta_title: string;
  default_meta_description: string;
  [key: string]: string;
}

export interface CmsMilestone {
  id: number;
  year: string;
  eyebrow: string;
  heading: string;
  description: string;
  image_url: string;
  display_order: number;
  is_published: boolean;
}

export interface CmsTeamMember {
  id: number;
  name: string;
  designation: string;
  category: 'leadership' | 'squad';
  discipline: string;
  biography: string;
  portrait_url: string;
  display_order: number;
  is_published: boolean;
}

export interface CmsDiscipline {
  id: number;
  name: string;
  slug: string;
  category: 'sports' | 'performing-arts';
  tagline: string;
  scene_heading: string;
  animation_style:
    | 'football-stadium'
    | 'cricket-sweep'
    | 'chess-strategy'
    | 'swimming-fluid'
    | 'skating-diagonal'
    | 'basketball-arc'
    | 'dance-curtain';
  short_description: string;
  full_description: string;
  benefits: string[];
  highlights: string[];
  cover_image: string;
  cta_text: string;
  display_order: number;
  is_published: boolean;
}

export interface CmsEvent {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  cover_image: string;
  discipline: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  registration_url: string;
  contact_details: string;
  is_featured: boolean;
  status: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
}

export interface CmsGalleryAlbum {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  display_order: number;
  is_published: boolean;
}

export interface CmsGalleryItem {
  id: number;
  album_id: number | null;
  title: string;
  caption: string;
  category: string;
  discipline: string;
  media_type: 'photo' | 'video';
  media_url: string;
  alt_text: string;
  display_order: number;
  is_featured: boolean;
  is_published: boolean;
}

export interface CmsProduct {
  id: number;
  category_name: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string;
  is_featured: boolean;
  is_published: boolean;
}

export interface JourneyStage {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  threshold: number;
}

export interface SkillBenefitItem {
  number: string;
  title: string;
  description: string;
}

export const INITIAL_CMS_DATA = {
  settings: {
    logo_url: '/images/brand/inventive-sports-logo.png',
    site_name: 'Inventive Sports & Performing Arts',
    hero_headline: 'BUILD SKILLS. DISCOVER POTENTIAL. BECOME EXTRAORDINARY.',
    hero_subcopy:
      'Where sports, strategy, and performing arts come together to shape confident individuals and future champions.',
    hero_primary_cta: 'EXPLORE DISCIPLINES',
    hero_secondary_cta: 'DISCOVER OUR ACADEMY',
    headline: 'MORE THAN A SPORTS ACADEMY.',
    description:
      'Inventive Sports brings together physical development, strategic thinking, creative expression, and teamwork in a multidisciplinary learning environment. We believe every discipline offers an opportunity to discover strengths, build confidence, and develop lifelong skills.',
    hero_eyebrow: 'OUR STORY',
    hero_description:
      'Nurturing champions through discipline, strategy, and high-performance training. Join the legacy of Inventive Sports.',
    mission_heading: 'TO REVOLUTIONIZE GRASSROOTS SPORTS',
    mission_body:
      'We are dedicated to providing a professional, multidisciplinary environment where young athletes can develop physical prowess, strategic thinking, and emotional resilience. Our mission is to build the next generation of champions—both on the field and in life.',
    vision_heading: 'THE GOLD STANDARD OF EXCELLENCE',
    vision_body:
      "To be India's premier sports and arts academy, where every child discovers their hidden potential through world-class coaching, state-of-the-art facilities, and a culture of relentless improvement.",
    centers: 'Kammanahalli & Hesaraghatta Centers, Bangalore',
    website_ref: 'https://www.inventivesports.co/',
    default_meta_title:
      'Inventive Sports & Performing Arts — Bangalore Sports & Arts Academy',
    default_meta_description:
      'Where sports, strategy, and performing arts come together to shape confident individuals and future champions in Bangalore.',
  } satisfies CmsSettings,

  milestones: [
    {
      id: 1,
      year: '2018',
      eyebrow: 'THE FOUNDATION',
      heading: 'A VISION THAT STARTED IN 2018',
      description:
        'In 2018, Inventive Academy started with a vision — a place where young talents in Bangalore could train holistically across sports and arts. We began with a single mission: to build the person, not just the athlete.',
      image_url: '/images/about/founded.png',
      display_order: 1,
      is_published: true,
    },
    {
      id: 2,
      year: 'MULTIDISCIPLINARY',
      eyebrow: 'MULTIDISCIPLINARY',
      heading: 'STRONGER THROUGH DIFFERENT DISCIPLINES',
      description:
        'We believe cross-training strengthens resilience. Skills from dance sharpen agility; mental focus from chess enhances reflexes; teamwork from team sports builds lifelong character.',
      image_url: '/images/about/multi.png',
      display_order: 2,
      is_published: true,
    },
    {
      id: 3,
      year: 'FACILITIES',
      eyebrow: 'ELITE FACILITIES',
      heading: 'SPACES DESIGNED FOR PROGRESS',
      description:
        'From our climate-controlled indoor halls to sport-specific zones, our centers in Kammanahalli, Hesaraghatta, and beyond are designed to inspire greatness every day.',
      image_url: '/images/about/state.png',
      display_order: 3,
      is_published: true,
    },
  ] satisfies CmsMilestone[],

  leadership: [
    {
      id: 1,
      name: 'Praveen K.',
      designation: 'Founder & CEO',
      category: 'leadership',
      discipline: 'Executive Leadership',
      biography:
        "As the Director, Praveen sir spearheads strategic initiatives and partnerships, driving Inventive Sports Academy's growth and vision. His extensive experience ensures our programs consistently deliver excellence.",
      portrait_url: '/images/leadership/praveen-k.jpg',
      display_order: 1,
      is_published: true,
    },
    {
      id: 2,
      name: 'Soniya M.',
      designation: 'Co-founder',
      category: 'leadership',
      discipline: 'Curriculum & Creative Direction',
      biography:
        "Soniya is the creative force behind our innovative curriculum. Her passion for nurturing young talent and fostering a vibrant learning environment is at the core of our academy's success.",
      portrait_url: '/images/leadership/soniya-m.jpg',
      display_order: 2,
      is_published: true,
    },
    {
      id: 3,
      name: 'Dr. Joseph Emmanuel',
      designation: 'Board of Advisor',
      category: 'leadership',
      discipline: 'Educational Advisory',
      biography:
        'A visionary leader in the Indian education sector, Dr. Joseph provides strategic guidance to ensure our programs meet the highest standards of holistic development and excellence.',
      portrait_url: '/images/leadership/dr-joseph-emmanuel.png',
      display_order: 3,
      is_published: true,
    },
    {
      id: 4,
      name: 'Yuvaraj',
      designation: 'General Manager',
      category: 'leadership',
      discipline: 'Academy Operations',
      biography:
        'Yuvaraj oversees the seamless execution of academy operations. His leadership ensures that our facilities and coaching staff deliver a world-class experience for every athlete.',
      portrait_url: '/images/leadership/yuvaraj.png',
      display_order: 4,
      is_published: true,
    },
  ] satisfies CmsTeamMember[],

  squad: [
    {
      id: 5,
      name: 'Binoy Kunjumon',
      designation: 'Chess Expert',
      category: 'squad',
      discipline: 'Chess',
      biography:
        'Guides students in classical opening repertoire, tactical calculation, and tournament preparation.',
      portrait_url: '/images/strategy/strategy-main.jpg',
      display_order: 1,
      is_published: true,
    },
    {
      id: 6,
      name: 'Manikandan',
      designation: 'Chess Expert',
      category: 'squad',
      discipline: 'Chess',
      biography:
        'Specializes in positional strategy, endgame precision, and competitive rapid/classical chess training.',
      portrait_url: '/images/strategy/strategy-main.jpg',
      display_order: 2,
      is_published: true,
    },
    {
      id: 7,
      name: 'Preetham VK',
      designation: 'Cricket Expert',
      category: 'squad',
      discipline: 'Cricket',
      biography:
        'Coaches batting mechanics, bowling action alignment, and match-awareness drills.',
      portrait_url: '/images/sports/cricket-main.jpg',
      display_order: 3,
      is_published: true,
    },
    {
      id: 8,
      name: 'Rakesh',
      designation: 'Swimming Expert',
      category: 'squad',
      discipline: 'Swimming',
      biography:
        'Develops stroke efficiency, breath control, water confidence, and competitive lane pacing.',
      portrait_url: '/images/sports/swimming-main.jpg',
      display_order: 4,
      is_published: true,
    },
    {
      id: 9,
      name: 'Jaypal',
      designation: 'Skating Expert',
      category: 'squad',
      discipline: 'Skating',
      biography:
        'Focuses on balance, cornering technique, stride propulsion, and rink safety.',
      portrait_url: '/images/sports/skating-main.jpg',
      display_order: 5,
      is_published: true,
    },
    {
      id: 10,
      name: 'Yuvaraj',
      designation: 'Football Expert',
      category: 'squad',
      discipline: 'Football',
      biography:
        'Leads first-touch ball mastery, tactical positioning, passing combinations, and match conditioning.',
      portrait_url: '/images/leadership/yuvaraj.png',
      display_order: 6,
      is_published: true,
    },
    {
      id: 11,
      name: 'Dhanush',
      designation: 'Dance Expert',
      category: 'squad',
      discipline: 'Dance and Performing Arts',
      biography:
        'Instructs rhythm synchronization, expressive stage movement, and choreography.',
      portrait_url: '/images/performing-arts/performing-arts-main.jpg',
      display_order: 7,
      is_published: true,
    },
    {
      id: 12,
      name: 'Biju Prasad',
      designation: 'Chess Expert',
      category: 'squad',
      discipline: 'Chess',
      biography:
        'Mentors developing players in pattern recognition, calculation depth, and tournament composure.',
      portrait_url: '/images/strategy/strategy-main.jpg',
      display_order: 8,
      is_published: true,
    },
    {
      id: 13,
      name: 'Vinod Kumar',
      designation: 'Basketball Expert',
      category: 'squad',
      discipline: 'Basketball',
      biography:
        'Trains shooting mechanics, court spacing, defensive footwork, and team transition play.',
      portrait_url: '/images/sports/basketball-main.jpg',
      display_order: 9,
      is_published: true,
    },
  ] satisfies CmsTeamMember[],

  disciplines: [
    {
      id: 1,
      name: 'Football',
      slug: 'football',
      category: 'sports',
      tagline: 'STADIUM LIGHTING & BALL TRAJECTORY EXPERIENCE',
      scene_heading: 'OWN THE FIELD.',
      animation_style: 'football-stadium',
      short_description:
        'Master ball control, tactical field vision, passing geometry, and explosive match conditioning under professional coaching.',
      full_description:
        'Our Football program develops complete players—combining technical first touch, spatial awareness, passing combinations, and disciplined team structure.',
      benefits: [
        'Close-control dribbling, striking accuracy, and two-footed technical mastery',
        'Tactical awareness, off-the-ball movement, and transitional team structure',
        'Cardiovascular endurance, agility, and competitive match composure',
      ],
      highlights: [
        'Small-sided tactical games & positional drills',
        'Set-piece trajectory & finishing sessions',
        'Structured inter-academy practice matches',
      ],
      cover_image: '/images/sports/football-main.jpg',
      cta_text: 'EXPLORE FOOTBALL',
      display_order: 1,
      is_published: true,
    },
    {
      id: 2,
      name: 'Cricket',
      slug: 'cricket',
      category: 'sports',
      tagline: 'TECHNICAL BATTING, BOWLING & FIELDING MASTERY',
      scene_heading: 'PLAY WITH PURPOSE.',
      animation_style: 'cricket-sweep',
      short_description:
        'Develop textbook batting technique, repeatable bowling rhythm, sharp fielding reflexes, and match temperament.',
      full_description:
        'Cricket at Inventive Sports focuses on biomechanical alignment, shot selection, bowling consistency, and tactical game reading across formats.',
      benefits: [
        'Balanced batting stance, footwork precision, and stroke execution',
        'Repeatable bowling action, line-and-length discipline, and variations',
        'High-intensity ground fielding, catching reflexes, and wicketkeeping basics',
      ],
      highlights: [
        'Dedicated net practice & bowling machine drills',
        'Match-scenario simulation & field placement strategy',
        'Physical conditioning for long-format stamina',
      ],
      cover_image: '/images/sports/cricket-main.jpg',
      cta_text: 'EXPLORE CRICKET',
      display_order: 2,
      is_published: true,
    },
    {
      id: 3,
      name: 'Chess',
      slug: 'chess',
      category: 'sports',
      tagline: 'STRATEGIC FORESIGHT & COGNITIVE PRECISION',
      scene_heading: 'THINK AHEAD. PLAY SMART.',
      animation_style: 'chess-strategy',
      short_description:
        'Cultivate deep concentration, multi-move calculation, tactical pattern recognition, and calm decision-making under clock pressure.',
      full_description:
        'Led by experienced chess mentors, our curriculum guides students from foundational rules to advanced tournament preparation, opening theory, and endgame mastery.',
      benefits: [
        'Opening principles, middle-game tactical motifs, and endgame technique',
        'Structured calculation habits, visualization, and blunder prevention',
        'Clock management, tournament etiquette, and post-game analytical review',
      ],
      highlights: [
        'Guided classical & rapid tournament preparation',
        'Tactical puzzle labs & grandmaster game studies',
        'Mentorship from dedicated Chess Experts',
      ],
      cover_image: '/images/strategy/strategy-main.jpg',
      cta_text: 'EXPLORE CHESS',
      display_order: 3,
      is_published: true,
    },
    {
      id: 4,
      name: 'Swimming',
      slug: 'swimming',
      category: 'sports',
      tagline: 'HYDRODYNAMIC EFFICIENCY & BREATH CONTROL',
      scene_heading: 'FIND YOUR FLOW.',
      animation_style: 'swimming-fluid',
      short_description:
        'Build water confidence, streamlined stroke mechanics, rhythmic breathing, and full-body cardiovascular endurance.',
      full_description:
        'Our Swimming program progresses from foundational water safety and buoyancy to competitive four-stroke technique, starts, turns, and pacing.',
      benefits: [
        'Streamlined body position, kick propulsion, and stroke efficiency',
        'Bilateral breathing control, flip turns, and underwater dolphin kick',
        'Low-impact full-body strength, lung capacity, and endurance',
      ],
      highlights: [
        'Progressive lane coaching by skill level',
        'Freestyle, backstroke, breaststroke & butterfly technique',
        'Timed endurance sets & racing start mechanics',
      ],
      cover_image: '/images/sports/swimming-main.jpg',
      cta_text: 'EXPLORE SWIMMING',
      display_order: 4,
      is_published: true,
    },
    {
      id: 5,
      name: 'Skating',
      slug: 'skating',
      category: 'sports',
      tagline: 'BALANCE, VELOCITY & EDGE CONTROL',
      scene_heading: 'MOVE WITH CONFIDENCE.',
      animation_style: 'skating-diagonal',
      short_description:
        'Master dynamic balance, cornering crossovers, stride power, and high-speed control on the rink.',
      full_description:
        'Skating builds extraordinary lower-body stability, core coordination, and spatial confidence through structured progression from beginner balance to speed skating.',
      benefits: [
        'Postural balance, braking safety, and edge control fundamentals',
        'Linear stride extension, crossover cornering, and cadence speed',
        'Core stability, ankle strength, and spatial agility',
      ],
      highlights: [
        'Beginner stability to advanced speed-skating tracks',
        'Slalom agility & crossover cornering drills',
        'Protective gear safety & time-trial preparation',
      ],
      cover_image: '/images/sports/skating-main.jpg',
      cta_text: 'EXPLORE SKATING',
      display_order: 5,
      is_published: true,
    },
    {
      id: 6,
      name: 'Basketball',
      slug: 'basketball',
      category: 'sports',
      tagline: 'ELEVATION, COURT VISION & TEAM TRANSITION',
      scene_heading: 'AIM HIGHER.',
      animation_style: 'basketball-arc',
      short_description:
        'Sharpen ball-handling, shooting arc mechanics, defensive footwork, and fast-paced team coordination on court.',
      full_description:
        'Our Basketball curriculum develops versatile court players with reliable shooting form, crisp passing vision, rebounding tenacity, and unselfish team defense.',
      benefits: [
        'Shooting release mechanics, layup footwork, and free-throw consistency',
        'Two-hand ball handling, court spacing, and pick-and-roll decision-making',
        'Lateral defensive slides, vertical leap conditioning, and communication',
      ],
      highlights: [
        'Form shooting & arc trajectory drills',
        'Half-court tactical execution & fast-break transition',
        '5v5 structured scrimmages & situational coaching',
      ],
      cover_image: '/images/sports/basketball-main.jpg',
      cta_text: 'EXPLORE BASKETBALL',
      display_order: 6,
      is_published: true,
    },
    {
      id: 7,
      name: 'Dance and Performing Arts',
      slug: 'performing-arts',
      category: 'performing-arts',
      tagline: 'RHYTHM, CHOREOGRAPHY & STAGE PRESENCE',
      scene_heading: 'EXPRESS YOUR POTENTIAL.',
      animation_style: 'dance-curtain',
      short_description:
        'Channel rhythm, body awareness, choreography, and creative storytelling in a supportive studio and stage environment.',
      full_description:
        'Dance and Performing Arts at Inventive Academy blend physical athleticism with artistic expression—building flexibility, musicality, ensemble synchronization, and stage confidence.',
      benefits: [
        'Rhythm accuracy, musicality, and full-body movement coordination',
        'Flexibility, posture, balance, and expressive stage presence',
        'Collaborative ensemble choreography and live showcase confidence',
      ],
      highlights: [
        'Contemporary, freestyle & rhythmic choreography labs',
        'Rehearsal-to-stage performance preparation',
        'Academy showcases & community cultural events',
      ],
      cover_image: '/images/performing-arts/performing-arts-main.jpg',
      cta_text: 'EXPLORE PERFORMING ARTS',
      display_order: 7,
      is_published: true,
    },
  ] satisfies CmsDiscipline[],

  events: [
    {
      id: 1,
      title: 'Inventive Rapid Chess Championship & Workshop',
      slug: 'inventive-rapid-chess-championship',
      short_description:
        'Structured rapid-chess rounds and tactical analysis sessions guided by our Chess Experts.',
      description:
        'Join players across age categories for an official academy rapid chess meet featuring Swiss-system rounds, post-game board analysis, and tactical workshops.',
      cover_image: '/images/strategy/strategy-main.jpg',
      discipline: 'Chess',
      start_date: '2026-11-15',
      end_date: '2026-11-15',
      start_time: '09:00 AM',
      end_time: '04:30 PM',
      venue: 'Kammanahalli Center, Bangalore',
      registration_url: '/contact',
      contact_details: 'Inventive Sports Desk — Kammanahalli',
      is_featured: true,
      status: 'published',
    },
    {
      id: 2,
      title: 'Inter-Center Football & Basketball Skills Meet',
      slug: 'inter-center-football-basketball-meet',
      short_description:
        'Small-sided football fixtures, shooting trajectory challenges, and team conditioning showcases.',
      description:
        'Athletes from our Kammanahalli and Hesaraghatta centers come together for structured match play, technical skill assessments, and coach feedback.',
      cover_image: '/images/sports/football-main.jpg',
      discipline: 'Football',
      start_date: '2026-11-29',
      end_date: '2026-11-29',
      start_time: '08:00 AM',
      end_time: '02:00 PM',
      venue: 'Hesaraghatta Main Turf & Court, Bangalore',
      registration_url: '/contact',
      contact_details: 'Inventive Sports Desk — Hesaraghatta',
      is_featured: true,
      status: 'published',
    },
    {
      id: 3,
      title: 'Annual Performing Arts & Skating Exhibition',
      slug: 'annual-performing-arts-skating-exhibition',
      short_description:
        'Live stage choreography and precision skating demonstrations for students and families.',
      description:
        'A celebration of movement, rhythm, and agility featuring ensemble dance performances and speed/slalom skating showcases.',
      cover_image: '/images/performing-arts/performing-arts-main.jpg',
      discipline: 'Dance and Performing Arts',
      start_date: '2026-12-12',
      end_date: '2026-12-12',
      start_time: '05:00 PM',
      end_time: '08:00 PM',
      venue: 'Inventive Main Indoor Arena, Bangalore',
      registration_url: '/contact',
      contact_details: 'Inventive Events Team',
      is_featured: false,
      status: 'published',
    },
  ] satisfies CmsEvent[],

  albums: [
    {
      id: 1,
      title: 'High-Performance Training Sessions',
      slug: 'high-performance-training',
      description:
        'Daily coaching across football, cricket, swimming, skating, and basketball.',
      cover_image: '/images/sports/football-main.jpg',
      display_order: 1,
      is_published: true,
    },
    {
      id: 2,
      title: 'Tournaments & Stage Showcases',
      slug: 'tournaments-and-showcases',
      description:
        'Moments from chess championships, dance recitals, and academy events.',
      cover_image: '/images/events/events-main.jpg',
      display_order: 2,
      is_published: true,
    },
  ] satisfies CmsGalleryAlbum[],

  gallery: [
    {
      id: 1,
      album_id: 1,
      title: 'Evening Stadium Football Training',
      caption: 'Ball trajectory and finishing drills under floodlights.',
      category: 'Training Sessions',
      discipline: 'Football',
      media_type: 'photo',
      media_url: '/images/sports/football-main.jpg',
      alt_text: 'Football player striking ball under stadium lights',
      display_order: 1,
      is_featured: true,
      is_published: true,
    },
    {
      id: 2,
      album_id: 1,
      title: 'Cricket Batting Mechanics Session',
      caption: 'Front-foot drive alignment and shot selection practice.',
      category: 'Training Sessions',
      discipline: 'Cricket',
      media_type: 'photo',
      media_url: '/images/sports/cricket-main.jpg',
      alt_text: 'Cricketer executing a cover drive in training',
      display_order: 2,
      is_featured: true,
      is_published: true,
    },
    {
      id: 3,
      album_id: 2,
      title: 'Classical & Rapid Chess Championship',
      caption: 'Focused calculation during tournament rounds.',
      category: 'Competitions',
      discipline: 'Chess',
      media_type: 'photo',
      media_url: '/images/strategy/strategy-main.jpg',
      alt_text: 'Chess player making a move on wooden tournament board',
      display_order: 3,
      is_featured: true,
      is_published: true,
    },
    {
      id: 4,
      album_id: 1,
      title: 'Competitive Lane Swimming',
      caption: 'Hydrodynamic stroke efficiency and pacing drills.',
      category: 'Training Sessions',
      discipline: 'Swimming',
      media_type: 'photo',
      media_url: '/images/sports/swimming-main.jpg',
      alt_text: 'Swimmer training in indoor lap pool',
      display_order: 4,
      is_featured: true,
      is_published: true,
    },
    {
      id: 5,
      album_id: 1,
      title: 'Inline Speed Skating Cornering',
      caption: 'Low-posture edge control and rink velocity training.',
      category: 'Training Sessions',
      discipline: 'Skating',
      media_type: 'photo',
      media_url: '/images/sports/skating-main.jpg',
      alt_text: 'Inline skater banking around track turn',
      display_order: 5,
      is_featured: false,
      is_published: true,
    },
    {
      id: 6,
      album_id: 1,
      title: 'Indoor Court Basketball Elevation',
      caption: 'Jump-shot release mechanics and court spacing.',
      category: 'Training Sessions',
      discipline: 'Basketball',
      media_type: 'photo',
      media_url: '/images/sports/basketball-main.jpg',
      alt_text: 'Basketball player elevating for a jump shot',
      display_order: 6,
      is_featured: false,
      is_published: true,
    },
    {
      id: 7,
      album_id: 2,
      title: 'Contemporary Stage Movement Showcase',
      caption: 'Expressive leap during performing arts studio rehearsal.',
      category: 'Performances',
      discipline: 'Dance and Performing Arts',
      media_type: 'photo',
      media_url: '/images/performing-arts/performing-arts-main.jpg',
      alt_text: 'Dancer mid-leap in sunlit studio',
      display_order: 7,
      is_featured: true,
      is_published: true,
    },
    {
      id: 8,
      album_id: 2,
      title: 'Multidisciplinary Training Hall',
      caption: 'Our indoor training spaces designed for holistic growth.',
      category: 'Event Galleries',
      discipline: 'General',
      media_type: 'photo',
      media_url: '/images/about/state.png',
      alt_text: 'Inventive Sports indoor facility',
      display_order: 8,
      is_featured: false,
      is_published: true,
    },
  ] satisfies CmsGalleryItem[],

  products: [
    {
      id: 1,
      category_name: 'Academy Apparel',
      name: 'Inventive Pro Training Jersey (Red / Black)',
      slug: 'inventive-pro-training-jersey',
      sku: 'INV-APP-001',
      description:
        'Breathable moisture-wicking training jersey featuring the official Inventive Sports crest. Engineered for football, cricket, basketball, and conditioning sessions.',
      price: 1299,
      sale_price: 999,
      stock_quantity: 45,
      image_url: '/images/athletics/athletics-main.jpg',
      is_featured: true,
      is_published: true,
    },
    {
      id: 2,
      category_name: 'Sports & Chess Equipment',
      name: 'Championship Staunton Wooden Chess Set & Clock Pack',
      slug: 'championship-staunton-chess-set',
      sku: 'INV-CHS-002',
      description:
        'Weighted tournament-standard Staunton chessmen with folding matte board and digital DGT-style increment timer recommended by our Chess Experts.',
      price: 2499,
      sale_price: null,
      stock_quantity: 20,
      image_url: '/images/strategy/strategy-main.jpg',
      is_featured: true,
      is_published: true,
    },
    {
      id: 3,
      category_name: 'Sports & Chess Equipment',
      name: 'Match-Grade Thermo-Bonded Football (Size 5)',
      slug: 'match-grade-thermo-bonded-football',
      sku: 'INV-FTB-003',
      description:
        'FIFA-standard flight stability football with textured micro-surface for accurate trajectory control under dry and wet turf conditions.',
      price: 1850,
      sale_price: 1599,
      stock_quantity: 30,
      image_url: '/images/sports/football-main.jpg',
      is_featured: true,
      is_published: true,
    },
    {
      id: 4,
      category_name: 'Sports & Chess Equipment',
      name: 'Inline Speed & Slalom Skate Starter Kit',
      slug: 'inline-speed-skate-starter-kit',
      sku: 'INV-SKT-004',
      description:
        'Precision aluminum-frame inline skates paired with aerodynamic helmet, wrist guards, and knee/elbow protection for academy rink sessions.',
      price: 4500,
      sale_price: 3999,
      stock_quantity: 15,
      image_url: '/images/sports/skating-main.jpg',
      is_featured: false,
      is_published: true,
    },
  ] satisfies CmsProduct[],

  journeyStages: [
    {
      number: '01',
      title: 'Discover',
      subtitle: 'EXPLORE INTERESTS & APTITUDE',
      description:
        'Experience physical sports, strategic board games, and performing arts to find the discipline that sparks genuine excitement.',
      image: '/images/about/founded.png',
      threshold: 0.08,
    },
    {
      number: '02',
      title: 'Learn',
      subtitle: 'FOUNDATIONAL MECHANICS',
      description:
        'Build sound posture, grip, footwork, and rules comprehension under the guidance of specialist coaches.',
      image: '/images/sports/cricket-main.jpg',
      threshold: 0.25,
    },
    {
      number: '03',
      title: 'Practice',
      subtitle: 'DELIBERATE REPETITION',
      description:
        'Develop consistency and muscle memory through structured drills, tactical puzzles, and studio rehearsals.',
      image: '/images/strategy/strategy-main.jpg',
      threshold: 0.42,
    },
    {
      number: '04',
      title: 'Improve',
      subtitle: 'FEEDBACK & REFINEMENT',
      description:
        'Track personal progress, refine technique through constructive mentor feedback, and build physical and mental stamina.',
      image: '/images/sports/swimming-main.jpg',
      threshold: 0.59,
    },
    {
      number: '05',
      title: 'Compete',
      subtitle: 'TOURNAMENTS & SHOWCASES',
      description:
        'Test your preparation in inter-center fixtures, rated chess meets, and live performing arts stage showcases.',
      image: '/images/sports/football-main.jpg',
      threshold: 0.76,
    },
    {
      number: '06',
      title: 'Achieve',
      subtitle: 'CONFIDENCE FOR LIFE',
      description:
        'Carry forward resilience, teamwork, strategic clarity, and self-belief that extend far beyond the arena.',
      image: '/images/performing-arts/performing-arts-main.jpg',
      threshold: 0.92,
    },
  ] satisfies JourneyStage[],

  skillsBenefits: [
    {
      number: '01',
      title: 'Physical Fitness',
      description:
        'Cardiovascular endurance, strength, flexibility, and motor coordination built through age-appropriate conditioning.',
    },
    {
      number: '02',
      title: 'Discipline and Consistency',
      description:
        'Structured training habits that teach time management, preparation, and respect for the process.',
    },
    {
      number: '03',
      title: 'Strategic Thinking',
      description:
        'Pattern recognition, foresight, and analytical problem-solving honed across chess and tactical team sports.',
    },
    {
      number: '04',
      title: 'Communication',
      description:
        'Clear vocal coordination on the field, active listening in rehearsal, and constructive dialogue with coaches.',
    },
    {
      number: '05',
      title: 'Teamwork',
      description:
        'Shared accountability, trust, and collective effort across football, cricket, basketball, and ensemble choreography.',
    },
    {
      number: '06',
      title: 'Confidence',
      description:
        'Measurable skill progression that builds self-assurance in competition, academics, and daily life.',
    },
    {
      number: '07',
      title: 'Creative Expression',
      description:
        'Artistic freedom, rhythm, and emotional expression cultivated through dance and stage performance.',
    },
    {
      number: '08',
      title: 'Performance Skills',
      description:
        'Composure under pressure—whether stepping up to the crease, starting a tournament clock, or taking the stage.',
    },
  ] satisfies SkillBenefitItem[],

  values: [
    {
      code: '01',
      title: 'Integrity',
      description: 'Acting with honesty and respect.',
    },
    {
      code: '02',
      title: 'Discipline',
      description: 'Building consistency through practice and commitment.',
    },
    {
      code: '03',
      title: 'Resilience',
      description: 'Learning and growing through challenges.',
    },
    {
      code: '04',
      title: 'Teamwork',
      description: 'Supporting one another and working toward shared goals.',
    },
  ],
};
