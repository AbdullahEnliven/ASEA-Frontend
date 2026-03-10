import { describe, it, expect, beforeEach } from 'vitest';
import useGenerationStore from '@/store/generation.store';

function reset() {
  useGenerationStore.setState({ status: 'idle', progress: 0, logs: [], currentStep: null });
}

describe('generation store', () => {
  beforeEach(reset);

  it('initial state is idle with 0 progress', () => {
    const s = useGenerationStore.getState();
    expect(s.status).toBe('idle');
    expect(s.progress).toBe(0);
    expect(s.logs).toHaveLength(0);
  });

  it('setStatus updates status', () => {
    useGenerationStore.getState().setStatus('generating');
    expect(useGenerationStore.getState().status).toBe('generating');
  });

  it('setProgress updates progress', () => {
    useGenerationStore.getState().setProgress(42);
    expect(useGenerationStore.getState().progress).toBe(42);
  });

  it('appendLog adds entry with timestamp', () => {
    useGenerationStore.getState().appendLog({ message: 'Building...' });
    const { logs } = useGenerationStore.getState();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Building...');
    expect(typeof logs[0].timestamp).toBe('number');
  });

  it('reset clears all state', () => {
    useGenerationStore.getState().setStatus('complete');
    useGenerationStore.getState().setProgress(100);
    useGenerationStore.getState().appendLog({ message: 'Done' });
    useGenerationStore.getState().reset();
    const s = useGenerationStore.getState();
    expect(s.status).toBe('idle');
    expect(s.progress).toBe(0);
    expect(s.logs).toHaveLength(0);
  });
});
