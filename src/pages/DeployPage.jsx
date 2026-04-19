import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Download, Database, Github, Check, X, Loader2, ExternalLink, Cloud, Globe, Terminal, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/common';
import { projectsService } from '@/services/projects.service';
import { integrationsService } from '@/services/integrations.service';

// ─── Cloud Deploy Tab ───────────────────────────────────
function CloudDeployTab({ projectId }) {
  const [subdomain, setSubdomain] = useState('');
  const [target, setTarget] = useState('production');
  const [deploying, setDeploying] = useState(false);
  const [step, setStep] = useState(0); // 0 = setup, 1 = deploy, 2 = success
  const [logs, setLogs] = useState([]);
  const [deployedUrl, setDeployedUrl] = useState(null);
  const logsEndRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-fill subdomain based on project name hash or just let user type
  useEffect(() => {
    // Basic random name
    setSubdomain(`store-${Math.random().toString(36).substring(2, 7)}`);
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (step === 1) {
      const socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000', {
        transports: ['websocket'],
      });
      socketRef.current = socket;
      
      socket.on('connect', () => {
        socket.emit('join_project', { project_id: projectId });
      });

      socket.on('deployment_log', (data) => {
         setLogs((prev) => [...prev, data.line]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [step, projectId]);

  const handleDeploy = async () => {
    if (!subdomain.trim() || subdomain.length < 3) {
      toast.error('Please enter a valid subdomain (at least 3 characters)');
      return;
    }
    
    setDeploying(true);
    setStep(1);
    setLogs(['Initiating deployment sequence...', 'Allocating Edge resources...', 'Pulling latest code artifacts...']);
    
    try {
      const res = await integrationsService.deployToCloud(projectId, { subdomain, target });
      setDeployedUrl(res.data.url);
      setLogs((prev) => [...prev, 'Deployment successful!', `Live at: ${res.data.url}`]);
      setStep(2);
      toast.success(`Successfully deployed ${target} build to Vercel!`);
    } catch (e) {
      const errMessage = e.response?.data?.detail || 'Deployment failed';
      toast.error(errMessage);
      setLogs((prev) => [...prev, `[ERROR] ${errMessage}`]);
      setStep(0);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {step === 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <Cloud size={28} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Deploy to Vercel</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Deploy every generated project to your connected Vercel account for preview and production URLs.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-6 w-full max-w-md mx-auto shadow-xl">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Choose a Custom Subdomain
              </label>
              <div className="flex w-full bg-[#111] rounded-xl border border-white/10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all overflow-hidden items-center">
                <div className="pl-4 pr-1">
                  <Globe size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="my-awesome-store"
                  className="w-full bg-transparent border-none outline-none text-white text-sm py-3 px-2 font-mono"
                />
                <div className="px-4 py-3 bg-white/5 border-l border-white/10 text-gray-400 text-sm whitespace-nowrap select-none font-mono">
                  .enliven-app.com
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant={target === 'preview' ? 'primary' : 'ghost'}
                className="w-full"
                onClick={() => setTarget('preview')}
              >
                Preview
              </Button>
              <Button
                size="lg"
                variant={target === 'production' ? 'primary' : 'ghost'}
                className="w-full"
                onClick={() => setTarget('production')}
              >
                Production
              </Button>
            </div>

            <Button size="lg" className="w-full" onClick={handleDeploy}>
              <Cloud size={16} /> Deploy to Vercel ({target})
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex items-center justify-center p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Loader2 size={24} className="animate-spin" />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Deploying to Vercel ({target})...</h3>
              <p className="text-sm text-blue-200/60 font-medium">Please do not close this window</p>
            </div>
          </div>
          
          <div className="bg-[#050505] rounded-2xl border border-white/[0.08] flex flex-col relative shadow-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center px-4 py-3 bg-[#111] border-b border-white/[0.05] relative z-20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.4)]"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
              </div>
              <span className="ml-4 text-xs font-semibold tracking-widest text-gray-500 uppercase">Build Terminal</span>
            </div>
            <div className="relative h-[350px] font-mono text-sm">
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div>
              <div className="h-full overflow-y-auto pt-3 pb-8 px-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2">
                {logs.map((log, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    key={i}
                    className={`flex items-start break-words leading-relaxed ${
                      log.includes('[ERROR]') || log.toLowerCase().includes('failed') ? 'text-red-400 font-medium' : 
                      log.includes('successful') || log.includes('SUCCESS') || log.includes('live') ? 'text-emerald-400 font-medium' : 
                      log.startsWith('>') || log.startsWith('!') ? 'text-blue-300' :
                      'text-gray-300'
                    }`}
                  >
                    <span className="text-gray-600 mr-3 select-none mt-0.5">❯</span>
                    <span className="flex-1">{log}</span>
                  </motion.div>
                ))}
                <div ref={logsEndRef} className="h-4" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && deployedUrl && (
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.4, type: "spring" }} className="max-w-md mx-auto py-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-emerald-400/5 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/20 relative">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
              <Check size={36} className="text-emerald-400" />
            </motion.div>
          </div>
          <h3 className="text-3xl font-bold mb-3 text-center text-white tracking-tight">You're Live!</h3>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Your store has been successfully deployed to Vercel.
          </p>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#050505] mb-8 text-center shadow-[0_10px_30px_-10px_rgba(16,185,129,0.15)] relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0 opacity-50"></div>
             <p className="text-xs text-emerald-500/80 uppercase tracking-widest font-bold mb-3 flex items-center justify-center gap-2">
               <Activity size={14} className="text-emerald-400 animate-pulse" /> Production URL
             </p>
             <a 
               href={deployedUrl} 
               target="_blank" 
               rel="noreferrer" 
               className="text-lg font-mono font-medium text-emerald-300 hover:text-emerald-100 transition-colors inline-block break-all bg-emerald-500/10 px-4 py-2 rounded-lg"
             >
               {deployedUrl.replace('https://', '')}
             </a>
          </div>

          <div className="flex gap-4">
             <Button variant="ghost" className="flex-1 border border-white/10 hover:bg-white/5" onClick={() => setStep(0)}>
               Deploy Another
             </Button>
             <Button 
               className="flex-1 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all" 
               onClick={() => window.open(deployedUrl, '_blank')}
             >
               <ExternalLink size={16} /> Visit App
             </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Download Tab ─────────────────────────────────────
function DownloadTab({ projectId }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await projectsService.download(projectId);
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `store-${projectId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch {
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
        <Download size={28} className="text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Download Project</h3>
      <p className="text-sm text-gray-400 mb-6">
        Download the complete project as a ZIP file with README and setup instructions.
      </p>
      <Button size="lg" onClick={handleDownload} loading={downloading}>
        <Download size={16} /> Download ZIP
      </Button>
    </div>
  );
}

// ─── Supabase Tab ─────────────────────────────────────
function SupabaseTab({ projectId }) {
  const [credentials, setCredentials] = useState({ url: '', anonKey: '', serviceRoleKey: '' });
  const [step, setStep] = useState(1);
  const [testing, setTesting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [connected, setConnected] = useState(false);
  const [initScript, setInitScript] = useState('');
  const [loadingScript, setLoadingScript] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      try {
        const res = await integrationsService.getSupabaseStatus(projectId);
        if (!isMounted) {
          return;
        }

        if (res.data?.connected) {
          setConnected(true);
          setStep(2);
          if (res.data.url) {
            setCredentials((prev) => ({ ...prev, url: res.data.url }));
          }
        }
      } catch {
        // Keep the tab interactive even if status lookup fails.
      }
    };

    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  useEffect(() => {
    let mounted = true;
    setLoadingScript(true);
    integrationsService
      .getSupabaseInitScript(projectId)
      .then((res) => {
        if (!mounted) return;
        setInitScript(res.data?.script || '');
      })
      .catch(() => {
        if (!mounted) return;
        setInitScript('');
      })
      .finally(() => {
        if (mounted) setLoadingScript(false);
      });

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const testConnection = async () => {
    setTesting(true);
    try {
      await integrationsService.testSupabaseConnection(projectId, credentials);
      setConnected(true);
      setStep(2);
      toast.success('Connected to Supabase!');
    } catch {
      toast.error('Connection failed. Check your credentials.');
    } finally {
      setTesting(false);
    }
  };

  const runMigrations = async () => {
    setMigrating(true);
    try {
      await integrationsService.runMigrations(projectId, credentials);
      setStep(3);
      toast.success('Migrations completed!');
    } catch {
      toast.error('Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  const copyScript = async () => {
    if (!initScript) return;
    try {
      await navigator.clipboard.writeText(initScript);
      setScriptCopied(true);
      toast.success('SQL init script copied');
      setTimeout(() => setScriptCopied(false), 1500);
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
        <Database size={28} className="text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center">Connect Supabase</h3>
      <p className="text-sm text-gray-400 mb-8 text-center">
        Follow this step-by-step pipeline to connect backend for this project.
      </p>

      <div className="mb-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-200 text-sm">
        Project backend is not fully connected until all steps below are completed.
      </div>

      <div className="space-y-6 mb-8">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center justify-center">1</span>
            <h4 className="font-semibold">Create Supabase project</h4>
          </div>
          <p className="text-sm text-gray-400 ml-8">
            Go to Supabase dashboard, create a new project, wait for it to finish provisioning.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center justify-center">2</span>
            <h4 className="font-semibold">Copy API keys and URL</h4>
          </div>
          <p className="text-sm text-gray-400 ml-8 mb-2">
            In Supabase: Project Settings → API.
          </p>
          <ul className="ml-12 list-disc text-sm text-gray-400 space-y-1">
            <li>Project URL</li>
            <li>anon/public key</li>
            <li>service_role key (keep secret)</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center justify-center">3</span>
            <h4 className="font-semibold">Run initialization SQL script</h4>
          </div>
          <p className="text-sm text-gray-400 ml-8 mb-3">
            Open Supabase SQL Editor, paste the script below, and run it.
          </p>

          <div className="ml-8 rounded-xl border border-white/10 bg-[#080808] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <span className="text-xs text-gray-400">ASEA Supabase init script</span>
              <button
                onClick={copyScript}
                disabled={!initScript}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-white/15 text-gray-200 hover:bg-white/10 disabled:opacity-50"
              >
                {scriptCopied ? <Check size={12} /> : <Terminal size={12} />}
                {scriptCopied ? 'Copied' : 'Copy Script'}
              </button>
            </div>
            <pre className="max-h-72 overflow-auto p-3 text-[11px] leading-relaxed text-gray-300 whitespace-pre-wrap">
              {loadingScript ? 'Loading script...' : (initScript || 'Script not available. Ensure supabasescript.txt exists in project root.')}
            </pre>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center justify-center">4</span>
            <h4 className="font-semibold">Connect keys below and verify</h4>
          </div>
          <p className="text-sm text-gray-400 ml-8">
            Fill credentials and click Test Connection. Then run migrations.
          </p>
        </div>
      </div>

      {step >= 1 && (
        <div className="space-y-4 mb-6">
          <Input
            label="Supabase Project URL"
            placeholder="https://xxxxx.supabase.co"
            value={credentials.url}
            onChange={(e) => setCredentials({ ...credentials, url: e.target.value })}
            disabled={connected}
          />
          <Input
            label="Anon Key"
            placeholder="eyJhbGci..."
            value={credentials.anonKey}
            onChange={(e) => setCredentials({ ...credentials, anonKey: e.target.value })}
            disabled={connected}
          />
          <Input
            label="Service Role Key"
            type="password"
            placeholder="eyJhbGci..."
            value={credentials.serviceRoleKey}
            onChange={(e) => setCredentials({ ...credentials, serviceRoleKey: e.target.value })}
            disabled={connected}
          />
          {!connected && (
            <Button className="w-full" onClick={testConnection} loading={testing}>
              Test Connection
            </Button>
          )}
          {connected && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <Check size={16} /> Connected
            </div>
          )}
        </div>
      )}

      {step >= 2 && (
        <div className="border-t border-white/10 pt-6">
          <Button className="w-full" onClick={runMigrations} loading={migrating}>
            Run Migrations
          </Button>
        </div>
      )}

      {step >= 3 && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-2">
          <Check size={16} /> Database is ready!
        </div>
      )}
    </div>
  );
}

// ─── GitHub Tab ───────────────────────────────────────
function GithubTab({ projectId }) {
  const [config, setConfig] = useState({
    repoName: '',
    isPrivate: true,
    branch: 'main',
    commitMessage: 'Initial commit from ASEA',
    owner: '',
  });
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connected, setConnected] = useState(false);
  const [githubUser, setGithubUser] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [repoUrl, setRepoUrl] = useState(null);

  const refreshGithubStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await integrationsService.getGithubStatus(projectId);
      const isConnected = Boolean(res.data?.connected);
      const username = res.data?.username || '';
      setConnected(isConnected);
      setGithubUser(username);
      if (isConnected && username) {
        setConfig((prev) => ({ ...prev, owner: prev.owner || username }));
      }
    } catch {
      setConnected(false);
      setGithubUser('');
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadOrgs = async () => {
    setLoadingOrgs(true);
    try {
      const res = await integrationsService.getGithubOrgs(projectId);
      setOrgs(Array.isArray(res.data?.orgs) ? res.data.orgs : []);
    } catch {
      setOrgs([]);
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    refreshGithubStatus();
  }, [projectId]);

  useEffect(() => {
    if (!connected || !projectId) return;
    loadOrgs();
  }, [connected, projectId]);

  const connectGithub = async () => {
    setConnecting(true);
    try {
      const res = await integrationsService.getGithubOauthUrl(projectId);
      const authUrl = res.data?.auth_url;
      if (!authUrl) throw new Error('Missing authorization URL');
      window.location.assign(authUrl);
    } catch {
      toast.error('Failed to start GitHub OAuth');
      setConnecting(false);
    }
  };

  const pushToGithub = async () => {
    if (!connected) {
      toast.error('Connect your GitHub account first');
      return;
    }
    if (!config.repoName.trim()) {
      toast.error('Repository name is required');
      return;
    }
    setPushing(true);
    try {
      const res = await integrationsService.pushToGithub(projectId, config);
      setRepoUrl(res.data.url);
      toast.success('Pushed to GitHub!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Push failed');
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
        <Github size={28} className="text-purple-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center">Push to GitHub</h3>
      <p className="text-sm text-gray-400 mb-8 text-center">
        Create a new repository and push your generated store.
      </p>

      {loadingStatus ? (
        <div className="mb-6 p-3 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 flex items-center justify-center gap-2">
          <Loader2 size={14} className="animate-spin" /> Checking GitHub connection...
        </div>
      ) : connected ? (
        <div className="mb-6 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-300 flex items-center justify-center gap-2">
          <Check size={14} /> Connected as @{githubUser}
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-200">
          <p className="mb-3">Sign in with GitHub to create repositories from your project.</p>
          <Button className="w-full" onClick={connectGithub} loading={connecting}>
            <Github size={16} /> Sign in with GitHub
          </Button>
        </div>
      )}

      {repoUrl ? (
        <div className="text-center space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center justify-center gap-2">
            <Check size={16} /> Successfully pushed!
          </div>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ExternalLink size={14} /> View Repository
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Repository Name"
            placeholder="my-store"
            value={config.repoName}
            onChange={(e) => setConfig({ ...config, repoName: e.target.value })}
            disabled={!connected}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Owner</label>
            <select
              value={config.owner}
              onChange={(e) => setConfig({ ...config, owner: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/40"
              disabled={!connected || loadingOrgs}
            >
              {githubUser && (
                <option value={githubUser}>{githubUser} (personal)</option>
              )}
              {orgs.map((org) => (
                <option key={org.id} value={org.login}>
                  {org.login} (organization)
                </option>
              ))}
            </select>
            {connected && loadingOrgs && (
              <p className="mt-1 text-xs text-gray-500">Loading organizations...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Visibility
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setConfig({ ...config, isPrivate: true })}
                disabled={!connected}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                  config.isPrivate
                    ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                Private
              </button>
              <button
                onClick={() => setConfig({ ...config, isPrivate: false })}
                disabled={!connected}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                  !config.isPrivate
                    ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                Public
              </button>
            </div>
          </div>
          <Input
            label="Branch"
            value={config.branch}
            onChange={(e) => setConfig({ ...config, branch: e.target.value })}
            disabled={!connected}
          />
          <Input
            label="Commit Message"
            value={config.commitMessage}
            onChange={(e) => setConfig({ ...config, commitMessage: e.target.value })}
            disabled={!connected}
          />
          <Button className="w-full" onClick={pushToGithub} loading={pushing} disabled={!connected}>
            <Github size={16} /> Push to GitHub
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Deploy Page ──────────────────────────────────────
export default function DeployPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(initialTab || 'cloud');

  const tabs = [
    { id: 'cloud', label: 'ASEA Cloud', icon: Cloud },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'supabase', label: 'Supabase', icon: Database },
    { id: 'github', label: 'GitHub', icon: Github },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Deploy</h1>

      {/* Tabs */}
      <div className="flex rounded-xl border border-white/10 overflow-hidden mb-8">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors
              ${activeTab === tabId
                ? 'bg-white/10 text-white'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'cloud' && <CloudDeployTab projectId={id} />}
      {activeTab === 'download' && <DownloadTab projectId={id} />}
      {activeTab === 'supabase' && <SupabaseTab projectId={id} />}
      {activeTab === 'github' && <GithubTab projectId={id} />}
    </div>
  );
}
