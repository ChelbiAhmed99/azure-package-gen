export interface STM32Family {
  name: string;
  cores: string[];
  series: string[];
  memoryVariants: {
    [key: string]: {
      flashSize: string;
      ramSize: string;
    };
  };
  supportedPeripherals: string[];
  features: {
    fpu?: boolean;
    trustZone?: boolean;
    cache?: boolean;
    dma?: boolean;
    ethernet?: boolean;
    usb?: boolean;
    crypto?: boolean;
  };
}

export interface GeneratorConfig {
  azureRTOSVersion: string;
  outputPath: string;
  selectedFamily: string;
  templatePath?: string;
  ipMode: "standalone" | "middleware";
  advancedSettings: {
    threadxConfig: {
      maxThreads: number;
      stackSize: number;
      preemptionThreshold: number;
      timeSlice: number;
    };
    middlewareConfig: {
      fileX: boolean;
      netXDuo: boolean;
      usbX: boolean;
      guix: boolean;
    };
    debugConfig: {
      traceEnabled: boolean;
      performanceMetrics: boolean;
      stackMonitoring: boolean;
    };
  };
}

export interface GenerationStatus {
  status: 'idle' | 'generating' | 'success' | 'error';
  message: string;
  logs: string[];
  progress: number;
}

export interface GenerationResult {
  success: boolean;
  message: string;
  files: string[];
}

export interface Template {
  name: string;
  content: string;
  type: 'pdsc' | 'ip_mode' | 'ip_config' | 'application';
}