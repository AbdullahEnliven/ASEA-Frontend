import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Github, Layers3, LockKeyhole, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import useAuthStore from '@/store/auth.store';
import { authService } from '@/services/auth.service';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const inputClass =
  '!rounded-lg !border-[#d8d0c0] !bg-white px-4 py-3 !text-[#10131b] placeholder:!text-[#9a9387] focus:!border-[#0f766e] focus:!ring-[#0f766e]/20';
const labelClass = 'font-black text-[#343945]';
const errorClass = 'text-[#ba4d41]';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data);
      login(res.data.user, res.data.token);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg = 'Login failed';
      if (typeof detail === 'string') msg = detail;
      else if (Array.isArray(detail)) msg = detail.map((d) => d.msg).join(', ');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubOAuth = () => {
    if (loading) return;
    setLoading(true);
    authService
      .getGithubOAuthUrl('login')
      .then((res) => {
        const authUrl = res.data?.auth_url;
        if (!authUrl) throw new Error('Missing authorization URL');
        window.location.assign(authUrl);
      })
      .catch(() => {
        setLoading(false);
        toast.error('GitHub login is not configured');
      });
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] px-5 py-8 text-[#10131b] sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-[0_24px_80px_rgba(22,24,31,0.1)] lg:grid-cols-[1fr_0.9fr]">
        <aside className="relative hidden min-h-full overflow-hidden bg-[#10131b] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <img
            src="/assets/asea-hero-studio.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(16,19,27,0.98)_0%,rgba(16,19,27,0.82)_46%,rgba(15,118,110,0.38)_100%)]" />

          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#10131b]">
                <Layers3 className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-tight">ASEA</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-[#aee9de]">commerce build room</span>
              </span>
            </Link>
          </div>

          <div className="relative max-w-xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#f2b84b]">Welcome back</p>
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              Continue shaping the store your team can own.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/68">
              Pick up your storefront, generated schema, admin tools, and deployment path in the same focused workspace.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {['Storefront', 'Admin', 'Export'].map((item) => (
              <div key={item} className="rounded-lg border border-white/12 bg-white/8 p-4 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">{item}</p>
                <p className="mt-3 text-sm font-black text-white">Ready</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10131b] text-white">
                <Layers3 className="h-5 w-5" />
              </span>
              <span className="text-xl font-black tracking-tight">ASEA</span>
            </Link>

            <div className="mb-9">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">Sign in</p>
              <h2 className="text-4xl font-black tracking-tight text-[#10131b]">Welcome back.</h2>
              <p className="mt-3 text-sm leading-6 text-[#5c6270]">
                Access your projects, previews, code exports, and launch settings.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                className={inputClass}
                labelClassName={labelClass}
                errorClassName={errorClass}
                rightElement={<Mail className="h-4 w-4 text-[#8b8174]" />}
                {...register('email')}
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                className={inputClass}
                labelClassName={labelClass}
                errorClassName={errorClass}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[#8b8174] transition hover:text-[#10131b]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex cursor-pointer items-center gap-2 font-bold text-[#5c6270]">
                  <input type="checkbox" className="rounded border-[#cfc6b6] bg-white text-[#0f766e] focus:ring-[#0f766e]/30" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="font-black text-[#0f766e] hover:text-[#0a514c]">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full !rounded-lg !bg-[#10131b] py-4 font-black !text-white hover:!bg-[#253044]"
                loading={loading}
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d8d0c0]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#fffaf0] px-3 font-bold text-[#8b8174]">or continue with GitHub</span>
              </div>
            </div>

            <div>
              <Button
                variant="secondary"
                className="w-full !rounded-lg !border-[#d8d0c0] !bg-white py-3 font-black !text-[#10131b] hover:!bg-[#f6f1e8]"
                onClick={handleGithubOAuth}
                disabled={loading}
              >
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>

            <p className="mt-8 text-center text-sm font-bold text-[#5c6270]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-black text-[#0f766e] hover:text-[#0a514c]">
                Create workspace
              </Link>
            </p>

            <div className="mt-8 rounded-lg border border-[#d8d0c0] bg-[#f7f2e8] p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
                  <LockKeyhole className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-[#5c6270]">
                  Your generated projects, auth tokens, and export settings stay protected inside your ASEA workspace.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
