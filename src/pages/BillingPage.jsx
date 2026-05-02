import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, FlaskConical, Folders, Gauge, HelpCircle, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common';
import { projectsService } from '@/services/projects.service';

const BETA_LIMIT = 5;

const included = [
  `${BETA_LIMIT} active projects`,
  'AI store generation',
  'Live preview builder',
  'Inspectable code view',
  'GitHub & deployment workflow',
  'AI code editor agent',
  'Supabase-ready schema',
  'Community support',
];

export default function BillingPage() {
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    projectsService
      .list()
      .then((res) => {
        const items = res.data?.items ?? res.data ?? [];
        setProjectCount(Array.isArray(items) ? items.length : 0);
      })
      .catch(() => setProjectCount(0));
  }, []);

  const used = projectCount ?? 0;
  const pct = Math.min(Math.round((used / BETA_LIMIT) * 100), 100);
  const remaining = Math.max(BETA_LIMIT - used, 0);
  const atLimit = used >= BETA_LIMIT;

  return (
    <div className="mx-auto max-w-7xl text-[#10131b]">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-[#10131b] bg-[#10131b] shadow-[0_24px_80px_rgba(16,19,27,0.22)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_20rem] lg:p-8">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f6c453]/40 bg-[#f6c453]/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#f6c453]">
              <FlaskConical size={12} /> Beta Plan — Free
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
              You're on the free beta plan.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/55">
              While we're in beta there are no paid plans, no payment processors, and nothing to
              upgrade. Every user gets{' '}
              <strong className="font-black text-white">{BETA_LIMIT} projects</strong> for free.
            </p>
          </div>

          {/* Right — current-plan card */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/6 p-6">
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-white/40">
                Current plan
              </p>
              <p className="text-4xl font-black text-white">Beta Free</p>
              <p className="mt-1.5 text-sm font-bold text-white/45">No payment method needed</p>
            </div>
            <div className="mt-6 rounded-lg border border-white/8 bg-white/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/35">Status</p>
              <p className="mt-2 text-sm font-bold text-[#8dd9ce]">
                ✦ Active — enjoy full beta access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Usage meter ───────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="rounded-2xl border border-[#d8d0c0] bg-white p-6 shadow-[0_14px_45px_rgba(22,24,31,0.05)]">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
                <Folders size={18} />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6f766f]">
                  Project usage
                </p>
                <p className="text-2xl font-black text-[#10131b]">
                  {projectCount === null ? '–' : used}
                  <span className="text-sm font-bold text-[#6f766f]"> / {BETA_LIMIT}</span>
                </p>
              </div>
            </div>
            {atLimit ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0c9c1] bg-[#fff4f1] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#ba4d41]">
                Limit reached
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#007f75]/25 bg-[#dff7f1] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#007f75]">
                {remaining} slot{remaining !== 1 ? 's' : ''} remaining
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-3 overflow-hidden rounded-full bg-[#eee6d7]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${atLimit ? 'bg-[#ba4d41]' : 'bg-[#0f766e]'}`}
              style={{ width: `${projectCount === null ? 0 : pct}%` }}
            />
          </div>

          {/* Slot dots */}
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: BETA_LIMIT }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < used
                    ? atLimit
                      ? 'bg-[#ba4d41]'
                      : 'bg-[#0f766e]'
                    : 'bg-[#d8d0c0]'
                }`}
              />
            ))}
          </div>

          {atLimit ? (
            <p className="mt-4 text-sm font-bold text-[#ba4d41]">
              You've reached the 5-project limit. Delete an existing project to create a new one.
            </p>
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <Link to="/projects/new">
                <Button className="!rounded-lg !bg-[#10131b] px-4 py-2.5 text-sm font-black !text-white hover:!bg-[#253044]">
                  <Plus size={14} /> New project
                </Button>
              </Link>
              <p className="text-sm font-bold text-[#6f766f]">
                {remaining} of {BETA_LIMIT} slots available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── What's included ───────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl border border-[#d8d0c0] bg-[#fffaf0] p-6 shadow-[0_14px_45px_rgba(22,24,31,0.05)]">
        <div className="mb-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#007f75]">
            Beta plan includes
          </p>
          <h2 className="text-2xl font-black tracking-tight text-[#10131b]">
            Everything we've built, at no cost.
          </h2>
        </div>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {included.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-bold text-[#343945]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#dff7f1] text-[#0f766e]">
                <Check size={12} strokeWidth={3} />
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── No upgrade notice ─────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl border border-[#d8d0c0] bg-white p-6 shadow-[0_14px_45px_rgba(22,24,31,0.05)]">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fff2c7] text-[#9a6a0a]">
            <Gauge size={20} />
          </span>
          <div>
            <h3 className="text-lg font-black text-[#10131b]">No paid plans — yet</h3>
            <p className="mt-1 text-sm leading-6 text-[#5c6270]">
              We're still in beta and haven't launched pricing. When we do, we'll give all beta
              users advance notice and a generous transition window. For now, just build.
            </p>
          </div>
        </div>
      </section>

      {/* ── Support ───────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#d8d0c0] bg-[#fffaf0] p-6 shadow-[0_14px_45px_rgba(22,24,31,0.04)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 className="text-xl font-black text-[#10131b]">Have a question?</h2>
              <p className="mt-1 text-sm leading-6 text-[#5c6270]">
                Reach out to the team for help with your projects, beta access, or anything else.
              </p>
            </div>
          </div>
          <Link to="/contact">
            <Button className="!rounded-lg !bg-[#10131b] px-5 py-3 font-black !text-white hover:!bg-[#253044] whitespace-nowrap">
              <HelpCircle size={15} /> Contact us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
