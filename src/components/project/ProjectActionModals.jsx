import { createElement, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ExternalLink, Github, Globe, Loader2, Rocket, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/common';
import { integrationsService } from '@/services/integrations.service';

const sanitizeSlug = (value = '') => {
  const plainValue = String(value)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .split('.')[0];

  return plainValue
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const modalSizeClass = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

function ProjectActionDialog({
  open,
  onClose,
  title,
  eyebrow,
  description,
  icon,
  children,
  size = 'md',
  closeDisabled = false,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !closeDisabled) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDisabled, onClose, open]);

  const dialog = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
          <Motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 cursor-default bg-[#10131b]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!closeDisabled) onClose();
            }}
          />
          <Motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-action-dialog-title"
            className={`relative w-full ${modalSizeClass[size]} overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] text-[#10131b] shadow-[0_32px_90px_rgba(16,19,27,0.34)]`}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-b border-[#d8d0c0] bg-[#f6f1e8] px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#10131b] text-[#f6c453] shadow-[0_14px_30px_rgba(16,19,27,0.18)]">
                  {createElement(icon, { size: 20 })}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#007f75]">{eyebrow}</p>
                  <h2 id="project-action-dialog-title" className="mt-1 text-xl font-black tracking-tight">
                    {title}
                  </h2>
                  {description && <p className="mt-1 text-sm font-semibold leading-6 text-[#5d6472]">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={closeDisabled}
                  className="rounded-lg border border-[#d8d0c0] bg-white p-2 text-[#6f766f] transition hover:border-[#10131b] hover:text-[#10131b] disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="max-h-[72vh] overflow-y-auto px-5 py-5">{children}</div>
          </Motion.section>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') {
    return dialog;
  }

  return createPortal(dialog, document.body);
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#6f766f]">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs font-semibold leading-5 text-[#8b8174]">{hint}</span>}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      className="w-full rounded-lg border border-[#d8d0c0] bg-white px-3 py-2.5 text-sm font-bold text-[#10131b] outline-none transition placeholder:text-[#a9a094] focus:border-[#007f75] focus:ring-2 focus:ring-[#007f75]/15 disabled:cursor-not-allowed disabled:bg-[#f6f1e8] disabled:text-[#8b8174]"
      {...props}
    />
  );
}

