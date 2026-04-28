import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Crown, ShieldCheck, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    caption: 'For testing a store idea and inspecting ASEA output.',
    cta: 'Start free',
    href: '/register',
    features: ['1 active project', 'Preview builder', 'Public GitHub export', 'Community support'],
  },
  {
    name: 'Studio',
    price: '$19',
    period: '/month',
    caption: 'For founders and teams launching polished commerce projects.',
    cta: 'Start Studio',
    href: '/register',
    featured: true,
    features: ['Unlimited projects', 'Private GitHub export', 'Custom domains', 'Priority generations', 'Deployment handoff'],
  },
  {
    name: 'Scale',
    price: '$49',
    period: '/month',
    caption: 'For operators managing multiple stores, brands, or client launches.',
    cta: 'Talk to us',
    href: '/contact',
    features: ['Team workspaces', 'Role controls', 'Advanced analytics', 'Launch support', 'Shared project standards'],
  },
];

const comparison = [
  'Generated storefront pages',
  'Supabase-ready data foundation',
  'Admin workspace output',
  'Inspectable code view',
  'GitHub and deployment workflow',
];

export default function PricingPage() {
  return (
    <main className="bg-[#f6f1e8] text-[#10131b]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex rounded-full border border-[#d8d0c0] bg-[#fffaf0] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#007f75] shadow-[0_12px_30px_rgba(16,19,27,0.08)]">
            Pricing
          </div>
          <h1 className="text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
            Choose the launch room that fits your build pace.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5d6472]">
            Start with a free project, then upgrade when you need more builds, private export, domains, and team workflow.
          </p>
        </Motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`relative flex h-full flex-col rounded-lg border p-6 shadow-[0_20px_60px_rgba(16,19,27,0.1)] ${
                plan.featured
                  ? 'border-[#10131b] bg-[#10131b] text-white'
                  : 'border-[#d8d0c0] bg-white text-[#10131b]'
              }`}
            >
              {plan.featured && (
                <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#f6c453] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#10131b]">
                  <Crown className="h-3.5 w-3.5" />
                  Popular
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-black">{plan.name}</h2>
                <p className={`mt-3 min-h-14 text-sm leading-6 ${plan.featured ? 'text-white/70' : 'text-[#5d6472]'}`}>
                  {plan.caption}
                </p>
              </div>

              <div className="mb-7 flex items-end gap-2">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className={`pb-1 text-sm font-bold ${plan.featured ? 'text-white/60' : 'text-[#8b8174]'}`}>
                  {plan.period}
                </span>
              </div>

              <Link
                to={plan.href}
                className={`mb-8 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black transition ${
                  plan.featured
                    ? 'bg-[#f6c453] text-[#10131b] hover:bg-[#ffd778]'
                    : 'bg-[#10131b] text-white hover:bg-[#007f75]'
                }`}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex-1 space-y-3">
                <p className={`mb-4 text-[11px] font-black uppercase tracking-[0.22em] ${plan.featured ? 'text-[#8dd9ce]' : 'text-[#007f75]'}`}>
                  Includes
                </p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      plan.featured ? 'bg-white/10 text-[#f6c453]' : 'bg-[#dff7f1] text-[#007f75]'
                    }`}>
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={`text-sm leading-6 ${plan.featured ? 'text-white/82' : 'text-[#343945]'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </Motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#d8d0c0] bg-[#fffaf0] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007f75]">Included in every plan</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Every project starts as an inspectable commerce foundation.</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {comparison.map((item, index) => (
              <Motion.div
                key={item}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-[#d8d0c0] bg-white p-4 shadow-[0_14px_34px_rgba(16,19,27,0.07)]"
              >
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#007f75]" />
                <span className="text-sm font-black">{item}</span>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-lg border border-[#d8d0c0] bg-white p-6 shadow-[0_24px_70px_rgba(16,19,27,0.1)] sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#fff2cb] text-[#8a5d00]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#007f75]">Need something custom?</p>
              <h3 className="mt-2 text-2xl font-black">We can shape team, agency, and enterprise launch workflows.</h3>
            </div>
          </div>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#10131b] px-5 py-3 text-sm font-black text-[#10131b] transition hover:bg-[#10131b] hover:text-white lg:mt-0"
          >
            Contact sales <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
