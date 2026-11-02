-- DevFest Jos 2026, hosted by GDG Jos: PadiUp's first circle. Its settings, event day and quiz
-- content. Data, not schema: safe to re-run, and it never overwrites settings changed in circle admin.
-- Apply with: pnpm db:apply db/circles/devfest-jos-2026.sql   then set PADIUP_CIRCLE=devfest-jos-2026

insert into quest_circles (slug, name, host_name, whatsapp_url, x, instagram, linkedin, facebook,
                           event_date, venue, city, community_url, hashtags, launch_at)
values ('devfest-jos-2026', 'DevFest Jos 2026', 'GDG Jos', 'https://chat.whatsapp.com/FZbv4sddTIgAiK9zZ9B7m3?mode=gi_t',
        'gdgjos2', 'gdg_jos', 'google-developer-groups-jos-gdg', 'gdgjos',
        '2026-10-17', 'Odilin''s Event Center', 'Jos', 'https://gdg.community.dev/gdg-jos/', '#DevFestJos #DevFest2026',
        '2026-10-13T00:00:00+01:00')
on conflict (slug) do update set
  whatsapp_url  = coalesce(quest_circles.whatsapp_url, excluded.whatsapp_url),
  linkedin      = coalesce(quest_circles.linkedin, excluded.linkedin),
  event_date    = coalesce(quest_circles.event_date, excluded.event_date),
  venue         = coalesce(quest_circles.venue, excluded.venue),
  city          = coalesce(quest_circles.city, excluded.city),
  community_url = coalesce(quest_circles.community_url, excluded.community_url),
  hashtags      = coalesce(quest_circles.hashtags, excluded.hashtags),
  launch_at     = coalesce(quest_circles.launch_at, excluded.launch_at);

-- ---------------------------------------------------------------------------
-- Learning cards: daily drops in event week, plus anytime trivia.
-- ---------------------------------------------------------------------------

