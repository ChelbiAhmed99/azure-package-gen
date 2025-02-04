import { create } from 'zustand';
import { GeneratorConfig, GenerationStatus } from './types';

interface ConfigStore {
  config: GeneratorConfig;
  status: GenerationStatus;
  setConfig: (config: Partial<GeneratorConfig>) => void;
  setStatus: (status: Partial<GenerationStatus>) => void;
  addLog: (log: string) => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    azureRTOSVersion: '6.2.0',
    outputPath: '',
    selectedFamily: 'STM32F7',
  },
  status: {
    status: 'idle',
    message: '',
    logs: [],
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
}));