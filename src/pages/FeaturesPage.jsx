import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, DatabaseZap, Eye, GitBranch, Lock, PencilRuler, Rocket, Store, Workflow } from 'lucide-react';

const features = [
  {
    title: 'Business-first generation',
    copy: 'ASEA reads the store model and shapes product types, buyer journeys, admin tools, and launch priorities together.',
    icon: Workflow,
    tone: 'bg-[#dff7f1] text-[#007f75]',
  },
  {
    title: 'Customer-ready storefront',
    copy: 'Home, collection, product detail, cart, checkout, account, and content pages are generated as one coherent experience.',
    icon: Store,
    tone: 'bg-[#fff2cb] text-[#8a5d00]',
  },
  {
    title: 'Supabase-ready backend',
    copy: 'Products, orders, users, inventory, promotions, settings, auth rules, and storage are mapped into practical foundations.',
    icon: DatabaseZap,
    tone: 'bg-[#ffe6df] text-[#ba4d41]',
  },
  {
    title: 'Visual edit surface',
    copy: 'Tune copy, layout, sections, and storefront details in context while the project remains connected to code.',
    icon: PencilRuler,
    tone: 'bg-[#e7eaf3] text-[#20263a]',
  },
  {
    title: 'Inspectable code',
    copy: 'Open the file tree, review generated React, edit files, save changes, and export the project when it is ready.',
    icon: Code2,
    tone: 'bg-[#dff7f1] text-[#007f75]',
  },
  {
    title: 'Launch handoff',
    copy: 'Preview, GitHub export, Vercel deployment setup, and project settings stay connected through release.',
    icon: Rocket,
    tone: 'bg-[#fff2cb] text-[#8a5d00]',
  },
];

const workflow = [
  { step: '01', title: 'Describe the store', copy: 'Give ASEA the model, audience, products, and operating needs.' },
  { step: '02', title: 'Inspect the first build', copy: 'Review storefront, data model, admin screens, and generated files.' },
  { step: '03', title: 'Refine in context', copy: 'Use chat, visual edits, and code view to make the project yours.' },
  { step: '04', title: 'Ship with ownership', copy: 'Export to GitHub, connect services, and deploy the working project.' },
];

const trustItems = [
  { label: 'Auth and access', icon: Lock },
  { label: 'Live preview', icon: Eye },
  { label: 'GitHub export', icon: GitBranch },
];

export default function FeaturesPage() {
  return (
    <main className="bg-[#f6f1e8] text-[#10131b]">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 lg:pb-24">
        <Motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#d8d0c0] bg-[#fffaf0] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#007f75] shadow-[0_12px_30px_rgba(16,19,27,0.08)]">
              Features
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
              Everything needed to turn a store brief into a working project.
            </h1>
          </div>

          <div className="rounded-lg bg-[#10131b] p-6 text-white shadow-[0_24px_70px_rgba(16,19,27,0.18)]">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#f6c453]">Generated package</p>
            <div className="mt-6 grid gap-3">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3">
                    <Icon className="h-4 w-4 text-[#8dd9ce]" />
                    <span className="text-sm font-black">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-lg border border-[#d8d0c0] bg-white p-6 shadow-[0_18px_48px_rgba(16,19,27,0.08)] transition hover:-translate-y-1 hover:border-[#10131b]"
              >
                <div className={`mb-10 inline-flex h-14 w-14 items-center justify-center rounded-lg ${feature.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#5d6472]">{feature.copy}</p>
              </Motion.article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#d8d0c0] bg-[#fffaf0] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#007f75]">How it flows</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">One production line from idea to launch.</h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {workflow.map((item, index) => (
              <Motion.div
                key={item.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_16px_40px_rgba(16,19,27,0.07)]"
              >
                <span className="text-xs font-black text-[#c8931f]">{item.step}</span>
                <h3 className="mt-6 text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5d6472]">{item.copy}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-lg border border-[#d8d0c0] bg-[#10131b] p-6 text-white shadow-[0_24px_70px_rgba(16,19,27,0.18)] sm:p-10 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8dd9ce]">Ready when you are</p>
            <h2 className="mt-3 text-4xl font-black leading-tight">Build the first version your team can inspect.</h2>
          </div>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#f6c453] px-5 py-3 text-sm font-black text-[#10131b] transition hover:bg-[#ffd778] lg:mt-0"
          >
            Start building <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
