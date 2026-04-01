import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  File, Folder, FolderOpen, Copy, Download, Edit3, Eye,
  ArrowLeft, Save, Check, Loader2, Search, X, PanelLeftClose,
  PanelLeftOpen, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectsService } from '@/services/projects.service';
import useProjectsStore from '@/store/projects.store';
import { Spinner } from '@/components/common';

const EXT_LANG = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  css: 'css', html: 'html', json: 'json', md: 'markdown',
  py: 'python', txt: 'plaintext',
};

function getLang(filename = '') {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_LANG[ext] || 'plaintext';
}

function normalizePath(path = '') {
  return String(path).replace(/\\/g, '/');
}

function FileTree({ files, activePath, onSelect, openDirs, setOpenDirs, depth = 0 }) {

  const dirs = {};
  const rootFiles = [];

  files.forEach((f) => {
    const parts = normalizePath(f.path).split('/');
    if (parts.length === 1) {
      rootFiles.push({ ...f, path: normalizePath(f.path) });
    } else {
      const dir = parts[0];
      if (!dirs[dir]) dirs[dir] = [];
      dirs[dir].push({ ...f, path: parts.slice(1).join('/') });
    }
  });

  const toggleDir = (dir) =>
    setOpenDirs((s) => ({ ...s, [dir]: !s[dir] }));

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      {Object.entries(dirs).map(([dir, children]) => (
        <div key={dir}>
          <button
            onClick={() => toggleDir(dir)}
            className="flex items-center gap-1.5 w-full px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          >
            {openDirs[dir] ? (
              <FolderOpen size={13} className="text-yellow-500" />
            ) : (
              <Folder size={13} className="text-yellow-500" />
            )}
            {dir}
          </button>
          {openDirs[dir] && (
            <FileTree
              files={children}
              activePath={activePath}
              onSelect={onSelect}
              openDirs={openDirs}
              setOpenDirs={setOpenDirs}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
      {rootFiles.map((f) => (
        <button
          key={f.path}
          onClick={() => onSelect(f)}
          className={`flex items-center gap-1.5 w-full px-2 py-1 text-xs rounded transition-colors
            ${activePath === normalizePath(f.path)
              ? 'bg-blue-600/20 text-blue-300'
              : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <File size={12} className="flex-shrink-0" />
          <span className="truncate">{f.path}</span>
        </button>
      ))}
    </div>
  );
}

export default function CodeViewerPage() {
  const { id } = useParams();
  const updateProjectFile = useProjectsStore((s) => s.updateProjectFile);

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState('');
  const [openTabs, setOpenTabs] = useState([]);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDirs, setOpenDirs] = useState({ src: true, app: true, components: true });
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRef = useRef(null);

  const activePath = normalizePath(activeFile?.path || '');

  const filteredFiles = useMemo(() => {
    if (!searchTerm.trim()) return files;
    const query = searchTerm.toLowerCase();
    return files.filter((f) => normalizePath(f.path).toLowerCase().includes(query));
  }, [files, searchTerm]);

  const ensurePathOpen = useCallback((path) => {
    const parts = normalizePath(path).split('/');
    if (parts.length <= 1) return;

    setOpenDirs((prev) => {
      const next = { ...prev };
      let current = '';
      parts.slice(0, -1).forEach((segment) => {
        current = current ? `${current}/${segment}` : segment;
        next[current] = true;
        if (segment && !next[segment]) next[segment] = true;
      });
      return next;
    });
  }, []);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectsService.getFiles(id);
      const list = (res.data?.files || []).map((f) => ({ ...f, path: normalizePath(f.path) }));
      setFiles(list);
      if (list.length > 0) {
        const current = activeFile ? list.find((f) => f.path === normalizePath(activeFile.path)) : null;
        await selectFile(current || list[0]);
      } else {
        setActiveFile(null);
        setCode('');
      }
    } catch {
      toast.error('Could not load project files');
    } finally {
      setLoading(false);
    }
  }, [id, activeFile]);

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectFile = useCallback(async (file) => {
    const normalizedFile = { ...file, path: normalizePath(file.path) };
    setActiveFile(normalizedFile);
    setOpenTabs((prev) => {
      if (prev.some((t) => normalizePath(t.path) === normalizedFile.path)) return prev;
      return [...prev, normalizedFile].slice(-10);
    });
    ensurePathOpen(normalizedFile.path);
    setDirty(false);
    setEditMode(false);
    setFileLoading(true);
    try {
      const res = await projectsService.getFile(id, normalizedFile.path);
      setCode(res.data?.content || '');
      setCursorPosition({ line: 1, column: 1 });
    } catch {
      setCode('// Could not load file');
    } finally {
      setFileLoading(false);
    }
  }, [ensurePathOpen, id]);

  const closeTab = (pathToClose) => {
    const normalized = normalizePath(pathToClose);
    setOpenTabs((prev) => prev.filter((t) => normalizePath(t.path) !== normalized));
    if (activePath === normalized) {
      const next = openTabs.filter((t) => normalizePath(t.path) !== normalized).pop();
      if (next) {
        selectFile(next);
      } else {
        setActiveFile(null);
        setCode('');
      }
    }
  };

  const handleSave = useCallback(async () => {
    if (!activeFile || !dirty) return;
    setSaving(true);
    try {
      await projectsService.updateFile(id, activeFile.path, code);
      updateProjectFile(id, activeFile.path, code);
      setDirty(false);
      toast.success('Saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  }, [activeFile, dirty, id, code, updateProjectFile]);

  // Ctrl/Cmd + S to save
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.path.split('/').pop();
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/10 flex-shrink-0">
        <Link
          to={id ? `/projects/${id}` : '/dashboard'}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Builder
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-sm text-gray-400 truncate max-w-[32rem]">
          {activeFile?.path || 'Select a file'}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setExplorerOpen((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            {explorerOpen ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
            Explorer
          </button>
          <button
            onClick={loadFiles}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            <Download size={13} />
            Download
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors
              ${editMode
                ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                : 'border-white/10 text-gray-400 hover:text-white'}`}
          >
            {editMode ? <Edit3 size={13} /> : <Eye size={13} />}
            {editMode ? 'Editing' : 'Read-only'}
          </button>
          {dirty && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {explorerOpen && (
          <div className="w-64 flex-shrink-0 border-r border-white/10 overflow-y-auto py-2">
            <div className="px-3 mb-2">
              <div className="relative">
                <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search files"
                  className="w-full pl-7 pr-7 py-1.5 text-xs rounded-md bg-white/5 border border-white/10 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
            {filteredFiles.length === 0 ? (
              <p className="px-4 text-xs text-gray-600 mt-4">No files found</p>
            ) : (
              <FileTree
                files={filteredFiles}
                activePath={activePath}
                onSelect={selectFile}
                openDirs={openDirs}
                setOpenDirs={setOpenDirs}
              />
            )}
          </div>
        )}

        <div className="flex-1 relative">
          <div className="h-9 border-b border-white/10 bg-[#101010] flex items-center overflow-x-auto">
            {openTabs.length === 0 ? (
              <span className="px-3 text-xs text-gray-500">No file open</span>
            ) : (
              openTabs.map((tab) => {
                const tabPath = normalizePath(tab.path);
                const isActive = tabPath === activePath;
                return (
                  <button
                    key={tabPath}
                    onClick={() => selectFile(tab)}
                    className={`h-full px-3 border-r border-white/10 text-xs flex items-center gap-2 max-w-[18rem]
                      ${isActive ? 'bg-[#181818] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <File size={12} className="shrink-0" />
                    <span className="truncate">{tabPath.split('/').pop()}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tabPath);
                      }}
                      className="text-gray-500 hover:text-white"
                    >
                      <X size={12} />
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {fileLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 z-10">
              <Spinner />
            </div>
          )}

          <Editor
            height="calc(100% - 2.25rem - 1.75rem)"
            language={getLang(activeFile?.path)}
            value={code}
            onChange={(v) => { setCode(v || ''); setDirty(true); }}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.onDidChangeCursorPosition((event) => {
                setCursorPosition({
                  line: event.position.lineNumber,
                  column: event.position.column,
                });
              });
            }}
            options={{
              readOnly: !editMode,
              fontSize: 13.5,
              fontFamily: '"Fira Code", "JetBrains Mono", monospace',
              fontLigatures: true,
              minimap: { enabled: true, size: 'proportional' },
              scrollBeyondLastLine: false,
              wordWrap: 'off',
              lineNumbersMinChars: 3,
              renderLineHighlight: 'all',
              automaticLayout: true,
              bracketPairColorization: { enabled: true },
              guides: { indentation: true, highlightActiveIndentation: true },
              smoothScrolling: true,
              cursorSmoothCaretAnimation: 'on',
            }}
            theme="vs-dark"
          />

          <div className="h-7 border-t border-white/10 bg-[#101010] text-[11px] text-gray-400 px-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>{getLang(activeFile?.path)}</span>
              <span>UTF-8</span>
              <span>LF</span>
              <span>{editMode ? 'Editable' : 'Read-only'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
              {dirty && <span className="text-amber-400">Unsaved changes</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
