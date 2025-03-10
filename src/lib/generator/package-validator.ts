
import { GeneratorConfig } from './types';

export class PackageValidator {
  validateConfig(config: GeneratorConfig): string[] {
    const errors: string[] = [];

    // Validate basic configuration
    if (!config.selectedFamily) {
      errors.push('STM32 family must be selected');
    }

    if (!config.azureRTOSVersion) {
      errors.push('Azure RTOS version is required');
    }

    if (!config.outputPath) {
      errors.push('Output path is required');
    }

    // Validate ThreadX configuration
    const { threadxConfig } = config.advancedSettings;
    if (threadxConfig.maxThreads < 1 || threadxConfig.maxThreads > 32) {
      errors.push('Maximum threads must be between 1 and 32');
    }

    if (threadxConfig.stackSize < 1024 || threadxConfig.stackSize > 32768) {
      errors.push('Stack size must be between 1024 and 32768 bytes');
    }

    if (threadxConfig.timeSlice < 0 || threadxConfig.timeSlice > 1000) {
      errors.push('Time slice must be between 0 and 1000 ms');
    }

    return errors;
  }

  validatePackageStructure(files: string[]): string[] {
    const errors: string[] = [];
    const requiredFiles = [
      'tx_user.h',
      'pdsc',
      'README.md',
      'LICENSE.md'
    ];

    // Validate core files
    requiredFiles.forEach(file => {
      if (!files.some(f => f.includes(file))) {
        errors.push(`Missing required file: ${file}`);
      }
    });

    // Validate folder structure
    const requiredFolders = [
      'Middlewares/ST/threadx',
      'Projects/Common',
      'Documentation'
    ];

    requiredFolders.forEach(folder => {
      if (!files.some(f => f.includes(folder))) {
        errors.push(`Missing required folder structure: ${folder}`);
      }
    });

    return errors;
  }

  validateVersionFormat(version: string): boolean {
    const versionRegex = /^\d+\.\d+\.\d+$/;
    return versionRegex.test(version);
  }

  validatePackageName(family: string, version: string): string {
    return `STMicroelectronics.X-CUBE-AZRTOS-${family}.${version}`;
  }
}
