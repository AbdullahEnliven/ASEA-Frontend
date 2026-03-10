import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useGenerationStore from '@/store/generation.store';
import useAuthStore from '@/store/auth.store';

export default function useGenerationSocket(projectId) {
  const token = useAuthStore((s) => s.token);
  const { setStatus, setProgress, setStep, appendLog } = useGenerationStore();

  useEffect(() => {
    if (!projectId || !token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000';
    const socket = io(socketUrl, {
      auth: { token },
      query: { projectId },
    });

    setStatus('running');

    socket.on('generation:progress', ({ percent, step }) => {
      setProgress(percent);
      setStep(step);
    });

    socket.on('generation:log', ({ line, level }) => {
      appendLog({ line, level });
    });

    socket.on('generation:complete', () => {
      setStatus('complete');
      setProgress(100);
    });

    socket.on('generation:error', ({ message }) => {
      setStatus('error');
      appendLog({ line: `Error: ${message}`, level: 'error' });
    });

    socket.on('connect_error', () => {
      appendLog({ line: 'Connection lost. Retrying...', level: 'error' });
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId, token, setStatus, setProgress, setStep, appendLog]);
}
