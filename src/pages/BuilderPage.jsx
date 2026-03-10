import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from 'lucide-react';
import useBuilderStore from '@/store/builder.store';
import useProjectsStore from '@/store/projects.store';
import { projectsService } from '@/services/projects.service';
import { DEVICE_WIDTHS } from '@/constants';
import { Button } from '@/components/common';

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

// ─── Live Preview ─────────────────────────────────────
function LivePreview() {
  const { deviceMode, activePage, editMode } = useBuilderStore();
  const activeProject = useProjectsStore((s) => s.activeProject);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeProject?.id) return;
    setLoading(true);
    setError(null);
    projectsService
      .getPreview(activeProject.id, activePage)
      .then((res) => setHtml(res.data.html || res.data))
      .catch(() => setError('Failed to load preview'))
      .finally(() => setLoading(false));
  }, [activeProject?.id, activePage]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-red-400 mb-3">{error}</p>
        <Button variant="secondary" size="sm" onClick={() => setError(null)}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-start justify-center overflow-auto bg-[#111] p-4">
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          width: DEVICE_WIDTHS[deviceMode],
          minHeight: '600px',
          maxWidth: '100%',
        }}
      >
        {html ? (
          <iframe
            srcDoc={html}
            title="Store Preview"
            className="w-full h-full min-h-[600px] border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[600px] text-gray-400 text-sm">
            No preview available. Generate a store first.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code Viewer (placeholder for Monaco) ─────────────
function CodeViewer() {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm bg-[#111]">
      <div className="text-center">
        <Code2 size={32} className="mx-auto mb-3 text-gray-600" />
        <p>Code viewer will load here.</p>
        <p className="text-xs text-gray-600 mt-1">Monaco Editor integration</p>
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
        {viewMode === 'preview' ? <LivePreview /> : <CodeViewer />}
      </div>
    </div>
  );
}
