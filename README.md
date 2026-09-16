# Museum of Manoj

A walk-through personal site. A spiral museum on Fifth Avenue where every room is a moment from Manoj Maheshwar Jagadeesan's life, from Chennai to New York. Visitors get a numbered ticket, meet a doodle guide who holds their hand up the steps, and walk twelve rooms with 4D effects. Each room punches a hole in the ticket.

## Run it

```bash
npm install
npm run dev
```

The dev server runs at http://127.0.0.1:5174. `npm run build` writes a static site to `dist/` (relative paths, so it deploys to Vercel, Netlify, GitHub Pages or any static host), and `npm run preview` serves that build.

Add `?flat` to the address to see the site without the 3D world, the way it looks in browsers without WebGL2 or with reduced motion.

## How it is built

- Vite with vanilla ES modules, three.js for one continuous 3D walk (up Fifth Avenue, up the museum steps, through the doors and up the spiral from room to room), GSAP and ScrollTrigger for scroll choreography, Lenis for smooth scrolling on mouse and trackpad (phones keep native scrolling), and rough.js for hand-drawn SVG.
- Art direction: a black and white paper theater. Lines "boil" through an SVG turbulence filter, surfaces use halftone, hatch and dot textures, and there are no decorative gradients.
- Mobile first: hold-to-walk works with touch, the permanent collection swipes sideways, and every effect respects reduced motion.

## Visitor numbers

Every browser gets a real, unique number in order of arrival: the first browser ever is #00,001. On the first visit the site creates a random id (kept in localStorage, with a cookie as a backup) and sends it to `/api/visit`, which hands out the next number and remembers it, so a returning browser keeps its number. Only the random id is stored.

- Development and `npm run preview`: a Vite plugin in `vite.config.js` keeps the count in `.data/visitors.json`.
- Production: `api/visit.js` is a Vercel function that keeps the count in Redis with one atomic script, so two visitors can never get the same number. To use another host, point `VITE_VISITOR_API` at its endpoint.
- If the counter can't be reached, the site still works and shows `#--,---` instead of inventing a number.

## Where things live

| What | File |
| --- | --- |
| Directory stops | `src/content/tour.js` |
| Every room: beats, stats, photo slots and "Tell me" notes | `src/content/rooms.js` |
| The 3D walk: Fifth Avenue, the entrance, and the scroll rail that moves the camera | `src/world/` (`world.js`, `interior.js`, `rail.js`, `shots.js`, `textures.js`, `stage.js`) |
| The rooms inside: the lobby, a corridor and a door for every room, framed drawings, benches | `src/world/rooms3d.js`, `src/world/decor.js` |
| Doodle Manoj walking you in and down every corridor, with his comic panel overhead | `src/world/guide.js` |
| The comic strip for each corridor (gaps are `tell` panels) | `src/content/strips.js` |
| Easter eggs in every room, and the souvenirs they hand out | `src/content/eggs.js`, `src/world/eggs.js`, `src/lib/keepsakes.js` |
| The ticket booth and tour picker | `src/scenes/arrival/` |
| Steps and lobby | `src/scenes/steps.js`, `src/scenes/lobby.js` |
| Visitor counter | `src/lib/visitor.js`, `server/visitors.js`, `api/visit.js` |
| Doodle Manoj (poses and outfits) | `src/character/manoj.js` |
| Room renderer and ticket punches | `src/rooms/index.js` |
| Illustrations, one file per room | `src/rooms/art-02.js` to `art-09.js` |
| 4D effects | `src/rooms/fx-draw.js`, `fx-motion.js`, `fx-maps.js` |
| Rooms 10 to 12 (collection, human wing, skylight) | `src/rooms/wing-*.js` |
| Styles | `src/styles/base.css`, `scenes.css`, `rooms.css` |

### Add, remove or reorder rooms

1. Edit `ROOMS` in `src/content/rooms.js`. Array order is walking order.
2. Update `STOPS` in `src/content/tour.js` so the floor directory matches.
3. Give a new beat an `art` key and draw it in any `src/rooms/art-*.js` (`export const ART = { key: (kit) => { ... } }`). Until it exists, the beat shows a "sketch coming soon" card, so nothing breaks.
4. Add `effect: 'name'` to a beat to attach a 4D effect from the `fx-*.js` files, and mark long beats `full: true` to skip them on the express tour.
5. `ROOM_COUNT` in `src/lib/state.js` sets the number of punch holes.

## Before launch

- **Visitor counter.** Deploy to Vercel and add an Upstash Redis database from the Vercel Marketplace. `api/visit.js` reads `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`).
- **Guestbook.** Notes are saved on the visitor's own device. Connect the form in `src/rooms/wing-skylight.js` to a backend before calling it public.
- **Resume.** Add `public/resume.pdf` for the gift shop download.
- **Links.** LinkedIn, GitHub and other profiles are not wired in yet.
- **Numbers.** The site says 5,000+ CLI downloads; the resume PDF still says 3,000+.
- **Client work.** Quotes and client names come from manoj.ai. Confirm they are fine to show.

## Photos

