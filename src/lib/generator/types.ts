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
}

export interface GeneratorConfig {
  azureRTOSVersion: string;
  outputPath: string;
  selectedFamily: string;
}

export interface GenerationStatus {
  status: 'idle' | 'generating' | 'success' | 'error';
  message: string;
  logs: string[];
}