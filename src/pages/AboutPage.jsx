import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Stores Generated', value: '10,000+' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Saved Hours', value: '500k+' },
  { label: 'Global Creators', value: '5,000+' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Background blobs */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-3xl mx-auto text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="text-xs font-medium text-blue-400 tracking-wide uppercase">Our Story</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl font-black tracking-tight mb-8"
        >
          Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Software Creation</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-400 leading-relaxed"
        >
          We believe that anyone should be able to build a business without getting bogged down in boilerplate code, infrastructure, and deployment pipelines. ASEA was built to bridge the gap between imagination and a deployed product.
        </motion.p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
          >
            <div className="text-3xl font-bold text-white mb-2">{s.value}</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Built for builders, by builders.</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            We spent years building e-commerce platforms the hard way. Writing the same authentication, shopping cart, and admin dashboard code hundreds of times. We knew there had to be a better way leveraging modern AI capabilities.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Our mission is simple: to reduce the time from idea to launched store from weeks to minutes, without sacrificing code quality or vendor lock-in. You own your code. Every single line.
          </p>
          
          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Join the movement
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-4 pt-12">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/5 rounded-3xl">
              <Shield className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-semibold mb-2">Secure by Default</h3>
              <p className="text-xs text-gray-400">Enterprise grade security out of the box.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/5 rounded-3xl">
              <Clock className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold mb-2">Speed</h3>
              <p className="text-xs text-gray-400">Ship in minutes, not months.</p>
            </div>
          </div>
          <div className="space-y-4 pb-12">
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-white/5 rounded-3xl">
              <Zap className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="font-semibold mb-2">Performant</h3>
              <p className="text-xs text-gray-400">Edge-ready architecture.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 rounded-3xl">
              <Globe className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="font-semibold mb-2">Global</h3>
              <p className="text-xs text-gray-400">Reach customers anywhere.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}