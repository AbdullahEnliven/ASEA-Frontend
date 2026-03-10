import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, PlusCircle, Settings, CreditCard, Code2, Rocket, X } from 'lucide-react';
import useProjectsStore from '@/store/projects.store';

const STATIC_COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'new-project', label: 'New Project', icon: PlusCircle, path: '/projects/new' },
  { id: 'account', label: 'Account Settings', icon: Settings, path: '/account' },
  { id: 'billing', label: 'Billing', icon: CreditCard, path: '/account/billing' },
];

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const projects = useProjectsStore((s) => s.projects);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const projectCommands = projects.map((p) => ({
    id: `project-${p.id}`,
    label: p.name,
    description: 'Open Builder',
    icon: Code2,
    path: `/projects/${p.id}`,
    group: 'Projects',
    extra: [
      { label: 'Code', icon: Code2, path: `/projects/${p.id}/code` },
      { label: 'Deploy', icon: Rocket, path: `/projects/${p.id}/deploy` },
    ],
  }));

  const allCommands = [...STATIC_COMMANDS, ...projectCommands];

  const filtered = query.trim()
    ? allCommands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  const run = useCallback(
    (path) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selected]) run(filtered[selected].path);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, filtered, selected, run, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-xl mx-4 rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search size={16} className="text-gray-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, pages, projects…"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
          />
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-500">No results</p>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => run(cmd.path)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                    ${i === selected ? 'bg-blue-600/20 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                >
                  <Icon size={15} className={i === selected ? 'text-blue-400' : 'text-gray-500'} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm">{cmd.label}</span>
                    {cmd.description && (
                      <span className="ml-2 text-xs text-gray-500">{cmd.description}</span>
                    )}
                  </div>
                  {cmd.group && (
                    <span className="text-xs text-gray-600">{cmd.group}</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/10 px-4 py-2 flex items-center gap-4 text-xs text-gray-600">
          <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded">↵</kbd> open</span>
          <span><kbd className="bg-white/5 px-1.5 py-0.5 rounded">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
