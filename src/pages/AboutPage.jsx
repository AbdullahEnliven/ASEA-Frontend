import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, DatabaseZap, GitBranch, ShieldCheck, Sparkles, Workflow } from 'lucide-react';

const stats = [
  { value: '3m', label: 'average first build' },
  { value: '42+', label: 'commerce modules' },
  { value: '100%', label: 'exportable code' },
  { value: '1', label: 'connected launch room' },
];

const principles = [
  {
    title: 'Start with the business',
    copy: 'ASEA turns a plain-language store brief into customer journeys, schema, admin needs, and release priorities.',
    icon: Workflow,
    tone: 'bg-[#dff7f1] text-[#007f75]',
  },
  {
    title: 'Keep the code inspectable',
    copy: 'The builder is a working surface, not a black box. You can preview, edit, inspect, export, and keep moving.',
    icon: Code2,
    tone: 'bg-[#e7eaf3] text-[#20263a]',
  },
  {
    title: 'Make data part of the first draft',
    copy: 'Products, orders, customers, auth rules, and operational tables are shaped alongside the storefront.',
    icon: DatabaseZap,
    tone: 'bg-[#fff2cb] text-[#8a5d00]',
  },
  {
    title: 'Ship with ownership',
    copy: 'GitHub export, Supabase foundations, and deployment handoff are included so teams can own the result.',
    icon: GitBranch,
    tone: 'bg-[#ffe6df] text-[#ba4d41]',
  },
];

const beliefs = [
  'Commerce software should begin with a working product, not a blank repo.',
  'AI output is only useful when teams can understand it, change it, and ship it.',
  'Storefront, backend, admin, and release should be designed together.',
];

export default function AboutPage() {
  return (
    <main className="bg-[#f6f1e8] text-[#10131b]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
        >
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#d8d0c0] bg-[#fffaf0] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#007f75] shadow-[0_12px_30px_rgba(16,19,27,0.08)]">
              About ASEA
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
              Commerce builders should start with a launch room.
            </h1>
          </div>
          <div className="rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-6 shadow-[0_24px_70px_rgba(16,19,27,0.12)]">
            <Sparkles className="mb-6 h-8 w-8 text-[#c8931f]" />
            <p className="text-lg leading-8 text-[#4f5663]">
              ASEA exists to remove the slowest part of launching commerce products: turning a business idea into
              coordinated storefront, data model, admin workflow, and deployable code.
            </p>
          </div>
        </Motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <Motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_16px_40px_rgba(16,19,27,0.08)]"
            >
              <p className="text-4xl font-black">{item.value}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b8174]">{item.label}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#d8d0c0] bg-[#fffaf0] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007f75]">Why we built it</p>
            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">The first draft should already be useful.</h2>
            <p className="mt-6 text-base leading-8 text-[#5d6472]">
              Most store builds lose time stitching together pages, auth, tables, roles, and deployment decisions.
              ASEA makes those decisions visible early, so founders and teams can inspect the whole project from day one.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((item, index) => {
              const Icon = item.icon;
              return (
                <Motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="rounded-lg border border-[#d8d0c0] bg-white p-6 shadow-[0_18px_48px_rgba(16,19,27,0.08)]"
                >
                  <div className={`mb-8 inline-flex h-12 w-12 items-center justify-center rounded-lg ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#5d6472]">{item.copy}</p>
                </Motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-lg bg-[#10131b] p-8 text-white shadow-[0_24px_70px_rgba(16,19,27,0.18)]">
            <ShieldCheck className="mb-10 h-9 w-9 text-[#8dd9ce]" />
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#f6c453]">Our standard</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">Clear output. Clean handoff. No trapped project.</h2>
          </div>

          <div className="space-y-3">
            {beliefs.map((belief, index) => (
              <Motion.div
                key={belief}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex gap-4 rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_14px_34px_rgba(16,19,27,0.07)]"
              >
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dff7f1] text-xs font-black text-[#007f75]">
                  {index + 1}
                </span>
                <p className="text-base font-bold leading-7 text-[#343945]">{belief}</p>
              </Motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#007f75]">Build with ASEA</p>
            <h3 className="mt-2 text-2xl font-black">Turn your commerce brief into a working project.</h3>
          </div>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#10131b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#007f75] sm:mt-0"
          >
            Start building <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
