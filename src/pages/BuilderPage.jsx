import { useState, useEffect, useRef, useCallback } from 'react';
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
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import useBuilderStore from '@/store/builder.store';
import useProjectsStore from '@/store/projects.store';
import { projectsService } from '@/services/projects.service';
import { DEVICE_WIDTHS } from '@/constants';
import { Button } from '@/components/common';
import toast from 'react-hot-toast';

// --- Toolbar ------------------------------------------
function BuilderToolbar() {
  const {
    deviceMode,
    setDeviceMode,
    editMode,
    setEditMode,
    viewMode,
    setViewMode,
  } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);

  const devices = [
    { mode: 'desktop', icon: Monitor },
    { mode: 'tablet', icon: Tablet },
    { mode: 'mobile', icon: Smartphone },
  ];

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
        <button className="text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 px-2">
          Share
        </button>
        <button className="text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5 px-2">
          GitHub
        </button>
        <Button variant="secondary" size="sm" className="bg-[#1a1a1a] border-white/10 text-white hover:bg-[#2a2a2a]">
          <Rocket size={13} className="text-purple-400" /> Upgrade
        </Button>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Publish
        </Button>
      </div>
    </div>
  );
}

// --- AI Chat Sidebar ----------------------------------
function ChatSidebar() {
  const activeProject = useProjectsStore((s) => s.activeProject);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with requirement message
  useEffect(() => {
    if (activeProject && messages.length === 0) {
      setMessages([
        { 
          id: 1, 
          role: 'user', 
          content: activeProject.requirements || 'Build me a fashion store selling streetwear for men and women.' 
        },
        { 
          id: 2, 
          role: 'agent', 
          content: "I've generated your initial store based on that description! You have a database connected, authentication ready, and server-side functions configured.\n\nWould you like me to tweak the colors, add new components, or modify the layout?"
        }
      ]);
    }
  }, [activeProject]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock agent response & edit execution
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'agent',
        content: "I've applied those changes to the store. How does it look now?"
      }]);
      toast.success("Agent updated the UI!", { icon: "?" });
    }, 2000);
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
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`p-4 max-w-[95%] rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-[#2b2b2b] text-white rounded-br-none' : 'bg-transparent text-gray-300 border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent rounded-bl-sm'}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-2 text-gray-500">
              <Loader2 size={14} className="animate-spin text-blue-500" />
              <span className="text-xs">ASEA is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0e0e0e]">
        <div className="flex flex-col gap-2 mb-4">
          <button className="w-full py-2.5 rounded-lg bg-[#1a1a1a] text-xs font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
            Enable Cloud Database
          </button>
          <button className="w-full py-2.5 rounded-lg bg-[#1a1a1a] text-xs font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
            Use external Supabase
          </button>
        </div>
        
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
function LivePreview() {
  const { deviceMode, activePage, editMode } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);
  const iframeRef = useRef(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);
  const debounceRef = useRef(null);
  const refreshRef = useRef(null);

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
    setLoading(true);
    projectsService.getPreview(activeProject.id, activePage)
      .then((res) => {
        const raw = typeof res.data === 'string' ? res.data : res.data.html || '';
        setHtml(raw);
      })
      .catch(() => {
        // mock fallback for styling purposes if backend fails
        setHtml(`<div style="font-family:sans-serif;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#333;background:#fafafa;">
          <h1 style="font-size:3rem;margin-bottom:1rem;color:#111;">System 01</h1>
          <p>Mocked preview fallback: Backend generated store.</p>
        </div>`);    
      })
      .finally(() => setLoading(false));
  }, [activeProject?.id, activePage]);

  useEffect(() => { loadPreview(); }, [loadPreview]);

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
             <span className="text-gray-400">https://</span>
             <span>{activeProject?.name?.toLowerCase().replace(/\s/g, '-') || 'preview'}</span>
             <span>.asea.dev</span>
           </div>
           
           <div className="flex flex-1 max-w-[60px] justify-end">
               <RotateCw size={14} className="text-gray-400" />
           </div>
        </div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border-x border-b border-transparent rounded-b-xl overflow-hidden">
            <Loader2 size={24} className="animate-spin text-blue-500 mb-4" />
          </div>
        ) : (
          <div className="flex-1 bg-white flex justify-center w-full h-full p-0 relative min-h-0">
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
  const [fileContent, setFileContent] = useState('// Generating standard template logic');

  return (
    <div className="flex-1 flex overflow-hidden bg-[#111] p-4">
      <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-[#0e0e0e]">
        <Editor
            height="100%"
            language="javascript"
            value={fileContent}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 13,
              minimap: { enabled: false },
            }}
          />
      </div>
    </div>
  );
}

// --- Main Builder Page --------------------------------
export default function BuilderPage() {
  const { id } = useParams();
  const { viewMode, reset } = useBuilderStore();
  const { setActiveProject } = useProjectsStore();

  useEffect(() => {
    // Load project data
    projectsService
      .get(id)
      .then((res) => setActiveProject(res.data))
      .catch(() => {});

    return () => reset();
  }, [id, setActiveProject, reset]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <BuilderToolbar />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        <ChatSidebar />
        {viewMode === 'preview' ? <LivePreview /> : <CodeViewerPane />}
      </div>
    </div>
  );
}
