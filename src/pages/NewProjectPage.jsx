import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Check,
  Database,
  FlaskConical,
  Layers3,
  Layout,
  Loader2,
  Palette,
  Rocket,
  Server,
  Sparkles,
  Store,
  WandSparkles,
} from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/common';
import { STORE_CATEGORIES } from '@/constants';
import useGenerationStore from '@/store/generation.store';
import useProjectsStore from '@/store/projects.store';
import { projectsService } from '@/services/projects.service';

const BETA_PROJECT_LIMIT = 5;

const inputClass =
  '!rounded-lg !border-[#d8d0c0] !bg-white px-4 py-3 !text-[#10131b] placeholder:!text-[#9a9387] focus:!border-[#0f766e] focus:!ring-[#0f766e]/20';
const labelClass = 'font-black text-[#343945]';
const errorClass = 'text-[#ba4d41]';

const promptIdeas = [
  {
    title: 'Fashion drop',
    category: 'Fashion',
    prompt:
      'Create a premium streetwear store for limited hoodie and sneaker drops. Include product variants, waitlist capture, editorial collection pages, size guides, and a fast checkout flow.',
  },
  {
    title: 'Beauty brand',
    category: 'Beauty',
    prompt:
      'Build a clean skincare store for a modern beauty brand. Include routine bundles, ingredient education, reviews, subscription options, and a soft editorial visual style.',
  },
  {
    title: 'Home goods',
    category: 'Home goods',
    prompt:
      'Generate a warm home decor store with curated collections, room inspiration pages, product filters, shipping details, and an admin area for inventory and orders.',
  },
];

const agents = [
  { id: 'architect', name: 'Architect', glyph: <Database size={20} />, task: 'Schema and product model' },
  { id: 'backend', name: 'Backend', glyph: <Server size={20} />, task: 'API and commerce rules' },
  { id: 'frontend', name: 'Frontend', glyph: <Layout size={20} />, task: 'Pages and interactions' },
  { id: 'stylist', name: 'Stylist', glyph: <Palette size={20} />, task: 'Brand and polish' },
];