function SegmentButton({ active, children, ...props }) {
  return (
    <button
      type="button"
      className={`flex-1 rounded-md px-3 py-2 text-sm font-black transition ${
        active
          ? 'bg-[#10131b] text-white shadow-sm'
          : 'text-[#5d6472] hover:bg-white hover:text-[#10131b]'
      } disabled:cursor-not-allowed disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProjectDeployModal({ open, onClose, project, onDeployed }) {
  const [target, setTarget] = useState('production');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainError, setSubdomainError] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');

  useEffect(() => {
    if (!open) return;

    setSubdomain((current) => current || sanitizeSlug(project?.name || '') || 'my-store');
    setSubdomainError('');
  }, [open, project?.name]);

  const fallbackSubdomain = sanitizeSlug(project?.name || '') || `store-${String(project?.id || '').slice(0, 6)}`;
  const previewUrl = `${sanitizeSlug(subdomain) || fallbackSubdomain}.vercel.app`;

  const handleDeploy = async () => {
    if (!project?.id) return;

    const sanitized = sanitizeSlug(subdomain) || fallbackSubdomain;
    if (!sanitized || sanitized.length < 3) {
      setSubdomainError('Use at least 3 characters: letters, numbers, or hyphens.');
      return;
    }

    setDeploying(true);
    setSubdomainError('');
    try {
      const deployRequest =
        target === 'preview'
          ? integrationsService.deployPreviewToVercel(project.id, { subdomain: sanitized })
          : integrationsService.deployProductionToVercel(project.id, { subdomain: sanitized });
      const res = await deployRequest;
      const url = res.data?.url || res.data?.production_url || res.data?.preview_url || '';
      setDeployedUrl(url);
      onDeployed?.(url);
      toast.success('Virtual deployment complete');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to deploy');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <ProjectActionDialog
      open={open}
      onClose={onClose}
      closeDisabled={deploying}
      title="Virtual deployment"
      eyebrow="Deploy"
      description="Adjust the launch settings, then deploy this project to its virtual hosted environment."
      icon={Rocket}
      size="md"
    >
      <div className="space-y-5">
        <Field label="Target">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] p-1">
            <SegmentButton active={target === 'preview'} onClick={() => setTarget('preview')} disabled={deploying}>
              Preview
            </SegmentButton>
            <SegmentButton active={target === 'production'} onClick={() => setTarget('production')} disabled={deploying}>
              Production
            </SegmentButton>
          </div>
        </Field>

        <Field label="Virtual URL" hint={`Preview: ${previewUrl}`}>
          <div className="flex overflow-hidden rounded-lg border border-[#d8d0c0] bg-white focus-within:border-[#007f75] focus-within:ring-2 focus-within:ring-[#007f75]/15">
            <div className="flex items-center px-3 text-[#8b8174]">
              <Globe size={16} />
            </div>
            <input
              value={subdomain}
              onChange={(event) => {
                setSubdomain(sanitizeSlug(event.target.value));
                setSubdomainError('');
              }}
              placeholder="my-store"
              disabled={deploying}
              className="min-w-0 flex-1 bg-transparent py-2.5 pr-2 text-sm font-bold text-[#10131b] outline-none placeholder:text-[#a9a094]"
            />
            <span className="border-l border-[#d8d0c0] bg-[#f6f1e8] px-3 py-2.5 text-xs font-black text-[#8b8174]">
              .vercel.app
            </span>
          </div>
          {subdomainError && <p className="mt-2 text-xs font-bold text-[#ba4d41]">{subdomainError}</p>}
        </Field>

        {deployedUrl && (
          <div className="rounded-lg border border-[#b8ded5] bg-[#dff7f1] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-[#0f766e] p-1 text-white">
                <Check size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-[#0f766e]">Deployment ready</p>
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-bold text-[#10131b] hover:text-[#007f75]"
                >
                  {deployedUrl}
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="!rounded-lg !border-[#d8d0c0] !bg-white !font-black !text-[#10131b] hover:!bg-[#f6f1e8]"
            onClick={onClose}
            disabled={deploying}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!rounded-lg !border-[#10131b] !bg-[#10131b] !font-black !text-white hover:!bg-[#007f75]"
            onClick={handleDeploy}
            loading={deploying}
          >
            <Rocket size={16} />
            {deploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </div>
      </div>
    </ProjectActionDialog>
  );
}

export function ProjectGithubModal({ open, onClose, project }) {
  const [config, setConfig] = useState({
    repoName: '',
    isPrivate: true,
    branch: 'main',
    commitMessage: 'Initial commit from ASEA',
    owner: '',
  });
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [connected, setConnected] = useState(false);
  const [githubUser, setGithubUser] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    if (!project?.name) return;
    setConfig((current) => ({
      ...current,
      repoName: current.repoName || sanitizeSlug(project.name) || 'my-store',
    }));
  }, [project?.name]);

  const refreshGithubStatus = useCallback(async () => {
    if (!project?.id) return;

    setLoadingStatus(true);
    try {
      const res = await integrationsService.getGithubStatus(project.id);
      const isConnected = Boolean(res.data?.connected);
      const username = res.data?.username || '';
      const repo = res.data?.repo || '';
      const [repoOwner, repoName] = repo.includes('/') ? repo.split('/') : ['', ''];

      setConnected(isConnected);
      setGithubUser(username);
      setRepoUrl(res.data?.url || '');
      setConfig((current) => ({
        ...current,
        owner: current.owner || repoOwner || username,
        repoName: current.repoName || repoName || sanitizeSlug(project?.name || ''),
        branch: res.data?.branch || current.branch,
      }));
    } catch {
      setConnected(false);
      setGithubUser('');
      setRepoUrl('');
    } finally {
      setLoadingStatus(false);
    }
  }, [project?.id, project?.name]);

  const loadOrgs = useCallback(async () => {
    if (!project?.id) return;

    setLoadingOrgs(true);
    try {
      const res = await integrationsService.getGithubOrgs(project.id);
      setOrgs(Array.isArray(res.data?.orgs) ? res.data.orgs : []);
    } catch {
      setOrgs([]);
    } finally {
      setLoadingOrgs(false);
    }
  }, [project?.id]);

  useEffect(() => {
    if (!open || !project?.id) return;
    refreshGithubStatus();
  }, [open, project?.id, refreshGithubStatus]);

  useEffect(() => {
    if (!open || !connected) return;
    loadOrgs();
  }, [connected, loadOrgs, open]);

  const connectGithub = async () => {
    if (!project?.id) return;

    setConnecting(true);
    try {
      const res = await integrationsService.getGithubOauthUrl(project.id);
      const authUrl = res.data?.auth_url;
      if (!authUrl) throw new Error('Missing authorization URL');
      window.location.assign(authUrl);
    } catch {
      toast.error('Failed to start GitHub OAuth');
      setConnecting(false);
    }
  };

  const pushToGithub = async () => {
    if (!project?.id) return;
    if (!connected) {
      toast.error('Connect GitHub first');
      return;
    }
    if (!config.repoName.trim()) {
      toast.error('Repository name is required');
      return;
    }

    setPushing(true);
    try {
      const res = await integrationsService.pushToGithub(project.id, config);
      setRepoUrl(res.data?.url || '');
      toast.success('Pushed to GitHub');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Push failed');
    } finally {
      setPushing(false);
    }
  };

  return (
    <ProjectActionDialog
      open={open}
      onClose={onClose}
      closeDisabled={connecting || pushing}
      title="Connect to GitHub"
      eyebrow="Repository"
      description="Authorize GitHub, choose repository settings, and push the generated project from this workspace."
      icon={Github}
      size="lg"
    >
      <div className="space-y-5">
        {loadingStatus ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-[#d8d0c0] bg-white p-4 text-sm font-black text-[#5d6472]">
            <Loader2 size={16} className="animate-spin text-[#007f75]" />
            Checking GitHub connection...
          </div>
        ) : connected ? (
          <div className="flex items-center gap-3 rounded-lg border border-[#b8ded5] bg-[#dff7f1] p-4 text-sm font-black text-[#0f766e]">
            <Check size={16} />
            Connected as @{githubUser}
          </div>
        ) : (
          <div className="rounded-lg border border-[#e7c975] bg-[#fff2cb] p-4">
            <p className="text-sm font-bold leading-6 text-[#8a5d00]">
              Connect your GitHub account to create or update a repository for this project.
            </p>
            <Button
              type="button"
              className="mt-4 w-full !rounded-lg !border-[#10131b] !bg-[#10131b] !font-black !text-white hover:!bg-[#007f75]"
              onClick={connectGithub}
              loading={connecting}
            >
              <Github size={16} />
              Connect to GitHub
            </Button>
          </div>
        )}

        {repoUrl && (
          <div className="rounded-lg border border-[#b8ded5] bg-white p-4">
            <p className="text-sm font-black text-[#0f766e]">Repository ready</p>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-bold text-[#10131b] hover:text-[#007f75]"
            >
              {repoUrl}
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Repository name">
            <TextInput
              value={config.repoName}
              onChange={(event) => setConfig({ ...config, repoName: sanitizeSlug(event.target.value) })}
              placeholder="my-store"
              disabled={!connected || pushing}
            />
          </Field>

          <Field label="Owner">
            <select
              value={config.owner}
              onChange={(event) => setConfig({ ...config, owner: event.target.value })}
              disabled={!connected || loadingOrgs || pushing}
              className="w-full rounded-lg border border-[#d8d0c0] bg-white px-3 py-2.5 text-sm font-bold text-[#10131b] outline-none transition focus:border-[#007f75] focus:ring-2 focus:ring-[#007f75]/15 disabled:cursor-not-allowed disabled:bg-[#f6f1e8] disabled:text-[#8b8174]"
            >
              {!githubUser && <option value="">Connect first</option>}
              {githubUser && <option value={githubUser}>{githubUser} (personal)</option>}
              {orgs.map((org) => (
                <option key={org.id} value={org.login}>
                  {org.login} (organization)
                </option>
              ))}
            </select>
            {connected && loadingOrgs && <p className="mt-2 text-xs font-semibold text-[#8b8174]">Loading organizations...</p>}
          </Field>
        </div>

        <Field label="Visibility">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] p-1">
            <SegmentButton
              active={config.isPrivate}
              onClick={() => setConfig({ ...config, isPrivate: true })}
              disabled={!connected || pushing}
            >
              Private
            </SegmentButton>
            <SegmentButton
              active={!config.isPrivate}
              onClick={() => setConfig({ ...config, isPrivate: false })}
              disabled={!connected || pushing}
            >
              Public
            </SegmentButton>
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Branch">
            <TextInput
              value={config.branch}
              onChange={(event) => setConfig({ ...config, branch: event.target.value })}
              disabled={!connected || pushing}
            />
          </Field>

          <Field label="Commit message">
            <TextInput
              value={config.commitMessage}
              onChange={(event) => setConfig({ ...config, commitMessage: event.target.value })}
              disabled={!connected || pushing}
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="!rounded-lg !border-[#d8d0c0] !bg-white !font-black !text-[#10131b] hover:!bg-[#f6f1e8]"
            onClick={onClose}
            disabled={connecting || pushing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="!rounded-lg !border-[#10131b] !bg-[#10131b] !font-black !text-white hover:!bg-[#007f75]"
            onClick={pushToGithub}
            loading={pushing}
            disabled={!connected}
          >
            <Github size={16} />
            {pushing ? 'Pushing...' : 'Push to GitHub'}
          </Button>
        </div>
      </div>
    </ProjectActionDialog>
  );
}
