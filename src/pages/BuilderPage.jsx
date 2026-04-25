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
    setCheckingSupabase(true);
    integrationsService
      .getSupabaseStatus(activeProject.id)
      .then((res) => {
        if (!mounted) return;
        setSupabaseConnected(Boolean(res.data?.connected));
      })
      .catch(() => {
        if (!mounted) return;
        setSupabaseConnected(false);
      })
      .finally(() => {
        if (mounted) setCheckingSupabase(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeProject?.id]);

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
    <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 bg-[#0e0e0e] text-white">
      <div className="flex items-center gap-4 min-w-[280px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 -ml-1 rounded transition-colors">
            <span className="text-sm font-semibold truncate leading-tight mt-1">
              {activeProject?.name || 'Untitled Store'}
            </span>
            <ChevronDown size={14} className="text-gray-400 mt-1" />
          </div>
          <span className="text-[10px] text-gray-500">Previewing last saved version</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center gap-2">
         {/* Top middle controls akin to Lovable */}
         <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Eye size={14} /> Preview
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <Code2 size={14} /> Code
            </button>
         </div>

         {/* Device toggles placed central */}
         {viewMode === 'preview' && (
           <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/10 ml-4">
             {devices.map(({ mode, icon: Icon }) => (
               <button
                 key={mode}
                 onClick={() => setDeviceMode(mode)}
                 className={`p-1.5 px-3 rounded-md transition-colors ${deviceMode === mode ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                 title={mode}
               >
                 <Icon size={14} />
               </button>
             ))}
             <button
               onClick={() => setEditMode(!editMode)}
               className={`p-1.5 px-3 ml-1 border-l border-white/5 transition-colors ${editMode ? 'text-blue-400' : 'text-zinc-500 hover:text-white'}`}
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
            className="inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
            title="Connect backend database"
          >
            <Database size={13} />
            Warning: Connect backend (Supabase)
          </Link>
        )}
        <button
          onClick={handleDownloadCode}
          disabled={downloading}
          className="text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 px-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          {downloading ? 'Downloading...' : 'Download Code'}
        </button>
        <button className="text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 px-2">
          Share
        </button>
        {activeProject?.id ? (
          <Link
            to={`/projects/${activeProject.id}/deploy?tab=github`}
            className="text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 px-2"
          >
            GitHub
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="text-gray-500 text-xs font-medium flex items-center gap-1.5 px-2 cursor-not-allowed"
          >
            GitHub
          </button>
        )}
        <Button variant="secondary" size="sm" className="bg-[#1a1a1a] border-white/10 text-white hover:bg-[#2a2a2a]">
          <Rocket size={13} className="text-purple-400" /> Upgrade
        </Button>
        <div className="flex items-center">
          <Button
            size="sm"
            className="bg-white text-black border border-gray-300 hover:bg-gray-100"
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
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-white">Choose your custom URL</h3>
            <p className="mt-1 text-xs text-gray-400">
              Pick a Vercel subdomain. If left empty, we use your store name.
            </p>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#0b0b0b] flex items-center overflow-hidden">
              <input
                value={customSubdomain}
                onChange={(e) => {
                  setCustomSubdomain(sanitizeSubdomain(e.target.value));
                  setSubdomainError('');
                }}
                placeholder="my-awesome-store"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
                disabled={deploying}
              />
              <span className="px-3 py-2.5 text-xs text-gray-500 border-l border-white/10">.vercel.app</span>
            </div>

            {!customSubdomain.trim() && (
              <p className="mt-2 text-xs text-gray-500">
                Using: {(sanitizeSubdomain(activeProject?.name || '') || `store-${String(activeProject?.id || '').slice(0, 6)}`)}.vercel.app
              </p>
            )}

            {subdomainError && <p className="mt-2 text-xs text-red-400">{subdomainError}</p>}

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#1a1a1a] border-white/10 text-white hover:bg-[#242424]"
                onClick={() => setDeployModalOpen(false)}
                disabled={deploying}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-white text-black border border-gray-300 hover:bg-gray-100"
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
    </div>
  );
}

// --- Agent Status Icons --------------------------------
const STATUS_CONFIG = {
  scanning: { icon: '🔍', color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Scanning' },
  analyzing: { icon: '🧠', color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Analyzing' },
  planning: { icon: '📝', color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Planning' },
  writing: { icon: '✏️', color: 'text-green-400', bg: 'bg-green-500/10', label: 'Writing' },
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
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${config.bg}`}>
        {isActive && isLast ? (
          <Loader2 size={12} className={`animate-spin ${config.color}`} />
        ) : (
          <span>{config.icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        <p className="text-[11px] text-gray-500 leading-snug truncate">{step.message}</p>
        {step.details?.files_read && (
          <div className="mt-1 flex flex-wrap gap-1">
            {step.details.files_read.slice(0, 4).map((f, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 font-mono">
                {f.split('/').pop()}
              </span>
            ))}
            {step.details.files_read.length > 4 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                +{step.details.files_read.length - 4} more
              </span>
            )}
          </div>
        )}
        {step.details?.files && (
          <div className="mt-1 flex flex-wrap gap-1">
            {step.details.files.map((f, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-mono">
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
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/[0.02] transition-colors"
        >
          {isActive ? (
            <Loader2 size={12} className="animate-spin text-blue-400 shrink-0" />
          ) : (
            <Sparkles size={12} className="text-emerald-400 shrink-0" />
          )}
          <span className="text-[11px] font-medium text-gray-400 flex-1">
            {isActive ? 'Agent is working...' : `Completed ${steps.length} steps`}
          </span>
          <ChevronDown
            size={12}
            className={`text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
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
              <div className="px-3 pb-2.5 border-t border-white/[0.04]">
                <div className="relative pl-3 mt-2">
                  {/* Vertical connector line */}
                  <div className="absolute left-[0.35rem] top-2 bottom-2 w-px bg-white/[0.06]" />
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
    <div className="mt-2 pt-2 border-t border-white/[0.06]">
      <button
        onClick={() => setShowAll(!showAll)}
        className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
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
              <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/[0.03] text-gray-400 font-mono flex items-center gap-1.5">
                <Code2 size={9} className="text-blue-400 shrink-0" />
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
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const token = useAuthStore((s) => s.token);
  const mountedRef = useRef(false);
  const agentStepsRef = useRef([]);

  const buildMessageId = useCallback(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  const loadChatHistory = useCallback(async () => {
    if (!activeProject?.id) return;
    setLoadingHistory(true);
    try {
      const res = await projectsService.getChatHistory(activeProject.id);
      if (!mountedRef.current) return;
      const persisted = (res.data?.messages || []).map((msg) => ({
        id: msg.id || buildMessageId(),
        role: msg.role === 'assistant' ? 'agent' : (msg.role || 'agent'),
        content: msg.content || '',
        files_modified: msg.metadata?.files_modified || [],
        plan: msg.metadata?.plan || '',
      }));
      setMessages(persisted);
    } catch {
      if (mountedRef.current) setMessages([]);
    } finally {
      if (mountedRef.current) setLoadingHistory(false);
    }
  }, [activeProject?.id, buildMessageId]);

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
       setMessages(prev => [...prev, {
         id: data.id || buildMessageId(),
         role: data.role === 'assistant' ? 'agent' : (data.role || 'agent'),
         content: data.message || data.content || data.reply || 'Agent replied.',
         files_modified: data.files_modified || [],
         plan: data.plan || '',
         steps: currentSteps.length > 0 ? currentSteps : undefined
       }]);
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

    socket.on('code_updated', () => {
       toast.success("Agent modified the UI! Vite should auto-refresh.", { icon: "✨" });
    });

    socketRef.current = socket;

    return () => {
       socket.emit('leave_project', { project_id: activeProject.id });
       socket.disconnect();
    };
  }, [activeProject?.id, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, agentSteps]);

  const handleSend = async () => {
    if (!input.trim() || !activeProject?.id) return;
    
    const userMsg = { id: buildMessageId(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    if (socketRef.current) {
        socketRef.current.emit('chat_message', { project_id: activeProject.id, message: userMsg.content });
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

  return (
    <div className="w-[340px] flex flex-col bg-[#0e0e0e] border-r border-white/10 h-full relative shrink-0">

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
        {loadingHistory && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={13} className="animate-spin" />
            <span className="text-xs">Loading chat history...</span>
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
              <div className={`p-4 max-w-[95%] rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-[#2b2b2b] text-white rounded-br-none' : 'bg-transparent text-gray-300 border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent rounded-bl-sm'}`}>
                {msg.plan && (
                  <div className="mb-2 pb-2 border-b border-white/[0.06]">
                    <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Plan</span>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{msg.plan}</p>
                  </div>
                )}
                {msg.content}
                <FilesModifiedBadge files={msg.files_modified} />
              </div>
            </motion.div>
          ))}

          {/* Live agent activity while working */}
          {(isTyping || agentSteps.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              {agentSteps.length > 0 ? (
                <AgentActivityCard steps={agentSteps} isActive={isTyping} />
              ) : (
                <div className="flex items-center gap-2 pl-2 text-gray-500">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span className="text-xs">ASEA is thinking...</span>
                </div>
              )}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0e0e0e]">
        {/* Database buttons removed as per user request */}
        
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-lg flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ASEA..."
            className="w-full bg-transparent border-none outline-none text-white text-sm p-4 min-h-[60px] max-h-[200px] resize-none pb-0"
          />
          <div className="flex items-center justify-between p-2">
            <div className="flex gap-1">
              <button className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <Sparkles size={16} />
              </button>
              <button className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <Pencil size={14} /> <span className="text-xs font-medium">Visual edits</span>
              </button>
            </div>
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-[#2a2a2a] disabled:text-gray-500 text-white rounded-xl transition-colors m-1"
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
      className="fixed z-50 shadow-2xl rounded-xl border border-blue-500/40 bg-[#0e0e0e] overflow-hidden"
      style={{
        top: absoluteRect.top,
        left: absoluteRect.left,
        width: Math.max(absoluteRect.width, 300),
        minHeight: absoluteRect.height || 40,
      }}
    >
      <div className="flex items-center gap-1 px-2 py-1 border-b border-white/10 bg-[#111]">
        {[
          { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
          { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            onMouseDown={(e) => { e.preventDefault(); action(); }}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${editor && editor.isActive(label.toLowerCase()) ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          <button onClick={onClose} className="px-2 py-0.5 text-xs text-gray-500 hover:text-white rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded font-medium">
            Save
          </button>
        </div>
      </div>
      <div className="p-2 [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-white [&_.ProseMirror]:min-h-[28px] [&_.ProseMirror]:px-1">
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
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] p-4 lg:p-6 p-1 relative overflow-hidden">
      {/* Browser Bar Mock Frame */}
      <div 
        className="flex flex-col bg-white rounded-xl shadow-2xl transition-all duration-300 overflow-hidden relative"
        style={{
            maxWidth: DEVICE_WIDTHS[deviceMode] || '100%',
            width: '100%',
            height: '100%',
            maxHeight: '100%'
        }}
      >
        <div className="h-10 bg-white border-b border-gray-200 flex items-center px-4 gap-2 flex-shrink-0">
           <div className="flex gap-1.5 flex-1 max-w-[60px]">
             <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
           </div>
           
           <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-[11px] text-gray-600 font-mono flex-1 max-w-sm justify-center">
             <span className="truncate" title={hasDeployedUrl ? deployedUrl : 'Not deployed yet'}>
               {hasDeployedUrl ? deployedUrl : 'Not deployed yet'}
             </span>
             {hasDeployedUrl ? (
               <a
                 href={deployedUrl}
                 target="_blank"
                 rel="noreferrer"
                 className="text-gray-500 hover:text-gray-800"
                 title="Open deployed URL"
               >
                 <ExternalLink size={12} />
               </a>
             ) : null}
           </div>
           
           <div className="flex flex-1 max-w-[60px] justify-end">
               <button
                 onClick={loadPreview}
                 disabled={loading}
                 className="p-1 rounded hover:bg-gray-200/70 disabled:opacity-50"
                 title="Reload preview"
               >
                 <RefreshCw size={14} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
               </button>
           </div>
        </div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border-x border-b border-transparent rounded-b-xl overflow-hidden">
            <Loader2 size={24} className="animate-spin text-blue-500 mb-4" />
          </div>
        ) : (
          <div className="flex-1 bg-white flex justify-center w-full h-full p-0 relative min-h-0">
             {error ? (
               <div className="absolute top-2 left-2 right-2 z-10 rounded-md border border-amber-300/50 bg-amber-50 text-amber-900 text-xs px-3 py-2">
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
                className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-gray-300 hover:bg-white/5"
                style={{ paddingLeft: `${8 + depth * 14}px` }}
              >
                {isOpen ? (
                  <ChevronDown size={12} className="text-gray-500 shrink-0" />
                ) : (
                  <ChevronRight size={12} className="text-gray-500 shrink-0" />
                )}
                {isOpen ? (
                  <FolderOpen size={13} className="text-amber-400 shrink-0" />
                ) : (
                  <Folder size={13} className="text-amber-400 shrink-0" />
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
              className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs truncate transition-colors ${isSelected ? 'bg-blue-600/20 text-blue-300' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
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
    <div className="flex-1 flex overflow-hidden bg-[#111] p-4">
      <div className="w-72 border border-white/10 rounded-xl overflow-hidden bg-[#0d0d0d] mr-4 flex flex-col">
        <div className="h-11 px-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-gray-400">Explorer</span>
          <button
            onClick={loadFiles}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            disabled={loadingFiles}
          >
            <RefreshCw size={12} className={loadingFiles ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {files.length === 0 ? (
            <p className="text-xs text-gray-500 px-2 py-3">No files available</p>
          ) : (
            renderTree(tree)
          )}
        </div>
      </div>

      <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-[#0e0e0e] flex flex-col">
        <div className="h-11 px-3 border-b border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400 truncate">{activeFilePath || 'No file selected'}</span>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="px-3 py-1 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <div className="flex-1 relative">
          {loadingContent && (
            <div className="absolute inset-0 z-10 bg-[#0e0e0e]/80 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-blue-400" />
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
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <BuilderToolbar deployedUrl={deployedUrl} setDeployedUrl={setDeployedUrl} />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        <ChatSidebar />
        {viewMode === 'preview' ? <LivePreview deployedUrl={deployedUrl} /> : <CodeViewerPane />}
      </div>
    </div>
  );
}
