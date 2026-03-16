import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import { STORE_CATEGORIES } from '@/constants';
import useGenerationStore from '@/store/generation.store';
import useProjectsStore from '@/store/projects.store';
import { projectsService } from '@/services/projects.service';
import { integrationsService } from '@/services/integrations.service';
import useGenerationSocket from '@/hooks/useGenerationSocket';

// ─── Step 1: Requirement Input ────────────────────────
function RequirementStep({ data, onChange, onNext }) {
  const [enhancing, setEnhancing] = useState(false);

  const enhance = async () => {
    if (!data.requirements?.trim()) {
      toast.error('Please describe your store first');
      return;
    }
    setEnhancing(true);
    try {
      const res = await projectsService.enhanceRequirements(data.requirements);
      onChange({ requirements: res.data.enhanced });
      toast.success('Requirements enhanced!');
    } catch {
      toast.error('Enhancement failed');
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Describe Your Store</h2>
      <p className="text-gray-400 text-sm mb-8">
        Tell us what kind of e-commerce store you want to build. Be as detailed as you like.
      </p>

      <textarea
        value={data.requirements || ''}
        onChange={(e) => onChange({ requirements: e.target.value })}
        rows={8}
        placeholder="I want a fashion store selling streetwear for men and women. I need size and color variants, a lookbook page, and Instagram-style product photos..."
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {data.requirements?.length || 0} characters
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={enhance}
          loading={enhancing}
        >
          <Sparkles size={14} /> Enhance with AI
        </Button>
      </div>

      {/* Category pills */}
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3">Store Category</p>
        <div className="flex flex-wrap gap-2">
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border
                ${data.category === cat
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <details className="mt-6">
        <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">
          Optional: Additional details
        </summary>
        <div className="mt-4 space-y-4">
          <Input
            label="Store Name"
            placeholder="My Awesome Store"
            value={data.storeName || ''}
            onChange={(e) => onChange({ storeName: e.target.value })}
          />
          <Input
            label="Target Market"
            placeholder="e.g. Young adults 18-35"
            value={data.targetMarket || ''}
            onChange={(e) => onChange({ targetMarket: e.target.value })}
          />
        </div>
      </details>

      <div className="flex justify-end mt-8">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!data.requirements?.trim()}
        >
          Generate Specification <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: Specification Review ─────────────────────
function SpecReviewStep({ spec, onBack, onGenerate, loading }) {
  if (!spec) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-blue-500" />
        <span className="ml-3 text-gray-400">Generating specification...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Review Specification</h2>
      <p className="text-gray-400 text-sm mb-8">
        The AI has generated a spec for your store. Review and adjust before generating.
      </p>
      <p className="text-amber-300/90 text-sm mb-6 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
        Supabase connection is required before generation. You will be redirected to connect if it is missing.
      </p>

      <div className="space-y-4">
        {/* Store info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Store</h3>
          <p className="text-lg font-semibold">{spec.name || 'Untitled Store'}</p>
          {spec.tagline && <p className="text-sm text-gray-400 mt-1">{spec.tagline}</p>}
        </div>

        {/* Modules */}
        {spec.modules?.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Modules</h3>
            <div className="flex flex-wrap gap-2">
              {spec.modules.map((m) => (
                <span key={m} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pages */}
        {spec.pages?.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Pages</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {spec.pages.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" /> {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Features */}
        {spec.features?.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Features</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {spec.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button size="lg" onClick={onGenerate} loading={loading}>
          <Sparkles size={16} /> Generate Store
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Generation Progress ──────────────────────
function GenerationStep({ projectId }) {
  const { status, progress, logs, currentStep } = useGenerationStore();

  useGenerationSocket(projectId);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Building Your Store</h2>
      <p className="text-gray-400 text-sm mb-8">
        {currentStep || 'Initializing generation...'}
      </p>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-400 text-right mb-6">{progress}%</p>

      {/* Log stream */}
      <div className="rounded-2xl border border-white/10 bg-black/50 p-4 h-72 overflow-y-auto font-mono text-xs space-y-1">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`${
              log.level === 'error' ? 'text-red-400' :
              log.level === 'success' ? 'text-emerald-400' :
              'text-gray-400'
            }`}
          >
            {log.line}
          </div>
        ))}
        {status === 'running' && (
          <div className="flex items-center gap-2 text-blue-400">
            <Loader2 size={12} className="animate-spin" />
            Processing...
          </div>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          Generation failed. Please try again.
        </div>
      )}
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────
export default function NewProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [spec, setSpec] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const addProject = useProjectsStore((s) => s.addProject);
  const generationReset = useGenerationStore((s) => s.reset);

  const updateData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNextToSpec = async () => {
    setLoading(true);
    try {
      const res = await projectsService.create({
        requirements: data.requirements,
        category: data.category,
        storeName: data.storeName,
        targetMarket: data.targetMarket,
      });
      setProjectId(res.data.project.id);
      setSpec(res.data.spec);
      addProject(res.data.project);
      setStep(2);
    } catch {
      toast.error('Failed to generate spec');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const supabaseStatus = await integrationsService.getSupabaseStatus(projectId);
      if (!supabaseStatus.data?.connected) {
        toast.error('Connect your Supabase project before generation');
        navigate(`/projects/${projectId}/deploy?tab=supabase`);
        return;
      }

      generationReset();
      await projectsService.startGeneration(projectId);
      setStep(3);
    } catch (error) {
      const message = error?.response?.data?.detail;
      toast.error(message || 'Failed to start generation');
    } finally {
      setLoading(false);
    }
  };

  // When generation completes, navigate to builder
  useEffect(() => {
    const unsub = useGenerationStore.subscribe((state) => {
      if (state.status === 'complete' && projectId) {
        toast.success('Store generated!');
        navigate(`/projects/${projectId}`);
      }
    });
    return unsub;
  }, [projectId, navigate]);

  // Step indicators
  const stepLabels = ['Describe', 'Review', 'Generate'];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-8 mb-12">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${step > i + 1
                  ? 'bg-emerald-500 text-white'
                  : step === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-500'
                }`}
            >
              {step > i + 1 ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                step === i + 1 ? 'text-white' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className="w-12 h-px bg-white/10 ml-3" />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <RequirementStep data={data} onChange={updateData} onNext={handleNextToSpec} />
      )}
      {step === 2 && (
        <SpecReviewStep
          spec={spec}
          onBack={() => setStep(1)}
          onGenerate={handleGenerate}
          loading={loading}
        />
      )}
      {step === 3 && <GenerationStep projectId={projectId} />}
    </div>
  );
}
