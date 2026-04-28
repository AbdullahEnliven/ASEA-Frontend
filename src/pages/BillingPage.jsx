import { Check, CreditCard, Gauge, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/common';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    caption: 'Validate one store idea.',
    features: ['1 project', '500 MB storage', 'Community support'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    caption: 'Launch and iterate faster.',
    features: ['Unlimited projects', '10 GB storage', 'Priority support', 'Custom domains'],
    current: false,
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    caption: 'Coordinate multiple brands.',
    features: ['Everything in Pro', '50 GB storage', 'Team collaboration', 'SSO', 'SLA'],
    current: false,
  },
];

const usage = [
  { label: 'Projects', used: '0', limit: '1', percent: 10 },
  { label: 'Storage', used: '0 MB', limit: '500 MB', percent: 0 },
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-7xl text-[#10131b]">
      <section className="mb-8 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-[0_20px_70px_rgba(22,24,31,0.08)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">
              Billing
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Scale your launch room when the work gets real.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5c6270]">
              Manage your plan, usage, and upgrade path for generated stores, exports, domains, and team workflows.
            </p>
          </div>

          <div className="rounded-lg bg-[#10131b] p-5 text-white">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#10131b]">
                Current plan
              </span>
              <CreditCard className="h-6 w-6 text-[#f2b84b]" />
            </div>
            <p className="text-5xl font-black tracking-tight">Free</p>
            <p className="mt-2 text-sm font-bold text-white/58">No payment method connected</p>
            <div className="mt-6 rounded-lg border border-white/10 bg-white/8 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Next step</p>
              <p className="mt-2 text-sm font-bold text-white">Upgrade when you need more projects or custom domains.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {usage.map((item) => (
          <div key={item.label} className="rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_14px_45px_rgba(22,24,31,0.05)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6f766f]">{item.label}</p>
                <p className="mt-2 text-2xl font-black text-[#10131b]">
                  {item.used} <span className="text-sm font-bold text-[#6f766f]">/ {item.limit}</span>
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
                <Gauge size={18} />
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#eee6d7]">
              <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#9a6a0a]">Plans</p>
            <h2 className="text-3xl font-black tracking-tight text-[#10131b]">Choose your launch capacity.</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[#5c6270]">
            Upgrade paths are designed around how many stores you are building and how much launch control you need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-lg border p-6 shadow-[0_18px_55px_rgba(22,24,31,0.06)] ${
                plan.popular
                  ? 'border-[#0f766e]/45 bg-[#dff7f1]'
                  : 'border-[#d8d0c0] bg-white'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-lg bg-[#10131b] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                  Best fit
                </span>
              )}
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-[#10131b]">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5c6270]">{plan.caption}</p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${plan.popular ? 'bg-[#0f766e] text-white' : 'bg-[#fff2c7] text-[#9a6a0a]'}`}>
                  {plan.popular ? <Sparkles size={18} /> : <Layers3 size={18} />}
                </span>
              </div>

              <div className="mb-7">
                <span className="text-5xl font-black tracking-tight text-[#10131b]">{plan.price}</span>
                <span className="text-sm font-bold text-[#6f766f]">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-bold text-[#343945]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#fffaf0] text-[#0f766e]">
                      <Check size={14} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <Button
                  variant="secondary"
                  className="w-full !rounded-lg !border-[#d8d0c0] !bg-[#fffaf0] font-black !text-[#6f766f]"
                  disabled
                >
                  Current plan
                </Button>
              ) : (
                <Button
                  className={`w-full !rounded-lg font-black ${
                    plan.popular
                      ? '!bg-[#10131b] !text-white hover:!bg-[#253044]'
                      : '!border-[#d8d0c0] !bg-white !text-[#10131b] hover:!bg-[#f6f1e8]'
                  }`}
                  variant={plan.popular ? 'primary' : 'secondary'}
                >
                  Upgrade
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-6 shadow-[0_18px_55px_rgba(22,24,31,0.05)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h2 className="text-xl font-black text-[#10131b]">Billing support</h2>
              <p className="mt-1 text-sm leading-6 text-[#5c6270]">
                Need invoices, annual billing, or a custom workspace plan? Contact the team and we will help you set it up.
              </p>
            </div>
          </div>
          <Button className="!rounded-lg !bg-[#10131b] px-5 py-3 font-black !text-white hover:!bg-[#253044]">
            Contact support
          </Button>
        </div>
      </section>
    </div>
  );
}