insert into quest_quiz_items (slug, round, track, opens_on, learn, question, options, correct, explanation, sort) values
  ('ai-agent', 'daily', 'AI and Agents', '2026-10-13', 'An AI agent is software that can take actions for you, like booking a ticket or sending an email, not just answer questions.', 'Which of these is an agent?', '["An app that books your bus to Abuja when prices drop", "A dictionary app", "A calculator app", "A photo filter"]'::jsonb, 0, 'It watches prices and books for you. Acting on your behalf is what makes software an agent.', 0),
  ('ai-llm', 'daily', 'AI and Agents', '2026-10-13', 'A large language model (LLM) learns patterns from huge amounts of text, then predicts the next words to write a reply.', 'What does an LLM do when it replies?', '["Asks the internet to vote", "Looks the answer up in one fixed database", "Predicts likely next words from patterns it learnt", "Copies a person typing live"]'::jsonb, 2, 'LLMs write word by word from learnt patterns. That''s why they can sound sure and still be wrong.', 1),
  ('ai-halluc', 'daily', 'AI and Agents', '2026-10-13', 'A hallucination is when an AI states something false with confidence, like a made-up quote or a link that doesn''t exist.', 'Your AI assistant gives you a statistic with no source. What''s the smart move?', '["Post it right away", "Trust it because it sounds confident", "Ask it to repeat it louder", "Check it against a trusted source first"]'::jsonb, 3, 'Treat AI output like a confident friend''s claim: useful, but check facts before you share them.', 2),
  ('ai-prompt', 'daily', 'AI and Agents', '2026-10-13', 'A prompt is the instruction you give an AI. Clear prompts give the goal, the context and the format you want back.', 'Which prompt will likely get the most useful answer?', '["\"Write a 3-line WhatsApp message inviting my class to DevFest Jos on 17 Oct, friendly tone\"", "\"Write something\"", "\"Help\"", "\"Do the thing from before\""]'::jsonb, 0, 'It says what to write, for whom, how long and in what tone. Specific prompts get specific results.', 3),
  ('ai-tools', 'daily', 'AI and Agents', '2026-10-13', 'Agents use tools: an AI can call a calendar, a search engine or a payment service to get real work done.', 'An agent adds a meeting to your calendar. What did it use?', '["A tool connected to your calendar", "Nothing, it only imagined it", "A printed diary", "Your phone''s torch"]'::jsonb, 0, 'Agents act through the tools and services they''re allowed to use. Good agents ask before doing anything important.', 4),
  ('ai-human', 'daily', 'AI and Agents', '2026-10-13', '"Human in the loop" means a person reviews or approves an AI''s important actions, like sending money or deleting files.', 'Which action most needs a person to approve it first?', '["Suggesting a song", "Summarising a news article", "Transferring ₦50,000 from your account", "Fixing a typo"]'::jsonb, 2, 'Money, deletions and messages sent in your name are hard to undo, so a human should confirm them.', 5),
  ('mob-flutter', 'daily', 'Mobile', '2026-10-14', 'Flutter is Google''s toolkit for building apps for Android, iOS, web and desktop from one codebase, written in the Dart language.', 'What''s the big win of Flutter?', '["It makes phones charge faster", "It replaces the internet", "One codebase for many platforms", "It only works on iPhones"]'::jsonb, 2, 'Write once, ship to Android, iOS, web and desktop. Small teams can reach every user.', 6),
  ('mob-android', 'daily', 'Mobile', '2026-10-14', 'Android is the most used mobile operating system in the world, and most smartphones in Nigeria run it.', 'Building an app for most phone users in Nigeria? Which platform matters most?', '["Game consoles", "Android", "Smartwatches", "Smart TVs"]'::jsonb, 1, 'Most Nigerian smartphones run Android, so test on mid-range Android phones first.', 7),
  ('mob-kotlin', 'daily', 'Mobile', '2026-10-14', 'Kotlin is the language Google recommends for Android apps. It''s concise and helps prevent crashes caused by missing values.', 'Which language does Google recommend for new Android apps?', '["Spreadsheet formulas", "HTML", "COBOL", "Kotlin"]'::jsonb, 3, 'Android has been Kotlin-first since 2019. Its null safety catches a whole class of crashes before they ship.', 8),
  ('mob-offline', 'daily', 'Mobile', '2026-10-14', 'Many users have slow or costly data. Good apps work offline, keep a local copy of what they can and keep downloads small.', 'Your users often lose network. What should your app do?', '["Force a 200 MB update", "Show a blank screen", "Crash and restart", "Save work on the phone and sync when back online"]'::jsonb, 3, 'Offline-first apps feel fast and never lose a user''s work when the network drops.', 9),
  ('mob-perms', 'daily', 'Mobile', '2026-10-14', 'An app''s permissions say what it can reach: camera, location, contacts. Ask only for what a feature needs, when it needs it.', 'A torch app asks for your contacts. What does that suggest?', '["It wants more than it needs", "Contacts make the light brighter", "Every app needs contacts", "Torches need contacts to work"]'::jsonb, 0, 'A permission should match a feature. Extra permissions are a warning sign.', 10),
  ('mob-reload', 'daily', 'Mobile', '2026-10-14', 'Hot reload in Flutter shows code changes in the running app in about a second, without restarting it.', 'What does hot reload save developers?', '["Storage space", "Battery on the user''s phone", "Time, by showing changes almost instantly", "Data costs for users"]'::jsonb, 2, 'Fast feedback means more experiments per hour, which is how good apps get polished.', 11),
  ('web-basics', 'daily', 'Web', '2026-10-15', 'Every web page is built from HTML for structure, CSS for style and JavaScript for behaviour.', 'Which part sets a button''s colour and font?', '["HTML", "CSS", "The router", "JavaScript"]'::jsonb, 1, 'CSS controls how things look. HTML says what''s there; JavaScript makes it respond.', 12),
  ('web-https', 'daily', 'Web', '2026-10-15', 'HTTPS encrypts the connection between your browser and a site, so others on the network can''t read or change what you send.', 'Why does the padlock in your browser matter when paying online?', '["The page is free", "The site is fast", "Your connection to the site is encrypted", "Google owns the site"]'::jsonb, 2, 'HTTPS protects data on the way. It doesn''t prove a site is honest, so still check the address.', 13),
  ('web-resp', 'daily', 'Web', '2026-10-15', 'A responsive site rearranges itself to fit any screen, from a small phone to a wide monitor.', 'Most of your visitors use phones. What should you design first?', '["A TV layout", "The phone layout", "A smartwatch face", "A printed poster"]'::jsonb, 1, 'Design for the smallest screen most people use, then add room for bigger ones.', 14),
  ('web-a11y', 'daily', 'Web', '2026-10-15', 'Accessibility means people with disabilities can use your site: labels for screen readers, readable contrast, keyboard access.', 'Which helps a blind visitor using a screen reader?', '["Light grey text on white", "Buttons that only work with a mouse", "Text descriptions (alt text) on images", "Music that plays automatically"]'::jsonb, 2, 'Screen readers read alt text aloud. Without it, images are silent gaps.', 15),
  ('web-api', 'daily', 'Web', '2026-10-15', 'An API lets two programs talk. A weather app asks a weather service''s API for today''s forecast, then shows the answer.', 'A ride app shows a Google map. How does it get the map?', '["By printing a map", "By drawing every street by hand", "Through the Google Maps API", "By photographing a screen"]'::jsonb, 2, 'APIs let apps borrow powerful features instead of building everything from scratch.', 16),
  ('web-speed', 'daily', 'Web', '2026-10-15', 'Speed matters: each extra second of loading makes more visitors give up, especially on mobile data.', 'Which change usually makes a page load faster?', '["Loading ten different fonts", "Making images bigger", "Adding auto-playing videos", "Compressing large images"]'::jsonb, 3, 'Images are often the heaviest part of a page. Smaller files mean faster pages and cheaper data.', 17),
  ('cs-cloud', 'daily', 'Cloud and Security', '2026-10-16', 'The cloud means using another company''s computers over the internet to run apps and store data, paying for what you use.', 'Your app suddenly gets ten times more users. What''s a cloud advantage?', '["You must buy a new building", "Nothing can change", "You can add capacity in minutes", "Users wait a month"]'::jsonb, 2, 'Cloud capacity grows and shrinks on demand, so a small team can handle a big launch.', 18),
  ('cs-phish', 'daily', 'Cloud and Security', '2026-10-16', 'Phishing is a fake message pretending to be someone you trust, to steal your password or money.', 'An email says your bank account is locked and asks you to log in through a link. What do you do?', '["Open your bank''s app or site yourself instead", "Click and log in quickly", "Forward it to everyone", "Reply with your PIN"]'::jsonb, 0, 'Never log in from a link in a surprise message. Go to the real app or site yourself.', 19),
  ('cs-2sv', 'daily', 'Cloud and Security', '2026-10-16', 'Two-step verification asks for a second proof, like a code from an app, so a stolen password alone isn''t enough.', 'Someone steals your password, but two-step verification is on. What happens?', '["Your account is deleted", "They still need your second code", "They get in anyway", "Your password changes itself"]'::jsonb, 1, 'The second step blocks most account takeovers. Turn it on for email first.', 20),
  ('cs-secrets', 'daily', 'Cloud and Security', '2026-10-16', 'Never put secret keys or passwords in code you share publicly. Bots scan public code for them within minutes.', 'Where should an app''s secret API key live?', '["In a tweet", "In a public GitHub repo", "In the server''s environment settings", "On the app''s homepage"]'::jsonb, 2, 'Secrets belong on the server, out of the code and out of the browser.', 21),
  ('cs-backup', 'daily', 'Cloud and Security', '2026-10-16', 'Backups protect you from lost phones, crashed laptops and ransomware. Keep at least one copy somewhere else.', 'Your laptop is stolen. Which habit saves your project?', '["Saving only to the desktop", "Renaming the files", "Regular backups to the cloud or another drive", "Never saving"]'::jsonb, 2, 'If it exists in one place only, it can vanish. A second copy elsewhere is cheap insurance.', 22),
  ('cs-pass', 'daily', 'Cloud and Security', '2026-10-16', 'A strong password is long and unique. A password manager can create and remember a different one for every site.', 'Which is the safest approach?', '["password123", "One password for everything", "A long, unique password per site, kept in a password manager", "Your birthday"]'::jsonb, 2, 'When one site leaks, unique passwords stop the leak spreading to your other accounts.', 23),
  ('pc-mvp', 'anytime', 'Product and Career', null, 'A minimum viable product (MVP) is the simplest version that lets real people try your idea, so you learn before building more.', 'You want to test a food delivery idea in Jos. What''s a good MVP?', '["Waiting until it''s perfect", "A WhatsApp number and a list of five restaurants", "A two-year build with every feature", "A TV advert before anything exists"]'::jsonb, 1, 'Start small, get real orders, learn what people want, then build.', 24),
  ('pc-users', 'anytime', 'Product and Career', null, 'Talk to users early. Watching five people try your product shows most of the big problems.', 'People keep getting stuck at sign-up. What''s the best first step?', '["Watch a few people try it and ask why", "Blame the users", "Change the logo", "Add more features"]'::jsonb, 0, 'Watching real people reveals problems that you can''t see as the builder.', 25),
  ('pc-portfolio', 'anytime', 'Product and Career', null, 'A portfolio shows what you''ve built. For tech jobs, a few real projects often say more than a list of courses.', 'Applying for your first developer role, what helps most?', '["A very long CV", "A list of certificates only", "An empty GitHub", "Links to projects you built"]'::jsonb, 3, 'Real projects prove you can finish things. Write a short note on what each one does.', 26),
  ('pc-oss', 'anytime', 'Product and Career', null, 'Open source means code anyone can read, use and improve. Contributing, even fixing documentation, builds skills and reputation.', 'What''s a good first open-source contribution?', '["Deleting the project", "Copying it as your own", "Demanding new features", "Fixing a typo or unclear step in the docs"]'::jsonb, 3, 'Docs fixes are welcome everywhere and teach you how a project''s review process works.', 27),
  ('pc-community', 'anytime', 'Product and Career', null, 'Communities like GDG Jos help you learn faster: you meet mentors, find collaborators and hear about opportunities.', 'What''s one way to get the most from a tech community?', '["Ask questions and share what you''re learning", "Only come for the food", "Never speak to anyone", "Leave before the talks"]'::jsonb, 0, 'Communities reward people who take part. One good question can lead to a mentor.', 28),
  ('pc-pm', 'anytime', 'Product and Career', null, 'Product managers decide what to build and why, working between users, designers and engineers. You don''t need to code to do it.', 'What does a product manager mostly do?', '["Fix the office printers", "Design the logo only", "Decide what the team builds next and why", "Write all of the code alone"]'::jsonb, 2, 'PMs turn user problems into priorities. It''s a great path for people who love both people and tech.', 29),
  ('tr-gdg', 'anytime', 'DevFest trivia', null, 'GDG stands for Google Developer Groups: local, volunteer-run communities for anyone interested in Google technologies.', 'What does GDG stand for?', '["Google Data Gateway", "Google Developer Groups", "Great Dev Gathering", "Global Design Guild"]'::jsonb, 1, 'GDGs meet in hundreds of cities worldwide, and GDG Jos is the Plateau''s chapter.', 30),
  ('tr-devfest', 'anytime', 'DevFest trivia', null, 'DevFests are community-run tech conferences hosted by Google Developer Groups around the world, mostly between September and December.', 'Who puts on DevFest Jos?', '["A football club", "Nobody, it runs itself", "GDG Jos volunteers", "A film studio"]'::jsonb, 2, 'Every DevFest is organised by local volunteers. Say thanks to the crew in the hall.', 31),
  ('tr-theme', 'anytime', 'DevFest trivia', null, 'This year''s DevFest Jos theme is Build for the agentic era: making software that can act for people, not just answer them.', 'What is DevFest Jos 2026''s theme?', '["Print everything", "Build for the agentic era", "Back to the fax machine", "Offline forever"]'::jsonb, 1, 'Agents, tools and people working together. Expect it in talks all day.', 32),
  ('tr-jos', 'anytime', 'DevFest trivia', null, 'Jos is the capital of Plateau State, known for its cool climate and called the Home of Peace and Tourism.', 'Jos is the capital of which state?', '["Kano", "Plateau", "Rivers", "Lagos"]'::jsonb, 1, 'Plateau State sits on the Jos Plateau, which gives the city its cooler weather.', 33)
