import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Database, Github, Check, X, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import { projectsService } from '@/services/projects.service';
import { integrationsService } from '@/services/integrations.service';

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

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
        <Database size={28} className="text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center">Connect Supabase</h3>
      <p className="text-sm text-gray-400 mb-8 text-center">
        Connect your Supabase project to set up the database.
      </p>

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
  });
  const [pushing, setPushing] = useState(false);
  const [repoUrl, setRepoUrl] = useState(null);

  const pushToGithub = async () => {
    if (!config.repoName.trim()) {
      toast.error('Repository name is required');
      return;
    }
    setPushing(true);
    try {
      const res = await integrationsService.pushToGithub(projectId, config);
      setRepoUrl(res.data.url);
      toast.success('Pushed to GitHub!');
    } catch {
      toast.error('Push failed');
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
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Visibility
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setConfig({ ...config, isPrivate: true })}
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
          />
          <Input
            label="Commit Message"
            value={config.commitMessage}
            onChange={(e) => setConfig({ ...config, commitMessage: e.target.value })}
          />
          <Button className="w-full" onClick={pushToGithub} loading={pushing}>
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
  const [activeTab, setActiveTab] = useState('download');

  const tabs = [
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

      {activeTab === 'download' && <DownloadTab projectId={id} />}
      {activeTab === 'supabase' && <SupabaseTab projectId={id} />}
      {activeTab === 'github' && <GithubTab projectId={id} />}
    </div>
  );
}
