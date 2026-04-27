import { Link } from 'react-router-dom';
import {
  Plus,
  LayoutGrid,
  List,
  Trash2,
  ExternalLink,
  Download,
  Code2,
  Search,
  SlidersHorizontal,
  X,
  Share2,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
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

const getProjectStorageBytes = (project) => {
  const value = project.storage_bytes ?? project.storageBytes ?? 0;
  const bytes = Number(value);
  return Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
};

const getProjectVercelUrl = (project) =>
  project.vercel_url ||
  project.vercelUrl ||
  project.vercel_production_url ||
  project.vercelProductionUrl ||
  project.vercel_preview_url ||
  project.vercelPreviewUrl ||
  '';

const isProjectLive = (project) => {
  const live = project.is_live ?? project.isLive;
  if (live !== undefined && live !== null) return Boolean(live);
  return Boolean(getProjectVercelUrl(project));
};

const getProjectStatus = (project) => (isProjectLive(project) ? 'deployed' : project.status);

const isDatabaseConnected = (project) => Boolean(
  project.supabase_connected ?? project.supabaseConnected
);

const getCreatedTime = (project) => new Date(project.createdAt ?? project.created_at ?? 0).getTime() || 0;

const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const origin = new URL(apiBase, window.location.origin).origin;
  return `${origin}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatBytes = (bytes) => {
  if (!bytes) return '0 MB';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** exponent);
  const precision = value >= 10 || exponent === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[exponent]}`;
};

function ProjectCard({ project }) {
  const [downloading, setDownloading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const previewUrl = resolveAssetUrl(project.thumbnailUrl || project.thumbnail_url || '');
  const deployedUrl = getProjectVercelUrl(project);
  const createdAtValue = project.createdAt || project.created_at;
  const createdDate = createdAtValue ? new Date(createdAtValue) : null;
  const createdDateLabel = createdDate && !Number.isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString()
    : 'Unknown date';
  const displayStatus = getProjectStatus(project);
  const databaseConnected = isDatabaseConnected(project);

  useEffect(() => {
    setPreviewFailed(false);
  }, [previewUrl]);

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

  const handleShareStore = async () => {
    if (!deployedUrl) {
      toast.error('This store is not deployed yet');
      return;
    }

    try {
      await navigator.clipboard.writeText(deployedUrl);
      toast.success('Deployed store link copied');
    } catch {
      toast.error('Failed to copy store link');
    }
  };

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 transition-all">
      <div className="relative h-36 rounded-xl bg-white/5 mb-4 overflow-hidden flex items-center justify-center text-gray-600 text-sm">
        {previewUrl && !previewFailed ? (
          <img
            src={previewUrl}
            alt={`${project.name} preview`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-6 text-center">
            <p className="text-sm font-medium text-gray-300">{project.name}</p>
            <p className="mt-1 text-xs text-gray-500">Thumbnail is being generated</p>
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
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant={statusVariant[displayStatus] || 'default'}>
            {displayStatus}
          </Badge>
          <Badge variant={databaseConnected ? 'success' : 'danger'}>
            {databaseConnected ? 'database connected' : 'database not connected'}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
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
          onClick={handleShareStore}
          disabled={!deployedUrl}
          className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10 disabled:opacity-45 disabled:cursor-not-allowed"
          title={deployedUrl || 'Deploy this store before sharing'}
        >
          <Share2 size={12} /> Share
        </button>
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    query: '',
    deployment: 'all',
    database: 'all',
    sort: 'newest',
  });

  useEffect(() => {
    let mounted = true;

    projectsService.list()
      .then((res) => {
         if (!mounted) return;
         const items = res.data.items || res.data || [];
         const sortedProjects = [...items].sort((a, b) => {
           const aTime = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
           const bTime = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
           return bTime - aTime;
         });
         setProjects(sortedProjects);
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [setProjects]);

  const filteredProjects = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return projects
      .filter((project) => {
        const name = String(project.name || '').toLowerCase();
        const slug = String(project.slug || '').toLowerCase();
        const matchesQuery = !query || name.includes(query) || slug.includes(query);
        const status = getProjectStatus(project);
        const matchesDeployment = filters.deployment === 'all' || status === filters.deployment;
        const connected = isDatabaseConnected(project);
        const matchesDatabase =
          filters.database === 'all' ||
          (filters.database === 'connected' && connected) ||
          (filters.database === 'not_connected' && !connected);

        return matchesQuery && matchesDeployment && matchesDatabase;
      })
      .sort((a, b) => {
        if (filters.sort === 'oldest') return getCreatedTime(a) - getCreatedTime(b);
        if (filters.sort === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
        if (filters.sort === 'storage') return getProjectStorageBytes(b) - getProjectStorageBytes(a);
        return getCreatedTime(b) - getCreatedTime(a);
      });
  }, [projects, filters]);

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    filters.deployment !== 'all' ||
    filters.database !== 'all' ||
    filters.sort !== 'newest';

  const resetFilters = () => {
    setFilters({
      query: '',
      deployment: 'all',
      database: 'all',
      sort: 'newest',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const storesLive = projects.filter((project) => {
    return isProjectLive(project);
  }).length;
  const storageUsed = projects.reduce(
    (total, project) => total + getProjectStorageBytes(project),
    0
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Stores Live', value: storesLive },
          { label: 'Storage Used', value: formatBytes(storageUsed) },
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
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-xl font-bold">Projects</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={filters.query}
              onChange={(e) => setFilters((current) => ({ ...current, query: e.target.value }))}
              placeholder="Search projects"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500/40"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((current) => !current)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              filtersOpen || hasActiveFilters
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
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

      {filtersOpen && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-gray-400">Deployment</span>
              <select
                value={filters.deployment}
                onChange={(e) => setFilters((current) => ({ ...current, deployment: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
              >
                <option value="all">All statuses</option>
                <option value="deployed">Deployed</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
                <option value="draft">Draft</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-gray-400">Database</span>
              <select
                value={filters.database}
                onChange={(e) => setFilters((current) => ({ ...current, database: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
              >
                <option value="all">All database states</option>
                <option value="connected">Connected</option>
                <option value="not_connected">Not connected</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-gray-400">Sort</span>
              <select
                value={filters.sort}
                onChange={(e) => setFilters((current) => ({ ...current, sort: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A-Z</option>
                <option value="storage">Storage used</option>
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={15} /> Clear filters
              </button>
            </div>
          </div>
        </div>
      )}

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
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <SlidersHorizontal size={30} className="text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No matching projects</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            Adjust your filters to see more stores.
          </p>
          <Button size="md" variant="secondary" onClick={resetFilters}>
            <X size={16} /> Clear filters
          </Button>
        </div>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
          }
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