on conflict (slug) do update set
  round = excluded.round, track = excluded.track, opens_on = excluded.opens_on, learn = excluded.learn,
  question = excluded.question, options = excluded.options, correct = excluded.correct,
  explanation = excluded.explanation, sort = excluded.sort;

-- ---------------------------------------------------------------------------
-- Brain Blitz: the organisers' DevFest Jos trivia bank (24 questions) plus 6 computer basics.
-- Round 1 easy, round 2 medium, round 3 hard. 10 questions per round.
-- Earlier sets are only taken out of the rounds (quiz_round = null), not deleted.
-- round = 'daily' with no opens_on keeps these out of the Phase 1 learning quiz.

update quest_quiz_items set quiz_round = null where quiz_round is not null;

insert into quest_quiz_items (slug, round, track, learn, question, options, correct, explanation, sort, quiz_round) values
-- Round 1: easy
('dj-01', 'daily', 'DevFest Jos', 'GDG means Google Developer Groups.', 'What does GDG stand for?',
  '["Google Design Guild", "Google Developer Groups", "Global Developer Gathering", "Google Data Group"]', 1,
  'GDG means Google Developer Groups, the community chapters that host DevFest around the world. GDG Jos is ours.', 0, 1),
('dj-02', 'daily', 'DevFest Jos', 'DevFest Jos 2026 is at Odilin''s Event Center, Jos.', 'Where is DevFest Jos 2026 happening today?',
  '["Fox Hotel Jos", "Jos Business School", "Odilin''s Event Center, Jos", "Sarau Event Centre, Jos"]', 2,
  'You''re in it: Odilin''s Event Center, Nunku Street, behind the National Library, Jos.', 1, 1),
