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

export type STM32FamilyKey = keyof typeof import('./stm32-families').STM32_FAMILIES;

export interface ThreadXConfig {
  maxThreads: number;
  stackSize: number;
  preemptionThreshold: number;
  timeSlice: number;
}

export interface MiddlewareConfig {
  fileX: boolean;
  netXDuo: boolean;
  usbX: boolean;
  guix: boolean;
}

export interface DebugConfig {
  traceEnabled: boolean;
  performanceMetrics: boolean;
  stackMonitoring: boolean;
}

export interface GeneratorConfig {
  azureRTOSVersion: string;
  outputPath: string;
  selectedFamily: string;
  templatePath?: string;
  ipMode: "standalone" | "middleware";
  advancedSettings: {
    threadxConfig: ThreadXConfig;
    middlewareConfig: MiddlewareConfig;
    debugConfig: DebugConfig;
  };
}

export interface Template {
  name: string;
  content: string;
  type: 'pdsc' | 'ip_mode' | 'ip_config' | 'application';
}

export interface GenerationResult {
  success: boolean;
  message: string;
  files: string[];
}