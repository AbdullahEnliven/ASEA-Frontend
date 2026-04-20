import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List, Trash2, ExternalLink, Download, Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectsService } from '@/services/projects.service';
import { Button, Badge, Spinner } from '@/components/common';
import useProjectsStore from '@/store/projects.store';
import toast from 'react-hot-toast';

const statusVariant = {
  draft: 'default',
  generating: 'warning',
  ready: 'success',
  deployed: 'info',
};

function ProjectCard({ project }) {
  const [downloading, setDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const previewUrl = project.thumbnailUrl || project.thumbnail_url || '';
  const createdAtValue = project.createdAt || project.created_at;
  const createdDate = createdAtValue ? new Date(createdAtValue) : null;
  const createdDateLabel = createdDate && !Number.isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString()
    : 'Unknown date';
  const initials = (project.name || 'New Store')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'NS';
  const hasPreviewImage = Boolean(previewUrl) && !imageError;

  const handleDownloadProject = async () => {
    setDownloading(true);
    try {
      const res = await projectsService.download(project.id);
      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name || 'project'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download project zip');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-all">
      <div className="h-36 rounded-xl bg-white/5 mb-4 overflow-hidden flex items-center justify-center text-gray-600 text-sm">
        {hasPreviewImage ? (
          <img
            src={previewUrl}
            alt={`${project.name} preview`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-950">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/15 blur-xl" />
            <div className="absolute -left-6 -bottom-8 h-24 w-24 rounded-full bg-emerald-400/15 blur-xl" />
            <div className="relative z-10 flex h-full items-center gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{project.name || 'Untitled Project'}</p>
                <p className="mt-0.5 text-xs text-gray-300">Preview will appear after generation or deployment</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-white">{project.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {createdDateLabel}
          </p>
        </div>
        <Badge variant={statusVariant[project.status] || 'default'}>
          {project.status}
        </Badge>
      </div>
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/projects/${project.id}`}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
        >
          <ExternalLink size={12} /> Open
        </Link>
        <Link
          to={`/projects/${project.id}/code`}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10"
        >
          <Code2 size={12} /> Code
        </Link>
        <button
          onClick={handleDownloadProject}
          disabled={downloading}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download size={12} /> {downloading ? 'Downloading...' : 'Download'}
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 ml-auto">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const projects = useProjectsStore((s) => s.projects);
  const setProjects = useProjectsStore((s) => s.setProjects);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.list()
      .then((res) => {
         const items = res.data.items || res.data || [];
         const sortedProjects = [...items].sort((a, b) => {
           const aTime = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
           const bTime = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
           return bTime - aTime;
         });
         setProjects(sortedProjects);
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, [setProjects]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-24">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Stores Live', value: projects.filter((p) => p.status === 'deployed').length },
          { label: 'Storage Used', value: '0 MB' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Projects</h1>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <List size={16} />
            </button>
          </div>
          <Link to="/projects/new">
            <Button size="md">
              <Plus size={16} /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Plus size={32} className="text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Create your first AI-generated e-commerce store in minutes.
          </p>
          <Link to="/projects/new">
            <Button size="lg">
              <Plus size={18} /> Create Your First Store
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
          }
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
