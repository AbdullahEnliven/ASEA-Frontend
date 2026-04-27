import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import useAuthStore from '@/store/auth.store';
import { authService } from '@/services/auth.service';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    companyName: z.string().min(2, 'Business name is required'),
    role: z.string().min(1, 'Select your role'),
    website: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    industry: z.string().min(1, 'Select an industry'),
    companySize: z.string().min(1, 'Select a team size'),
    primaryGoal: z.string().min(1, 'Select a primary goal'),
    storeStage: z.string().min(1, 'Select your store stage'),
    monthlyRevenue: z.string().min(1, 'Select monthly revenue'),
    referralSource: z.string().optional(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => !d.website || /^https?:\/\/.+\..+/.test(d.website), {
    message: 'Use a full URL, for example https://example.com',
    path: ['website'],
  });

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];

function SelectField({ label, error, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <select
        className={`w-full rounded-xl border bg-[#151515] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 [&_option]:bg-[#151515] [&_option]:text-white ${
          error ? 'border-red-500' : 'border-white/10'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: '',
      industry: '',
      companySize: '',
      primaryGoal: '',
      storeStage: '',
      monthlyRevenue: '',
      terms: false,
    },
  });

  const password = watch('password', '');
  const strength = getStrength(password);

  const nextStep = async () => {
    const fields = step === 1
      ? ['name', 'email', 'phone', 'password', 'confirmPassword']
      : ['companyName', 'role', 'country', 'industry', 'companySize'];
    const valid = await trigger(fields);
    if (valid) setStep((current) => Math.min(current + 1, 3));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      login(res.data.user, res.data.token);
      toast.success('Account created. Your workspace is ready.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg = 'Registration failed';
      if (typeof detail === 'string') msg = detail;
      else if (Array.isArray(detail)) msg = detail.map((d) => d.msg).join(', ');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await authService.getGithubOAuthUrl('register');
      const authUrl = res.data?.auth_url;
      if (!authUrl) throw new Error('Missing authorization URL');
      window.location.assign(authUrl);
    } catch {
      setLoading(false);
      toast.error('GitHub signup is not configured');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Create your ASEA workspace</h1>
            <p className="mt-2 text-sm text-gray-400">Set up your profile, business context, and store goals.</p>
          </div>
          <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { id: 1, label: 'Account', icon: UserRound },
            { id: 2, label: 'Business', icon: Building2 },
            { id: 3, label: 'Goals', icon: ArrowRight },
          ].map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`rounded-xl border px-4 py-3 ${
                step >= id ? 'border-blue-500/40 bg-blue-500/10 text-blue-200' : 'border-white/10 bg-white/[0.02] text-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Icon size={16} /> {label}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
              <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
              <Input label="Phone" placeholder="+1 555 0123" error={errors.phone?.message} {...register('phone')} />
              <div />
              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  rightElement={
                    <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-gray-400 hover:text-white">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...register('password')}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{strength > 0 ? strengthLabels[strength - 1] : 'Too short'}</p>
                  </div>
                )}
              </div>
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                error={errors.confirmPassword?.message}
                rightElement={
                  <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="text-gray-400 hover:text-white">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('confirmPassword')}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Business / Brand Name" placeholder="Northstar Apparel" error={errors.companyName?.message} {...register('companyName')} />
              <SelectField label="Your Role" error={errors.role?.message} {...register('role')}>
                <option value="">Select role</option>
                <option value="Founder">Founder</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Developer">Developer</option>
                <option value="Agency">Agency</option>
              </SelectField>
              <Input label="Website" placeholder="https://yourstore.com" error={errors.website?.message} {...register('website')} />
              <Input label="Country" placeholder="United States" error={errors.country?.message} {...register('country')} />
              <SelectField label="Industry" error={errors.industry?.message} {...register('industry')}>
                <option value="">Select industry</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty">Beauty</option>
                <option value="Electronics">Electronics</option>
                <option value="Home goods">Home goods</option>
                <option value="Food and beverage">Food and beverage</option>
                <option value="Other">Other</option>
              </SelectField>
              <SelectField label="Team Size" error={errors.companySize?.message} {...register('companySize')}>
                <option value="">Select team size</option>
                <option value="Solo">Solo</option>
                <option value="2-5">2-5</option>
                <option value="6-20">6-20</option>
                <option value="21-100">21-100</option>
                <option value="100+">100+</option>
              </SelectField>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Primary Goal" error={errors.primaryGoal?.message} {...register('primaryGoal')}>
                <option value="">Select goal</option>
                <option value="Launch a new store">Launch a new store</option>
                <option value="Improve an existing store">Improve an existing store</option>
                <option value="Create client stores">Create client stores</option>
                <option value="Prototype ideas faster">Prototype ideas faster</option>
              </SelectField>
              <SelectField label="Store Stage" error={errors.storeStage?.message} {...register('storeStage')}>
                <option value="">Select stage</option>
                <option value="Idea">Idea</option>
                <option value="Pre-launch">Pre-launch</option>
                <option value="Live store">Live store</option>
                <option value="Scaling">Scaling</option>
              </SelectField>
              <SelectField label="Monthly Revenue" error={errors.monthlyRevenue?.message} {...register('monthlyRevenue')}>
                <option value="">Select range</option>
                <option value="$0">$0</option>
                <option value="$1-$1k">$1-$1k</option>
                <option value="$1k-$10k">$1k-$10k</option>
                <option value="$10k-$100k">$10k-$100k</option>
                <option value="$100k+">$100k+</option>
              </SelectField>
              <Input label="How did you hear about ASEA?" placeholder="Google, friend, agency, etc." {...register('referralSource')} />
              <div className="md:col-span-2">
                <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-white/20 bg-white/5" {...register('terms')} />
                  <span>I agree to the Terms of Service and Privacy Policy.</span>
                </label>
                {errors.terms && <p className="mt-1 text-xs text-red-400">{errors.terms.message}</p>}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep((current) => Math.max(current - 1, 1))} disabled={step === 1 || loading}>
              <ArrowLeft size={16} /> Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <Button type="submit" loading={loading}>
                Create Account
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <Button variant="secondary" className="mt-4 w-full" onClick={handleGithubSignup} disabled={loading}>
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
