import { describe, it, expect, beforeEach } from 'vitest';
import useBuilderStore from '@/store/builder.store';

function resetStore() {
  useBuilderStore.setState({
    activePage: 'home',
    deviceMode: 'desktop',
    editMode: false,
    viewMode: 'preview',
    selectedElement: null,
    undoStack: [],
    redoStack: [],
  });
}

describe('builder store', () => {
  beforeEach(resetStore);

  it('has correct initial state', () => {
    const s = useBuilderStore.getState();
    expect(s.activePage).toBe('home');
    expect(s.deviceMode).toBe('desktop');
    expect(s.editMode).toBe(false);
    expect(s.undoStack).toHaveLength(0);
  });

  it('setDeviceMode updates deviceMode', () => {
    useBuilderStore.getState().setDeviceMode('mobile');
    expect(useBuilderStore.getState().deviceMode).toBe('mobile');
  });

  it('setEditMode toggles correctly', () => {
    useBuilderStore.getState().setEditMode(true);
    expect(useBuilderStore.getState().editMode).toBe(true);
  });

  it('pushUndo appends to undoStack and clears redoStack', () => {
    useBuilderStore.getState().pushUndo({ content: 'v1' });
    useBuilderStore.getState().pushUndo({ content: 'v2' });
    expect(useBuilderStore.getState().undoStack).toHaveLength(2);
    expect(useBuilderStore.getState().redoStack).toHaveLength(0);
  });

  it('undo moves snapshot to redoStack', () => {
    useBuilderStore.getState().pushUndo({ content: 'v1' });
    useBuilderStore.getState().undo();
    expect(useBuilderStore.getState().undoStack).toHaveLength(0);
    expect(useBuilderStore.getState().redoStack).toHaveLength(1);
  });

  it('redo moves snapshot back to undoStack', () => {
    useBuilderStore.getState().pushUndo({ content: 'v1' });
    useBuilderStore.getState().undo();
    useBuilderStore.getState().redo();
    expect(useBuilderStore.getState().undoStack).toHaveLength(1);
    expect(useBuilderStore.getState().redoStack).toHaveLength(0);
  });

  it('undo on empty stack is a no-op', () => {
    useBuilderStore.getState().undo();
    expect(useBuilderStore.getState().undoStack).toHaveLength(0);
  });

  it('selectElement / clearSelection', () => {
    useBuilderStore.getState().selectElement({ id: 'heading-1' });
    expect(useBuilderStore.getState().selectedElement).toEqual({ id: 'heading-1' });
    useBuilderStore.getState().clearSelection();
    expect(useBuilderStore.getState().selectedElement).toBeNull();
  });
});
