import { create } from 'zustand';
import { GeneratorConfig, GenerationStatus } from './types';

interface ConfigStore {
  config: GeneratorConfig;
  status: GenerationStatus;
  setConfig: (config: Partial<GeneratorConfig>) => void;
  setStatus: (status: Partial<GenerationStatus>) => void;
  addLog: (log: string) => void;
  updateProgress: (progress: number) => void;
  resetStatus: () => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    azureRTOSVersion: '6.2.0',
    outputPath: '',
    selectedFamily: 'STM32F7',
    ipMode: 'standalone',
    advancedSettings: {
      threadxConfig: {
        maxThreads: 8,
        stackSize: 1024,
        preemptionThreshold: 4,
        timeSlice: 10,
      },
      middlewareConfig: {
        fileX: false,
        netXDuo: false,
        usbX: false,
        guix: false,
      },
      debugConfig: {
        traceEnabled: false,
        performanceMetrics: false,
        stackMonitoring: false,
      },
    },
  },
  status: {
    status: 'idle',
    message: '',
    logs: [],
    progress: 0,
  },
  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
  setStatus: (newStatus) =>
    set((state) => ({
      status: { ...state.status, ...newStatus },
    })),
  addLog: (log) =>
    set((state) => ({
      status: {
        ...state.status,
        logs: [...state.status.logs, `[${new Date().toISOString()}] ${log}`],
      },
    })),
  updateProgress: (progress) =>
    set((state) => ({
      status: { ...state.status, progress },
    })),
  resetStatus: () =>
    set((state) => ({
      status: {
        status: 'idle',
        message: '',
        logs: [],
        progress: 0,
      },
    })),
}));