import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight, Sparkles, Rocket, Github, Database, ShoppingCart, BarChart3,
  Check, ChevronDown, Star, Zap, Globe,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    desc: 'Describe your store in plain English. Our AI builds the entire e-commerce platform for you.',
    color: 'blue',
  },
  {
    icon: ShoppingCart,
    title: 'Full E-Commerce Stack',
    desc: 'Products, cart, checkout, auth, admin panel, and inventory management — all generated.',
    color: 'purple',
  },
  {
    icon: Database,
    title: 'Supabase Backend',
    desc: 'Connect your Supabase project, run migrations, and have a production-ready database instantly.',
    color: 'emerald',
  },
  {
    icon: Github,
    title: 'Push to GitHub',
    desc: 'One-click push to a new GitHub repository. Your code, your control, always.',
    color: 'orange',
  },
  {
    icon: Rocket,
    title: 'Live Preview & Edit',
    desc: 'See your store in real time. Click any text, image, or color to edit it inline.',
    color: 'pink',
  },
  {
    icon: BarChart3,
    title: 'Admin Dashboard',
    desc: 'Every generated store includes a full admin panel with analytics and order management.',
    color: 'cyan',
  },
];

const colorMap = {
  blue: 'bg-blue-500/15 text-blue-400',
  purple: 'bg-purple-500/15 text-purple-400',
  emerald: 'bg-emerald-500/15 text-emerald-400',
  orange: 'bg-orange-500/15 text-orange-400',
  pink: 'bg-pink-500/15 text-pink-400',
  cyan: 'bg-cyan-500/15 text-cyan-400',
};

const steps = [
  { num: '01', title: 'Describe', desc: 'Tell us what kind of store you want to build in plain English.' },
  { num: '02', title: 'Review', desc: 'Inspect the AI-generated spec and make any adjustments.' },
  { num: '03', title: 'Generate', desc: 'Watch as the full-stack store is built in real time.' },
  { num: '04', title: 'Deploy', desc: 'Connect Supabase and push to GitHub with one click.' },
];

const templates = [
  { name: 'Sneaker Drop', category: 'Fashion', color: 'from-orange-500/20 to-red-500/20', icon: '👟' },
  { name: 'Organic Market', category: 'Food & Drink', color: 'from-emerald-500/20 to-teal-500/20', icon: '🌿' },
  { name: 'Tech Gadgets', category: 'Electronics', color: 'from-blue-500/20 to-cyan-500/20', icon: '🔌' },
  { name: 'Artisan Coffee', category: 'Beverage', color: 'from-amber-500/20 to-yellow-500/20', icon: '☕' },
  { name: 'Home Decor', category: 'Lifestyle', color: 'from-purple-500/20 to-pink-500/20', icon: '🛋️' },
  { name: 'Pet Supplies', category: 'Animals', color: 'from-lime-500/20 to-green-500/20', icon: '🐾' },
];

