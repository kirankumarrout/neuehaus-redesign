# NEUEHAUS — Stasis in Design

A complete, dependency-free architecture portfolio redesign, prepared as source code for your existing website. This package does not modify the live neuehaus.in website.

## Run locally

Requires Node.js 18 or newer. Extract the ZIP, open a terminal in `neuehaus-redesign`, and run:

```sh
npm start
```

Open http://localhost:3000. No dependency installation is required. The local server binds to your own computer. You can also open `index.html` directly; a local server is recommended.

## Build and deploy

```sh
npm run check
npm run build
```

Upload the contents of `dist` to any static host. For Netlify, push the source folder to your GitHub repository, import that repository in Netlify, and use build command `npm run build` and publish directory `dist`. `netlify.toml` supplies these settings. For drag-and-drop Netlify deployment, upload `dist` after building.

The application uses hash navigation, so every view works on simple static hosting. It does not require a database, API keys or a JavaScript framework.

## Included views

- Home: animated 3D pavilion hero with a project-film switch, introduction, selected project, studio perspective, expertise panels, 3D concept study.
- Work: ten original portfolio images, Architecture/Interiors filters, accessible full-screen image viewer.
- The Affluence: project overview, verified facts and nine project images.
- Studio: practice introduction and editorial design perspective.
- Expertise: Architecture, Interiors, Engineering and Landscape, a suggested inquiry progression, interactive model.
- Contact: verified business details, maps search, validated email inquiry, practical FAQs.
- Privacy notice, error view and responsive full-screen navigation.

## Motion and interaction

The landing page opens with an original, shaded architectural pavilion rendered through 3D projection on Canvas. It orbits slowly, supports drag rotation with inertia and keyboard arrow rotation, and adapts to phone layouts. Lift the roof to explore the pavilion, switch to golden-hour lighting, or reset the view. The primary project link subtly follows the pointer. The visitor can switch between the 3D study and the project film. A pause control applies to both views. Animation and video pause when the hero is off-screen or the browser tab is hidden; resources are cleaned up on navigation. The pavilion is an abstract concept, not a project digital twin.

The optional 12-second looping MP4 project film is derived from existing Neuehaus still images using slow pans. This is an image film, not filmed project footage. Play/pause controls and a poster fallback are included. Reduced-motion preferences disable autoplay and animated reveals.

Scroll reveal transitions, fine-pointer contextual cursor, image zooms, gallery navigation with keyboard arrows, modal Escape handling, navigation focus wrapping and a page progress indicator. Native scrolling is retained.

The CSS 3D model supports drag rotation, accessible rotation buttons, solid/wireframe/exploded views and reset. It is an original abstract interactive concept, **not a digital twin of The Affluence**. Soft raised controls provide neumorphism; restrained translucent surfaces provide glassmorphism.

## Inquiry behavior

The form validates required fields and prepares a `mailto:` draft to `info.neuehaus@gmail.com`. The visitor reviews and sends it in their email client. It does not send automatically, store leads or claim successful delivery. A visible open-draft link and copy-inquiry fallback are included. Connect a real backend or hosted form service if you want submissions without an email client.

## Edit the website

- `data.js`: portfolio images, captions and services.
- `app.js`: view templates, copy and interactions.
- `hero.js`: procedural 3D hero rendering, playback and animation lifecycle.
- `styles.css`: typography, colours, layouts and responsive breakpoints.
- `index.html`: navigation, footer, metadata and dialogs.
- `assets/`: local WebP images, favicon and hero image film.

Colours are defined at the top of `styles.css`. The wordmark is a typographic treatment, not a newly claimed official logo. Google Fonts (DM Sans and Manrope) are optional external requests; local system fonts work as fallbacks.

## Content provenance and decisions

Business name, the “Stasis in Design” tagline, four design disciplines, project name, Odisha location, 2020 built year, six bedrooms, four bathrooms, two stories and contact information come from https://neuehaus.in/ (reviewed 7 October 2026).

The existing project description gives inconsistent floor areas: its facts list 11,000 sq. ft., while body copy gives approximately 5,000 sq. ft. Neither is repeated. Confirm the correct value before adding it.

Images come from `https://neuehaus.in/wp-content/uploads/2023/12/`. Their existing watermarks are preserved. The visually distinct `mres-cmp.jpg` appears as a separate “Residential facade study” in the overall portfolio, with no invented location, date, client or project name. It is excluded from The Affluence gallery. Remaining 2023 images follow the existing site's project grouping. Confirm image-to-project attribution with the studio before public launch.

Original editorial copy proposes a design perspective; it does not assert unverified awards, client lists, performance statistics, team identities or delivery guarantees. Suggested inquiry stages are not contractual promises.

## Reference review

All supplied reference URLs were requested during research. Available content informed the project-first navigation, editorial hierarchy, imagery-led presentation, clear discipline structure and contact journey. No reference firm's images, code, logos or brand copy are included.

- https://studioasa.in/ — project discovery, expertise and inquiry flow.
- https://heatherwick.com/ — studio perspective and experiential narrative.
- https://shigerubanarchitects.com/ — work categories and project metadata.
- https://www.zha.com/ — prominent project/news storytelling.
- https://perkinswill.com/ — human-centred editorial structure.
- https://www.gensler.com/ — broad expertise and research navigation.
- https://www.som.com/ — integrated practice and project structure.
- https://www.hok.com/ — discipline and market navigation.
- https://big.dk/ — work exploration and visual project identity.
- https://www.morphogenesis.org/ — multidisciplinary practice and contextual approach.
- https://sanjaypuriarchitects.com/ — architecture/interior navigation; limited content was retrievable.
- https://www.fosterandpartners.com/ — returned a 404 through research retrieval; no claim of visual inspection is made.

## Validation and launch notes

JavaScript syntax, static build, local image/video availability, view markup, internal route targets and duplicate IDs are checked. Images were visually inspected and video duration confirmed. Responsive rules cover phones, tablets and wide screens; touch devices retain the normal cursor.

Browser rendering and end-to-end interaction testing were unavailable in this session. Before production, review in Chrome/Safari on desktop and phones, test the mailto draft on the intended devices, confirm studio details and image attribution, and replace the hero image film with commissioned footage if desired.

This is a static frontend deliverable. It does not include a CMS, lead database, real project BIM model or production video footage. There are no analytics or tracking scripts in the package.
