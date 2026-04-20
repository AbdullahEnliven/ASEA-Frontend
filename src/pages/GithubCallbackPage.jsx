import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { integrationsService } from '@/services/integrations.service';

function decodeOAuthState(state) {
  try {
    const normalized = state.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function decodeJwtPayload(state = '') {
  try {
    const parts = state.split('.');
    if (parts.length < 2) return null;
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function GithubCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const calledRef = useRef(false);

  useEffect(() => {
    const finishOAuth = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      const error = searchParams.get('error');
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (error) {
        toast.error('GitHub authorization was cancelled or denied');
        navigate('/dashboard', { replace: true });
        return;
      }

      if (!code || !state) {
        toast.error('Invalid GitHub callback payload');
        navigate('/login', { replace: true });
        return;
      }

      const integrationPayload = decodeOAuthState(state);
      const projectId = integrationPayload?.project_id;

      if (projectId) {
        try {
          await integrationsService.connectGithub(projectId, { code, state });
          toast.success('GitHub connected successfully');
          navigate(`/projects/${projectId}/deploy?tab=github&gh=connected`, { replace: true });
        } catch (err) {
          toast.error(err.response?.data?.detail || 'Failed to connect GitHub');
          navigate(`/projects/${projectId}/deploy?tab=github`, { replace: true });
        }
        return;
      }

      const authPayload = decodeJwtPayload(state);
      const source = authPayload?.src === 'register' ? 'register' : 'login';
      try {
        const res = await authService.exchangeGithubOAuthCode(code, state);
        login(res.data.user, res.data.token);
        toast.success('Signed in with GitHub');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        toast.error(err.response?.data?.detail || 'GitHub sign in failed');
        navigate(source === 'register' ? '/register' : '/login', { replace: true });
      }
    };

    finishOAuth();
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-white/10 bg-white/5 mb-4">
          <Loader2 size={28} className="animate-spin text-blue-400" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Connecting GitHub</h1>
        <p className="text-sm text-gray-400">Completing OAuth sign in...</p>
      </div>
    </div>
  );
}