Drop files into `public/photos` with these names. Until a file exists, its slot shows a halftone placeholder with the expected path. Photos render in black and white and turn to color on hover or tap.

| File in public/photos | Room | Shows |
| --- | --- | --- |
| 02-chennai-street.jpg | Room 02, Chennai, where it began | A Chennai street |
| 02-home.jpg | Room 02, Chennai, where it began | Home |
| 02-college.jpg | Room 02, Chennai, where it began | College days |
| 02-graduation.jpg | Room 02, Chennai, where it began | Graduation |
| 03-office.jpg | Room 03, Teknuance, the first job | The office |
| 04-founders.jpg | Room 04, Three friends, one studio | The three of us |
| 04-workspace.jpg | Room 04, Three friends, one studio | The first workspace |
| 04-launch.jpg | Room 04, Three friends, one studio | A launch day |
| 05-arriving-delhi.jpg | Room 05, Flight to Delhi | Arriving in Delhi |
| 05-favcy-team.jpg | Room 05, Flight to Delhi | The Favcy team |
| 06-studio.jpg | Room 06, A studio of my own | The studio |
| 07-admit.jpg | Room 07, The leap | The admit screen |
| 07-packing.jpg | Room 07, The leap | Packing |
| 07-parents.jpg | Room 07, The leap | Home, before the airport |
| 07-airport.jpg | Room 07, The leap | The airport goodbye |
| 07-first-us-photo.jpg | Room 07, The leap | First photo in the US |
| 08-first-snow.jpg | Room 08, Buffalo | First snow |
| 08-campus.jpg | Room 08, Buffalo | Campus |
| 08-graduation.jpg | Room 08, Buffalo | Graduation |
| 09-new-york.jpg | Room 09, New York | New York |
| 09-rhohack.jpg | Room 09, New York | RhoHack, at night |
| 10-rho-desk.jpg | Room 10, The permanent collection | Rho Desk, the demo |
| 10-snapinfra.jpg | Room 10, The permanent collection | SnapInfra |
| 10-rebateos.jpg | Room 10, The permanent collection | RebateOS |
| 10-scootpie.jpg | Room 10, The permanent collection | ScootPie |
| 11-photo-1.jpg | Room 11, The human wing | Lens life |
| 11-photo-2.jpg | Room 11, The human wing | Lens life |
| 11-photo-3.jpg | Room 11, The human wing | Lens life |
| 11-photo-4.jpg | Room 11, The human wing | Lens life |
| 11-photo-5.jpg | Room 11, The human wing | Lens life |
| 11-photo-6.jpg | Room 11, The human wing | Lens life |
| 11-nano.jpg | Room 11, The human wing | Nano |

## Still to fill in

Each dashed "Tell me" note on the site marks a personal detail that is not known yet. Nothing personal has been invented; these stay as visible placeholders until they are written into src/content/rooms.js.

- Room 02, Chennai, where it began: Where in Chennai I grew up
- Room 02, Chennai, where it began: What I wrote: stories, scripts, a blog?
- Room 02, Chennai, where it began: A family moment I would share
- Room 02, Chennai, where it began: One college memory
- Room 03, Teknuance, the first job: Was 2020 remote or in the office?
- Room 03, Teknuance, the first job: A teammate story
- Room 03, Teknuance, the first job: The first thing I shipped
- Room 04, Three friends, one studio: Was this Zedtribe or Hurrae?
- Room 04, Three friends, one studio: Their names, with their OK
- Room 04, Three friends, one studio: How we picked the name
- Room 04, Three friends, one studio: Client countries (pins are placeholders until then)
- Room 04, Three friends, one studio: Why the chapter closed
- Room 05, Flight to Delhi: What moving to Delhi felt like
- Room 05, Flight to Delhi: The feature I am proudest of
- Room 05, Flight to Delhi: An A/B test that surprised me
- Room 06, A studio of my own: Why I started it
- Room 06, A studio of my own: A favorite client story
- Room 06, A studio of my own: The moment I chose AI
- Room 07, The leap: Why AI, and why then
- Room 07, The leap: The day the admit came
- Room 07, The leap: My visa interview story
- Room 07, The leap: Only what I want to share here
- Room 07, The leap: Who came to the airport
- Room 07, The leap: My route and layover
- Room 07, The leap: What I felt when I landed
- Room 08, Buffalo: My first snow story
- Room 08, Buffalo: A class or professor that mattered
- Room 08, Buffalo: How SnapInfra started
- Room 08, Buffalo: Friends who made Buffalo home
- Room 09, New York: How I got to New York
- Room 09, New York: A pharma prototype I can talk about
- Room 09, New York: The RhoHack night
- Room 10, The permanent collection: Which client work is okay to show
- Room 10, The permanent collection: GitHub links for each project
- Room 10, The permanent collection: Screenshots or short demo videos
- Room 11, The human wing: My best 8 to 12 photos
- Room 11, The human wing: The side project list
- Room 12, Skylight: what's next: Remote or relocation answer
- Room 12, Skylight: what's next: LinkedIn, GitHub, Dribbble, Instagram and X links
- Room 12, Skylight: what's next: OK to show a public guestbook?
