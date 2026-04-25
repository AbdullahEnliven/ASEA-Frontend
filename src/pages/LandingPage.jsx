import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Sparkles, Rocket, Github, Database, ShoppingCart, BarChart3,
  Check, ChevronDown, Star, Zap, Globe, Layers, Play
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

function FloatingShape({ className, delay, duration }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 filter -z-10 mix-blend-screen ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: duration || 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay || 0,
      }}
    />
  );
}

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
    <div className="relative overflow-hidden bg-zinc-950 text-white min-h-screen">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
      
      <FloatingShape className="w-[500px] h-[500px] bg-blue-600 top-[-10%] left-[-10%]" duration={10} />
      <FloatingShape className="w-[600px] h-[600px] bg-purple-600 top-[20%] right-[-15%]" delay={2} duration={12} />
      <FloatingShape className="w-[400px] h-[400px] bg-emerald-600 bottom-[-10%] left-[20%]" delay={4} duration={9} />

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-40 lg:pb-32 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg shadow-blue-500/10"
        >
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-100/90 tracking-wide uppercase">
            ASEA 2.0 is Live
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[1] mb-8"
        >
          Generate Apps{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-gradient-x bg-[length:200%_auto]">
            at Light Speed.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl text-lg lg:text-2xl text-gray-400 mb-12 leading-relaxed"
        >
          Describe your vision in plain English. Watch our AI generate the complete stack—database, API, and an interactive UI—<span className="text-white font-medium">in under 3 minutes</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/register"
            className="group relative inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Generating Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <a
            href="#how-it-works"
            className="group px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Play size={18} className="fill-white" />
            See How
          </a>
        </motion.div>

        {/* Live Builder Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-5xl relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-2 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative rounded-lg border border-white/5 bg-black/50 overflow-hidden text-left shadow-2xl flex flex-col h-[400px]">
            {/* Fake Mac Header */}
            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/10 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 text-xs text-gray-300 bg-white/5 px-3 py-1 rounded-md font-semibold tracking-wide">
                Build Progress
              </div>
            </div>
            {/* Fake Body */}
            <div className="flex-1 p-6 text-sm leading-relaxed overflow-hidden relative">
              <div className="text-gray-300 mb-4 text-base font-semibold">You describe your store. ASEA handles the heavy lifting.</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 4, ease: "linear", delay: 1 }}
                className="overflow-hidden space-y-3"
              >
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Sparkles size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">"Create a modern sneaker store with smooth checkout"</p>
                    <p className="text-gray-400 text-xs mt-1">Your request is understood in plain English.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Check size={16} className="text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Store pages and product catalog are generated.</p>
                    <p className="text-gray-400 text-xs mt-1">Home, product list, cart, and checkout are ready.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Database size={16} className="text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Accounts and data are connected automatically.</p>
                    <p className="text-gray-400 text-xs mt-1">Sign in and customer data are configured for you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-emerald-500/30">
                  <Rocket size={16} className="text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-emerald-300 font-semibold">Your store is live and ready to launch.</p>
                    <p className="text-gray-400 text-xs mt-1">You can customize text, images, and branding instantly.</p>
                  </div>
                </div>
              </motion.div>
              {/* Overlay fade out */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Template Showcase (Marquee) ─────────────────── */}
      <section className="pb-32 overflow-hidden bg-black/20 py-20 border-y border-white/5">
        <div className="text-center mb-12 px-6">
          <motion.h2
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-300 to-emerald-300 bg-[length:220%_100%]"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Launch Any Architecture
          </motion.h2>
          <p className="text-gray-400 mt-3 text-sm max-w-xl mx-auto">
            From sneaker stores to membership businesses, just explain what you want and ASEA builds it for you.
          </p>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
          
          <div className="flex space-x-5 animate-marquee group-hover:[animation-play-state:paused] py-4">
            {[...templates, ...templates, ...templates].map((t, i) => (
              <div
                key={i}
                className={`relative w-64 h-44 rounded-3xl bg-gradient-to-br ${t.color} border border-white/10
                  flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all cursor-pointer backdrop-blur-sm shadow-xl flex-none`}
              >
                <div className="p-3 bg-white/10 rounded-2xl shadow-inner backdrop-blur-md">
                  <motion.span
                    className="text-4xl drop-shadow-md inline-block"
                    animate={{
                      y: [0, -6, 0],
                      rotate: [0, -4, 4, 0],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (i % templates.length) * 0.15,
                    }}
                  >
                    {t.icon}
                  </motion.span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-white tracking-wide">{t.name}</p>
                  <p className="text-xs text-white/70 font-medium uppercase mt-1 tracking-widest">{t.category}</p>
                </div>
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/0 hover:ring-white/40 transition-all glow-effect z-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-28 z-10" id="how-it-works">
        <FadeUp className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Layers size={14} /> Pipeline
          </div>
          <h2 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">From idea to live system.</h2>
        </FadeUp>
        
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 mt-8">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-500/10 via-purple-500/30 to-emerald-500/10 -z-10" />

          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.15}>
              <div className="relative p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] h-full backdrop-blur-xl group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-white font-black text-xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  {step.num}
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                
                {/* Arrow Connector for Desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-6 top-10 text-gray-600 bg-zinc-950 p-2 rounded-full border border-white/5">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-28 z-10">
        <FadeUp className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-6">
            <Sparkles size={24} className="text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black">Zero Limitations.</h2>
          <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Unlike simple site builders, ASEA writes scalable React and Python code with an actual Postgres database using Supabase. No vendor lock-in.
          </p>
        </FadeUp>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.1}>
              <div className="group relative p-8 rounded-[2rem] bg-zinc-950 border border-white/5 hover:border-white/10 overflow-hidden h-full flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity ${colorMap[f.color]}`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${colorMap[f.color]}`}>
                  <f.icon size={26} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{f.title}</h3>
                <p className="text-gray-400 text-base leading-relaxed">{f.desc}</p>
                <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                  <ArrowRight className={`w-6 h-6 ${colorMap[f.color].split(' ')[1]}`} />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-28 z-10" id="pricing">
        <FadeUp className="text-center mb-24">
          <h2 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">Scale without limits.</h2>
          <p className="text-gray-400 mt-6 text-xl max-w-2xl mx-auto">Start instantly in the public beta. Upgrade to Pro anytime for dedicated compute and advanced analytics.</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.15}>
              <div
                className={`relative flex flex-col rounded-[2.5rem] border p-10 h-full backdrop-blur-3xl transform transition-all duration-300 hover:scale-105
                  ${plan.highlight
                    ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_80px_rgba(59,130,246,0.15)] z-20 scale-[1.02]'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/30 z-10'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                    Highest Performer
                  </div>
                )}
                <div className="mb-8">
                  <p className={`font-black text-2xl ${plan.highlight ? 'text-blue-400' : 'text-white'}`}>{plan.name}</p>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">{plan.desc}</p>
                  <div className="flex items-end gap-1 mt-8 mb-4">
                    <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-500 text-lg mb-2 font-medium">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-4 flex-1 mb-10">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-4 text-base text-gray-300 font-medium">
                      <div className={`p-1 rounded-full ${plan.highlight ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white'}`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-5 rounded-2xl font-bold text-lg transition-all
                    ${plan.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-500/20'
                      : 'bg-white text-black hover:bg-gray-200'}`}
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