('dj-03', 'daily', 'DevFest Jos', 'The DevFest Jos 2026 theme is Build for the agentic era.', 'What is the theme of DevFest Jos 2026?',
  '["Build for the agentic era", "Code the Plateau", "AI for everyone", "Learn, connect, share"]', 0,
  'This year is all about building with AI agents: Build for the agentic era.', 2, 1),
('dj-04', 'daily', 'DevFest Jos', 'DevFest Jos 2026 has five content tracks.', 'How many content tracks does DevFest Jos 2026 have?',
  '["Three", "Four", "Five", "Seven"]', 2,
  'Five tracks: AI and Agents, Mobile, Web, Cloud and Security, and Product and Career.', 3, 1),
('dj-05', 'daily', 'DevFest Jos', 'Regular tickets to DevFest Jos 2026 are free.', 'How much does a Regular ticket to DevFest Jos 2026 cost?',
  '["Free", "N2,000", "N5,000", "N8,000"]', 0,
  'Regular tickets are free on GDG Community. VIP is N8,000 and adds swag and lunch.', 4, 1),
('dj-06', 'daily', 'DevFest Jos', 'The My Padi ticket gets you and a friend in for N15,000.', 'Which DevFest Jos 2026 ticket gets you and a friend in for N15,000?',
  '["Squad Pass", "My Padi", "Duo VIP", "Bestie Ticket"]', 1,
  'The My Padi ticket: two VIP tickets for N15,000, saving N1,000. Padis go further together.', 5, 1),
