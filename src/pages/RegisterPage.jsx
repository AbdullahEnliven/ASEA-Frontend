import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Github,
  Layers3,
  Target,
  UserRound,
} from 'lucide-react';
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

const inputClass =
  '!rounded-lg !border-[#d8d0c0] !bg-white px-4 py-3 !text-[#10131b] placeholder:!text-[#9a9387] focus:!border-[#0f766e] focus:!ring-[#0f766e]/20';
const labelClass = 'font-black text-[#343945]';
const errorClass = 'text-[#ba4d41]';

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['bg-[#ef6f61]', 'bg-[#f2b84b]', 'bg-[#4461f2]', 'bg-[#0f766e]'];

const steps = [
  { id: 1, label: 'Account', helper: 'Your login details', glyph: <UserRound className="h-4 w-4" /> },
  { id: 2, label: 'Business', helper: 'Store context', glyph: <Building2 className="h-4 w-4" /> },
  { id: 3, label: 'Launch', helper: 'Goals and stage', glyph: <Target className="h-4 w-4" /> },
];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function SelectField({ label, error, children, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-black text-[#343945]">{label}</label>
      <select
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#10131b] outline-none transition-colors focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20 [&_option]:bg-white [&_option]:text-[#10131b] ${
          error ? 'border-[#ba4d41]' : 'border-[#d8d0c0]'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-[#ba4d41]">{error}</p>}
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
    const fields =
      step === 1
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
    <div className="min-h-screen bg-[#f6f1e8] px-5 py-8 text-[#10131b] sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-[0_24px_80px_rgba(22,24,31,0.1)] lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="relative overflow-hidden border-b border-[#d8d0c0] bg-[#10131b] p-8 text-white lg:border-b-0 lg:border-r lg:p-10">
          <img
            src="/assets/asea-hero-studio.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-28"
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(16,19,27,0.98)_0%,rgba(16,19,27,0.84)_52%,rgba(15,118,110,0.36)_100%)]" />

          <div className="relative flex h-full min-h-[430px] flex-col justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#10131b]">
                  <Layers3 className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-2xl font-black tracking-tight">ASEA</span>
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-[#aee9de]">commerce build room</span>
                </span>
              </Link>

              <div className="mt-16 max-w-md">
                <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#f2b84b]">Create workspace</p>
                <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Give ASEA the context. Get a sharper first build.
                </h1>
                <p className="mt-6 text-base leading-7 text-white/68">
                  Your business details help shape the generated storefront, database, admin tools, and launch path around the store you actually want to ship.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-3">
              {['Customer-ready pages', 'Structured commerce data', 'Owned code export'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/12 bg-white/8 px-4 py-3 backdrop-blur">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dff7f1] text-[#0f766e]">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-black text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="px-5 py-10 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Signup</p>
              <h2 className="text-4xl font-black tracking-tight text-[#10131b]">Build your launch room.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#5c6270]">
                Set up your profile, business context, and launch goals so ASEA can generate a more useful first project.
              </p>
            </div>
            <Link to="/login" className="text-sm font-black text-[#0f766e] hover:text-[#0a514c]">
              Already have an account?
            </Link>
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border px-4 py-4 transition ${
                  step >= item.id
                    ? 'border-[#0f766e]/35 bg-[#dff7f1] text-[#0f3d38]'
                    : 'border-[#d8d0c0] bg-white text-[#8b8174]'
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-black">
                    {item.glyph}
                    {item.label}
                  </div>
                  <span className="text-xs font-black">0{item.id}</span>
                </div>
                <p className="text-xs font-bold opacity-75">{item.helper}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-[#d8d0c0] bg-[#f7f2e8] p-5 sm:p-7">
            {step === 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full Name" placeholder="Jane Doe" error={errors.name?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('name')} />
                <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('email')} />
                <Input label="Phone" placeholder="+1 555 0123" error={errors.phone?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('phone')} />
                <div className="hidden md:block" />
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    error={errors.password?.message}
                    className={inputClass}
                    labelClassName={labelClass}
                    errorClassName={errorClass}
                    rightElement={
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-[#8b8174] hover:text-[#10131b]">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    {...register('password')}
                  />
                  {password && (
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : 'bg-[#ddd4c4]'}`} />
                        ))}
                      </div>
                      <p className="mt-2 text-xs font-bold text-[#5c6270]">{strength > 0 ? strengthLabels[strength - 1] : 'Too short'}</p>
                    </div>
                  )}
                </div>
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  error={errors.confirmPassword?.message}
                  className={inputClass}
                  labelClassName={labelClass}
                  errorClassName={errorClass}
                  rightElement={
                    <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="text-[#8b8174] hover:text-[#10131b]">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  {...register('confirmPassword')}
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Business / Brand Name" placeholder="Northstar Apparel" error={errors.companyName?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('companyName')} />
                <SelectField label="Your Role" error={errors.role?.message} {...register('role')}>
                  <option value="">Select role</option>
                  <option value="Founder">Founder</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Developer">Developer</option>
                  <option value="Agency">Agency</option>
                </SelectField>
                <Input label="Website" placeholder="https://yourstore.com" error={errors.website?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('website')} />
                <Input label="Country" placeholder="United States" error={errors.country?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('country')} />
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
              <div className="grid gap-5 md:grid-cols-2">
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
                <Input label="How did you hear about ASEA?" placeholder="Google, friend, agency, etc." className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('referralSource')} />
                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#d8d0c0] bg-white p-4 text-sm font-bold text-[#5c6270]">
                    <input type="checkbox" className="mt-0.5 rounded border-[#cfc6b6] bg-white text-[#0f766e] focus:ring-[#0f766e]/30" {...register('terms')} />
                    <span>I agree to the Terms of Service and Privacy Policy.</span>
                  </label>
                  {errors.terms && <p className="mt-2 text-xs text-[#ba4d41]">{errors.terms.message}</p>}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                className="!rounded-lg !border-[#d8d0c0] !bg-white px-5 py-3 font-black !text-[#10131b] hover:!bg-[#fffaf0]"
                onClick={() => setStep((current) => Math.max(current - 1, 1))}
                disabled={step === 1 || loading}
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  className="!rounded-lg !bg-[#10131b] px-5 py-3 font-black !text-white hover:!bg-[#253044]"
                  onClick={nextStep}
                >
                  Continue
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button type="submit" className="!rounded-lg !bg-[#10131b] px-5 py-3 font-black !text-white hover:!bg-[#253044]" loading={loading}>
                  Create Account
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </form>

          <div className="mt-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#d8d0c0]" />
            <span className="text-xs font-bold text-[#8b8174]">or</span>
            <div className="h-px flex-1 bg-[#d8d0c0]" />
          </div>
          <Button
            variant="secondary"
            className="mt-4 w-full !rounded-lg !border-[#d8d0c0] !bg-white py-3 font-black !text-[#10131b] hover:!bg-[#f6f1e8]"
            onClick={handleGithubSignup}
            disabled={loading}
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>
        </main>
      </div>
    </div>
  );
}
