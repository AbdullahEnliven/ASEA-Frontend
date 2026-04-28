import { motion as Motion } from 'framer-motion';
import { ArrowRight, LifeBuoy, Mail, MessageSquare, Send, Sparkles, Timer } from 'lucide-react';

const contactRoutes = [
  {
    title: 'Product questions',
    copy: 'Talk through ASEA plans, project output, export, and launch handoff.',
    action: 'hello@asea.dev',
    href: 'mailto:hello@asea.dev',
    icon: Mail,
    tone: 'bg-[#dff7f1] text-[#007f75]',
  },
  {
    title: 'Builder support',
    copy: 'Get help with generated projects, deploy setup, Supabase, or GitHub export.',
    action: 'support@asea.dev',
    href: 'mailto:support@asea.dev',
    icon: LifeBuoy,
    tone: 'bg-[#fff2cb] text-[#8a5d00]',
  },
  {
    title: 'Partnerships',
    copy: 'For studios, agencies, and commerce teams launching multiple stores.',
    action: 'partners@asea.dev',
    href: 'mailto:partners@asea.dev',
    icon: MessageSquare,
    tone: 'bg-[#ffe6df] text-[#ba4d41]',
  },
];

const fields = [
  { label: 'Name', placeholder: 'Jane Doe', type: 'text' },
  { label: 'Work email', placeholder: 'jane@company.com', type: 'email' },
  { label: 'Company', placeholder: 'Your team or store', type: 'text' },
];

export default function ContactPage() {
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
            Contact us
          </div>
          <h1 className="text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
            Tell us what you want to launch.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5d6472]">
            Whether you are evaluating ASEA, need support, or want a team workflow, send the brief and we will route it to the right place.
          </p>
        </Motion.div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:pb-28">
        <div className="space-y-4">
          {contactRoutes.map((route, index) => {
            const Icon = route.icon;
            return (
              <Motion.a
                key={route.title}
                href={route.href}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group flex gap-5 rounded-lg border border-[#d8d0c0] bg-white p-5 shadow-[0_18px_48px_rgba(16,19,27,0.08)] transition hover:-translate-y-0.5 hover:border-[#10131b]"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${route.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black">{route.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#5d6472]">{route.copy}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#007f75]">
                    {route.action}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </span>
              </Motion.a>
            );
          })}

          <div className="rounded-lg bg-[#10131b] p-6 text-white shadow-[0_24px_70px_rgba(16,19,27,0.16)]">
            <Timer className="mb-6 h-7 w-7 text-[#f6c453]" />
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#8dd9ce]">Response window</p>
            <p className="mt-3 text-2xl font-black">Most messages get a reply within one business day.</p>
          </div>
        </div>

        <Motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-5 shadow-[0_24px_70px_rgba(16,19,27,0.12)] sm:p-8"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#007f75]">Launch brief</p>
              <h2 className="mt-2 text-3xl font-black">Send a message</h2>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#10131b] text-[#f6c453]">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field, index) => (
              <label key={field.label} className={index === 2 ? 'sm:col-span-2' : ''}>
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#5d6472]">
                  {field.label}
                </span>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-[#d8d0c0] bg-white px-4 py-3 text-sm font-semibold text-[#10131b] outline-none transition placeholder:text-[#a9a094] focus:border-[#007f75] focus:ring-4 focus:ring-[#007f75]/10"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-[#5d6472]">
              What are you building?
            </span>
            <textarea
              rows={6}
              placeholder="Share the store type, timeline, team size, and anything you need ASEA to support."
              className="w-full resize-none rounded-lg border border-[#d8d0c0] bg-white px-4 py-3 text-sm font-semibold text-[#10131b] outline-none transition placeholder:text-[#a9a094] focus:border-[#007f75] focus:ring-4 focus:ring-[#007f75]/10"
            />
          </label>

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#10131b] px-5 py-4 text-sm font-black text-white transition hover:bg-[#007f75]">
            Send message <Send className="h-4 w-4" />
          </button>
        </Motion.form>
      </section>
    </main>
  );
}
