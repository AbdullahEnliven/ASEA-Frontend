import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  File, Folder, FolderOpen, Copy, Download, Edit3, Eye,
  ArrowLeft, Save, Check, Loader2,
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

function FileTree({ files, active, onSelect, depth = 0 }) {
  const [openDirs, setOpenDirs] = useState({});

  const dirs = {};
  const rootFiles = [];

  files.forEach((f) => {
    const parts = f.path.split('/');
    if (parts.length === 1) {
      rootFiles.push(f);
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
            <FileTree files={children} active={active} onSelect={onSelect} depth={depth + 1} />
          )}
        </div>
      ))}
      {rootFiles.map((f) => (
        <button
          key={f.path}
          onClick={() => onSelect(f)}
          className={`flex items-center gap-1.5 w-full px-2 py-1 text-xs rounded transition-colors
            ${active?.path === f.path
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
  const activeProject = useProjectsStore((s) => s.activeProject);

  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load file list
  useEffect(() => {
    async function load() {
      try {
        const res = await projectsService.getFiles(id);
        const list = res.data?.files || [];
        setFiles(list);
        if (list.length > 0) selectFile(list[0]);
      } catch {
        toast.error('Could not load project files');
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function selectFile(file) {
    setActiveFile(file);
    setDirty(false);
    setEditMode(false);
    setFileLoading(true);
    try {
      const res = await projectsService.getFile(id, file.path);
      setCode(res.data?.content || '');
    } catch {
      setCode('// Could not load file');
    } finally {
      setFileLoading(false);
    }
  }

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
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/10 flex-shrink-0">
        <Link
          to={id ? `/projects/${id}` : '/dashboard'}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Builder
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-sm text-gray-400 truncate">
          {activeFile?.path || 'Select a file'}
        </span>

        <div className="ml-auto flex items-center gap-2">
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
        {/* File tree */}
        <div className="w-52 flex-shrink-0 border-r border-white/10 overflow-y-auto py-2">
          {files.length === 0 ? (
            <p className="px-4 text-xs text-gray-600 mt-4">No files found</p>
          ) : (
            <FileTree files={files} active={activeFile} onSelect={selectFile} />
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          {fileLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 z-10">
              <Spinner />
            </div>
          )}
          <Editor
            height="100%"
            language={getLang(activeFile?.path)}
            value={code}
            onChange={(v) => { setCode(v || ''); setDirty(true); }}
            options={{
              readOnly: !editMode,
              fontSize: 13,
              fontFamily: '"Fira Code", "JetBrains Mono", monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbersMinChars: 3,
              renderLineHighlight: 'all',
            }}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
}