('dj-07', 'daily', 'DevFest Jos', 'GDG Jos is @gdgjos2 on X.', 'What is GDG Jos''s handle on X (Twitter)?',
  '["@gdgjos", "@gdg_jos", "@gdgjos2", "@devfestjos"]', 2,
  'On X it''s @gdgjos2. On Instagram it''s @gdg_jos.', 6, 1),
('dj-08', 'daily', 'DevFest Jos', 'DevFest Jos has been on a Saturday every year from 2022 to 2026.', 'On which day of the week has DevFest Jos been held every year from 2022 to 2026?',
  '["Friday", "Saturday", "Sunday", "It changes every year"]', 1,
  'Every edition from 2022 to today has been on a Saturday.', 7, 1),
('cb-01', 'daily', 'Computer basics', 'CPU stands for Central Processing Unit.', 'What does CPU stand for?',
  '["Computer Power Unit", "Central Program Utility", "Central Processing Unit", "Core Personal Unit"]', 2,
  'The CPU is the computer''s brain: it carries out the instructions of every program.', 8, 1),
('cb-02', 'daily', 'Computer basics', 'Ctrl + C copies what you have selected.', 'On a Windows computer, which shortcut copies the text you have selected?',
  '["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"]', 0,
  'Ctrl + C copies, Ctrl + V pastes, Ctrl + X cuts and Ctrl + Z undoes. On a Mac, use Cmd instead of Ctrl.', 9, 1),

