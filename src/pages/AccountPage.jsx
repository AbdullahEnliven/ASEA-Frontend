import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Building2, CheckCircle2, Globe2, Lock, Target, Trash2, UserRound } from 'lucide-react';
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
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your identity, business details, and workspace preferences.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-gray-400">Profile completion</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 w-40 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${profileCompletion}%` }} />
            </div>
            <span className="text-sm font-semibold">{profileCompletion}%</span>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold">
            {(user?.name || user?.full_name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.name || user?.full_name || 'User'}</p>
            <p className="text-sm text-gray-400">{user?.email || 'No email'}</p>
            <p className="mt-1 text-xs text-gray-500">{user?.plan || 'free'} plan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(updateProfile)} className="space-y-8">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <UserRound size={16} className="text-blue-400" /> Personal
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" error={errors.full_name?.message} {...register('full_name')} />
              <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
              <Input label="Country" error={errors.country?.message} {...register('country')} />
              <Input label="Website" placeholder="https://yourstore.com" error={errors.website?.message} {...register('website')} />
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Building2 size={16} className="text-blue-400" /> Business
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Business / Brand Name" error={errors.company_name?.message} {...register('company_name')} />
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
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <Target size={16} className="text-blue-400" /> Store Goals
            </div>
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
              <Input label="Referral Source" {...register('referral_source')} />
            </div>
          </div>

          <Button type="submit" loading={saving}>
            <CheckCircle2 size={16} /> Save Profile
          </Button>
        </form>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Lock size={18} className="text-blue-400" /> Security
          </div>
          <form onSubmit={handlePasswordSubmit(changePassword)} className="space-y-4">
            <Input label="Current Password" type="password" error={passwordErrors.currentPassword?.message} {...registerPassword('currentPassword')} />
            <Input label="New Password" type="password" error={passwordErrors.newPassword?.message} {...registerPassword('newPassword')} />
            <Input label="Confirm New Password" type="password" error={passwordErrors.confirmPassword?.message} {...registerPassword('confirmPassword')} />
            <Button type="submit" variant="secondary" loading={passwordSaving}>Change Password</Button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Globe2 size={18} className="text-blue-400" /> Workspace
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <p>Plan: <span className="text-white">{user?.plan || 'free'}</span></p>
            <p>Verified: <span className="text-white">{user?.is_verified ? 'Yes' : 'No'}</span></p>
            <p>Onboarding: <span className="text-white">{user?.onboarding_completed ? 'Completed' : 'Incomplete'}</span></p>
          </div>
          <div className="mt-6 border-t border-red-500/20 pt-5">
            <h3 className="font-semibold text-red-400">Danger Zone</h3>
            <p className="mt-1 text-sm text-gray-400">Permanently delete your account and all associated data.</p>
            <Button variant="danger" className="mt-4" onClick={handleDeleteAccount}>
              <Trash2 size={16} /> Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
