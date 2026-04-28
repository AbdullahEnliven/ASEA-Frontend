import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  CircleDollarSign,
  DatabaseZap,
  GitBranch,
  Play,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
} from 'lucide-react';

const heroStats = [
  { value: '3m', label: 'average first build' },
  { value: '42', label: 'store modules' },
  { value: '100%', label: 'exportable code' },
];

const companyMarks = [
  { name: 'Northstar', glyph: 'star', wordClass: 'font-black' },
  { name: 'Vellum', glyph: 'fold', wordClass: 'font-semibold' },
  { name: 'Arc Studio', glyph: 'arc', wordClass: 'font-black' },
  { name: 'HelioCart', glyph: 'sun', wordClass: 'font-black' },
  { name: 'Monarch', glyph: 'crown', wordClass: 'font-semibold' },
  { name: 'Stacklane', glyph: 'stack', wordClass: 'font-black' },
  { name: 'Luma Labs', glyph: 'spark', wordClass: 'font-semibold' },
  { name: 'OrbitWorks', glyph: 'orbit', wordClass: 'font-black' },
];

const outputCards = [
  {
    title: 'Store that can sell',
    copy: 'A complete buying journey with product discovery, cart, checkout, account screens, and polished brand moments.',
    glyph: <Store className="h-5 w-5" />,
    tone: 'bg-[#dff7f1] text-[#0f766e]',
  },
  {
    title: 'Backend already shaped',
    copy: 'Products, orders, users, inventory, promotions, and settings are structured so the business has a real operating base.',
    glyph: <DatabaseZap className="h-5 w-5" />,
    tone: 'bg-[#fff2c7] text-[#9a6a0a]',
  },
  {
    title: 'Admin your team can use',
    copy: 'Manage catalog, orders, content, and access without waiting for a separate back-office build.',
    glyph: <ShieldCheck className="h-5 w-5" />,
    tone: 'bg-[#ffe6df] text-[#ba4d41]',
  },
  {
    title: 'Code you keep',
    copy: 'Preview, inspect, export to GitHub, and continue from a project foundation your developers can actually own.',
    glyph: <GitBranch className="h-5 w-5" />,
    tone: 'bg-[#e6e9f2] text-[#20263a]',
  },
];

const handoffItems = [
  { label: 'Sell sooner', detail: 'skip weeks of blank-page setup' },
  { label: 'Operate cleaner', detail: 'admin, data, and storefront stay aligned' },
  { label: 'Customize freely', detail: 'visual builder plus inspectable code' },
  { label: 'Own the result', detail: 'exportable foundation, no trapped project' },
];

const capabilityTiles = [
  {
    title: 'Commerce logic',
    copy: 'Catalog, cart, checkout, coupons, tax, inventory, and customer accounts are generated together.',
    color: 'teal',
    glyph: 'commerce',
  },
  {
    title: 'Data foundation',
    copy: 'Supabase schema, migrations, auth policies, storage buckets, and seed data arrive ready to review.',
    color: 'gold',
    glyph: 'schema',
  },
  {
    title: 'Builder canvas',
    copy: 'Edit the storefront visually while preserving a clean React project underneath the interface.',
    color: 'coral',
    glyph: 'canvas',
  },
  {
    title: 'Release controls',
    copy: 'Preview, code view, GitHub export, and deployment status stay in the same operating surface.',
    color: 'ink',
    glyph: 'release',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    caption: 'Prototype and test a new store idea.',
    features: ['1 active project', 'Public repository export', 'Preview builder', 'Community support'],
  },
  {
    name: 'Studio',
    price: '$19',
    caption: 'Launch polished storefronts faster.',
    features: ['Unlimited projects', 'Private repository export', 'Custom domains', 'Priority generations'],
    featured: true,
  },
  {
    name: 'Scale',
    price: '$49',
    caption: 'For operators managing multiple brands.',
    features: ['Team workspaces', 'Advanced analytics', 'Role controls', 'Launch support'],
  },
];