-- Round 2: medium
('dj-09', 'daily', 'DevFest Jos', 'DevFest Jos 2022 was on Saturday 10 December 2022.', 'When did DevFest Jos 2022 take place?',
  '["Saturday 10 December 2022", "Saturday 18 November 2022", "Saturday 7 December 2022", "Saturday 20 September 2022"]', 0,
  'DevFest Jos 2022 was on Saturday 10 December 2022.', 0, 2),
('dj-10', 'daily', 'DevFest Jos', 'DevFest Jos 2022 was at Jos Business School.', 'Where was DevFest Jos 2022 held?',
  '["University of Jos Permanent Site", "Jos Business School", "Fox Hotel Jos", "Sarau Event Centre"]', 1,
  'Jos Business School, 4 Miri Drive, off Rayfield Road. It included a Career Fair track with the UniJos student developer club.', 1, 2),
('dj-11', 'daily', 'DevFest Jos', 'DevFest Jos 2023 was on Saturday 18 November 2023.', 'When did DevFest Jos 2023 take place?',
  '["Saturday 10 December 2023", "Saturday 18 November 2023", "Saturday 7 October 2023", "Saturday 2 December 2023"]', 1,
  'DevFest Jos 2023 was on Saturday 18 November 2023.', 2, 2),
('dj-12', 'daily', 'DevFest Jos', 'DevFest Jos 2023 was at Fox Hotel Jos.', 'Where was DevFest Jos 2023 held?',
  '["Fox Hotel Jos", "Odilin''s Event Center", "Jos Business School", "University of Jos Permanent Site"]', 0,
  'Fox Hotel Jos on Akila Machunga Street, by Jay FM, off the National Library.', 3, 2),
('dj-13', 'daily', 'DevFest Jos', 'DevFest Jos 2024 was on Saturday 7 December 2024.', 'When did DevFest Jos 2024 take place?',
  '["Saturday 18 November 2024", "Saturday 20 September 2024", "Saturday 7 December 2024", "Saturday 14 December 2024"]', 2,
  'DevFest Jos 2024 was on Saturday 7 December 2024.', 4, 2),
('dj-14', 'daily', 'DevFest Jos', 'DevFest Jos 2024 was at the University of Jos Permanent Site.', 'Where was DevFest Jos 2024 held?',
  '["Fox Hotel Jos", "University of Jos Permanent Site", "Jos Business School", "Sarau Event Centre"]', 1,
  'Mallam Adamu Adamu Lecture Theatre A, University of Jos Permanent Site.', 5, 2),
('dj-15', 'daily', 'DevFest Jos', 'DevFest Jos 2025 was on Saturday 20 September 2025.', 'When did DevFest Jos 2025 take place?',
  '["Saturday 20 September 2025", "Saturday 18 October 2025", "Saturday 6 December 2025", "Saturday 15 November 2025"]', 0,
  'DevFest Jos 2025 (listed as Developers Festival 2025) was on Saturday 20 September 2025.', 6, 2),
('dj-16', 'daily', 'DevFest Jos', 'DevFest Jos 2025 was at Sarau Event Centre, behind NTA Jos.', 'Where was DevFest Jos 2025 held?',
  '["Fox Hotel Jos", "Odilin''s Event Center", "Sarau Event Centre, behind NTA Jos", "Jos Business School"]', 2,
  'Sarau Event Centre, behind NTA Jos.', 7, 2),
('dj-17', 'daily', 'DevFest Jos', 'Loreta Katok Tohomdet leads GDG Jos.', 'Who is the lead organiser of GDG Jos?',
  '["Robert John", "Loreta Katok Tohomdet", "John Ebuga Saduna", "Stephen Nwoye"]', 1,
  'Loreta Katok Tohomdet leads GDG Jos. Robert John is the Chapter Community Mentor.', 8, 2),
('cb-03', 'daily', 'Computer basics', 'www stands for World Wide Web.', 'In a website address, what does "www" stand for?',
  '["Wide Web Window", "World Web Wire", "Web Wide World", "World Wide Web"]', 3,
  'www is short for World Wide Web, the system of pages and links you browse on the internet.', 9, 2),

