import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FlaskConical,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

const BETA_LIMIT = 5;

const features = [
  { icon: <Rocket size={18} />, title: 'AI Store Generation', desc: 'Full storefront generated from a plain-English brief.' },
  { icon: <Zap size={18} />, title: 'Live Preview Builder', desc: 'Inspect and edit your store in real time.' },
  { icon: <ShieldCheck size={18} />, title: 'Inspectable Code', desc: 'Every file is yours — download the full source any time.' },
  { icon: <Star size={18} />, title: 'GitHub Export', desc: 'Push your project to a GitHub repo with one click.' },
  { icon: <Sparkles size={18} />, title: 'AI Code Editor', desc: 'Refine your store with natural-language chat commands.' },
  { icon: <Check size={18} />, title: 'Supabase-ready Schema', desc: 'A complete database foundation wired up from day one.' },
];

const included = [
  `${BETA_LIMIT} active projects`,
  'Preview builder',
  'Inspectable code view',
  'GitHub & deployment workflow',
  'AI code editor agent',
  'Supabase-ready data foundation',
  'Admin workspace output',
  'Community support',
];

const faqs = [
  {
    q: 'Why is ASEA free right now?',
    a: "We're in early beta and focused on building the best possible product with real users. There are no payment processors or plans — everyone gets full access.",
  },
  {
    q: 'What happens when I hit 5 projects?',
    a: 'You will not be able to create new projects until you delete an existing one. Your current projects remain fully accessible.',
  },
  {
    q: 'Will it always be free?',
    a: 'Beta access is free. When we move out of beta we will announce paid plans in advance and give beta users a generous transition window.',
  },
  {
    q: 'Can I export my projects before you add pricing?',
    a: 'Yes — you can download a full zip or push to GitHub at any time. Your code is always yours.',
  },
];

export default function PricingPage() {
  return (
    <main className="bg-[#f6f1e8] text-[#10131b] overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:pb-24 text-center">
        {/* Glow blob */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="h-80 w-80 rounded-full bg-[#007f75]/12 blur-[120px]" />
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          {/* Beta pill */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#007f75]/30 bg-[#007f75]/10 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.26em] text-[#007f75]">
            <FlaskConical size={13} className="shrink-0" />
            Beta Access — No Payment Required
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-[0.96] sm:text-6xl lg:text-7xl">
            Everything free,
            <br />
            <span className="relative">
              <span className="relative z-10 text-[#007f75]">while we're in beta.</span>
              <span className="pointer-events-none absolute inset-x-0 bottom-1 h-3 rounded-full bg-[#007f75]/15" />
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#5d6472]">
            We don't have payment processing set up yet — and that's intentional. Use ASEA for free,
            build up to{' '}
            <strong className="font-black text-[#10131b]">{BETA_LIMIT} projects</strong>, and help
            us shape the product before we launch paid plans.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#10131b] px-7 py-4 text-sm font-black text-white transition hover:bg-[#253044]"
            >
              Start building for free <ArrowRight size={16} />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d8d0c0] bg-white px-7 py-4 text-sm font-black text-[#10131b] transition hover:border-[#10131b]"
            >
              See what ASEA can do
            </Link>
          </div>
        </Motion.div>
      </section>

      {/* ── Single Plan Card ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-[#10131b] bg-[#10131b] p-8 shadow-[0_32px_80px_rgba(16,19,27,0.22)] sm:p-10"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#007f75]/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#f6c453]/15 blur-[60px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            {/* Left: plan info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f6c453]/40 bg-[#f6c453]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#f6c453]">
                  <FlaskConical size={11} /> Beta Plan
                </div>
                <h2 className="text-5xl font-black text-white">Free</h2>
                <p className="mt-2 text-lg font-bold text-white/50">No credit card. No billing. Ever — for now.</p>

                <div className="mt-8">
                  {/* Project limit meter */}
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/40">Project limit</p>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black leading-none text-white">{BETA_LIMIT}</span>
                    <span className="mb-2 text-sm font-bold text-white/50">projects total</span>
                  </div>
                  <div className="mt-4 flex gap-1.5">
                    {Array.from({ length: BETA_LIMIT }).map((_, i) => (
                      <div
                        key={i}
                        className="h-2 flex-1 rounded-full bg-[#007f75]/40"
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 text-xs font-bold text-white/35">
                    Delete a project to free up a slot.
                  </p>
                </div>
              </div>

              <Link
                to="/register"
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#f6c453] px-6 py-3.5 text-sm font-black text-[#10131b] transition hover:bg-[#ffd778]"
              >
                Get started free <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: feature list */}
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#8dd9ce]">Included in beta</p>
              <ul className="space-y-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f6c453]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-bold text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Motion.div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────── */}
      <section className="border-y border-[#d8d0c0] bg-[#fffaf0] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#007f75]">What you get</p>
            <h2 className="text-4xl font-black sm:text-5xl">Full power, zero cost.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#5d6472]">
              Beta users get every feature we've built. Nothing is locked behind a paywall.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => (
              <Motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl border border-[#d8d0c0] bg-white p-6 shadow-[0_14px_34px_rgba(16,19,27,0.06)]"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#dff7f1] text-[#007f75]">
                  {feat.icon}
                </span>
                <h3 className="text-base font-black text-[#10131b]">{feat.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6472]">{feat.desc}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#007f75]">FAQ</p>
          <h2 className="text-4xl font-black">Common questions.</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Motion.details
              key={faq.q}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-xl border border-[#d8d0c0] bg-white p-5 shadow-[0_10px_28px_rgba(16,19,27,0.05)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-[#10131b]">
                {faq.q}
                <ArrowRight
                  size={15}
                  className="shrink-0 text-[#007f75] transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="mt-4 text-sm leading-6 text-[#5d6472]">{faq.a}</p>
            </Motion.details>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-[#10131b] p-8 text-center sm:p-12"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-[#007f75]/20 blur-[80px]" />
          </div>
          <div className="relative">
            <FlaskConical size={32} className="mx-auto mb-5 text-[#f6c453]" />
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Join the beta. Build something real.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/60">
              No credit card. No commitments. Just an early look at the future of AI-powered e-commerce development.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#f6c453] px-8 py-4 text-sm font-black text-[#10131b] transition hover:bg-[#ffd778]"
            >
              Create your free account <ArrowRight size={16} />
            </Link>
          </div>
        </Motion.div>
      </section>
    </main>
  );
}
