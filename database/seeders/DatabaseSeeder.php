<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        // 1. Seed Default Admin Account
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@inventivesports.co'],
            [
                'name' => 'Inventive Administrator',
                'password' => Hash::make('InventiveAdmin2026!'),
                'role' => 'super_admin',
                'api_token' => 'inv-admin-live-token-2026',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        // 2. Seed Website Settings & Content
        $settings = [
            ['group' => 'branding', 'key' => 'logo_url', 'value' => '/images/brand/inventive-sports-logo.png'],
            ['group' => 'branding', 'key' => 'site_name', 'value' => 'Inventive Sports & Performing Arts'],
            ['group' => 'hero', 'key' => 'hero_headline', 'value' => 'BUILD SKILLS. DISCOVER POTENTIAL. BECOME EXTRAORDINARY.'],
            ['group' => 'hero', 'key' => 'hero_subcopy', 'value' => 'Where sports, strategy, and performing arts come together to shape confident individuals and future champions.'],
            ['group' => 'hero', 'key' => 'hero_primary_cta', 'value' => 'EXPLORE DISCIPLINES'],
            ['group' => 'hero', 'key' => 'hero_secondary_cta', 'value' => 'DISCOVER OUR ACADEMY'],
            ['group' => 'about_home', 'key' => 'headline', 'value' => 'MORE THAN A SPORTS ACADEMY.'],
            ['group' => 'about_home', 'key' => 'description', 'value' => 'Inventive Sports brings together physical development, strategic thinking, creative expression, and teamwork in a multidisciplinary learning environment. We believe every discipline offers an opportunity to discover strengths, build confidence, and develop lifelong skills.'],
            ['group' => 'about_page', 'key' => 'hero_eyebrow', 'value' => 'OUR STORY'],
            ['group' => 'about_page', 'key' => 'hero_headline', 'value' => 'BUILDING PEOPLE. NURTURING CHAMPIONS.'],
            ['group' => 'about_page', 'key' => 'hero_description', 'value' => 'Nurturing champions through discipline, strategy, and high-performance training. Join the legacy of Inventive Sports.'],
            ['group' => 'about_page', 'key' => 'mission_heading', 'value' => 'TO REVOLUTIONIZE GRASSROOTS SPORTS'],
            ['group' => 'about_page', 'key' => 'mission_body', 'value' => 'We are dedicated to providing a professional, multidisciplinary environment where young athletes can develop physical prowess, strategic thinking, and emotional resilience. Our mission is to build the next generation of champions—both on the field and in life.'],
            ['group' => 'about_page', 'key' => 'vision_heading', 'value' => 'THE GOLD STANDARD OF EXCELLENCE'],
            ['group' => 'about_page', 'key' => 'vision_body', 'value' => 'To be India\'s premier sports and arts academy, where every child discovers their hidden potential through world-class coaching, state-of-the-art facilities, and a culture of relentless improvement.'],
            ['group' => 'contact', 'key' => 'centers', 'value' => 'Kammanahalli & Hesaraghatta Centers, Bangalore'],
            ['group' => 'contact', 'key' => 'website_ref', 'value' => 'https://www.inventivesports.co/'],
            ['group' => 'seo', 'key' => 'default_meta_title', 'value' => 'Inventive Sports & Performing Arts — Bangalore Sports & Arts Academy'],
            ['group' => 'seo', 'key' => 'default_meta_description', 'value' => 'Where sports, strategy, and performing arts come together to shape confident individuals and future champions in Bangalore.'],
        ];

        foreach ($settings as $s) {
            DB::table('settings')->updateOrInsert(
                ['key' => $s['key']],
                array_merge($s, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // 3. Seed About Us Timeline Milestones
        DB::table('timeline_milestones')->truncate();
        DB::table('timeline_milestones')->insert([
            [
                'year' => '2018',
                'eyebrow' => 'THE FOUNDATION',
                'heading' => 'A VISION THAT STARTED IN 2018',
                'description' => 'In 2018, Inventive Academy started with a vision — a place where young talents in Bangalore could train holistically across sports and arts. We began with a single mission: to build the person, not just the athlete.',
                'image_url' => '/images/about/founded.png',
                'display_order' => 1,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'year' => 'MULTIDISCIPLINARY',
                'eyebrow' => 'MULTIDISCIPLINARY',
                'heading' => 'STRONGER THROUGH DIFFERENT DISCIPLINES',
                'description' => 'We believe cross-training strengthens resilience. Skills from dance sharpen agility; mental focus from chess enhances reflexes; teamwork from team sports builds lifelong character.',
                'image_url' => '/images/about/multi.png',
                'display_order' => 2,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'year' => 'FACILITIES',
                'eyebrow' => 'ELITE FACILITIES',
                'heading' => 'SPACES DESIGNED FOR PROGRESS',
                'description' => 'From our climate-controlled indoor halls to sport-specific zones, our centers in Kammanahalli, Hesaraghatta, and beyond are designed to inspire greatness every day.',
                'image_url' => '/images/about/state.png',
                'display_order' => 3,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        // 4. Seed Leadership & Our Squad (Exact Image Mapping)
        DB::table('team_members')->truncate();
        $team = [
            // Leadership (Exact uploaded image mapping)
            [
                'name' => 'Praveen K.',
                'designation' => 'Founder & CEO',
                'category' => 'leadership',
                'discipline' => 'Executive Leadership',
                'biography' => 'As the Director, Praveen sir spearheads strategic initiatives and partnerships, driving Inventive Sports Academy\'s growth and vision. His extensive experience ensures our programs consistently deliver excellence.',
                'portrait_url' => '/images/leadership/praveen-k.jpg',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'Soniya M.',
                'designation' => 'Co-founder',
                'category' => 'leadership',
                'discipline' => 'Curriculum & Creative Direction',
                'biography' => 'Soniya is the creative force behind our innovative curriculum. Her passion for nurturing young talent and fostering a vibrant learning environment is at the core of our academy\'s success.',
                'portrait_url' => '/images/leadership/soniya-m.jpg',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'Dr. Joseph Emmanuel',
                'designation' => 'Board of Advisor',
                'category' => 'leadership',
                'discipline' => 'Educational Advisory',
                'biography' => 'A visionary leader in the Indian education sector, Dr. Joseph provides strategic guidance to ensure our programs meet the highest standards of holistic development and excellence.',
                'portrait_url' => '/images/leadership/dr-joseph-emmanuel.png',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'Yuvaraj',
                'designation' => 'General Manager',
                'category' => 'leadership',
                'discipline' => 'Academy Operations',
                'biography' => 'Yuvaraj oversees the seamless execution of academy operations. His leadership ensures that our facilities and coaching staff deliver a world-class experience for every athlete.',
                'portrait_url' => '/images/leadership/yuvaraj.png',
                'display_order' => 4,
                'is_published' => true,
            ],
            // Our Squad (9 Coaches & Experts)
            [
                'name' => 'Binoy Kunjumon',
                'designation' => 'Chess Expert',
                'category' => 'squad',
                'discipline' => 'Chess',
                'biography' => 'Guides students in classical opening repertoire, tactical calculation, and tournament preparation.',
                'portrait_url' => '/images/strategy/strategy-main.jpg',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'Manikandan',
                'designation' => 'Chess Expert',
                'category' => 'squad',
                'discipline' => 'Chess',
                'biography' => 'Specializes in positional strategy, endgame precision, and competitive rapid/classical chess training.',
                'portrait_url' => '/images/strategy/strategy-main.jpg',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'Preetham VK',
                'designation' => 'Cricket Expert',
                'category' => 'squad',
                'discipline' => 'Cricket',
                'biography' => 'Coaches batting mechanics, bowling action alignment, and match-awareness drills.',
                'portrait_url' => '/images/sports/cricket-main.jpg',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'Rakesh',
                'designation' => 'Swimming Expert',
                'category' => 'squad',
                'discipline' => 'Swimming',
                'biography' => 'Develops stroke efficiency, breath control, water confidence, and competitive lane pacing.',
                'portrait_url' => '/images/sports/swimming-main.jpg',
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'name' => 'Jaypal',
                'designation' => 'Skating Expert',
                'category' => 'squad',
                'discipline' => 'Skating',
                'biography' => 'Focuses on balance, cornering technique, stride propulsion, and rink safety.',
                'portrait_url' => '/images/sports/skating-main.jpg',
                'display_order' => 5,
                'is_published' => true,
            ],
            [
                'name' => 'Yuvaraj',
                'designation' => 'Football Expert',
                'category' => 'squad',
                'discipline' => 'Football',
                'biography' => 'Leads first-touch ball mastery, tactical positioning, passing combinations, and match conditioning.',
                'portrait_url' => '/images/leadership/yuvaraj.png',
                'display_order' => 6,
                'is_published' => true,
            ],
            [
                'name' => 'Dhanush',
                'designation' => 'Dance Expert',
                'category' => 'squad',
                'discipline' => 'Dance and Performing Arts',
                'biography' => 'Instructs rhythm synchronization, expressive stage movement, and choreography.',
                'portrait_url' => '/images/performing-arts/performing-arts-main.jpg',
                'display_order' => 7,
                'is_published' => true,
            ],
            [
                'name' => 'Biju Prasad',
                'designation' => 'Chess Expert',
                'category' => 'squad',
                'discipline' => 'Chess',
                'biography' => 'Mentors developing players in pattern recognition, calculation depth, and tournament composure.',
                'portrait_url' => '/images/strategy/strategy-main.jpg',
                'display_order' => 8,
                'is_published' => true,
            ],
            [
                'name' => 'Vinod Kumar',
                'designation' => 'Basketball Expert',
                'category' => 'squad',
                'discipline' => 'Basketball',
                'biography' => 'Trains shooting mechanics, court spacing, defensive footwork, and team transition play.',
                'portrait_url' => '/images/sports/basketball-main.jpg',
                'display_order' => 9,
                'is_published' => true,
            ],
        ];

        foreach ($team as $member) {
            DB::table('team_members')->insert(array_merge($member, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        // 5. Seed 7 Interactive Sports & Performing Arts Disciplines
        DB::table('disciplines')->truncate();
        $disciplines = [
            [
                'name' => 'Football',
                'slug' => 'football',
                'category' => 'sports',
                'tagline' => 'STADIUM LIGHTING & BALL TRAJECTORY EXPERIENCE',
                'scene_heading' => 'OWN THE FIELD.',
                'animation_style' => 'football-stadium',
                'short_description' => 'Master ball control, tactical field vision, passing geometry, and explosive match conditioning under professional coaching.',
                'full_description' => 'Our Football program develops complete players—combining technical first touch, spatial awareness, passing combinations, and disciplined team structure.',
                'benefits_json' => json_encode([
                    'Close-control dribbling, striking accuracy, and two-footed technical mastery',
                    'Tactical awareness, off-the-ball movement, and transitional team structure',
                    'Cardiovascular endurance, agility, and competitive match composure',
                ]),
                'highlights_json' => json_encode([
                    'Small-sided tactical games & positional drills',
                    'Set-piece trajectory & finishing sessions',
                    'Structured inter-academy practice matches',
                ]),
                'cover_image' => '/images/sports/football-main.jpg',
                'cta_text' => 'EXPLORE FOOTBALL',
                'display_order' => 1,
                'is_published' => true,
            ],
            [
                'name' => 'Cricket',
                'slug' => 'cricket',
                'category' => 'sports',
                'tagline' => 'TECHNICAL BATTING, BOWLING & FIELDING MASTERY',
                'scene_heading' => 'PLAY WITH PURPOSE.',
                'animation_style' => 'cricket-sweep',
                'short_description' => 'Develop textbook batting technique, repeatable bowling rhythm, sharp fielding reflexes, and match temperament.',
                'full_description' => 'Cricket at Inventive Sports focuses on biomechanical alignment, shot selection, bowling consistency, and tactical game reading across formats.',
                'benefits_json' => json_encode([
                    'Balanced batting stance, footwork precision, and stroke execution',
                    'Repeatable bowling action, line-and-length discipline, and variations',
                    'High-intensity ground fielding, catching reflexes, and wicketkeeping basics',
                ]),
                'highlights_json' => json_encode([
                    'Dedicated net practice & bowling machine drills',
                    'Match-scenario simulation & field placement strategy',
                    'Physical conditioning for long-format stamina',
                ]),
                'cover_image' => '/images/sports/cricket-main.jpg',
                'cta_text' => 'EXPLORE CRICKET',
                'display_order' => 2,
                'is_published' => true,
            ],
            [
                'name' => 'Chess',
                'slug' => 'chess',
                'category' => 'sports',
                'tagline' => 'STRATEGIC FORESIGHT & COGNITIVE PRECISION',
                'scene_heading' => 'THINK AHEAD. PLAY SMART.',
                'animation_style' => 'chess-strategy',
                'short_description' => 'Cultivate deep concentration, multi-move calculation, tactical pattern recognition, and calm decision-making under clock pressure.',
                'full_description' => 'Led by experienced chess mentors, our curriculum guides students from foundational rules to advanced tournament preparation, opening theory, and endgame mastery.',
                'benefits_json' => json_encode([
                    'Opening principles, middle-game tactical motifs, and endgame technique',
                    'Structured calculation habits, visualization, and blunder prevention',
                    'Clock management, tournament etiquette, and post-game analytical review',
                ]),
                'highlights_json' => json_encode([
                    'Guided classical & rapid tournament preparation',
                    'Tactical puzzle labs & grandmaster game studies',
                    'Mentorship from dedicated Chess Experts',
                ]),
                'cover_image' => '/images/strategy/strategy-main.jpg',
                'cta_text' => 'EXPLORE CHESS',
                'display_order' => 3,
                'is_published' => true,
            ],
            [
                'name' => 'Swimming',
                'slug' => 'swimming',
                'category' => 'sports',
                'tagline' => 'HYDRODYNAMIC EFFICIENCY & BREATH CONTROL',
                'scene_heading' => 'FIND YOUR FLOW.',
                'animation_style' => 'swimming-fluid',
                'short_description' => 'Build water confidence, streamlined stroke mechanics, rhythmic breathing, and full-body cardiovascular endurance.',
                'full_description' => 'Our Swimming program progresses from foundational water safety and buoyancy to competitive four-stroke technique, starts, turns, and pacing.',
                'benefits_json' => json_encode([
                    'Streamlined body position, kick propulsion, and stroke efficiency',
                    'Bilateral breathing control, flip turns, and underwater dolphin kick',
                    'Low-impact full-body strength, lung capacity, and endurance',
                ]),
                'highlights_json' => json_encode([
                    'Progressive lane coaching by skill level',
                    'Freestyle, backstroke, breaststroke & butterfly technique',
                    'Timed endurance sets & racing start mechanics',
                ]),
                'cover_image' => '/images/sports/swimming-main.jpg',
                'cta_text' => 'EXPLORE SWIMMING',
                'display_order' => 4,
                'is_published' => true,
            ],
            [
                'name' => 'Skating',
                'slug' => 'skating',
                'category' => 'sports',
                'tagline' => 'BALANCE, VELOCITY & EDGE CONTROL',
                'scene_heading' => 'MOVE WITH CONFIDENCE.',
                'animation_style' => 'skating-diagonal',
                'short_description' => 'Master dynamic balance, cornering crossovers, stride power, and high-speed control on the rink.',
                'full_description' => 'Skating builds extraordinary lower-body stability, core coordination, and spatial confidence through structured progression from beginner balance to speed skating.',
                'benefits_json' => json_encode([
                    'Postural balance, braking safety, and edge control fundamentals',
                    'Linear stride extension, crossover cornering, and cadence speed',
                    'Core stability, ankle strength, and spatial agility',
                ]),
                'highlights_json' => json_encode([
                    'Beginner stability to advanced speed-skating tracks',
                    'Slalom agility & crossover cornering drills',
                    'Protective gear safety & time-trial preparation',
                ]),
                'cover_image' => '/images/sports/skating-main.jpg',
                'cta_text' => 'EXPLORE SKATING',
                'display_order' => 5,
                'is_published' => true,
            ],
            [
                'name' => 'Basketball',
                'slug' => 'basketball',
                'category' => 'sports',
                'tagline' => 'ELEVATION, COURT VISION & TEAM TRANSITION',
                'scene_heading' => 'AIM HIGHER.',
                'animation_style' => 'basketball-arc',
                'short_description' => 'Sharpen ball-handling, shooting arc mechanics, defensive footwork, and fast-paced team coordination on court.',
                'full_description' => 'Our Basketball curriculum develops versatile court players with reliable shooting form, crisp passing vision, rebounding tenacity, and unselfish team defense.',
                'benefits_json' => json_encode([
                    'Shooting release mechanics, layup footwork, and free-throw consistency',
                    'Two-hand ball handling, court spacing, and pick-and-roll decision-making',
                    'Lateral defensive slides, vertical leap conditioning, and communication',
                ]),
                'highlights_json' => json_encode([
                    'Form shooting & arc trajectory drills',
                    'Half-court tactical execution & fast-break transition',
                    '5v5 structured scrimmages & situational coaching',
                ]),
                'cover_image' => '/images/sports/basketball-main.jpg',
                'cta_text' => 'EXPLORE BASKETBALL',
                'display_order' => 6,
                'is_published' => true,
            ],
            [
                'name' => 'Dance and Performing Arts',
                'slug' => 'performing-arts',
                'category' => 'performing-arts',
                'tagline' => 'RHYTHM, CHOREOGRAPHY & STAGE PRESENCE',
                'scene_heading' => 'EXPRESS YOUR POTENTIAL.',
                'animation_style' => 'dance-curtain',
                'short_description' => 'Channel rhythm, body awareness, choreography, and creative storytelling in a supportive studio and stage environment.',
                'full_description' => 'Dance and Performing Arts at Inventive Academy blend physical athleticism with artistic expression—building flexibility, musicality, ensemble synchronization, and stage confidence.',
                'benefits_json' => json_encode([
                    'Rhythm accuracy, musicality, and full-body movement coordination',
                    'Flexibility, posture, balance, and expressive stage presence',
                    'Collaborative ensemble choreography and live showcase confidence',
                ]),
                'highlights_json' => json_encode([
                    'Contemporary, freestyle & rhythmic choreography labs',
                    'Rehearsal-to-stage performance preparation',
                    'Academy showcases & community cultural events',
                ]),
                'cover_image' => '/images/performing-arts/performing-arts-main.jpg',
                'cta_text' => 'EXPLORE PERFORMING ARTS',
                'display_order' => 7,
                'is_published' => true,
            ],
        ];

        foreach ($disciplines as $d) {
            DB::table('disciplines')->insert(array_merge($d, [
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        // 6. Seed Events
        DB::table('events')->truncate();
        DB::table('events')->insert([
            [
                'title' => 'Inventive Rapid Chess Championship & Workshop',
                'slug' => 'inventive-rapid-chess-championship',
                'short_description' => 'Structured rapid-chess rounds and tactical analysis sessions guided by our Chess Experts.',
                'description' => 'Join players across age categories for an official academy rapid chess meet featuring Swiss-system rounds, post-game board analysis, and tactical workshops.',
                'cover_image' => '/images/strategy/strategy-main.jpg',
                'discipline' => 'Chess',
                'start_date' => '2026-11-15',
                'end_date' => '2026-11-15',
                'start_time' => '09:00 AM',
                'end_time' => '04:30 PM',
                'venue' => 'Kammanahalli Center, Bangalore',
                'registration_url' => '/contact',
                'contact_details' => 'Inventive Sports Desk — Kammanahalli',
                'is_featured' => true,
                'status' => 'published',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Inter-Center Football & Basketball Skills Meet',
                'slug' => 'inter-center-football-basketball-meet',
                'short_description' => 'Small-sided football fixtures, shooting trajectory challenges, and team conditioning showcases.',
                'description' => 'Athletes from our Kammanahalli and Hesaraghatta centers come together for structured match play, technical skill assessments, and coach feedback.',
                'cover_image' => '/images/sports/football-main.jpg',
                'discipline' => 'Football',
                'start_date' => '2026-11-29',
                'end_date' => '2026-11-29',
                'start_time' => '08:00 AM',
                'end_time' => '02:00 PM',
                'venue' => 'Hesaraghatta Main Turf & Court, Bangalore',
                'registration_url' => '/contact',
                'contact_details' => 'Inventive Sports Desk — Hesaraghatta',
                'is_featured' => true,
                'status' => 'published',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'title' => 'Annual Performing Arts & Skating Exhibition',
                'slug' => 'annual-performing-arts-skating-exhibition',
                'short_description' => 'Live stage choreography and precision skating demonstrations for students and families.',
                'description' => 'A celebration of movement, rhythm, and agility featuring ensemble dance performances and speed/slalom skating showcases.',
                'cover_image' => '/images/performing-arts/performing-arts-main.jpg',
                'discipline' => 'Dance and Performing Arts',
                'start_date' => '2026-12-12',
                'end_date' => '2026-12-12',
                'start_time' => '05:00 PM',
                'end_time' => '08:00 PM',
                'venue' => 'Inventive Main Indoor Arena, Bangalore',
                'registration_url' => '/contact',
                'contact_details' => 'Inventive Events Team',
                'is_featured' => false,
                'status' => 'published',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        // 7. Seed Gallery Albums & Items
        DB::table('gallery_items')->truncate();
        DB::table('gallery_albums')->truncate();

        $albumTrainingId = DB::table('gallery_albums')->insertGetId([
            'title' => 'High-Performance Training Sessions',
            'slug' => 'high-performance-training',
            'description' => 'Daily coaching across football, cricket, swimming, skating, and basketball.',
            'cover_image' => '/images/sports/football-main.jpg',
            'display_order' => 1,
            'is_published' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $albumTournamentsId = DB::table('gallery_albums')->insertGetId([
            'title' => 'Tournaments & Stage Showcases',
            'slug' => 'tournaments-and-showcases',
            'description' => 'Moments from chess championships, dance recitals, and academy events.',
            'cover_image' => '/images/events/events-main.jpg',
            'display_order' => 2,
            'is_published' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('gallery_items')->insert([
            [
                'album_id' => $albumTrainingId,
                'title' => 'Evening Stadium Football Training',
                'caption' => 'Ball trajectory and finishing drills under floodlights.',
                'category' => 'Training Sessions',
                'discipline' => 'Football',
                'media_type' => 'photo',
                'media_url' => '/images/sports/football-main.jpg',
                'alt_text' => 'Football player striking ball under stadium lights',
                'display_order' => 1,
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTrainingId,
                'title' => 'Cricket Batting Mechanics Session',
                'caption' => 'Front-foot drive alignment and shot selection practice.',
                'category' => 'Training Sessions',
                'discipline' => 'Cricket',
                'media_type' => 'photo',
                'media_url' => '/images/sports/cricket-main.jpg',
                'alt_text' => 'Cricketer executing a cover drive in training',
                'display_order' => 2,
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTournamentsId,
                'title' => 'Classical & Rapid Chess Championship',
                'caption' => 'Focused calculation during tournament rounds.',
                'category' => 'Competitions',
                'discipline' => 'Chess',
                'media_type' => 'photo',
                'media_url' => '/images/strategy/strategy-main.jpg',
                'alt_text' => 'Chess player making a move on wooden tournament board',
                'display_order' => 3,
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTrainingId,
                'title' => 'Competitive Lane Swimming',
                'caption' => 'Hydrodynamic stroke efficiency and pacing drills.',
                'category' => 'Training Sessions',
                'discipline' => 'Swimming',
                'media_type' => 'photo',
                'media_url' => '/images/sports/swimming-main.jpg',
                'alt_text' => 'Swimmer training in indoor lap pool',
                'display_order' => 4,
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTrainingId,
                'title' => 'Inline Speed Skating Cornering',
                'caption' => 'Low-posture edge control and rink velocity training.',
                'category' => 'Training Sessions',
                'discipline' => 'Skating',
                'media_type' => 'photo',
                'media_url' => '/images/sports/skating-main.jpg',
                'alt_text' => 'Inline skater banking around track turn',
                'display_order' => 5,
                'is_featured' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTrainingId,
                'title' => 'Indoor Court Basketball Elevation',
                'caption' => 'Jump-shot release mechanics and court spacing.',
                'category' => 'Training Sessions',
                'discipline' => 'Basketball',
                'media_type' => 'photo',
                'media_url' => '/images/sports/basketball-main.jpg',
                'alt_text' => 'Basketball player elevating for a jump shot',
                'display_order' => 6,
                'is_featured' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTournamentsId,
                'title' => 'Contemporary Stage Movement Showcase',
                'caption' => 'Expressive leap during performing arts studio rehearsal.',
                'category' => 'Performances',
                'discipline' => 'Dance and Performing Arts',
                'media_type' => 'photo',
                'media_url' => '/images/performing-arts/performing-arts-main.jpg',
                'alt_text' => 'Dancer mid-leap in sunlit studio',
                'display_order' => 7,
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'album_id' => $albumTournamentsId,
                'title' => 'Multidisciplinary Training Hall',
                'caption' => 'Our indoor training spaces designed for holistic growth.',
                'category' => 'Event Galleries',
                'discipline' => 'General',
                'media_type' => 'photo',
                'media_url' => '/images/about/state.png',
                'alt_text' => 'Inventive Sports indoor facility',
                'display_order' => 8,
                'is_featured' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        // 8. Seed Product Categories & Shop Products
        DB::table('products')->truncate();
        DB::table('product_categories')->truncate();

        $catApparel = DB::table('product_categories')->insertGetId([
            'name' => 'Academy Apparel',
            'slug' => 'academy-apparel',
            'description' => 'Official Inventive Sports training jerseys and tracksuits.',
            'display_order' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $catEquipment = DB::table('product_categories')->insertGetId([
            'name' => 'Sports & Chess Equipment',
            'slug' => 'sports-equipment',
            'description' => 'Tournament chess sets, footballs, cricket gear, and skating protection.',
            'display_order' => 2,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('products')->insert([
            [
                'category_id' => $catApparel,
                'category_name' => 'Academy Apparel',
                'name' => 'Inventive Pro Training Jersey (Red / Black)',
                'slug' => 'inventive-pro-training-jersey',
                'sku' => 'INV-APP-001',
                'description' => 'Breathable moisture-wicking training jersey featuring the official Inventive Sports crest. Engineered for football, cricket, basketball, and conditioning sessions.',
                'price' => 1299.00,
                'sale_price' => 999.00,
                'stock_quantity' => 45,
                'image_url' => '/images/athletics/athletics-main.jpg',
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $catEquipment,
                'category_name' => 'Sports & Chess Equipment',
                'name' => 'Championship Staunton Wooden Chess Set & Clock Pack',
                'slug' => 'championship-staunton-chess-set',
                'sku' => 'INV-CHS-002',
                'description' => 'Weighted tournament-standard Staunton chessmen with folding matte board and digital DGT-style increment timer recommended by our Chess Experts.',
                'price' => 2499.00,
                'sale_price' => null,
                'stock_quantity' => 20,
                'image_url' => '/images/strategy/strategy-main.jpg',
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $catEquipment,
                'category_name' => 'Sports & Chess Equipment',
                'name' => 'Match-Grade Thermo-Bonded Football (Size 5)',
                'slug' => 'match-grade-thermo-bonded-football',
                'sku' => 'INV-FTB-003',
                'description' => 'FIFA-standard flight stability football with textured micro-surface for accurate trajectory control under dry and wet turf conditions.',
                'price' => 1850.00,
                'sale_price' => 1599.00,
                'stock_quantity' => 30,
                'image_url' => '/images/sports/football-main.jpg',
                'is_featured' => true,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $catEquipment,
                'category_name' => 'Sports & Chess Equipment',
                'name' => 'Inline Speed & Slalom Skate Starter Kit',
                'slug' => 'inline-speed-skate-starter-kit',
                'sku' => 'INV-SKT-004',
                'description' => 'Precision aluminum-frame inline skates paired with aerodynamic helmet, wrist guards, and knee/elbow protection for academy rink sessions.',
                'price' => 4500.00,
                'sale_price' => 3999.00,
                'stock_quantity' => 15,
                'image_url' => '/images/sports/skating-main.jpg',
                'is_featured' => false,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        // 9. Seed Media Library Registry
        DB::table('media')->truncate();
        $mediaAssets = [
            ['title' => 'Official Inventive Sports Logo', 'filename' => 'inventive-sports-logo.png', 'file_url' => '/images/brand/inventive-sports-logo.png', 'mime_type' => 'image/png', 'alt_text' => 'Inventive Sports Official Logo', 'usage_role' => 'logo'],
            ['title' => 'Praveen K. — Founder & CEO', 'filename' => 'praveen-k.jpg', 'file_url' => '/images/leadership/praveen-k.jpg', 'mime_type' => 'image/jpeg', 'alt_text' => 'Praveen K. — Founder & CEO of Inventive Sports', 'usage_role' => 'leadership'],
            ['title' => 'Soniya M. — Co-founder', 'filename' => 'soniya-m.jpg', 'file_url' => '/images/leadership/soniya-m.jpg', 'mime_type' => 'image/jpeg', 'alt_text' => 'Soniya M. — Co-founder of Inventive Sports', 'usage_role' => 'leadership'],
            ['title' => 'Dr. Joseph Emmanuel — Board of Advisor', 'filename' => 'dr-joseph-emmanuel.png', 'file_url' => '/images/leadership/dr-joseph-emmanuel.png', 'mime_type' => 'image/png', 'alt_text' => 'Dr. Joseph Emmanuel — Board of Advisor', 'usage_role' => 'leadership'],
            ['title' => 'Yuvaraj — General Manager', 'filename' => 'yuvaraj.png', 'file_url' => '/images/leadership/yuvaraj.png', 'mime_type' => 'image/png', 'alt_text' => 'Yuvaraj — General Manager', 'usage_role' => 'leadership'],
            ['title' => 'The Foundation (2018)', 'filename' => 'founded.png', 'file_url' => '/images/about/founded.png', 'mime_type' => 'image/png', 'alt_text' => 'Inventive Academy Foundation 2018', 'usage_role' => 'timeline'],
            ['title' => 'Multidisciplinary Training', 'filename' => 'multi.png', 'file_url' => '/images/about/multi.png', 'mime_type' => 'image/png', 'alt_text' => 'Multidisciplinary training at Inventive Sports', 'usage_role' => 'timeline'],
            ['title' => 'Elite Facilities', 'filename' => 'state.png', 'file_url' => '/images/about/state.png', 'mime_type' => 'image/png', 'alt_text' => 'State of the art facilities at Inventive Sports', 'usage_role' => 'timeline'],
        ];

        foreach ($mediaAssets as $m) {
            DB::table('media')->insert(array_merge($m, [
                'file_size' => 102400,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }

        // 10. Seed Initial Leads & Activity Log
        if (DB::table('leads')->count() === 0) {
            $leadId = DB::table('leads')->insertGetId([
                'name' => 'Aarav Sharma',
                'email' => 'aarav.parent@example.com',
                'phone' => '+91 98450 12345',
                'preferred_discipline' => 'Football',
                'enquiry_type' => 'Trial Session Enquiry',
                'message' => 'Looking to enroll my 11-year-old son in weekend Football and Chess coaching at the Kammanahalli center.',
                'source_page' => '/sports/football',
                'status' => 'New',
                'assigned_to' => 'Yuvaraj',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('lead_notes')->insert([
                'lead_id' => $leadId,
                'author_name' => 'Yuvaraj',
                'note' => 'Scheduled orientation call for Saturday morning batch.',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('activity_logs')->insert([
            'actor_name' => 'System Seeder',
            'action' => 'Initialized Inventive Sports CMS Database',
            'entity_type' => 'system',
            'entity_id' => 1,
            'details' => 'Seeded leadership portraits, 9 squad coaches, 7 sports disciplines, timeline milestones, events, gallery, and shop catalogue.',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