-- Round 3: hard
('dj-18', 'daily', 'DevFest Jos', 'DevFest Jos 2025 was in September, earlier in the year than 2022, 2023 and 2024.', 'Which of these DevFest Jos editions was held earliest in the year?',
  '["2022", "2023", "2024", "2025"]', 3,
  '2025 was in September. 2023 was in November, and 2022 and 2024 were both in December.', 0, 3),
('dj-19', 'daily', 'DevFest Jos', 'DevFest Jos 2019 was a virtual event.', 'How was DevFest Jos 2019 held?',
  '["At Jos Business School", "At Fox Hotel Jos", "As a virtual event", "At the University of Jos"]', 2,
  'DevFest Jos 2019 (14 December 2019) was listed as a virtual event.', 1, 3),
('dj-20', 'daily', 'DevFest Jos', 'Bard was renamed Gemini in 2024.', 'A DevFest Jos 2023 talk covered prompt engineering with which Google AI tool, since renamed Gemini?',
  '["Bard", "LaMDA", "PaLM Chat", "Duet"]', 0,
  'Bard was renamed Gemini in 2024. The 2023 talk was on prompt engineering with Bard AI.', 2, 3),
('dj-21', 'daily', 'DevFest Jos', 'Murtala Abdullahi was a 2023 panellist and is a 2026 keynote speaker.', 'Which DevFest Jos 2026 keynote speaker was also a panellist at DevFest Jos 2023?',
  '["Manji Wilson", "Moses Amama", "Murtala Abdullahi", "Daniel Okoro"]', 2,
  'Murtala Abdullahi, CEO of Smartweb Nigeria and VP of NiRA, was on the 2023 panel and is a 2026 keynote speaker.', 3, 3),
('dj-22', 'daily', 'DevFest Jos', 'Dickson Nsofor, CEO of Kora, spoke at DevFest Jos 2025.', 'The CEO of which DevFest Jos sponsor spoke at DevFest Jos 2025?',
  '["Kora", "nHub", "Axia Hub", "Startup Lab"]', 0,
  'Dickson Nsofor, CEO of Kora, spoke in 2025. Kora backed DevFest Jos in 2025.', 4, 3),
('dj-23', 'daily', 'DevFest Jos', 'Robert John is GDG Jos''s Chapter Community Mentor.', 'What is Robert John''s role in GDG Jos?',
  '["Lead Organiser", "Chapter Community Mentor", "Head of Design", "Sponsorship Lead"]', 1,
  'Robert John is GDG Jos''s Chapter Community Mentor, and he spoke at DevFest Jos 2023.', 5, 3),
('dj-24', 'daily', 'DevFest Jos', 'Venues 2022 to 2025: Jos Business School, Fox Hotel, UniJos, Sarau.', 'Put the venues in order, from 2022 to 2025.',
  '["Fox Hotel, Jos Business School, UniJos, Sarau", "Jos Business School, Fox Hotel, UniJos, Sarau", "Jos Business School, UniJos, Fox Hotel, Sarau", "UniJos, Fox Hotel, Jos Business School, Sarau"]', 1,
  '2022 Jos Business School, 2023 Fox Hotel Jos, 2024 University of Jos, 2025 Sarau Event Centre. And 2026: Odilin''s Event Center.', 6, 3),
('cb-04', 'daily', 'Computer basics', 'Android is an operating system.', 'Which of these is an operating system?',
  '["Microsoft Word", "Android", "Google Chrome", "WhatsApp"]', 1,
  'Android is an operating system: it runs the phone and every app on it. Word, Chrome and WhatsApp are apps.', 7, 3),
('cb-05', 'daily', 'Computer basics', 'RAM stands for Random Access Memory.', 'What does RAM stand for?',
  '["Random Access Memory", "Read And Modify", "Rapid App Manager", "Remote Access Mode"]', 0,
  'RAM is the short-term memory a computer uses while programs are running. It is cleared when you switch off.', 8, 3),
('cb-06', 'daily', 'Computer basics', 'A mouse is an input device.', 'Which of these is an input device?',
  '["Monitor", "Printer", "Mouse", "Speaker"]', 2,
  'A mouse sends information into the computer. Monitors, printers and speakers are output devices.', 9, 3)
on conflict (slug) do update set
  track = excluded.track, question = excluded.question, learn = excluded.learn, options = excluded.options,
  correct = excluded.correct, explanation = excluded.explanation, sort = excluded.sort, quiz_round = excluded.quiz_round;
