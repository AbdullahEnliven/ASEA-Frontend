import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for trying ASEA out.',
    features: ['1 project limit', '500 MB storage', 'Public GitHub repos', 'Community support'],
    missing: ['Custom domains', 'Private GitHub repos', 'Advanced analytics', 'Priority support'],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For serious store builders.',
    features: [
      'Unlimited projects',
      '10 GB storage',
      'Private GitHub repos',
      'Custom domains',
      'Priority support',
      'Advanced analytics',
    ],
    missing: ['White-label export', 'Dedicated SLA'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/month',
    desc: 'Collaborate at scale.',
    features: [
      'Everything in Pro',
      '50 GB storage',
      'Team workspaces',
      'SSO / SAML',
      'Dedicated SLA',
      'White-label export',
    ],
    missing: [],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Start for free, upgrade when you need to. You always own 100% of the code we generate.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-3xl p-8 flex flex-col h-full bg-[#0f0f0f] border ${
              plan.highlight ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)]' : 'border-white/10'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm h-10">{plan.desc}</p>
            </div>
            
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-black">{plan.price}</span>
              <span className="text-gray-400 font-medium">{plan.period}</span>
            </div>

            <button
              className={`w-full py-3.5 px-4 rounded-xl font-semibold mb-8 transition-all ${
                plan.highlight
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              {plan.cta}
            </button>

            <div className="space-y-4 flex-1">
              <p className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Includes</p>
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-500/20 p-1 rounded-full text-blue-400 shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
              
              {plan.missing.length > 0 && (
                <div className="pt-4 mt-6 border-t border-white/5 space-y-4">
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-start gap-3 opacity-50">
                      <div className="mt-1 bg-gray-500/20 p-1 rounded-full text-gray-400 shrink-0">
                        <X size={12} strokeWidth={3} />
                      </div>
                      <span className="text-gray-400 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-32 max-w-3xl mx-auto text-center border-t border-white/10 pt-16">
         <h3 className="text-2xl font-bold mb-4">Enterprise Needs?</h3>
         <p className="text-gray-400 mb-8">Custom SLA, dedicated instances, and tailored AI models are available for large organizations.</p>
         <button className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-medium">
           Contact Sales Team
         </button>
      </div>
    </div>
  );
}