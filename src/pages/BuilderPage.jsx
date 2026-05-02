import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Pencil,
  Code2,
  Undo2,
  Redo2,
  Save,
  Rocket,
  FileText,
  FolderTree,
  Image,
  Loader2,
  Copy,
  Download,
  Database,
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  File as FileIcon,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import useBuilderStore from '@/store/builder.store';
import useProjectsStore from '@/store/projects.store';
import { projectsService } from '@/services/projects.service';
import { integrationsService } from '@/services/integrations.service';
import useAuthStore from '@/store/auth.store';
import { DEVICE_WIDTHS } from '@/constants';
import { Button } from '@/components/common';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

// --- Toolbar ------------------------------------------
function BuilderToolbar({ deployedUrl, setDeployedUrl }) {
  const {
    deviceMode,
    setDeviceMode,
    editMode,
    setEditMode,
    viewMode,
    setViewMode,
  } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);
  const [downloading, setDownloading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [customSubdomain, setCustomSubdomain] = useState('');
  const [subdomainError, setSubdomainError] = useState('');
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [checkingSupabase, setCheckingSupabase] = useState(false);
  const activeProjectSupabaseConnected = Boolean(
    activeProject?.supabase_connected ?? activeProject?.supabaseConnected
  );

  const devices = [
    { mode: 'desktop', icon: Monitor },
    { mode: 'tablet', icon: Tablet },
    { mode: 'mobile', icon: Smartphone },
  ];

  const sanitizeSubdomain = useCallback((value = '') => {
    const plainValue = String(value)
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .split('.')[0];
    return plainValue
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  useEffect(() => {
    if (!activeProject?.name) return;
    setCustomSubdomain((current) => {
      if (current.trim()) return current;
      return sanitizeSubdomain(activeProject.name) || 'my-store';
    });
  }, [activeProject?.name, sanitizeSubdomain]);

  useEffect(() => {
    if (!activeProject?.id) return;
    let mounted = true;
    setSupabaseConnected(activeProjectSupabaseConnected);
    setCheckingSupabase(true);
    integrationsService
      .getSupabaseStatus(activeProject.id)
      .then((res) => {
        if (!mounted) return;
        setSupabaseConnected(Boolean(res.data?.connected));
      })
      .catch(() => {
        if (!mounted) return;
        setSupabaseConnected(activeProjectSupabaseConnected);
      })
      .finally(() => {
        if (mounted) setCheckingSupabase(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeProject?.id, activeProjectSupabaseConnected]);

  const handleDownloadCode = async () => {
    if (!activeProject?.id) return;
    setDownloading(true);
    try {
      const res = await projectsService.download(activeProject.id);
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeProject.name || 'project'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch {
      toast.error('Failed to download code');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeploy = async () => {
    if (!activeProject?.id) return;
    const sanitized =
      sanitizeSubdomain(customSubdomain) ||
      sanitizeSubdomain(activeProject?.name || '') ||
      `store-${String(activeProject.id).slice(0, 6)}`;
    if (!sanitized || sanitized.length < 3) {
      setSubdomainError('Please enter at least 3 characters (letters, numbers, hyphens).');
      return;
    }

    setDeploying(true);
    setSubdomainError('');
    try {
      const res = await integrationsService.deployProductionToVercel(activeProject.id, { subdomain: sanitized });
      const url = res.data?.url || '';
      setDeployedUrl(url);
      setDeployModalOpen(false);
      toast.success('Deployed successfully');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      toast.error('Failed to deploy');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="flex h-16 items-center justify-between gap-4 border-b border-[#d8d0c0] bg-[#fffaf0]/95 px-4 text-[#10131b] shadow-[0_10px_32px_rgba(16,19,27,0.08)] backdrop-blur">
      <div className="flex min-w-[300px] items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8d0c0] bg-[#10131b] text-sm font-black text-[#f6c453] shadow-[0_12px_24px_rgba(16,19,27,0.16)]">
          A
        </div>
        <div className="flex flex-col">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg p-1 -ml-1 transition-colors hover:bg-[#efe6d6]">
            <span className="max-w-[230px] truncate text-sm font-black leading-tight tracking-[-0.01em]">
              {activeProject?.name || 'Untitled Store'}
            </span>
            <ChevronDown size={14} className="text-[#8b8174]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#007f75]">Launch workspace</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2">
         {/* Top middle controls akin to Lovable */}
         <div className="flex rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] p-1 shadow-inner">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black transition-colors ${viewMode === 'preview' ? 'bg-[#10131b] text-white shadow-sm' : 'text-[#5d6472] hover:bg-white hover:text-[#10131b]'}`}
            >
              <Eye size={14} /> Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-black transition-colors ${viewMode === 'code' ? 'bg-[#10131b] text-white shadow-sm' : 'text-[#5d6472] hover:bg-white hover:text-[#10131b]'}`}
            >
              <Code2 size={14} /> Code
            </button>
         </div>

         {/* Device toggles placed central */}
         {viewMode === 'preview' && (
           <div className="ml-3 flex rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] p-1 shadow-inner">
             {devices.map(({ mode, icon: Icon }) => (
               <button
                 key={mode}
                 onClick={() => setDeviceMode(mode)}
                 className={`rounded-md p-1.5 px-3 transition-colors ${deviceMode === mode ? 'bg-white text-[#10131b] shadow-sm' : 'text-[#8b8174] hover:bg-white hover:text-[#10131b]'}`}
                 title={mode}
               >
                 <Icon size={14} />
               </button>
             ))}
             <button
               onClick={() => setEditMode(!editMode)}
               className={`ml-1 border-l border-[#d8d0c0] p-1.5 px-3 transition-colors ${editMode ? 'text-[#007f75]' : 'text-[#8b8174] hover:text-[#10131b]'}`}
               title="Visual Edit Mode"
             >
               <Pencil size={14} />
             </button>
           </div>
         )}
      </div>

      <div className="flex items-center gap-3">
        {!checkingSupabase && !supabaseConnected && activeProject?.id && (
          <Link
            to={`/projects/${activeProject.id}/deploy?tab=supabase`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#c8931f]/40 bg-[#fff2cb] px-3 py-1.5 text-[11px] font-black text-[#8a5d00] transition-colors hover:bg-[#ffe8a3]"
            title="Connect backend database"
          >
            <Database size={13} />
            Connect Supabase
          </Link>
        )}
        <button
          onClick={handleDownloadCode}
          disabled={downloading}
          className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-xs font-black text-[#5d6472] transition-colors hover:border-[#d8d0c0] hover:bg-white hover:text-[#10131b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={14} />
          {downloading ? 'Downloading...' : 'Download Code'}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-xs font-black text-[#5d6472] transition-colors hover:border-[#d8d0c0] hover:bg-white hover:text-[#10131b]">
          Share
        </button>
        {activeProject?.id ? (
          <Link
            to={`/projects/${activeProject.id}/deploy?tab=github`}
            className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-xs font-black text-[#5d6472] transition-colors hover:border-[#d8d0c0] hover:bg-white hover:text-[#10131b]"
          >
            GitHub
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="flex cursor-not-allowed items-center gap-1.5 px-2 text-xs font-black text-[#a9a094]"
          >
            GitHub
          </button>
        )}
        <Button variant="secondary" size="sm" className="!border-[#d8d0c0] !bg-white !text-[#10131b] hover:!bg-[#f6f1e8]">
          <Rocket size={13} className="text-[#007f75]" /> Upgrade
        </Button>
        <div className="flex items-center">
          <Button
            size="sm"
            className="!border-[#10131b] !bg-[#10131b] !text-white hover:!bg-[#007f75]"
            onClick={() => {
              setSubdomainError('');
              setDeployModalOpen(true);
            }}
            loading={deploying}
          >
            <Rocket size={13} />
            {deploying ? 'Deploying...' : 'Deploy'}
          </Button>
        </div>
      </div>

      {deployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              if (!deploying) setDeployModalOpen(false);
            }}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-[#d8d0c0] bg-[#fffaf0] p-5 text-[#10131b] shadow-2xl">
            <h3 className="text-base font-black">Choose your custom URL</h3>
            <p className="mt-1 text-xs text-[#5d6472]">
              Pick a Vercel subdomain. If left empty, we use your store name.
            </p>

            <div className="mt-4 flex items-center overflow-hidden rounded-xl border border-[#d8d0c0] bg-white">
              <input
                value={customSubdomain}
                onChange={(e) => {
                  setCustomSubdomain(sanitizeSubdomain(e.target.value));
                  setSubdomainError('');
                }}
                placeholder="my-awesome-store"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-semibold text-[#10131b] outline-none placeholder:text-[#a9a094]"
                disabled={deploying}
              />
              <span className="border-l border-[#d8d0c0] px-3 py-2.5 text-xs font-bold text-[#8b8174]">.vercel.app</span>
            </div>

            {!customSubdomain.trim() && (
              <p className="mt-2 text-xs text-[#8b8174]">
                Using: {(sanitizeSubdomain(activeProject?.name || '') || `store-${String(activeProject?.id || '').slice(0, 6)}`)}.vercel.app
              </p>
            )}

            {subdomainError && <p className="mt-2 text-xs text-red-400">{subdomainError}</p>}

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="!border-[#d8d0c0] !bg-white !text-[#10131b] hover:!bg-[#f6f1e8]"
                onClick={() => setDeployModalOpen(false)}
                disabled={deploying}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="!border-[#10131b] !bg-[#10131b] !text-white hover:!bg-[#007f75]"
                onClick={handleDeploy}
                loading={deploying}
              >
                <Rocket size={13} />
                {deploying ? 'Deploying...' : 'Deploy now'}
              </Button>
            </div>
          </div>
        </div>
      )}
                <Rocket size={13} />
                {deploying ? 'Deploying...' : 'Deploy now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Agent Status Icons --------------------------------
const STATUS_CONFIG = {
  scanning: { icon: '🔍', color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Scanning' },
  analyzing: { icon: '🧠', color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Analyzing' },
  planning: { icon: '📝', color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Planning' },
  writing: { icon: '✏️', color: 'text-green-400', bg: 'bg-green-500/10', label: 'Writing' },
  repairing: { icon: '🔧', color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Repairing' },
  queued: { icon: '⏳', color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Queued' },
  complete: { icon: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Complete' },
  error: { icon: '❌', color: 'text-red-400', bg: 'bg-red-500/10', label: 'Error' },
};

// --- Agent Activity Step --------------------------------
function AgentActivityStep({ step, isActive, isLast }) {
  const config = STATUS_CONFIG[step.type] || STATUS_CONFIG.scanning;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2.5 py-1.5 ${isLast ? '' : 'opacity-60'}`}
    >
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs ${config.bg}`}>
        {isActive && isLast ? (
          <Loader2 size={12} className={`animate-spin ${config.color}`} />
        ) : (
          <span>{config.icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        <p className="truncate text-[11px] leading-snug text-[#5d6472]">{step.message}</p>
        {step.details?.files_read && (
          <div className="mt-1 flex flex-wrap gap-1">
            {step.details.files_read.slice(0, 4).map((f, i) => (
              <span key={i} className="rounded bg-[#f6f1e8] px-1.5 py-0.5 font-mono text-[9px] text-[#5d6472]">
                {f.split('/').pop()}
              </span>
            ))}
            {step.details.files_read.length > 4 && (
              <span className="rounded bg-[#f6f1e8] px-1.5 py-0.5 text-[9px] text-[#5d6472]">
                +{step.details.files_read.length - 4} more
              </span>
            )}
          </div>
        )}
        {step.details?.files && (
          <div className="mt-1 flex flex-wrap gap-1">
            {step.details.files.map((f, i) => (
              <span key={i} className="rounded bg-[#dff7ef] px-1.5 py-0.5 font-mono text-[9px] text-[#007f75]">
                {f.split('/').pop()}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Agent Activity Card --------------------------------
function AgentActivityCard({ steps, isActive }) {
  const [expanded, setExpanded] = useState(true);
  
  if (!steps || steps.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="overflow-hidden rounded-xl border border-[#d8d0c0] bg-white shadow-[0_14px_32px_rgba(16,19,27,0.08)]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[#f6f1e8]"
        >
          {isActive ? (
            <Loader2 size={12} className="shrink-0 animate-spin text-[#007f75]" />
          ) : (
            <Sparkles size={12} className="shrink-0 text-[#007f75]" />
          )}
          <span className="flex-1 text-[11px] font-black text-[#343945]">
            {isActive ? 'Agent is working...' : `Completed ${steps.length} steps`}
          </span>
          <ChevronDown
            size={12}
            className={`text-[#8b8174] transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#efe6d6] px-3 pb-2.5">
                <div className="relative pl-3 mt-2">
                  {/* Vertical connector line */}
                  <div className="absolute left-[0.35rem] top-2 bottom-2 w-px bg-[#d8d0c0]" />
                  {steps.map((step, i) => (
                    <AgentActivityStep
                      key={`${step.type}-${i}`}
                      step={step}
                      isActive={isActive}
                      isLast={i === steps.length - 1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- Files Modified Badge ------------------------------
function FilesModifiedBadge({ files }) {
  const [showAll, setShowAll] = useState(false);
  if (!files || files.length === 0) return null;
  
  return (
    <div className="mt-2 border-t border-[#efe6d6] pt-2">
      <button
        onClick={() => setShowAll(!showAll)}
        className="flex items-center gap-1.5 text-[10px] font-bold text-[#8b8174] transition-colors hover:text-[#10131b]"
      >
        <FileText size={10} />
        <span>{files.length} file{files.length !== 1 ? 's' : ''} modified</span>
        <ChevronDown size={10} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-1.5 flex flex-col gap-1 overflow-hidden"
          >
            {files.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 rounded-md bg-[#f6f1e8] px-2 py-1 font-mono text-[10px] text-[#5d6472]">
                <Code2 size={9} className="shrink-0 text-[#007f75]" />
                {f}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- AI Chat Sidebar ----------------------------------
function ChatSidebar() {
  const activeProject = useProjectsStore((s) => s.activeProject);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentSteps, setAgentSteps] = useState([]);
  const [restoringMessageId, setRestoringMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const token = useAuthStore((s) => s.token);
  const mountedRef = useRef(false);
  const agentStepsRef = useRef([]);

  const buildMessageId = useCallback(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  const normalizeChatMessage = useCallback((msg = {}) => {
    const metadata = msg.metadata || {};
    const role = msg.role === 'assistant' ? 'agent' : (msg.role || 'agent');
    return {
      id: msg.id || metadata.client_message_id || buildMessageId(),
      server_id: msg.id || null,
      client_message_id: metadata.client_message_id || msg.client_message_id || null,
      role,
      content: msg.content || msg.message || msg.reply || '',
      files_modified: metadata.files_modified || msg.files_modified || [],
      plan: metadata.plan || msg.plan || '',
      steps: msg.steps,
      checkpoint_id: metadata.checkpoint_id || msg.checkpoint_id || null,
      commit_hash: metadata.commit_hash || msg.commit_hash || null,
      checkpoint_message: metadata.checkpoint_message || msg.checkpoint_message || '',
      github_push: metadata.github_push || msg.github_push || null,
    };
  }, [buildMessageId]);

  const loadChatHistory = useCallback(async () => {
    if (!activeProject?.id) return;
    setLoadingHistory(true);
    try {
      const res = await projectsService.getChatHistory(activeProject.id);
      if (!mountedRef.current) return;
      const persisted = (res.data?.messages || []).map((msg) => normalizeChatMessage(msg));
      setMessages(persisted);
    } catch {
      if (mountedRef.current) setMessages([]);
    } finally {
      if (mountedRef.current) setLoadingHistory(false);
    }
  }, [activeProject?.id, normalizeChatMessage]);

  useEffect(() => {
    mountedRef.current = true;
    if (activeProject?.id) {
      setMessages([]);
      loadChatHistory();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [activeProject?.id, loadChatHistory]);

  useEffect(() => {
    if (!activeProject?.id) return;
    
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000', {
       transports: ['websocket'],
       auth: token ? { token } : undefined,
    });
    
    socket.on('connect', () => {
       socket.emit('join_project', { project_id: activeProject.id });
    });

    socket.on('agent_typing', () => {
       setIsTyping(true);
       setAgentSteps([]);
       agentStepsRef.current = [];
    });

    // Real-time agent status updates
    socket.on('agent_status', (data) => {
       setAgentSteps(prev => {
         // Prevent duplicate consecutive steps of the same type
         if (prev.length > 0 && prev[prev.length - 1].type === data.type && prev[prev.length - 1].message === data.message) {
           agentStepsRef.current = prev;
           return prev;
         }
         const next = [...prev, { type: data.type, message: data.message, details: data.details || {} }];
         agentStepsRef.current = next;
         return next;
       });
       // If complete or error, stop typing indicator
       if (data.type === 'complete' || data.type === 'error') {
         setIsTyping(false);
       }
    });

    const handleAgentReply = (data) => {
       setIsTyping(false);
       const currentSteps = [...agentStepsRef.current];
       setMessages(prev => [...prev, normalizeChatMessage({
         ...data,
         content: data.message || data.content || data.reply || 'Agent replied.',
         steps: currentSteps.length > 0 ? currentSteps : undefined,
       })]);
       // Always sync with persisted history after receiving a reply.
       setTimeout(() => {
         if (mountedRef.current) loadChatHistory();
       }, 150);
       setAgentSteps([]);
       agentStepsRef.current = [];
    };

    socket.on('agent_reply', handleAgentReply);
    // Backward compatibility for alternate server event naming.
    socket.on('agent_response', handleAgentReply);

    socket.on('chat_message_saved', (data) => {
       const normalized = normalizeChatMessage({
         ...data,
         content: data.message || data.content || '',
       });
       setMessages((prev) => {
         const matchIndex = prev.findIndex((msg) => (
           (normalized.client_message_id && msg.id === normalized.client_message_id) ||
           (normalized.client_message_id && msg.client_message_id === normalized.client_message_id) ||
           (normalized.server_id && msg.server_id === normalized.server_id)
         ));

         if (matchIndex === -1) return [...prev, normalized];

         const next = [...prev];
         next[matchIndex] = { ...next[matchIndex], ...normalized };
         return next;
       });
    });

    socket.on('code_updated', (data) => {
       if (data?.legacy_refresh_notice) {
         toast.success('Agent updated the code.');
         window.dispatchEvent(new CustomEvent('asea:project-code-updated', { detail: { projectId: activeProject.id } }));
         return;
       }
       const push = data?.github_push;
       if (push?.pushed) {
         toast.success('Agent updated the code and pushed it to GitHub.');
       } else {
         toast.success('Agent updated the code.');
         if (push?.error) toast.error(`GitHub push failed: ${push.error}`);
       }
       window.dispatchEvent(new CustomEvent('asea:project-code-updated', { detail: { projectId: activeProject.id } }));
       if (!data) {
       toast.success("Agent modified the UI! Vite should auto-refresh.", { icon: "✨" });
       }
    });

    socketRef.current = socket;

    return () => {
       socket.emit('leave_project', { project_id: activeProject.id });
       socket.disconnect();
    };
  }, [activeProject?.id, token, normalizeChatMessage, loadChatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, agentSteps]);

  const handleSend = async () => {
    if (!input.trim() || !activeProject?.id) return;
    
    const userMsg = { id: buildMessageId(), role: 'user', content: input, client_message_id: null };
    userMsg.client_message_id = userMsg.id;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    if (socketRef.current) {
        socketRef.current.emit('chat_message', {
          project_id: activeProject.id,
          message: userMsg.content,
          client_message_id: userMsg.client_message_id,
        });
    } else {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'agent',
            content: "Socket not connected, but I would have processed this."
          }]);
        }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRestoreCheckpoint = async (msg) => {
    if (!activeProject?.id || !msg?.checkpoint_id || restoringMessageId) return;
    const confirmed = window.confirm('Restore the project code to this message version?');
    if (!confirmed) return;

    setRestoringMessageId(msg.id);
    try {
      const res = await projectsService.restoreCheckpoint(activeProject.id, msg.checkpoint_id);
      const push = res.data?.github_push;
      if (push?.pushed) {
        toast.success('Restored and pushed to GitHub.');
      } else {
        toast.success('Restored project code.');
        if (push?.error) toast.error(`GitHub push failed: ${push.error}`);
      }
      window.dispatchEvent(new CustomEvent('asea:project-code-updated', { detail: { projectId: activeProject.id } }));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Restore failed');
    } finally {
      setRestoringMessageId(null);
    }
  };

  const promptStarters = [
    'Improve the product detail page conversion flow.',
    'Make the checkout feel more premium and trusted.',
    'Add an admin view for orders and inventory.',
  ];

  return (
    <div className="relative flex h-full w-[370px] shrink-0 flex-col border-r border-[#d8d0c0] bg-[#fffaf0] text-[#10131b]">
      <div className="border-b border-[#d8d0c0] px-5 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#007f75]">ASEA Copilot</p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.03em]">Build brief</h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10131b] text-[#f6c453] shadow-[0_12px_24px_rgba(16,19,27,0.16)]">
            <Sparkles size={18} />
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[#5d6472]">
          Direct the store, screens, data model, and release path from one focused thread.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-6">
        {loadingHistory && (
          <div className="flex items-center gap-2 text-[#8b8174]">
            <Loader2 size={13} className="animate-spin" />
            <span className="text-xs">Loading chat history...</span>
          </div>
        )}
        {!loadingHistory && messages.length === 0 && !isTyping && (
          <div className="rounded-2xl border border-[#d8d0c0] bg-white p-4 shadow-[0_18px_40px_rgba(16,19,27,0.08)]">
            <p className="text-sm font-black">Tell ASEA what should change next.</p>
            <p className="mt-2 text-xs leading-relaxed text-[#5d6472]">
              Start with the customer outcome, the page to improve, or the operational tool you need.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {promptStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setInput(starter)}
                  className="rounded-lg border border-[#efe6d6] bg-[#f6f1e8] px-3 py-2 text-left text-xs font-bold text-[#343945] transition-colors hover:border-[#007f75]/40 hover:bg-[#e8f7f3]"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Show activity steps from the agent's work if available */}
              {msg.role === 'agent' && msg.steps && msg.steps.length > 0 && (
                <div className="w-full mb-2">
                  <AgentActivityCard steps={msg.steps} isActive={false} />
                </div>
              )}
              <div className={`max-w-[95%] rounded-2xl p-4 text-[13px] leading-relaxed shadow-[0_14px_34px_rgba(16,19,27,0.08)] ${msg.role === 'user' ? 'rounded-br-none bg-[#10131b] text-white' : 'rounded-bl-sm border border-[#d8d0c0] bg-white text-[#343945]'}`}>
                {msg.plan && (
                  <div className="mb-2 border-b border-[#efe6d6] pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#007f75]">Plan</span>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#5d6472]">{msg.plan}</p>
                  </div>
                )}
                {msg.content}
                <FilesModifiedBadge files={msg.files_modified} />
              </div>
              {msg.checkpoint_id && (
                <button
                  type="button"
                  onClick={() => handleRestoreCheckpoint(msg)}
                  disabled={Boolean(restoringMessageId)}
                  title={msg.commit_hash ? `Restore to commit ${msg.commit_hash.slice(0, 7)}` : 'Restore code to this version'}
                  className={`mt-1 flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    msg.role === 'user'
                      ? 'border-[#2a3040] bg-[#10131b] text-[#f6c453] hover:bg-[#20283a]'
                      : 'border-[#d8d0c0] bg-white text-[#007f75] hover:bg-[#e8f7f3]'
                  }`}
                >
                  {restoringMessageId === msg.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Undo2 size={13} />
                  )}
                </button>
              )}
            </motion.div>
          ))}

          {/* Live agent activity while working */}
          {(isTyping || agentSteps.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              {agentSteps.length > 0 ? (
                <AgentActivityCard steps={agentSteps} isActive={isTyping} />
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-[#d8d0c0] bg-white px-3 py-2 text-[#5d6472] shadow-[0_14px_34px_rgba(16,19,27,0.08)]">
                  <Loader2 size={14} className="animate-spin text-[#007f75]" />
                  <span className="text-xs font-bold">ASEA is planning the next pass...</span>
                </div>
              )}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="border-t border-[#d8d0c0] bg-[#fffaf0] p-4">
        {/* Database buttons removed as per user request */}
        
        <div className="flex flex-col rounded-2xl border border-[#d8d0c0] bg-white shadow-[0_18px_40px_rgba(16,19,27,0.1)] transition-all focus-within:border-[#007f75]/60 focus-within:ring-4 focus-within:ring-[#007f75]/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ASEA to change a page, data flow, layout, copy, or launch setup..."
            className="max-h-[200px] min-h-[78px] w-full resize-none border-none bg-transparent p-4 pb-0 text-sm font-semibold text-[#10131b] outline-none placeholder:text-[#a9a094]"
          />
          <div className="flex items-center justify-between p-2">
            <div className="flex gap-1">
              <button className="rounded-lg p-2 text-[#8b8174] transition-colors hover:bg-[#f6f1e8] hover:text-[#10131b]">
                <Sparkles size={16} />
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-transparent p-2 text-[#8b8174] transition-colors hover:border-[#d8d0c0] hover:bg-[#f6f1e8] hover:text-[#10131b]">
                <Pencil size={14} /> <span className="text-xs font-black">Visual edits</span>
              </button>
            </div>
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="m-1 rounded-xl bg-[#10131b] p-2 text-white transition-colors hover:bg-[#007f75] disabled:bg-[#efe6d6] disabled:text-[#a9a094]"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Inline Editor Overlay (Tiptap) ------------------
function InlineEditor({ activeEdit, onClose, onSave }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapLink.configure({ openOnClick: false }),
    ],
    content: activeEdit?.text || '',
    onUpdate: ({ editor: e }) => {
      activeEdit.pendingHtml = e.getHTML();
    },
  });

  const handleSave = () => {
    if (editor) {
      onSave(activeEdit.editableId, editor.getHTML());
    }
    onClose();
  };

  if (!activeEdit) return null;
  const { absoluteRect } = activeEdit;

  return (
    <div
      className="fixed z-50 overflow-hidden rounded-xl border border-[#007f75]/40 bg-[#fffaf0] text-[#10131b] shadow-2xl"
      style={{
        top: absoluteRect.top,
        left: absoluteRect.left,
        width: Math.max(absoluteRect.width, 300),
        minHeight: absoluteRect.height || 40,
      }}
    >
      <div className="flex items-center gap-1 border-b border-[#d8d0c0] bg-[#f6f1e8] px-2 py-1">
        {[
          { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
          { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            onMouseDown={(e) => { e.preventDefault(); action(); }}
            className={`rounded px-2 py-0.5 text-xs font-black transition-colors ${editor && editor.isActive(label.toLowerCase()) ? 'bg-[#10131b] text-white' : 'text-[#5d6472] hover:bg-white hover:text-[#10131b]'}`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          <button onClick={onClose} className="rounded px-2 py-0.5 text-xs font-bold text-[#8b8174] hover:text-[#10131b]">
            Cancel
          </button>
          <button onClick={handleSave} className="rounded bg-[#007f75]/10 px-2 py-0.5 text-xs font-black text-[#007f75] hover:bg-[#007f75]/20">
            Save
          </button>
        </div>
      </div>
      <div className="p-2 [&_.ProseMirror]:min-h-[28px] [&_.ProseMirror]:px-1 [&_.ProseMirror]:text-[#10131b] [&_.ProseMirror]:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// --- Live Preview -------------------------------------
function LivePreview({ deployedUrl }) {
  const { deviceMode, activePage, editMode } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);
  const iframeRef = useRef(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);
  const debounceRef = useRef(null);
  const refreshRef = useRef(null);
  const startupRetryRef = useRef(null);
  const startupAttemptsRef = useRef(0);
  const MAX_STARTUP_RETRIES = 4;
  const hasDeployedUrl = Boolean(deployedUrl);

  const getEditableHtml = useCallback(
    (rawHtml) => {
      if (!editMode) return rawHtml;
      const script = `<script>
        document.addEventListener('click', function(e) {
          var t = e.target.closest('[data-editable-id]');
          if (!t) { parent.postMessage({ type:'asea:deselect' }, '*'); return; }
          e.preventDefault();
          var r = t.getBoundingClientRect();
          parent.postMessage({ type:'asea:click', editableId:t.dataset.editableId, text:t.innerHTML, rect:{top:r.top, left:r.left, width:r.width, height:r.height} }, '*');
        });
        document.addEventListener('mouseover', function(e) {
          var t = e.target.closest('[data-editable-id]');
          if (t) { t.style.outline='2px dashed #3b82f6'; t.style.cursor='pointer'; }
        });
        document.addEventListener('mouseout', function(e) {
          var t = e.target.closest('[data-editable-id]');
          if (t) { t.style.outline=''; t.style.cursor=''; }
        });
      </script>`;
      return rawHtml.replace(/<\/body>/i, script + '</body>') || rawHtml + script;
    },
    [editMode]
  );

  const loadPreview = useCallback(() => {
    if (!activeProject?.id) return;
    clearTimeout(startupRetryRef.current);
    setLoading(true);
    projectsService.getPreview(activeProject.id, activePage)
      .then((res) => {
        const raw = typeof res.data === 'string' ? res.data : res.data.html || '';
        if (raw.includes('Preview is still starting')) {
          if (startupAttemptsRef.current < MAX_STARTUP_RETRIES) {
            startupAttemptsRef.current += 1;
            startupRetryRef.current = setTimeout(() => loadPreview(), 2500);
            setHtml(raw);
            setError(null);
            return;
          }

          if (hasDeployedUrl) {
            setHtml(`<style>body{margin:0;padding:0;overflow:hidden}iframe{width:100vw;height:100vh;border:none}</style><iframe src="${deployedUrl}"></iframe>`);
            setError('Local preview did not start. Showing deployed site instead.');
          } else {
            setHtml(raw);
            setError('Local preview is taking too long to start. Try refreshing preview after checking the project dev server dependencies.');
          }
          return;
        }

        startupAttemptsRef.current = 0;
        setError(null);
        setHtml(raw);
      })
      .catch(() => {
        // mock fallback for styling purposes if backend fails
        setHtml(`<div style="font-family:sans-serif;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#333;background:#fafafa;">
          <h1 style="font-size:3rem;margin-bottom:1rem;color:#111;">System 01</h1>
          <p>Mocked preview fallback: Backend generated store.</p>
        </div>`);
        setError('Failed to load preview endpoint.');
      })
      .finally(() => setLoading(false));
  }, [activeProject?.id, activePage, hasDeployedUrl, deployedUrl]);

  useEffect(() => {
    startupAttemptsRef.current = 0;
    loadPreview();
  }, [loadPreview]);

  useEffect(() => {
    return () => {
      clearTimeout(startupRetryRef.current);
    };
  }, []);

  useEffect(() => {
    const handleCodeUpdate = (event) => {
      if (event.detail?.projectId && event.detail.projectId !== activeProject?.id) return;
      loadPreview();
    };

    window.addEventListener('asea:project-code-updated', handleCodeUpdate);
    return () => window.removeEventListener('asea:project-code-updated', handleCodeUpdate);
  }, [activeProject?.id, loadPreview]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'asea:click') {
        const iframeRect = iframeRef.current?.getBoundingClientRect();
        if (!iframeRect) return;
        setActiveEdit({
          editableId: e.data.editableId,
          text: e.data.text,
          pendingHtml: e.data.text,
          absoluteRect: {
            top: iframeRect.top + e.data.rect.top,
            left: iframeRect.left + e.data.rect.left,
            width: e.data.rect.width,
            height: e.data.rect.height,
          },
        });
      } else if (e.data?.type === 'asea:deselect') {
        setActiveEdit(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const saveEdit = useCallback(
    (editableId, newHtml) => {
      if (!activeProject?.id) return;
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          await projectsService.updateFile(activeProject.id, editableId, newHtml);
          clearTimeout(refreshRef.current);
          refreshRef.current = setTimeout(() => loadPreview(), 500);
        } catch {
          toast.error('Failed to save change');
        }
      }, 300);
    },
    [activeProject?.id, loadPreview]
  );

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f6f1e8] p-4 lg:p-6">
      {/* Browser Bar Mock Frame */}
      <div 
        className="relative flex flex-col overflow-hidden rounded-2xl border border-[#d8d0c0] bg-white shadow-[0_24px_70px_rgba(16,19,27,0.18)] transition-all duration-300"
        style={{
            maxWidth: DEVICE_WIDTHS[deviceMode] || '100%',
            width: '100%',
            height: '100%',
            maxHeight: '100%'
        }}
      >
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[#d8d0c0] bg-[#fffaf0] px-4">
           <div className="flex max-w-[72px] flex-1 gap-1.5">
             <div className="h-2.5 w-2.5 rounded-full bg-[#f06f63]"></div>
             <div className="h-2.5 w-2.5 rounded-full bg-[#f6c453]"></div>
             <div className="h-2.5 w-2.5 rounded-full bg-[#007f75]"></div>
           </div>
           
           <div className="mx-auto flex max-w-md flex-1 items-center justify-center gap-2 rounded-lg border border-[#d8d0c0] bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-[#5d6472]">
             <span className="truncate" title={hasDeployedUrl ? deployedUrl : 'Not deployed yet'}>
               {hasDeployedUrl ? deployedUrl : 'Not deployed yet'}
             </span>
             {hasDeployedUrl ? (
               <a
                 href={deployedUrl}
                 target="_blank"
                 rel="noreferrer"
                 className="text-[#8b8174] hover:text-[#10131b]"
                 title="Open deployed URL"
               >
                 <ExternalLink size={12} />
               </a>
             ) : null}
           </div>
           
           <div className="flex max-w-[72px] flex-1 justify-end">
               <button
                 onClick={loadPreview}
                 disabled={loading}
                 className="rounded-lg border border-transparent p-1.5 transition-colors hover:border-[#d8d0c0] hover:bg-white disabled:opacity-50"
                 title="Reload preview"
               >
                 <RefreshCw size={14} className={`text-[#8b8174] ${loading ? 'animate-spin' : ''}`} />
               </button>
           </div>
        </div>
        
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-hidden rounded-b-xl border-x border-b border-transparent bg-white">
            <Loader2 size={24} className="mb-4 animate-spin text-[#007f75]" />
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8b8174]">Loading preview</p>
          </div>
        ) : (
          <div className="relative flex h-full min-h-0 w-full flex-1 justify-center bg-white p-0">
             {error ? (
               <div className="absolute left-3 right-3 top-3 z-10 rounded-lg border border-[#c8931f]/40 bg-[#fff2cb] px-3 py-2 text-xs font-semibold text-[#8a5d00]">
                 {error}
               </div>
             ) : null}
             <iframe
                ref={iframeRef}
                srcDoc={getEditableHtml(html)}
                title="Store Preview"
                className="w-full h-full border-0 absolute inset-0"
                sandbox="allow-scripts allow-same-origin"
              />
          </div>
        )}
      </div>

      {editMode && activeEdit && (
        <InlineEditor
          activeEdit={activeEdit}
          onClose={() => setActiveEdit(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

const RotateCw = ({size, className}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>

// --- Monaco Code Viewer -------------------------------
function CodeViewerPane() {
  const activeProject = useProjectsStore((s) => s.activeProject);
  const updateProjectFile = useProjectsStore((s) => s.updateProjectFile);
  const [files, setFiles] = useState([]);
  const [activeFilePath, setActiveFilePath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState({
    src: true,
    public: true,
  });
  const activeFileRequestRef = useRef(0);
  const activeFilePathRef = useRef('');

  const normalizePath = useCallback((value = '') => String(value).replace(/\\/g, '/').replace(/^\/+/, ''), []);

  const getLanguage = (path = '') => {
    const ext = path.split('.').pop()?.toLowerCase() || '';
    const map = {
      js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
      css: 'css', html: 'html', json: 'json', md: 'markdown', py: 'python',
    };
    return map[ext] || 'plaintext';
  };

  const loadFileContent = useCallback(async (filePath) => {
    if (!activeProject?.id || !filePath) return;
    const requestId = activeFileRequestRef.current + 1;
    activeFileRequestRef.current = requestId;
    activeFilePathRef.current = filePath;
    setActiveFilePath(filePath);
    setLoadingContent(true);
    try {
      const res = await projectsService.getFile(activeProject.id, filePath);
      if (activeFileRequestRef.current !== requestId) return;
      setFileContent(res.data?.content || '');
      setDirty(false);
    } catch {
      if (activeFileRequestRef.current !== requestId) return;
      setFileContent('// Could not load selected file');
      toast.error('Failed to load file content');
    } finally {
      if (activeFileRequestRef.current !== requestId) return;
      setLoadingContent(false);
    }
  }, [activeProject?.id]);

  const loadFiles = useCallback(async () => {
    if (!activeProject?.id) return;
    setLoadingFiles(true);
    try {
      const res = await projectsService.getFiles(activeProject.id);
      const list = (res.data?.files || []).map((f) => ({ ...f, path: normalizePath(f.path || '') }));
      setFiles(list);
      if (activeFilePathRef.current && !list.some((f) => f.path === activeFilePathRef.current)) {
        activeFilePathRef.current = '';
        setActiveFilePath('');
        setFileContent('');
      } else if (list.length === 0) {
        activeFilePathRef.current = '';
        setActiveFilePath('');
        setFileContent('// No files found for this project');
      }
    } catch {
      toast.error('Failed to load project files');
      setFiles([]);
      activeFilePathRef.current = '';
      setActiveFilePath('');
      setFileContent('// Failed to load files');
    } finally {
      setLoadingFiles(false);
    }
  }, [activeProject?.id, normalizePath]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    const handleCodeUpdate = (event) => {
      if (event.detail?.projectId && event.detail.projectId !== activeProject?.id) return;
      loadFiles();
      if (activeFilePathRef.current) {
        loadFileContent(activeFilePathRef.current);
      }
    };

    window.addEventListener('asea:project-code-updated', handleCodeUpdate);
    return () => window.removeEventListener('asea:project-code-updated', handleCodeUpdate);
  }, [activeProject?.id, loadFiles, loadFileContent]);

  const handleSave = useCallback(async () => {
    if (!activeProject?.id || !activeFilePath || !dirty) return;
    setSaving(true);
    try {
      await projectsService.updateFile(activeProject.id, activeFilePath, fileContent);
      updateProjectFile(activeProject.id, activeFilePath, fileContent);
      setDirty(false);
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }, [activeProject?.id, activeFilePath, dirty, fileContent, updateProjectFile]);

  const tree = useMemo(() => {
    const root = { dirs: {}, files: [] };

    files.forEach((file) => {
      const fullPath = normalizePath(file.path);
      if (!fullPath) return;

      const parts = fullPath.split('/').filter(Boolean);
      let current = root;
      let currentDirPath = '';

      parts.forEach((part, idx) => {
        const isLast = idx === parts.length - 1;

        if (isLast) {
          current.files.push({ name: part, path: fullPath });
        } else {
          currentDirPath = currentDirPath ? `${currentDirPath}/${part}` : part;
          if (!current.dirs[part]) {
            current.dirs[part] = {
              name: part,
              path: currentDirPath,
              dirs: {},
              files: [],
            };
          }
          current = current.dirs[part];
        }
      });
    });

    return root;
  }, [files, normalizePath]);

  const toggleDir = (path) => {
    setExpandedDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (node, depth = 0) => {
    const dirEntries = Object.values(node.dirs).sort((a, b) => a.name.localeCompare(b.name));
    const fileEntries = [...node.files].sort((a, b) => a.name.localeCompare(b.name));

    return (
      <>
        {dirEntries.map((dir) => {
          const isOpen = expandedDirs[dir.path] ?? false;
          return (
            <div key={dir.path}>
              <button
                onClick={() => toggleDir(dir.path)}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold text-[#5d6472] hover:bg-[#f6f1e8] hover:text-[#10131b]"
                style={{ paddingLeft: `${8 + depth * 14}px` }}
              >
                {isOpen ? (
                  <ChevronDown size={12} className="shrink-0 text-[#8b8174]" />
                ) : (
                  <ChevronRight size={12} className="shrink-0 text-[#8b8174]" />
                )}
                {isOpen ? (
                  <FolderOpen size={13} className="shrink-0 text-[#c8931f]" />
                ) : (
                  <Folder size={13} className="shrink-0 text-[#c8931f]" />
                )}
                <span className="truncate">{dir.name}</span>
              </button>
              {isOpen && renderTree(dir, depth + 1)}
            </div>
          );
        })}

        {fileEntries.map((file) => {
          const isSelected = file.path === activeFilePath;
          return (
            <button
              key={file.path}
              onClick={() => loadFileContent(file.path)}
              className={`flex w-full items-center gap-1.5 truncate rounded px-2 py-1 text-xs font-semibold transition-colors ${isSelected ? 'bg-[#10131b] text-white shadow-sm' : 'text-[#5d6472] hover:bg-[#f6f1e8] hover:text-[#10131b]'}`}
              style={{ paddingLeft: `${24 + depth * 14}px` }}
              title={file.path}
            >
              <FileIcon size={12} className="shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-[#f6f1e8] p-4 lg:p-6">
      <div className="mr-4 flex w-72 flex-col overflow-hidden rounded-2xl border border-[#d8d0c0] bg-white shadow-[0_18px_48px_rgba(16,19,27,0.1)]">
        <div className="flex h-12 items-center justify-between border-b border-[#d8d0c0] px-3">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-[#007f75]">Project files</span>
          <button
            onClick={loadFiles}
            className="flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs font-black text-[#5d6472] transition-colors hover:border-[#d8d0c0] hover:bg-[#f6f1e8] hover:text-[#10131b]"
            disabled={loadingFiles}
          >
            <RefreshCw size={12} className={loadingFiles ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {files.length === 0 ? (
            <p className="px-2 py-3 text-xs font-semibold text-[#8b8174]">No files available</p>
          ) : (
            renderTree(tree)
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#20242e] bg-[#10131b] shadow-[0_24px_70px_rgba(16,19,27,0.24)]">
        <div className="flex h-12 items-center justify-between gap-3 border-b border-white/10 bg-[#161a24] px-4">
          <span className="truncate font-mono text-xs text-[#c9ced8]">{activeFilePath || 'No file selected'}</span>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="rounded-lg bg-[#f6c453] px-3 py-1.5 text-xs font-black text-[#10131b] transition-colors hover:bg-[#ffd778] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="flex-1 relative">
          {loadingContent && (
            <div className="absolute inset-0 z-10 bg-[#0e0e0e]/80 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-[#f6c453]" />
            </div>
          )}
        <Editor
            height="100%"
            language={getLanguage(activeFilePath)}
            value={fileContent}
            onChange={(value) => {
              setFileContent(value || '');
              setDirty(true);
            }}
            theme="vs-dark"
            options={{
              readOnly: false,
              fontSize: 13,
              minimap: { enabled: true },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// --- Main Builder Page --------------------------------
export default function BuilderPage() {
  const { id } = useParams();
  const { viewMode, reset } = useBuilderStore();
  const { setActiveProject } = useProjectsStore();
  const [deployedUrl, setDeployedUrl] = useState('');

  useEffect(() => {
    // Load project data
    projectsService
      .get(id)
      .then((res) => setActiveProject(res.data))
      .catch(() => {});

    return () => reset();
  }, [id, setActiveProject, reset]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    integrationsService
      .getVercelStatus(id)
      .then((res) => {
        if (!mounted) return;
        const persistedUrl = res.data?.production_url || res.data?.preview_url || '';
        setDeployedUrl(persistedUrl);
      })
      .catch(() => {
        if (!mounted) return;
        setDeployedUrl('');
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f6f1e8] text-[#10131b]">
      <BuilderToolbar deployedUrl={deployedUrl} setDeployedUrl={setDeployedUrl} />
      <div className="flex h-[calc(100vh-64px)] flex-1 overflow-hidden">
        <ChatSidebar />
        {viewMode === 'preview' ? <LivePreview deployedUrl={deployedUrl} /> : <CodeViewerPane />}
      </div>
    </div>
  );
}
