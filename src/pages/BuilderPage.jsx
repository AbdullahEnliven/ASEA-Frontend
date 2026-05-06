import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  Github,
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
import { ProjectDeployModal, ProjectGithubModal } from '@/components/project/ProjectActionModals';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

function BuilderToolbar({ setDeployedUrl, onToggleChat, chatOpen }) {
  const {
    deviceMode,
    setDeviceMode,
    editMode,
    setEditMode,
    viewMode,
    setViewMode,
  } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);
  const [searchParams, setSearchParams] = useSearchParams();
  const [downloading, setDownloading] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [githubModalOpen, setGithubModalOpen] = useState(false);
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

  useEffect(() => {
    const modal = searchParams.get('modal');
    const deploy = searchParams.get('deploy');
    const github = searchParams.get('github') || searchParams.get('gh');

    if (modal === 'deploy' || deploy === 'open') {
      setDeployModalOpen(true);
    }
    if (modal === 'github' || github) {
      setGithubModalOpen(true);
    }
  }, [searchParams]);

  const clearActionQuery = useCallback(() => {
    const actionKeys = ['modal', 'deploy', 'github', 'gh', 'tab'];
    const hasActionQuery = actionKeys.some((key) => searchParams.has(key));
    if (!hasActionQuery) return;

    const nextParams = new URLSearchParams(searchParams);
    actionKeys.forEach((key) => nextParams.delete(key));
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const closeDeployModal = useCallback(() => {
    setDeployModalOpen(false);
    clearActionQuery();
  }, [clearActionQuery]);

  const closeGithubModal = useCallback(() => {
    setGithubModalOpen(false);
    clearActionQuery();
  }, [clearActionQuery]);

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

  return (
    <div className="flex h-14 items-center justify-between gap-2 border-b border-[#d8d0c0] bg-[#fffaf0]/95 px-3 text-[#10131b] shadow-[0_10px_32px_rgba(16,19,27,0.08)] backdrop-blur sm:h-16 sm:px-4">
      {/* Left: logo + project name */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {/* Mobile: chat toggle button */}
        <button
          onClick={onToggleChat}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#d8d0c0] bg-[#10131b] text-[#f6c453] lg:hidden"
          title="Toggle chat"
        >
          <MessageSquare size={14} />
        </button>

        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d8d0c0] bg-[#10131b] text-sm font-black text-[#f6c453] shadow-[0_12px_24px_rgba(16,19,27,0.16)] sm:flex">
          A
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex cursor-pointer items-center gap-1.5 rounded-lg p-1 -ml-1 transition-colors hover:bg-[#efe6d6]">
            <span className="max-w-[120px] truncate text-xs font-black leading-tight tracking-[-0.01em] sm:max-w-[180px] sm:text-sm lg:max-w-[230px]">
              {activeProject?.name || 'Untitled Store'}
            </span>
            <ChevronDown size={12} className="shrink-0 text-[#8b8174]" />
          </div>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#007f75] sm:block">Launch workspace</span>
        </div>
      </div>

      {/* Center: view/device toggles (hidden on xs) */}
      <div className="hidden flex-1 items-center justify-center gap-2 sm:flex">
        <div className="flex rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] p-1 shadow-inner">
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-black transition-colors sm:gap-2 sm:px-3 ${viewMode === 'preview' ? 'bg-[#10131b] text-white shadow-sm' : 'text-[#5d6472] hover:bg-white hover:text-[#10131b]'}`}
          >
            <Eye size={13} /> <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-black transition-colors sm:gap-2 sm:px-3 ${viewMode === 'code' ? 'bg-[#10131b] text-white shadow-sm' : 'text-[#5d6472] hover:bg-white hover:text-[#10131b]'}`}
          >
            <Code2 size={13} /> <span className="hidden sm:inline">Code</span>
          </button>
        </div>

        {viewMode === 'preview' && (
          <div className="hidden items-center rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] p-1 shadow-inner md:flex">
            {devices.map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setDeviceMode(mode)}
                className={`rounded-md p-1.5 px-2 transition-colors md:px-3 ${deviceMode === mode ? 'bg-white text-[#10131b] shadow-sm' : 'text-[#8b8174] hover:bg-white hover:text-[#10131b]'}`}
                title={mode}
              >
                <Icon size={13} />
              </button>
            ))}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`ml-1 border-l border-[#d8d0c0] p-1.5 px-2 transition-colors md:px-3 ${editMode ? 'text-[#007f75]' : 'text-[#8b8174] hover:text-[#10131b]'}`}
              title="Visual Edit Mode"
            >
              <Pencil size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {!checkingSupabase && !supabaseConnected && (
          <div
            className="hidden items-center gap-2 rounded-lg border border-[#c8931f]/40 bg-[#fff2cb] px-3 py-1.5 text-[11px] font-black text-[#8a5d00] md:inline-flex"
            title="Backend database is not connected"
          >
            <Database size={13} />
            Database needed
          </div>
        )}
        <button
          onClick={handleDownloadCode}
          disabled={downloading}
          className="hidden items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-xs font-black text-[#5d6472] transition-colors hover:border-[#d8d0c0] hover:bg-white hover:text-[#10131b] disabled:opacity-60 lg:flex"
        >
          <Download size={13} />
          {downloading ? '…' : 'Download'}
        </button>
        <button
          type="button"
          onClick={() => setGithubModalOpen(true)}
          className={`hidden items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-xs font-black text-[#5d6472] transition-colors hover:border-[#d8d0c0] hover:bg-white hover:text-[#10131b] ${activeProject?.id ? 'lg:flex' : 'hidden'}`}
        >
          <Github size={13} /> <span className="hidden xl:inline">GitHub</span>
        </button>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="!border-[#10131b] !bg-[#10131b] !text-white hover:!bg-[#007f75] !px-3 !py-1.5 !text-xs"
            onClick={() => setDeployModalOpen(true)}
          >
            <Rocket size={12} />
            <span className="hidden sm:inline">Deploy</span>
          </Button>
        </div>
      </div>

      <ProjectGithubModal open={githubModalOpen} onClose={closeGithubModal} project={activeProject} />
      <ProjectDeployModal
        open={deployModalOpen}
        onClose={closeDeployModal}
        project={activeProject}
        onDeployed={setDeployedUrl}
      />
    </div>
  );
}


  const devices = [
    { mode: 'desktop', icon: Monitor },
    { mode: 'tablet', icon: Tablet },
    { mode: 'mobile', icon: Smartphone },
  ];

  useEffect(() => {
    const modal = searchParams.get('modal');
    const deploy = searchParams.get('deploy');
    const github = searchParams.get('github') || searchParams.get('gh');

    if (modal === 'deploy' || deploy === 'open') {
      setDeployModalOpen(true);
    }
    if (modal === 'github' || github) {
      setGithubModalOpen(true);
    }
  }, [searchParams]);

  const clearActionQuery = useCallback(() => {
    const actionKeys = ['modal', 'deploy', 'github', 'gh', 'tab'];
    const hasActionQuery = actionKeys.some((key) => searchParams.has(key));
    if (!hasActionQuery) return;

    const nextParams = new URLSearchParams(searchParams);
    actionKeys.forEach((key) => nextParams.delete(key));
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const closeDeployModal = useCallback(() => {
    setDeployModalOpen(false);
    clearActionQuery();
  }, [clearActionQuery]);

  const closeGithubModal = useCallback(() => {
    setGithubModalOpen(false);
    clearActionQuery();
  }, [clearActionQuery]);

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
    <div className="relative flex h-full w-full shrink-0 flex-col border-r border-[#d8d0c0] bg-[#fffaf0] text-[#10131b] lg:w-[370px]">
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

// --- Live Preview (Vercel-based, Railway-compatible) ------------------

/** Strip ANSI terminal escape sequences (e.g. \u001b[2K) from log lines */
const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').trim();

/**
 * Return a clean display URL for the browser address bar.
 * - Prefer the production URL (e.g. hydrabox.vercel.app)
 * - Otherwise strip the deployment-hash + team-slug from the preview URL
 *   e.g. hydrabox-dmc0opquj-hudjgnr-6989s-projects.vercel.app → hydrabox (preview)
 */
const getDisplayUrl = (previewUrl, productionUrl) => {
  if (productionUrl) return productionUrl;
  if (!previewUrl) return '';
  try {
    const hostname = new URL(previewUrl).hostname; // e.g. hydrabox-dmc0opquj-hudjgnr-6989s-projects.vercel.app
    if (!hostname.endsWith('.vercel.app')) return hostname;
    const withoutSuffix = hostname.replace('.vercel.app', ''); // hydrabox-dmc0opquj-hudjgnr-6989s-projects
    const parts = withoutSuffix.split('-');
    // Vercel hashes are typically 9 random lowercase alphanumeric chars
    const hashIdx = parts.findIndex((p, i) => i > 0 && /^[a-z0-9]{9,}$/.test(p));
    const projectName = hashIdx > 0 ? parts.slice(0, hashIdx).join('-') : parts[0];
    return `${projectName}.vercel.app (preview)`;
  } catch {
    return previewUrl;
  }
};

function LivePreview() {
  const activeProject = useProjectsStore((s) => s.activeProject);
  const pollRef = useRef(null);
  const socketRef = useRef(null);
  const token = useAuthStore((s) => s.token);

  // preview state: idle | deploying | ready | error
  const [previewStatus, setPreviewStatus] = useState('idle');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [productionUrl, setProductionUrl] = useState(null);
  const [previewMsg, setPreviewMsg] = useState('');
  const [deployLog, setDeployLog] = useState([]);
  const [copied, setCopied] = useState(false);
  const deployLogRef = useRef(null);
  const mountedRef = useRef(false);

  // Auto-scroll deploy log
  useEffect(() => {
    if (deployLogRef.current) {
      deployLogRef.current.scrollTop = deployLogRef.current.scrollHeight;
    }
  }, [deployLog]);

  const applyStatus = useCallback((data) => {
    if (!mountedRef.current) return;
    const status = data.status || 'idle';
    setPreviewStatus(status);
    setPreviewUrl(data.url || null);
    setProductionUrl(data.production_url || null);
    setPreviewMsg(data.message || '');
    if (status === 'deploying' && data.message) {
      const clean = stripAnsi(data.message);
      if (clean) setDeployLog((prev) => [...prev.slice(-200), clean]);
    }
    if (status === 'ready' || status === 'error') setDeployLog([]);
  }, []);

  // Initial status check
  const fetchStatus = useCallback(async () => {
    if (!activeProject?.id) return;
    try {
      const res = await projectsService.getPreviewStatus(activeProject.id);
      applyStatus(res.data);
    } catch {
      // silently ignore
    }
  }, [activeProject?.id, applyStatus]);

  useEffect(() => {
    mountedRef.current = true;
    setPreviewStatus('idle');
    setPreviewUrl(null);
    setProductionUrl(null);
    setPreviewMsg('');
    setDeployLog([]);
    fetchStatus();
    return () => {
      mountedRef.current = false;
      clearInterval(pollRef.current);
    };
  }, [activeProject?.id, fetchStatus]);

  // Poll while deploying
  useEffect(() => {
    clearInterval(pollRef.current);
    if (previewStatus === 'deploying') {
      pollRef.current = setInterval(fetchStatus, 4000);
    }
    return () => clearInterval(pollRef.current);
  }, [previewStatus, fetchStatus]);

  // Socket.IO — listen for real-time preview_status events
  useEffect(() => {
    if (!activeProject?.id) return;
    const socket = io(
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000',
      { transports: ['websocket'], auth: token ? { token } : undefined }
    );
    socket.on('connect', () => {
      socket.emit('join_project', { project_id: activeProject.id });
    });
    socket.on('preview_status', (data) => applyStatus(data));
    // When agent changes code → mark preview as stale
    socket.on('code_updated', () => {
      if (mountedRef.current) {
        setPreviewStatus((s) => (s === 'ready' ? 'idle' : s));
        setPreviewMsg('Code updated — rebuild preview to see changes');
        setPreviewUrl(null);
      }
    });
    socketRef.current = socket;
    return () => {
      socket.emit('leave_project', { project_id: activeProject.id });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeProject?.id, token, applyStatus]);

  const handleTriggerPreview = useCallback(async () => {
    if (!activeProject?.id) return;
    setPreviewStatus('deploying');
    setPreviewMsg('Requesting Vercel preview deploy…');
    setDeployLog(['Starting Vercel preview deploy…']);
    try {
      const res = await projectsService.triggerPreview(activeProject.id);
      applyStatus(res.data);
    } catch (err) {
      setPreviewStatus('error');
      setPreviewMsg(err.response?.data?.detail || 'Failed to trigger preview');
    }
  }, [activeProject?.id, applyStatus]);

  const handleCopy = () => {
    if (!previewUrl) return;
    navigator.clipboard?.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isReady = previewStatus === 'ready' && previewUrl;
  const isDeploying = previewStatus === 'deploying';
  const isError = previewStatus === 'error';
  const displayUrl = getDisplayUrl(previewUrl, productionUrl);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#f6f1e8] p-8 gap-5">

      {/* ── Ready ── */}
      {isReady && (
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#007f75]" />
            <span className="text-xs font-bold text-[#007f75]">Live on Vercel</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#d8d0c0] bg-white shadow-[0_8px_40px_rgba(16,19,27,0.12)]">
            <div className="flex items-center gap-2 border-b border-[#d8d0c0] bg-[#fffaf0] px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#f06f63]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#f6c453]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#007f75]" />
              </div>
              <div className="flex flex-1 items-center gap-1.5 overflow-hidden rounded-md bg-[#f0ebe2] px-2.5 py-1">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#007f75]" />
                <span className="flex-1 truncate font-mono text-[10px] font-semibold text-[#5d6472]">{displayUrl || previewUrl}</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 px-8 py-7 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#007f75] to-[#004d49] shadow-[0_8px_24px_rgba(0,127,117,0.35)]">
                <ExternalLink size={24} className="text-white" />
              </div>
              <div>
                <p className="text-base font-black text-[#10131b]">{activeProject?.name || 'Your Store'}</p>
                <p className="mt-1 text-xs text-[#8b8174]">Deployed and ready to view</p>
              </div>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10131b] px-5 py-3 text-sm font-black text-white shadow-[0_8px_24px_rgba(16,19,27,0.2)] transition-all hover:bg-[#007f75] hover:shadow-[0_8px_24px_rgba(0,127,117,0.3)] active:scale-[0.98]"
              >
                <ExternalLink size={15} /> Open Preview
              </a>
              <div className="flex w-full items-center gap-2 rounded-lg border border-[#d8d0c0] bg-[#f6f1e8] px-3 py-2">
                <span className="flex-1 truncate font-mono text-[10px] text-[#8b8174]" title={previewUrl}>{previewUrl}</span>
                <button onClick={handleCopy} className="shrink-0 rounded px-2 py-0.5 text-[10px] font-black text-[#007f75] hover:bg-[#007f75]/10">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-[#8b8174]">
            <span>Code changed?</span>
            <button onClick={handleTriggerPreview} className="flex items-center gap-1.5 font-bold text-[#10131b] hover:text-[#007f75]">
              <RefreshCw size={11} /> Rebuild Preview
            </button>
          </div>
        </div>
      )}

      {/* ── Deploying ── */}
      {isDeploying && (
        <div className="flex w-full max-w-lg flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#007f75]/20 border-t-[#007f75]" />
            <Rocket size={22} className="text-[#007f75]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-[#10131b]">Deploying to Vercel</p>
            <p className="mt-1 text-xs text-[#8b8174]">~1–2 min first build · cached after that</p>
          </div>
          {deployLog.length > 0 && (
            <div ref={deployLogRef} className="w-full max-h-52 overflow-y-auto rounded-xl border border-[#d8d0c0] bg-[#0f172a] px-4 py-3 font-mono text-[10px] text-[#94a3b8] shadow-inner">
              {deployLog.map((line, i) => <div key={i} className="leading-relaxed">{line}</div>)}
              <div className="mt-1 animate-pulse text-[#007f75]">▌</div>
            </div>
          )}
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50"><span className="text-2xl">⚠️</span></div>
          <div>
            <p className="text-sm font-black text-[#10131b]">Deploy failed</p>
            <p className="mt-1 max-w-xs text-xs text-[#8b8174]">{previewMsg}</p>
          </div>
          <button onClick={handleTriggerPreview} className="flex items-center gap-2 rounded-xl bg-[#10131b] px-4 py-2 text-xs font-black text-white hover:bg-[#007f75]">
            <RefreshCw size={13} /> Try Again
          </button>
        </div>
      )}

      {/* ── Idle ── */}
      {!isReady && !isDeploying && !isError && (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8d0c0] bg-[#f6f1e8] shadow-inner">
            <Rocket size={28} className="text-[#007f75]" />
          </div>
          <div>
            <p className="text-base font-black text-[#10131b]">Preview your store</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#8b8174]">
              {previewMsg || 'Deploy to Vercel to get a live link. Same URL works for production — no double build.'}
            </p>
          </div>
          <button
            onClick={handleTriggerPreview}
            id="trigger-preview-btn"
            className="flex items-center gap-2 rounded-xl bg-[#10131b] px-5 py-2.5 text-sm font-black text-white shadow-[0_8px_24px_rgba(16,19,27,0.2)] transition-all hover:bg-[#007f75] hover:shadow-[0_8px_24px_rgba(0,127,117,0.3)] active:scale-95"
          >
            <Rocket size={15} /> Build Preview on Vercel
          </button>
          <p className="text-[10px] text-[#a9a094]">Powered by Vercel · ~1 min first build</p>
        </div>
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
  const [filesLoaded, setFilesLoaded] = useState(false);
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
      setFilesLoaded(true);
      setLoadingFiles(false);
    }
  }, [activeProject?.id, normalizePath]);

  useEffect(() => {
    setFilesLoaded(false);
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

  const renderFileSkeleton = () => (
    <div className="space-y-2 px-2 py-3" aria-label="Loading project files">
      {[
        { width: 'w-28', indent: 'ml-0' },
        { width: 'w-40', indent: 'ml-5' },
        { width: 'w-32', indent: 'ml-5' },
        { width: 'w-24', indent: 'ml-0' },
        { width: 'w-36', indent: 'ml-5' },
        { width: 'w-44', indent: 'ml-5' },
      ].map((item, index) => (
        <div key={index} className={`flex items-center gap-2 ${item.indent}`}>
          <span className="h-3 w-3 shrink-0 animate-pulse rounded bg-[#e4dccf]" />
          <span className={`h-3 ${item.width} animate-pulse rounded bg-[#e4dccf]`} />
        </div>
      ))}
    </div>
  );

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
          {loadingFiles || !filesLoaded ? (
            renderFileSkeleton()
          ) : files.length === 0 ? (
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
  const { viewMode, setViewMode, reset } = useBuilderStore();
  const { setActiveProject } = useProjectsStore();
  const [deployedUrl, setDeployedUrl] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  // Breakpoint: treat >=1024 as desktop (always show chat sidebar)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
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
      .catch(() => { if (!mounted) return; setDeployedUrl(''); });
    return () => { mounted = false; };
  }, [id]);

  // Mobile tab: 'chat' | 'preview' | 'code'
  const [mobileTab, setMobileTab] = useState('preview');

  // Sync viewMode store with mobile tab
  useEffect(() => {
    if (!isDesktop) {
      if (mobileTab === 'preview') setViewMode('preview');
      if (mobileTab === 'code') setViewMode('code');
    }
  }, [mobileTab, isDesktop, setViewMode]);

  const showChat = isDesktop || mobileTab === 'chat';
  const showMain = isDesktop || mobileTab !== 'chat';

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f6f1e8] text-[#10131b]">
      <BuilderToolbar
        setDeployedUrl={setDeployedUrl}
        onToggleChat={() => setMobileTab((t) => t === 'chat' ? 'preview' : 'chat')}
        chatOpen={mobileTab === 'chat'}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100dvh - 56px)' }}>

        {/* Chat sidebar — desktop: always visible. Mobile: shown when mobileTab==='chat' */}
        <div
          className={`flex-col overflow-hidden transition-all duration-200 ${
            isDesktop
              ? 'flex w-[340px] shrink-0 xl:w-[370px]'
              : showChat
              ? 'flex w-full'
              : 'hidden'
          }`}
        >
          <ChatSidebar />
        </div>

        {/* Preview / Code — hidden on mobile when chat tab is active */}
        {showMain && (
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {viewMode === 'preview' ? <LivePreview /> : <CodeViewerPane />}
          </div>
        )}
      </div>

      {/* Mobile bottom tab bar */}
      {!isDesktop && (
        <div className="flex h-14 shrink-0 items-center justify-around border-t border-[#d8d0c0] bg-[#fffaf0] px-2">
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
              mobileTab === 'chat' ? 'text-[#007f75]' : 'text-[#8b8174]'
            }`}
          >
            <MessageSquare size={18} />
            Chat
          </button>
          <button
            onClick={() => { setMobileTab('preview'); setViewMode('preview'); }}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
              mobileTab === 'preview' ? 'text-[#007f75]' : 'text-[#8b8174]'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            onClick={() => { setMobileTab('code'); setViewMode('code'); }}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-colors ${
              mobileTab === 'code' ? 'text-[#007f75]' : 'text-[#8b8174]'
            }`}
          >
            <Code2 size={18} />
            Code
          </button>
        </div>
      )}
    </div>
  );
}
