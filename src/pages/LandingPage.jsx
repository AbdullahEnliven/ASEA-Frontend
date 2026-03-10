import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Rocket, Github, Database, ShoppingCart, BarChart3 } from 'lucide-react';

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
  { num: '01', title: 'Describe', desc: 'Tell us what kind of store you want to build.' },
  { num: '02', title: 'Generate', desc: 'AI creates the full-stack store in minutes.' },
  { num: '03', title: 'Deploy', desc: 'Connect Supabase, push to GitHub, and go live.' },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-xs font-medium text-blue-100/70 tracking-wide uppercase">
            Now in Public Beta
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8">
          Build your store <br />
          <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-white/40">
            with AI.
          </span>
        </h1>

        <p className="max-w-2xl text-lg lg:text-xl text-gray-400 mb-12 leading-relaxed">
          ASEA is an AI-powered e-commerce store builder. Describe what you want,
          and we generate a full-stack store — frontend, backend, database, and admin panel.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 font-bold text-lg mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-3xl font-bold text-center mb-16">Everything You Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorMap[f.color]}`}>
                <f.icon size={22} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-32 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to build your store?</h2>
        <p className="text-gray-400 mb-8">
          Join thousands of entrepreneurs using ASEA to launch their e-commerce business.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
        >
          Get Started — It&apos;s Free
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
