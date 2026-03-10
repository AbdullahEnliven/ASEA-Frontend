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
} from 'lucide-react';
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

// ─── Toolbar ──────────────────────────────────────────
function BuilderToolbar() {
  const {
    deviceMode,
    setDeviceMode,
    editMode,
    setEditMode,
    viewMode,
    setViewMode,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);

  const devices = [
    { mode: 'desktop', icon: Monitor },
    { mode: 'tablet', icon: Tablet },
    { mode: 'mobile', icon: Smartphone },
  ];

  return (
    <div className="flex items-center justify-between h-12 px-4 border-b border-white/10 bg-[#0a0a0a]">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold truncate max-w-[200px]">
          {activeProject?.name || 'Untitled'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Device toggle */}
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {devices.map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              className={`p-1.5 ${
                deviceMode === mode
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white'
              }`}
              title={mode}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* View mode */}
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setViewMode('preview')}
            className={`p-1.5 ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            title="Preview"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`p-1.5 ${viewMode === 'code' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            title="Code"
          >
            <Code2 size={14} />
          </button>
        </div>

        {/* Edit toggle */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`p-1.5 rounded-lg border transition-colors ${
            editMode
              ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
              : 'border-white/10 text-gray-500 hover:text-white'
          }`}
          title={editMode ? 'Editing' : 'View only'}
        >
          <Pencil size={14} />
        </button>

        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30"
        >
          <Redo2 size={14} />
        </button>

        <Button variant="secondary" size="sm">
          <Save size={13} /> Save
        </Button>
        <Button size="sm">
          <Rocket size={13} /> Deploy
        </Button>
      </div>
    </div>
  );
}

// ─── Left Sidebar ─────────────────────────────────────
function BuilderSidebar() {
  const [tab, setTab] = useState('pages');
  const { activePage, setActivePage } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);

  const pages = activeProject?.pages || ['home', 'products', 'cart', 'checkout', 'admin'];

  const tabs = [
    { id: 'pages', icon: FileText, label: 'Pages' },
    { id: 'files', icon: FolderTree, label: 'Files' },
    { id: 'assets', icon: Image, label: 'Assets' },
  ];

  return (
    <div className="w-56 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
      {/* Tab headers */}
      <div className="flex border-b border-white/10">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors
              ${tab === id ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {tab === 'pages' && (
          <div className="space-y-0.5">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors
                  ${activePage === page
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {tab === 'files' && (
          <p className="text-xs text-gray-500 px-3 py-4">
            File tree will appear after generation.
          </p>
        )}

        {tab === 'assets' && (
          <p className="text-xs text-gray-500 px-3 py-4">
            No assets uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Inline Editor Overlay (Tiptap) ──────────────────
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
      {/* Tiptap toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-white/10 bg-[#111]">
        {[
          { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
          { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            onMouseDown={(e) => { e.preventDefault(); action(); }}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors
              ${active ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          <button onClick={onClose} className="px-2 py-0.5 text-xs text-gray-500 hover:text-white rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded font-medium"
          >
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

// ─── Live Preview ─────────────────────────────────────
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
          parent.postMessage({ type:'asea:click', editableId:t.dataset.editableId, text:t.innerHTML,
            rect:{top:r.top,left:r.left,width:r.width,height:r.height} }, '*');
        });
        document.addEventListener('mouseover', function(e) {
          var t = e.target.closest('[data-editable-id]');
          if (t) { t.style.outline='2px solid rgba(59,130,246,0.6)'; t.style.cursor='text'; }
        });
        document.addEventListener('mouseout', function(e) {
          var t = e.target.closest('[data-editable-id]');
          if (t) { t.style.outline=''; t.style.cursor=''; }
        });
      <\/script>`;
      return rawHtml.replace(/<\/body>/i, script + '</body>') || rawHtml + script;
    },
    [editMode]
  );

  const loadPreview = useCallback(() => {
    if (!activeProject?.id) return;
    setLoading(true);
    setError(null);
    projectsService
      .getPreview(activeProject.id, activePage)
      .then((res) => {
        const raw = typeof res.data === 'string' ? res.data : res.data.html || '';
        setHtml(raw);
      })
      .catch(() => setError('Failed to load preview'))
      .finally(() => setLoading(false));
  }, [activeProject?.id, activePage]);

  useEffect(() => { loadPreview(); }, [loadPreview]);

  // Listen to postMessages from iframe
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
          // Debounced refresh
          clearTimeout(refreshRef.current);
          refreshRef.current = setTimeout(() => loadPreview(), 500);
        } catch {
          toast.error('Failed to save change');
        }
      }, 300);
    },
    [activeProject?.id, loadPreview]
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#111]">
        <Loader2 size={24} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#111] text-center">
        <p className="text-sm text-red-400 mb-3">{error}</p>
        <Button variant="secondary" size="sm" onClick={loadPreview}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-start justify-center overflow-auto bg-[#111] p-4 relative">
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
        style={{ width: DEVICE_WIDTHS[deviceMode], minHeight: '600px', maxWidth: '100%' }}
      >
        {html ? (
          <iframe
            ref={iframeRef}
            srcDoc={getEditableHtml(html)}
            title="Store Preview"
            className="w-full min-h-[600px] border-0"
            style={{ height: '100%', minHeight: '600px' }}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center min-h-[600px] text-gray-400 text-sm">
            No preview available. Generate a store first.
          </div>
        )}
      </div>

      {/* Inline editor overlay */}
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

// ─── Monaco Code Viewer ────────────────────────────────
function CodeViewerPane() {
  const activeProject = useProjectsStore((s) => s.activeProject);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [readOnly, setReadOnly] = useState(true);

  useEffect(() => {
    if (!activeProject?.id) return;
    projectsService
      .getFiles(activeProject.id)
      .then((res) => {
        const fileList = res.data.files || res.data || [];
        setFiles(fileList);
        if (fileList.length > 0) selectFile(fileList[0]);
      })
      .catch(() => {});
  }, [activeProject?.id]);

  const selectFile = async (file) => {
    setSelectedFile(file);
    setLoadingContent(true);
    try {
      const res = await projectsService.getFile(activeProject.id, file.id);
      setFileContent(res.data.content || '');
    } catch {
      setFileContent('// Could not load file content');
    } finally {
      setLoadingContent(false);
    }
  };

  const getLanguage = (filename = '') => {
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.sql')) return 'sql';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    toast.success('Copied to clipboard');
  };

  const handleDownloandFile = () => {
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile?.name || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#111]">
      {/* File tree */}
      <div className="w-52 border-r border-white/10 overflow-y-auto py-2">
        {files.length === 0 ? (
          <p className="text-xs text-gray-500 px-4 py-2">No files yet</p>
        ) : (
          files.map((f) => (
            <button
              key={f.id}
              onClick={() => selectFile(f)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left truncate transition-colors
                ${selectedFile?.id === f.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <FileText size={12} />
              {f.name}
            </button>
          ))
        )}
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0e0e0e]">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>{selectedFile.path || selectedFile.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReadOnly(!readOnly)}
                className={`px-2 py-1 rounded text-xs font-medium border transition-colors
                  ${readOnly
                    ? 'border-white/10 text-gray-500 hover:text-white'
                    : 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                  }`}
              >
                {readOnly ? 'Read only' : 'Editing'}
              </button>
              <button onClick={handleCopy} className="p-1.5 text-gray-500 hover:text-white">
                <Copy size={13} />
              </button>
              <button onClick={handleDownloandFile} className="p-1.5 text-gray-500 hover:text-white">
                <Download size={13} />
              </button>
            </div>
          </div>
        )}

        {loadingContent ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <Editor
            height="100%"
            language={getLanguage(selectedFile?.name)}
            value={fileContent}
            onChange={(val) => !readOnly && setFileContent(val || '')}
            theme="vs-dark"
            options={{
              readOnly,
              fontSize: 13,
              lineNumbers: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              renderLineHighlight: 'gutter',
              padding: { top: 12, bottom: 12 },
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Builder Page ────────────────────────────────
export default function BuilderPage() {
  const { id } = useParams();
  const { viewMode, reset } = useBuilderStore();
  const { setActiveProject, activeProject } = useProjectsStore();

  useEffect(() => {
    // Load project data
    projectsService
      .get(id)
      .then((res) => setActiveProject(res.data))
      .catch(() => {});

    return () => reset();
  }, [id, setActiveProject, reset]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      <BuilderToolbar />
      <div className="flex flex-1 overflow-hidden">
        <BuilderSidebar />
        {viewMode === 'preview' ? <LivePreview /> : <CodeViewerPane />}
      </div>
    </div>
  );
}
