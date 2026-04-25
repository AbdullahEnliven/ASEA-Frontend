import { motion } from 'framer-motion';
import { Database, Zap, Lock, Palette, Code2, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Code2,
    title: 'Clean Next.js Code',
    desc: 'We generate standard Next.js 14 App Router code with modern React patterns. No proprietary frameworks or hidden complexities.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    icon: Database,
    title: 'Supabase Integrated',
    desc: 'Seamlessly weaves authentication, PostgreSQL database, storage, and RLS policies right into the generated codebase.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    icon: Palette,
    title: 'Tailwind Mastery',
    desc: 'Every UI component is beautifully styled using Tailwind CSS, making it trivial for you to tweak the design later.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10'
  },
  {
    icon: Lock,
    title: 'Enterprise Auth',
    desc: 'Social logins, magic links, forgot-password flows and strict route-guarding out of the box via Supabase Auth.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  {
    icon: Zap,
    title: 'Instant Preview',
    desc: 'Watch the AI generate and preview the app in an embedded sandbox within seconds. Tweak it via simple chat commands.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10'
  },
  {
    icon: Rocket,
    title: '1-Click Deploy',
    desc: 'Connect your GitHub and we will spin up a repository and automatically wire a Vercel deployment pipeline.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24 max-w-3xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            Everything you need
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Complete Toolkit for Modern Web Apps
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            We do more than just write code. ASEA scaffolds standard, battle-tested modern architectures 
            so you can ship production-ready SaaS platforms in minutes.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <f.icon className={`w-7 h-7 ${f.color}`} />
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[2rem] p-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to see it in action?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
          Join thousands of developers using ASEA to rapidly prototype and launch scalable apps.
        </p>
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
        >
          Start Building 
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}