const faqs = [
  {
    q: 'Do I own the generated code?',
    a: 'Yes. ASEA creates a project you can export, push to GitHub, and continue developing outside the platform.',
  },
  {
    q: 'Can I change the visual design after generation?',
    a: 'Yes. The builder keeps visual edits, code inspection, and project settings together so you can keep refining after the first build.',
  },
  {
    q: 'Is Supabase required?',
    a: 'Supabase gives the fastest full-stack launch path, but the exported project is still regular application code you can adapt.',
  },
];

const glyphStyles = {
  commerce: 'text-[#0f766e] bg-[#dff7f1]',
  schema: 'text-[#9a6a0a] bg-[#fff2c7]',
  canvas: 'text-[#ba4d41] bg-[#ffe6df]',
  release: 'text-[#20263a] bg-[#e6e9f2]',
};

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </Motion.div>
  );
}

function PrismGlyph({ type }) {
  const common = 'h-10 w-10';

  if (type === 'schema') {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M10 11h20v7H10zM7 24h10v7H7zM23 24h10v7H23z" fill="currentColor" opacity="0.16" />
        <path d="M10 11h20v7H10zM12 18v6M28 18v6M7 24h10v7H7zM23 24h10v7H23z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'canvas') {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 9h24v22H8z" fill="currentColor" opacity="0.14" />
        <path d="M8 9h24v22H8zM13 15h14M13 21h8M25 25l4 4M28 22l-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'release') {
    return (
      <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 6l12 7v14l-12 7-12-7V13z" fill="currentColor" opacity="0.14" />
        <path d="M20 6l12 7v14l-12 7-12-7V13zM20 20l12-7M20 20v14M20 20L8 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M9 11h22l-3 18H12z" fill="currentColor" opacity="0.14" />
      <path d="M9 11h22l-3 18H12zM15 16h10M14 22h13M17 8l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CapabilityCard({ item, index }) {
  return (
    <FadeUp delay={index * 0.08}>
      <article className="group h-full rounded-lg border border-[#d9d7cd] bg-white p-6 shadow-[0_18px_60px_rgba(22,24,31,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#1f2937]">
        <div className={`mb-10 inline-flex h-14 w-14 items-center justify-center rounded-lg ${glyphStyles[item.glyph]}`}>
          <PrismGlyph type={item.glyph} />
        </div>
        <p className="mb-3 text-xl font-black tracking-tight text-[#10131b]">{item.title}</p>
        <p className="text-sm leading-6 text-[#5c6270]">{item.copy}</p>
      </article>
    </FadeUp>
  );
}

function CompanyMarkGlyph({ type }) {
  const common = 'h-8 w-8 sm:h-9 sm:w-9';

  if (type === 'fold') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <path d="M9 7h18v22H9z" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M27 7 14 20v9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'arc') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <path d="M7 25c3.4-8.8 8-13.2 13.8-13.2 3.8 0 6.7 1.5 8.7 4.6" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
        <path d="M9 25h19" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'sun') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M18 5v5M18 26v5M5 18h5M26 18h5M8.8 8.8l3.5 3.5M23.7 23.7l3.5 3.5M27.2 8.8l-3.5 3.5M12.3 23.7l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'crown') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <path d="M8 25h20l-2-13-6 6-2-8-2 8-6-6z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M11 29h14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'stack') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <path d="m18 6 12 6-12 6-12-6zM8 18l10 5 10-5M8 24l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'spark') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <path d="M18 5l3.2 9.8L31 18l-9.8 3.2L18 31l-3.2-9.8L5 18l9.8-3.2z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'orbit') {
    return (
      <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="3.8" fill="currentColor" />
        <path d="M6.5 18c4-7.4 19-7.4 23 0-4 7.4-19 7.4-23 0Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M18 6.5c7.4 4 7.4 19 0 23-7.4-4-7.4-19 0-23Z" fill="none" stroke="currentColor" strokeWidth="2.2" opacity="0.58" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 36 36" aria-hidden="true">
      <path d="M18 5 21.5 14H31l-7.7 5.5 3 9.5L18 23.3 9.7 29l3-9.5L5 14h9.5z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

function CompanyLoop() {
  const loopedMarks = [...companyMarks, ...companyMarks];

  return (
    <section className="border-y border-white/8 bg-[#141714] px-5 py-14 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-9 text-center text-sm font-black text-white sm:text-base">
          Teams building modern commerce experiences choose ASEA
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#141714] to-transparent sm:w-36" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#141714] to-transparent sm:w-36" />
        <div className="asea-logo-track flex w-max items-center gap-8 whitespace-nowrap sm:gap-10">
          {loopedMarks.map((mark, index) => (
            <div
              key={`${mark.name}-${index}`}
              className="group flex min-w-[220px] items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-7 py-4 text-white/64 shadow-[0_14px_36px_rgba(0,0,0,0.16)] transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white sm:min-w-[248px]"
            >
              <span className="text-white/58 transition group-hover:text-[#f6c453]">
                <CompanyMarkGlyph type={mark.glyph} />
              </span>
              <span className={`text-[1.45rem] leading-none sm:text-[1.65rem] ${mark.wordClass}`}>
                {mark.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#d8d5ca]">
      <button
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-base font-bold text-[#10131b]">{q}</span>
        <ChevronDown className={`h-5 w-5 text-[#606672] transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <Motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-sm leading-6 text-[#606672]">{a}</p>
      </Motion.div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-hidden bg-[#f6f1e8] text-[#10131b]">
      <section className="relative min-h-[82svh] px-5 pt-28 pb-14 sm:px-8 lg:min-h-[86svh] lg:pt-32">
        <img
          src="/assets/asea-hero-studio.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,232,0.97)_0%,rgba(246,241,232,0.88)_37%,rgba(246,241,232,0.24)_74%,rgba(246,241,232,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#f6f1e8] to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-[#cac4b7] bg-[#fffaf0]/80 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#23534f] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Commerce OS for AI builders
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-[#10131b] sm:text-7xl lg:text-8xl">
              Turn a store idea into a real launch system.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4f5664] sm:text-xl">
              ASEA builds the storefront, database, admin tools, and deployment path in one calm workspace so teams can move from concept to owned code without the usual rebuild cycle.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10131b] px-6 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(16,19,27,0.28)] transition hover:-translate-y-0.5 hover:bg-[#253044]"
              >
                Start a build
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#outputs"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#bdb6a6] bg-[#fffaf0]/75 px-6 py-4 text-sm font-black text-[#10131b] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#10131b]"
              >
                <Play className="h-4 w-4 fill-[#10131b]" />
                See outputs
              </a>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="grid w-full max-w-lg grid-cols-3 overflow-hidden rounded-lg border border-[#cfc8ba] bg-[#fffaf0]/88 shadow-[0_22px_70px_rgba(35,38,47,0.14)] backdrop-blur lg:mb-6"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="border-r border-[#dfd8cb] p-4 last:border-r-0">
                <p className="text-3xl font-black tracking-tight text-[#10131b]">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#626a78]">{stat.label}</p>
              </div>
            ))}
          </Motion.div>
        </div>
      </section>

      <CompanyLoop />

      <section id="outputs" className="bg-[#fffaf0] px-5 py-28 sm:px-8 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-20 grid gap-8 lg:grid-cols-[0.95fr_1fr] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Day-one output</p>
              <h2 className="max-w-3xl text-4xl font-black tracking-tight text-[#10131b] sm:text-5xl">
                Start from a store customers can believe in.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[#5c6270] lg:justify-self-end">
              ASEA turns your brief into the pieces that make a launch feel real: a selling storefront, usable admin tools, structured commerce data, and code your team can keep improving.
            </p>
          </FadeUp>

          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <FadeUp>
              <article className="flex h-full flex-col justify-between rounded-lg border border-[#d8d0c0] bg-[#f7f2e8] p-8 shadow-[0_18px_55px_rgba(22,24,31,0.07)] lg:p-10">
                <div>
                  <div className="mb-12 flex items-center justify-between gap-4">
                    <span className="rounded-lg bg-[#10131b] px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
                      Launch package
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
                      <Workflow className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="max-w-lg text-3xl font-black leading-tight tracking-tight text-[#10131b] sm:text-4xl">
                    The first build should feel close enough to sell, not just close enough to demo.
                  </h3>
                  <p className="mt-6 max-w-xl text-base leading-7 text-[#5c6270]">
                    You get a coherent commerce system with enough structure to validate an offer, show stakeholders, onboard products, and hand the project to developers without starting over.
                  </p>
                  <Link
                    to="/register"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#10131b] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#253044]"
                  >
                    Build my store
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-14 grid gap-4 sm:grid-cols-2">
                  {handoffItems.map((item, index) => (
                    <div key={item.label} className="rounded-lg border border-[#ddd4c4] bg-white px-4 py-5">
                      <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#9a6a0a]">0{index + 1}</p>
                      <div>
                        <p className="text-base font-black text-[#10131b]">{item.label}</p>
                        <p className="mt-2 text-sm leading-6 text-[#626a78]">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </FadeUp>

            <div className="grid gap-6 sm:grid-cols-2">
              {outputCards.map((card, index) => (
                <FadeUp key={card.title} delay={index * 0.06}>
                  <article className="flex min-h-[250px] flex-col rounded-lg border border-[#d8d0c0] bg-white p-8 shadow-[0_18px_55px_rgba(22,24,31,0.06)] transition hover:-translate-y-1 hover:border-[#10131b]">
                    <div className={`mb-10 flex h-12 w-12 items-center justify-center rounded-lg ${card.tone}`}>
                      {card.glyph}
                    </div>
                    <h3 className="text-xl font-black tracking-tight text-[#10131b]">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[#5c6270]">{card.copy}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9f6f1] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-14 max-w-3xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Custom prism glyphs</p>
            <h2 className="text-4xl font-black tracking-tight text-[#10131b] sm:text-5xl">
              Four product surfaces, one generated system.
            </h2>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {capabilityTiles.map((item, index) => (
              <CapabilityCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d9d1c1] bg-[#10131b] px-5 py-24 text-white sm:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#f2b84b]">Production pricing</p>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Start lean, scale when the launches get serious.</h2>
            </div>
            <Link
              to="/pricing"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-[#10131b]"
            >
              Compare plans
              <CircleDollarSign className="h-4 w-4" />
            </Link>
          </FadeUp>

          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <FadeUp key={plan.name} delay={index * 0.08}>
                <article className={`h-full rounded-lg border p-6 ${plan.featured ? 'border-[#f2b84b] bg-[#fffaf0] text-[#10131b]' : 'border-white/10 bg-white/5 text-white'}`}>
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-black">{plan.name}</p>
                      <p className={`mt-2 text-sm leading-6 ${plan.featured ? 'text-[#626a78]' : 'text-white/60'}`}>{plan.caption}</p>
                    </div>
                    {plan.featured && (
                      <span className="rounded-md bg-[#f2b84b] px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#10131b]">
                        Best fit
                      </span>
                    )}
                  </div>

                  <div className="mb-8 flex items-end gap-1">
                    <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                    <span className={`pb-2 text-sm font-bold ${plan.featured ? 'text-[#626a78]' : 'text-white/45'}`}>/mo</span>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-bold">
                        <Check className={`h-4 w-4 ${plan.featured ? 'text-[#0f766e]' : 'text-[#f2b84b]'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition ${plan.featured ? 'bg-[#10131b] text-white hover:bg-[#263044]' : 'bg-white text-[#10131b] hover:bg-[#f6f1e8]'}`}
                  >
                    Choose {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-32">
        <FadeUp>
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#ba4d41]">Questions</p>
            <h2 className="text-4xl font-black tracking-tight text-[#10131b] sm:text-5xl">
              Short answers before the first build.
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </FadeUp>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:pb-32">
        <FadeUp>
          <div className="mx-auto max-w-7xl rounded-lg bg-[#0f766e] px-6 py-12 text-white shadow-[0_24px_70px_rgba(15,118,110,0.24)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-white/65">Ready room</p>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Give ASEA the brief. Keep the code.</h2>
            </div>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-black text-[#0f3d38] transition hover:-translate-y-0.5 hover:bg-[#fff4d8] lg:mt-0"
            >
              Generate a store
              <Boxes className="h-4 w-4" />
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