function RequirementStep({ data, onChange, onGenerate }) {
  const [enhancing, setEnhancing] = useState(false);

  const briefLength = data.requirements?.trim().length || 0;
  const enhance = async () => {
    if (!data.requirements?.trim()) {
      toast.error('Please describe your store first');
      return;
    }
    setEnhancing(true);
    try {
      const res = await projectsService.enhanceRequirements(data.requirements);
      onChange({ requirements: res.data.enhanced });
      toast.success('Requirements enhanced');
    } catch {
      toast.error('Enhancement failed');
    } finally {
      setEnhancing(false);
    }
  };

  const applyIdea = (idea) => {
    onChange({ requirements: idea.prompt, category: idea.category });
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-7xl"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-[#d8d0c0] bg-white p-6 shadow-[0_18px_55px_rgba(22,24,31,0.06)] lg:p-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#9a6a0a]">
                Launch brief
              </p>
              <h2 className="text-2xl font-black tracking-tight text-[#10131b]">
                What are we building?
              </h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={enhance}
              loading={enhancing}
              className="!rounded-lg !border-[#d8d0c0] !bg-[#fffaf0] font-black !text-[#10131b] hover:!border-[#10131b] hover:!bg-[#f6f1e8]"
            >
              <Sparkles size={14} /> Enhance with AI
            </Button>
          </div>

          <textarea
            value={data.requirements || ''}
            onChange={(e) => onChange({ requirements: e.target.value })}
            rows={9}
            placeholder="Example: I want a premium streetwear store for limited drops. Include product variants, waitlist capture, editorial collection pages, size guides, reviews, and a fast checkout experience..."
            className="min-h-[250px] w-full resize-none rounded-lg border border-[#d8d0c0] bg-[#fffaf0] px-5 py-4 text-base leading-7 text-[#10131b] outline-none placeholder:text-[#9a9387] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-[#6f766f]">
              {briefLength} characters
            </span>
            <span className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
              More detail creates a stronger first build
            </span>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-black text-[#343945]">Store category</p>
            <div className="flex flex-wrap gap-2">
              {STORE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onChange({ category: cat })}
                  className={`rounded-lg border px-4 py-2 text-sm font-black transition-colors
                    ${data.category === cat
                      ? 'border-[#0f766e]/35 bg-[#dff7f1] text-[#0f766e]'
                      : 'border-[#d8d0c0] bg-white text-[#5c6270] hover:border-[#10131b] hover:text-[#10131b]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <details className="mt-8 rounded-lg border border-[#d8d0c0] bg-[#f7f2e8] p-4">
            <summary className="cursor-pointer text-sm font-black text-[#10131b]">
              Optional launch details
            </summary>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input
                label="Store Name"
                placeholder="Northstar Goods"
                value={data.storeName || ''}
                onChange={(e) => onChange({ storeName: e.target.value })}
                className={inputClass}
                labelClassName={labelClass}
                errorClassName={errorClass}
              />
              <Input
                label="Target Market"
                placeholder="Young adults 18-35"
                value={data.targetMarket || ''}
                onChange={(e) => onChange({ targetMarket: e.target.value })}
                className={inputClass}
                labelClassName={labelClass}
                errorClassName={errorClass}
              />
            </div>
            <p className="mt-3 text-xs font-bold text-[#6f766f]">
              Leave the store name blank if you want ASEA to suggest one.
            </p>
          </details>

          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              onClick={onGenerate}
              disabled={!data.requirements?.trim()}
              className="!rounded-lg !bg-[#10131b] px-6 py-4 font-black !text-white hover:!bg-[#253044]"
            >
              Generate store <ArrowRight size={18} />
            </Button>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-lg border border-[#d8d0c0] bg-[#fffaf0] p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dff7f1] text-[#0f766e]">
                <WandSparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-[#10131b]">Starter prompts</p>
                <p className="text-xs font-bold text-[#6f766f]">Use one, then customize it.</p>
              </div>
            </div>
            <div className="space-y-3">
              {promptIdeas.map((idea) => (
                <button
                  key={idea.title}
                  type="button"
                  onClick={() => applyIdea(idea)}
                  className="w-full rounded-lg border border-[#d8d0c0] bg-white p-4 text-left transition hover:border-[#10131b]"
                >
                  <p className="text-sm font-black text-[#10131b]">{idea.title}</p>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#5c6270]">{idea.prompt}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-[#0f766e] p-5 text-white shadow-[0_18px_55px_rgba(15,118,110,0.18)]">
            <Store className="mb-5 h-8 w-8 text-[#aee9de]" />
            <h3 className="text-xl font-black tracking-tight">A better brief makes a better store.</h3>
            <p className="mt-3 text-sm leading-6 text-white/72">
              Mention products, audience, brand style, must-have pages, payment needs, and admin workflows.
            </p>
          </div>
        </aside>
      </div>
    </Motion.div>
  );
}

function GenerationStep({ projectId }) {
  const status = useGenerationStore((state) => state.status);
  const progress = useGenerationStore((state) => state.progress);
  const logs = useGenerationStore((state) => state.logs);
  const currentStep = useGenerationStore((state) => state.currentStep);
  const setStatus = useGenerationStore((state) => state.setStatus);
  const setProgress = useGenerationStore((state) => state.setProgress);
  const setStep = useGenerationStore((state) => state.setStep);
  const appendLog = useGenerationStore((state) => state.appendLog);

  useEffect(() => {
    if (!projectId) return undefined;

    let cancelled = false;
    setStatus('running');
    setProgress(0);

    const stepsInfo = [
      { stepText: 'Mapping commerce architecture', logLines: ['Reading launch brief...', 'Designing product data...', 'Planning user journeys...', 'Preparing schema draft...'] },
      { stepText: 'Building backend foundation', logLines: ['Scaffolding API routes...', 'Setting up auth flows...', 'Preparing order logic...', 'Connecting generation tasks...'] },
      { stepText: 'Composing storefront screens', logLines: ['Creating store layout...', 'Building product cards...', 'Wiring cart states...', 'Preparing responsive pages...'] },
      { stepText: 'Applying brand polish', logLines: ['Choosing visual tokens...', 'Refining spacing...', 'Adding motion details...', 'Packaging project files...'] },
    ];

    let overallProgress = 0;
    const totalLogs = stepsInfo.reduce((acc, s) => acc + s.logLines.length, 0);
    const progressPerLog = 100 / totalLogs;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const simulateGeneration = async () => {
      await wait(1000);

      for (const info of stepsInfo) {
        if (cancelled) return;
        setStep(info.stepText);
        for (const line of info.logLines) {
          await wait(550 + Math.random() * 350);
          if (cancelled) return;
          appendLog({ level: 'info', line });
          overallProgress += progressPerLog;
          setProgress(Math.min(Math.round(overallProgress), 99));
        }
      }

      await wait(900);
      if (cancelled) return;
      appendLog({ level: 'success', line: 'Launch room assembled. Your store is ready.' });
      setProgress(100);
      setStatus('complete');
    };

    simulateGeneration();

    return () => {
      cancelled = true;
    };
  }, [appendLog, projectId, setProgress, setStatus, setStep]);

  const activeIndex = Math.min(Math.floor(progress / 25), 3);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center">
      <Motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 overflow-hidden rounded-lg border border-[#d8d0c0] bg-[#fffaf0] shadow-[0_20px_70px_rgba(22,24,31,0.08)]"
      >
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0f766e]">
              Generation in progress
            </p>
            <h2 className="max-w-3xl text-4xl font-black tracking-tight text-[#10131b] sm:text-5xl">
              ASEA agents are assembling your commerce project.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5c6270]">
              {currentStep || 'Initializing the launch workflow...'}
            </p>
          </div>

          <div className="rounded-lg bg-[#10131b] p-5 text-white">
            <div className="mb-8 flex items-center justify-between">
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#10131b]">
                Overall progress
              </span>
              <Bot className="h-6 w-6 text-[#f2b84b]" />
            </div>
            <p className="text-6xl font-black tracking-tight">{progress}%</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <Motion.div
                className="h-full rounded-full bg-[#0f766e]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
            </div>
            {status === 'running' && (
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#aee9de]">
                <Loader2 size={14} className="animate-spin" />
                Agent framework is processing
              </div>
            )}
          </div>
        </div>
      </Motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {agents.map((agent, idx) => {
            const isActive = idx === activeIndex && status !== 'complete';
            const isDone = progress >= ((idx + 1) * 25);

            return (
              <Motion.div
                key={agent.id}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative overflow-hidden rounded-lg border p-5 transition-all duration-500 ${
                  isActive
                    ? 'border-[#0f766e]/45 bg-[#dff7f1] shadow-[0_18px_55px_rgba(15,118,110,0.14)]'
                    : isDone
                      ? 'border-[#d8d0c0] bg-white'
                      : 'border-[#d8d0c0] bg-[#fffaf0]'
                }`}
              >
                <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-lg ${
                  isActive ? 'bg-[#0f766e] text-white' : isDone ? 'bg-[#10131b] text-white' : 'bg-[#e6e9f2] text-[#343945]'
                }`}>
                  {agent.glyph}
                </div>
                <h3 className="text-lg font-black text-[#10131b]">{agent.name}</h3>
                <p className="mt-2 text-sm font-bold text-[#5c6270]">{agent.task}</p>
                {isActive && (
                  <Motion.div
                    className="absolute inset-x-0 bottom-0 h-1 bg-[#0f766e]"
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </Motion.div>
            );
          })}
        </div>

        <div className="rounded-lg border border-[#d8d0c0] bg-[#10131b] p-5 text-white shadow-[0_18px_55px_rgba(22,24,31,0.16)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/55">Build log</p>
            <Layers3 className="h-5 w-5 text-[#f2b84b]" />
          </div>
          <div className="h-72 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-black/22 p-4 font-mono text-xs">
            {logs.map((log, i) => (
              <Motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={`${log.timestamp}-${i}`}
                className={
                  log.level === 'error'
                    ? 'text-[#ff9c8f]'
                    : log.level === 'success'
                      ? 'text-[#aee9de]'
                      : 'text-white/64'
                }
              >
                <span className="mr-2 opacity-50">
                  [{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '--:--:--'}]
                </span>
                {log.line}
              </Motion.div>
            ))}
            {status === 'running' && (
              <div className="flex items-center gap-2 pt-2 text-[#aee9de]">
                <Loader2 size={12} className="animate-spin" />
                Working...
              </div>
            )}
          </div>

          {status === 'error' && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-[#ef6f61]/35 bg-[#ffe6df] p-4 text-sm font-bold text-[#ba4d41]"
            >
              Generation failed. Please try again or check the logs.
            </Motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [projectId, setProjectId] = useState(null);

  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const generationReset = useGenerationStore((s) => s.reset);

  // Guard: show limit-reached screen if user is already at cap
  if (projects.length >= BETA_PROJECT_LIMIT) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#fff2c7] text-[#9a6a0a]">
            <FlaskConical size={36} />
          </span>
          <h1 className="text-3xl font-black text-[#10131b]">Beta limit reached</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#5c6270]">
            You've used all <strong className="font-black text-[#10131b]">{BETA_PROJECT_LIMIT}</strong> project slots
            available in the free beta plan. Delete an existing project to create a new one.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-[#10131b] px-6 py-3 text-sm font-black text-white transition hover:bg-[#253044]"
            >
              <ArrowRight size={15} /> Go to dashboard
            </Link>
            <Link
              to="/billing"
              className="inline-flex items-center gap-2 rounded-lg border border-[#d8d0c0] bg-white px-6 py-3 text-sm font-black text-[#10131b] transition hover:border-[#10131b]"
            >
              View plan details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const updateData = useCallback((updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleGenerate = async () => {
    if (!data.requirements?.trim()) {
      toast.error('Please describe your store first');
      return;
    }

    generationReset();
    setStep(2);

    try {
      const res = await projectsService.create({
        requirements: data.requirements,
        category: data.category,
        storeName: data.storeName,
        targetMarket: data.targetMarket,
      });
      const newProjectId = res.data.project.id;
      setProjectId(newProjectId);
      addProject(res.data.project);

      await projectsService.startGeneration(newProjectId);
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.detail;
      toast.error(message || 'Failed to start generation');
      setStep(1);
    }
  };

  const handleGenerationStatus = useMemo(
    () => (state) => {
      if (state.status === 'complete' && projectId) {
        toast.success('Store generated successfully');
        navigate(`/projects/${projectId}`);
      }
    },
    [navigate, projectId]
  );

  useEffect(() => {
    const unsub = useGenerationStore.subscribe(handleGenerationStatus);
    return unsub;
  }, [handleGenerationStatus]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Motion.div
            key="step1"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <RequirementStep
              data={data}
              onChange={updateData}
              onGenerate={handleGenerate}
            />
          </Motion.div>
        )}

        {step === 2 && (
          <Motion.div
            key="step2"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <GenerationStep projectId={projectId} />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
