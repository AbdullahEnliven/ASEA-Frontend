import { CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/common';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['1 project', '500 MB storage', 'Community support'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    features: ['Unlimited projects', '10 GB storage', 'Priority support', 'Custom domains'],
    current: false,
    popular: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    features: ['Everything in Pro', '50 GB storage', 'Team collaboration', 'SSO', 'SLA'],
    current: false,
  },
];

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Billing</h1>

      {/* Current plan */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Current Plan</p>
            <p className="text-xl font-bold mt-1">Free</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CreditCard size={16} />
            No payment method
          </div>
        </div>
        {/* Usage */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Projects</p>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">0 / 1</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Storage</p>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">0 / 500 MB</p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 relative ${
              plan.popular
                ? 'border-blue-500/40 bg-blue-500/5'
                : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-500 text-xs font-medium">
                Popular
              </span>
            )}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <div className="mt-2 mb-6">
              <span className="text-3xl font-black">{plan.price}</span>
              <span className="text-sm text-gray-400">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check size={14} className="text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.current ? (
              <Button variant="secondary" className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full" variant={plan.popular ? 'primary' : 'secondary'}>
                Upgrade
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
