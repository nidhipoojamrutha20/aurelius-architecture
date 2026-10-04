# AURELIS — Architecture + Build

A premium fictional architecture studio experience built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Three Fiber, Three.js, Framer Motion and Lucide.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Build the production app with `npm run build`, then serve it with `npm start`.

## Customise the demo

- Studio identity, contact information, WhatsApp number and social links: `config/site.ts`
- Editable projects, services, materials, testimonials and automation walkthrough: `data/`
- Procedural villa and interactive viewing modes: `components/BuildingScene.tsx`
- Sales-demo modules include the homeowner planner, owner dashboard, client portal and sample automation flow. Demo actions do not send messages or create real bookings.
- Project enquiry is stored in the current browser as `aurelis-demo-enquiry`; uploaded file names are kept locally and files are never transmitted.

All sample projects, studio metrics, client portal information, testimonial copy and architectural imagery are illustrative placeholders for sales demonstration. They are not claims about completed AURELIS work. The readiness planner provides indicative planning guidance and does not generate a construction quote.
