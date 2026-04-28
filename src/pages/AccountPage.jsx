import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Building2,
  CheckCircle2,
  Globe2,
  Lock,
  ShieldCheck,
  Target,
  Trash2,
  UserRound,
} from 'lucide-react';
import { Button, Input } from '@/components/common';
import useAuthStore from '@/store/auth.store';
import { authService } from '@/services/auth.service';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  company_name: z.string().optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  primary_goal: z.string().optional(),
  store_stage: z.string().optional(),
  monthly_revenue: z.string().optional(),
  referral_source: z.string().optional(),
}).refine((d) => !d.website || /^https?:\/\/.+\..+/.test(d.website), {
  message: 'Use a full URL, for example https://example.com',
  path: ['website'],
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const inputClass =
  '!rounded-lg !border-[#d8d0c0] !bg-white px-4 py-3 !text-[#10131b] placeholder:!text-[#9a9387] focus:!border-[#0f766e] focus:!ring-[#0f766e]/20';
const labelClass = 'font-black text-[#343945]';
const errorClass = 'text-[#ba4d41]';

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

function completionValue(user) {
  const fields = [
    'full_name',
    'company_name',
    'role',
    'phone',
    'website',
    'country',
    'industry',
    'company_size',
    'primary_goal',
    'store_stage',
    'monthly_revenue',
  ];
  const completed = fields.filter((field) => Boolean(user?.[field])).length;
  return Math.round((completed / fields.length) * 100);
}

function SectionHeading({ glyph, title, copy }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
        {glyph}
      </span>
      <div>
        <h2 className="text-lg font-black tracking-tight text-[#10131b]">{title}</h2>
        {copy && <p className="mt-1 text-sm leading-6 text-[#5c6270]">{copy}</p>}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const profileDefaults = useMemo(() => ({
    full_name: user?.full_name || user?.name || '',
    company_name: user?.company_name || '',
    role: user?.role || '',
    phone: user?.phone || '',
    website: user?.website || '',
    country: user?.country || '',
    industry: user?.industry || '',
    company_size: user?.company_size || '',
    primary_goal: user?.primary_goal || '',
    store_stage: user?.store_stage || '',
    monthly_revenue: user?.monthly_revenue || '',
    referral_source: user?.referral_source || '',
  }), [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: profileDefaults,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const profileCompletion = completionValue({ ...user, ...profileDefaults });
  const displayName = user?.name || user?.full_name || 'User';

  const updateProfile = async (data) => {
    setSaving(true);
    try {
      const payload = { ...data, onboarding_completed: true };
      const res = await authService.updateProfile(payload);
      updateUser(res.data);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (data) => {
    setPasswordSaving(true);
    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete your account and all projects? This cannot be undone.')) return;
    try {
      await authService.deleteAccount();
      logout();
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="mx-auto max-w-7xl text-[#10131b]">
      <section className="mb-8 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-[0_20px_70px_rgba(22,24,31,0.08)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">
              Account
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Keep your launch workspace personal and useful.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5c6270]">
              Manage your identity, business context, security, and workspace details so ASEA can shape better generated stores.
            </p>
          </div>

          <div className="rounded-lg bg-[#10131b] p-5 text-white">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#10131b]">
                Profile health
              </span>
              <ShieldCheck className="h-6 w-6 text-[#f2b84b]" />
            </div>
            <p className="text-6xl font-black tracking-tight">{profileCompletion}%</p>
            <p className="mt-2 text-sm font-bold text-white/58">Profile completion</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-[#d8d0c0] bg-white p-6 shadow-[0_18px_55px_rgba(22,24,31,0.06)] lg:p-8">
          <div className="mb-8 flex items-center gap-4 rounded-lg border border-[#d8d0c0] bg-[#f7f2e8] p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#10131b] text-2xl font-black text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-black text-[#10131b]">{displayName}</p>
              <p className="text-sm font-bold text-[#5c6270]">{user?.email || 'No email'}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
                {user?.plan || 'free'} plan
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(updateProfile)} className="space-y-9">
            <div>
              <SectionHeading
                glyph={<UserRound size={18} />}
                title="Personal"
                copy="Basic contact details for your workspace profile."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full Name" error={errors.full_name?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('full_name')} />
                <Input label="Phone" error={errors.phone?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('phone')} />
                <Input label="Country" error={errors.country?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('country')} />
                <Input label="Website" placeholder="https://yourstore.com" error={errors.website?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('website')} />
              </div>
            </div>

            <div>
              <SectionHeading
                glyph={<Building2 size={18} />}
                title="Business"
                copy="Tell ASEA how to frame your store and operating context."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Business / Brand Name" error={errors.company_name?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('company_name')} />
                <SelectField label="Your Role" error={errors.role?.message} {...register('role')}>
                  <option value="">Select role</option>
                  <option value="Founder">Founder</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Developer">Developer</option>
                  <option value="Agency">Agency</option>
                </SelectField>
                <SelectField label="Industry" error={errors.industry?.message} {...register('industry')}>
                  <option value="">Select industry</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Home goods">Home goods</option>
                  <option value="Food and beverage">Food and beverage</option>
                  <option value="Other">Other</option>
                </SelectField>
                <SelectField label="Team Size" error={errors.company_size?.message} {...register('company_size')}>
                  <option value="">Select team size</option>
                  <option value="Solo">Solo</option>
                  <option value="2-5">2-5</option>
                  <option value="6-20">6-20</option>
                  <option value="21-100">21-100</option>
                  <option value="100+">100+</option>
                </SelectField>
              </div>
            </div>

            <div>
              <SectionHeading
                glyph={<Target size={18} />}
                title="Store goals"
                copy="These details help generated stores start closer to the business you want."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField label="Primary Goal" error={errors.primary_goal?.message} {...register('primary_goal')}>
                  <option value="">Select goal</option>
                  <option value="Launch a new store">Launch a new store</option>
                  <option value="Improve an existing store">Improve an existing store</option>
                  <option value="Create client stores">Create client stores</option>
                  <option value="Prototype ideas faster">Prototype ideas faster</option>
                </SelectField>
                <SelectField label="Store Stage" error={errors.store_stage?.message} {...register('store_stage')}>
                  <option value="">Select stage</option>
                  <option value="Idea">Idea</option>
                  <option value="Pre-launch">Pre-launch</option>
                  <option value="Live store">Live store</option>
                  <option value="Scaling">Scaling</option>
                </SelectField>
                <SelectField label="Monthly Revenue" error={errors.monthly_revenue?.message} {...register('monthly_revenue')}>
                  <option value="">Select range</option>
                  <option value="$0">$0</option>
                  <option value="$1-$1k">$1-$1k</option>
                  <option value="$1k-$10k">$1k-$10k</option>
                  <option value="$10k-$100k">$10k-$100k</option>
                  <option value="$100k+">$100k+</option>
                </SelectField>
                <Input label="Referral Source" className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...register('referral_source')} />
              </div>
            </div>

            <Button type="submit" loading={saving} className="!rounded-lg !bg-[#10131b] px-5 py-3 font-black !text-white hover:!bg-[#253044]">
              <CheckCircle2 size={16} /> Save profile
            </Button>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-6 shadow-[0_18px_55px_rgba(22,24,31,0.05)]">
            <SectionHeading
              glyph={<Lock size={18} />}
              title="Security"
              copy="Update your password for this workspace."
            />
            <form onSubmit={handlePasswordSubmit(changePassword)} className="space-y-4">
              <Input label="Current Password" type="password" error={passwordErrors.currentPassword?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...registerPassword('currentPassword')} />
              <Input label="New Password" type="password" error={passwordErrors.newPassword?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...registerPassword('newPassword')} />
              <Input label="Confirm New Password" type="password" error={passwordErrors.confirmPassword?.message} className={inputClass} labelClassName={labelClass} errorClassName={errorClass} {...registerPassword('confirmPassword')} />
              <Button
                type="submit"
                variant="secondary"
                loading={passwordSaving}
                className="!rounded-lg !border-[#d8d0c0] !bg-white font-black !text-[#10131b] hover:!bg-[#f6f1e8]"
              >
                Change password
              </Button>
            </form>
          </section>

          <section className="rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-6 shadow-[0_18px_55px_rgba(22,24,31,0.05)]">
            <SectionHeading
              glyph={<Globe2 size={18} />}
              title="Workspace"
              copy="Current status for your ASEA account."
            />
            <div className="space-y-3 text-sm font-bold text-[#5c6270]">
              <p>Plan: <span className="text-[#10131b]">{user?.plan || 'free'}</span></p>
              <p>Verified: <span className="text-[#10131b]">{user?.is_verified ? 'Yes' : 'No'}</span></p>
              <p>Onboarding: <span className="text-[#10131b]">{user?.onboarding_completed ? 'Completed' : 'Incomplete'}</span></p>
            </div>
            <div className="mt-6 border-t border-[#ef6f61]/25 pt-5">
              <h3 className="font-black text-[#ba4d41]">Danger zone</h3>
              <p className="mt-1 text-sm leading-6 text-[#5c6270]">Permanently delete your account and all associated data.</p>
              <Button variant="danger" className="mt-4 !rounded-lg font-black" onClick={handleDeleteAccount}>
                <Trash2 size={16} /> Delete account
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