const testimonials = [
  {
    quote: 'ASEA saved us weeks of development time. We described our store, reviewed the spec, and had a live preview in 4 minutes.',
    author: 'Sarah K.',
    role: 'Founder, Petal & Bloom',
    stars: 5,
  },
  {
    quote: 'The inline editing is incredible. I can tweak every pixel without touching a single line of code.',
    author: 'Marcus T.',
    role: 'Designer & Entrepreneur',
    stars: 5,
  },
  {
    quote: 'Supabase integration just works. Migrations, seeding, production — all handled automatically.',
    author: 'Priya N.',
    role: 'CTO, Nimble Commerce',
    stars: 5,
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for trying ASEA out.',
    features: ['1 project', '500 MB storage', 'Public GitHub repos', 'Community support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'For serious store builders.',
    features: [
      'Unlimited projects',
      '10 GB storage',
      'Private GitHub repos',
      'Custom domains',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    desc: 'Collaborate at scale.',
    features: [
      'Everything in Pro',
      '50 GB storage',
      'Team workspaces',
      'SSO / SAML',
      'Dedicated SLA',
      'White-label export',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'How does the AI generation actually work?',
    a: 'You describe your store in plain English. Our AI (powered by the latest LLMs) creates a structured spec covering pages, features, and database schema. Once you approve the spec, the code generation engine produces a full Next.js + Supabase store in minutes.',
  },
  {
    q: 'Do I own the generated code?',
    a: 'Yes — 100%. The code pushed to GitHub is yours. No vendor lock-in, no runtime dependency on ASEA.',
  },
  {
    q: 'Can I edit the generated store after generation?',
    a: 'Absolutely. The Builder lets you edit everything inline — text, images, colors, layout — directly in the live preview. You can also edit raw code in the Monaco Editor inside the Code Viewer.',
  },
  {
    q: 'What tech stack does ASEA generate?',
    a: 'Currently Next.js 14 (App Router) for the frontend, Supabase for auth + database + storage, and Stripe for payments. More stacks (Remix, SvelteKit) are on the roadmap.',
  },
  {
    q: 'Is Supabase required?',
    a: 'Not for the builder itself. You can download the ZIP and wire any backend you like. The one-click Supabase integration is optional and designed for teams who want zero-config deployment.',
  },
];

// Reusable fade-in-up animation wrapper
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors gap-4"
      >
        <span className="font-medium text-sm">{q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/8 blur-[150px] rounded-full -z-10" />
      <div className="pointer-events-none absolute top-[60%] -right-1/4 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full -z-10" />

      {/* ── Hero ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-28 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-xs font-medium text-blue-100/70 tracking-wide uppercase">
            Now in Public Beta
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
        >
          Build your store{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
            with AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg lg:text-xl text-gray-400 mb-12 leading-relaxed"
        >
          ASEA is an AI-powered e-commerce store builder. Describe what you want and we
          generate a full-stack store — frontend, backend, database, and admin panel —
          in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
          >
            Start Building Free
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-center"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-6 mt-14 text-sm text-gray-500"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-yellow-400" />
            <span>Under 5 min to first store</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Globe size={14} className="text-blue-400" />
            <span>1,200+ stores generated</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Star size={14} className="text-amber-400" />
            <span>4.9 / 5 average rating</span>
          </div>
        </motion.div>
      </section>

      {/* ── Template Showcase ─────────────────── */}
      <section className="pb-28 overflow-hidden">
        <FadeUp className="text-center mb-12 px-6">
          <h2 className="text-3xl font-bold">Launch Any Store, Instantly</h2>
          <p className="text-gray-400 mt-3 text-sm">
            Browse community-built templates or describe your own from scratch.
          </p>
        </FadeUp>

        <div className="flex gap-5 px-6 max-w-7xl mx-auto flex-wrap justify-center">
          {templates.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.06}>
              <div
                className={`relative w-52 h-40 rounded-2xl bg-gradient-to-br ${t.color} border border-white/10
                  flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform cursor-pointer group`}
              >
                <span className="text-4xl">{t.icon}</span>
                <div className="text-center">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.category}</p>
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/20 transition-all" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl font-bold">How It Works</h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.08}>
              <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-700">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
          <p className="text-gray-400 mt-3 text-sm max-w-xl mx-auto">
            From AI generation to one-click deploy — ASEA covers the full stack.
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.06}>
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorMap[f.color]}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <FadeUp className="text-center mb-14">
          <h2 className="text-3xl font-bold">Loved by Builders</h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeUp key={t.author} delay={i * 0.1}>
              <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-4 h-full">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-28" id="pricing">
        <FadeUp className="text-center mb-14">
          <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mt-3 text-sm">Start free. Scale when you're ready.</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex flex-col rounded-3xl border p-8 h-full
                  ${plan.highlight
                    ? 'bg-blue-600/10 border-blue-500/40 ring-1 ring-blue-500/30'
                    : 'bg-white/[0.02] border-white/10'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-bold text-lg">{plan.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{plan.desc}</p>
                  <div className="flex items-end gap-1 mt-4">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-gray-500 text-sm mb-1.5">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <Check size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all
                    ${plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </FadeUp>
        <FadeUp>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </FadeUp>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-32 text-center">
        <FadeUp>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-blue-500/5 to-transparent p-14">
            <h2 className="text-4xl font-black mb-4">Ready to build?</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Join thousands of entrepreneurs using ASEA to launch their e-commerce business.
              No credit card required.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
            >
              Get Started — It&apos;s Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="font-bold text-white tracking-tight">ASEA</span>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
          <span>© {new Date().getFullYear()} ASEA. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
