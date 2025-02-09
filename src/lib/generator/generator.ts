import { GeneratorConfig, GenerationResult, Template, STM32Family, STM32FamilyKey } from './types';
import { STM32_FAMILIES } from './stm32-families';
import { FileGenerator } from './file-generator';
import { TemplateHandler } from './template-handler';
import { PackageValidator } from './package-validator';

export class Generator {
  private config: GeneratorConfig;
  private templates: Template[] = [];
  private family: STM32Family;
  private fileGenerator: FileGenerator;
  private templateHandler: TemplateHandler;
  private packageValidator: PackageValidator;

  constructor(config: GeneratorConfig) {
    this.config = config;
    this.family = STM32_FAMILIES[config.selectedFamily as STM32FamilyKey];
    this.fileGenerator = new FileGenerator();
    this.templateHandler = new TemplateHandler();
    this.packageValidator = new PackageValidator();

    // Validate configuration
    const configErrors = this.packageValidator.validateConfig(config);
    if (configErrors.length > 0) {
      throw new Error(`Configuration validation failed:\n${configErrors.join('\n')}`);
    }
  }

  async generatePDSC(): Promise<GenerationResult> {
    try {
      const pdscContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<package xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="1.7.7" xs:noNamespaceSchemaLocation="PACK.xsd">
  <vendor>STMicroelectronics</vendor>
  <name>X-CUBE-AZRTOS-${this.config.selectedFamily}</name>
  <description>STM32Cube Azure RTOS Software for ${this.config.selectedFamily} Series</description>
  <url>https://github.com/STMicroelectronics/x-cube-azrtos-${this.config.selectedFamily.toLowerCase()}</url>
  
  <releases>
    <release version="${this.config.azureRTOSVersion}">
      <description>Azure RTOS Software for ${this.config.selectedFamily} Series v${this.config.azureRTOSVersion}</description>
    </release>
  </releases>

  <keywords>
    <keyword>RTOS</keyword>
    <keyword>ThreadX</keyword>
    <keyword>Azure RTOS</keyword>
    <keyword>STM32Cube</keyword>
    <keyword>${this.config.selectedFamily}</keyword>
    ${this.generateMiddlewareKeywords()}
  </keywords>

  <conditions>
    ${this.generateConditions()}
  </conditions>

  <components>
    ${this.generateComponents()}
  </components>
</package>`;

      const filename = `X-CUBE-AZRTOS-${this.config.selectedFamily.toLowerCase()}.pdsc`;
      this.fileGenerator.addFile(filename, pdscContent);
      
      return {
        success: true,
        message: 'PDSC file generated successfully',
        files: [filename]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate PDSC: ${error}`,
        files: []
      };
    }
  }

  async generateIPMode(): Promise<GenerationResult> {
    try {
      const threadxConfig = this.generateThreadXConfig();
      const filename = 'tx_user.h';
      this.fileGenerator.addFile(filename, threadxConfig);
      
      return {
        success: true,
        message: 'ThreadX configuration generated successfully',
        files: [filename]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate IP Mode: ${error}`,
        files: []
      };
    }
  }

  async generateIPConfig(): Promise<GenerationResult> {
    try {
      const files: string[] = [];
      const { middlewareConfig } = this.config.advancedSettings;

      if (middlewareConfig.fileX) {
        const fxConfig = this.generateFileXConfig();
        this.fileGenerator.addFile('fx_user.h', fxConfig);
        files.push('fx_user.h');
      }

      if (middlewareConfig.netXDuo) {
        const nxConfig = this.generateNetXDuoConfig();
        this.fileGenerator.addFile('nx_user.h', nxConfig);
        files.push('nx_user.h');
      }

      if (middlewareConfig.usbX) {
        const uxConfig = this.generateUSBXConfig();
        this.fileGenerator.addFile('ux_user.h', uxConfig);
        files.push('ux_user.h');
      }

      return {
        success: true,
        message: 'Middleware configurations generated successfully',
        files
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate IP Config: ${error}`,
        files: []
      };
    }
  }

  async generateAll(): Promise<GenerationResult> {
    try {
      const pdscResult = await this.generatePDSC();
      const ipModeResult = await this.generateIPMode();
      const ipConfigResult = await this.generateIPConfig();

      const allFiles = [
        ...pdscResult.files,
        ...ipModeResult.files,
        ...ipConfigResult.files
      ];

      // Generate package metadata
      this.fileGenerator.setMetadata('generator', 'Azure RTOS Package Generator');
      this.fileGenerator.setMetadata('version', this.config.azureRTOSVersion);
      this.fileGenerator.setMetadata('family', this.config.selectedFamily);

      // Generate documentation
      const readmeContent = this.generateReadme();
      this.fileGenerator.addFile('README.md', readmeContent);
      allFiles.push('README.md');

      const zipFileName = `X-CUBE-AZRTOS-${this.config.selectedFamily.toLowerCase()}_v${this.config.azureRTOSVersion}.zip`;
      await this.fileGenerator.generateZip(zipFileName);

      return {
        success: true,
        message: 'Complete package generated successfully',
        files: [zipFileName]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate complete package: ${error}`,
        files: []
      };
    }
  }

  async generateZip(filename: string): Promise<void> {
    const fileGenerator = new FileGenerator();
    fileGenerator.setMetadata('generator', 'ACTIA Engineering Services - X-CUBE Azure RTOS Generator');
    fileGenerator.setMetadata('version', this.config.azureRTOSVersion);
    fileGenerator.setMetadata('family', this.config.selectedFamily);
    await fileGenerator.generateZip(filename);
  }

  private generateReadme(): string {
    return `# X-CUBE-AZRTOS-${this.config.selectedFamily} Software Expansion

This package provides a full integration of Microsoft Azure RTOS in the STM32Cube environment for the STM32${this.config.selectedFamily} series of microcontrollers.

## Overview

Azure RTOS complementing the extensive STM32Cube ecosystem provides free development tools and software expansion packages. STM32 users can leverage the rich services of Azure RTOS for tiny, smart, connected devices.

## Prerequisites

- USBX, FileX and NetXDuo building requires ThreadX as they are based on RTOS model
- USBX Host MSC requires FileX Middleware usage
- USBX Device ECM/RNDIS classes require NetXDuo usage

### Supported Toolchains
${this.family.toolchains?.map(toolchain => `- ${toolchain}`).join('\n') || ''}

### Supported Boards
${this.family.supportedBoards?.map(board => `- ${board}`).join('\n') || ''}

## ThreadX Applications
${this.family.azureRTOS?.threadx?.applications.map(app => `- ${app}`).join('\n') || ''}

## USBX Applications
${this.family.azureRTOS?.usbx?.applications.map(app => `- ${app}`).join('\n') || ''}

## FileX Applications
${this.family.azureRTOS?.filex?.applications.map(app => `- ${app}`).join('\n') || ''}

## NetXDuo Applications
${this.family.azureRTOS?.netxDuo?.applications.map(app => `- ${app}`).join('\n') || ''}

For more information, please visit the [STMicroelectronics GitHub repository](https://github.com/STMicroelectronics/x-cube-azrtos-${this.config.selectedFamily.toLowerCase()}).
`;
  }

  private generateThreadXConfig(): string {
    const { threadxConfig } = this.config.advancedSettings;
    return `#ifndef TX_USER_H
#define TX_USER_H

/* Define various ThreadX parameters */
#define TX_TIMER_TICKS_PER_SECOND    ${1000 / threadxConfig.timeSlice}
#define TX_MAX_PRIORITIES            32
#define TX_MINIMUM_STACK             ${this.calculateMinStack()}
#define TX_TIMER_THREAD_STACK_SIZE   ${threadxConfig.stackSize}
#define TX_TIMER_THREAD_PRIORITY     ${threadxConfig.preemptionThreshold}

/* Feature Configuration */
${this.generateFeatureConfig()}

/* Debug Configuration */
#define TX_ENABLE_EVENT_TRACE        ${this.config.advancedSettings.debugConfig.traceEnabled ? 1 : 0}
#define TX_ENABLE_STACK_CHECKING     ${this.config.advancedSettings.debugConfig.stackMonitoring ? 1 : 0}
#define TX_ENABLE_PERFORMANCE_INFO   ${this.config.advancedSettings.debugConfig.performanceMetrics ? 1 : 0}

#endif`;
  }

  private calculateMinStack(): number {
    const baseStack = this.family.cores[0].includes('M7') ? 2048 : 1024;
    return baseStack + (this.config.advancedSettings.debugConfig.traceEnabled ? 512 : 0);
  }

  private generateFeatureConfig(): string {
    const { middlewareConfig } = this.config.advancedSettings;
    const features = [];

    if (middlewareConfig.fileX) features.push('#define FX_ENABLED');
    if (middlewareConfig.netXDuo) features.push('#define NX_ENABLED');
    if (middlewareConfig.usbX) features.push('#define UX_ENABLED');

    return features.join('\n');
  }

  private generateFileXConfig(): string {
    return `#ifndef FX_USER_H
#define FX_USER_H

#define FX_MAX_LONG_NAME_LEN     256
#define FX_MAX_LAST_NAME_LEN     256
#define FX_MAX_SECTOR_CACHE      256
#define FX_FAT_MAP_SIZE          128

#endif`;
  }

  private generateNetXDuoConfig(): string {
    return `#ifndef NX_USER_H
#define NX_USER_H

#define NX_TCP_ENABLE
#define NX_UDP_ENABLE
#define NX_IPV6_ENABLE
#define NX_ENABLE_IP_RAW_PACKET_FILTER

#endif`;
  }

  private generateUSBXConfig(): string {
    return `#ifndef UX_USER_H
#define UX_USER_H

#define UX_DEVICE_ENABLE
#define UX_HOST_ENABLE
#define UX_MAX_DEVICES      8
#define UX_MAX_HCD         2

#endif`;
  }

  private generateMiddlewareKeywords(): string {
    const { middlewareConfig } = this.config.advancedSettings;
    const keywords = [];
    
    if (middlewareConfig.fileX) keywords.push('<keyword>FileX</keyword>');
    if (middlewareConfig.netXDuo) keywords.push('<keyword>NetX Duo</keyword>');
    if (middlewareConfig.usbX) keywords.push('<keyword>USBX</keyword>');
    
    return keywords.join('\n    ');
  }

  private generateConditions(): string {
    return `
    <condition id="ARM Toolchain">
      <description>ARM compilation tools</description>
      <require Tcompiler="ARMCC"/>
    </condition>
    <condition id="GCC Toolchain">
      <description>GNU Tools for ARM Embedded Processors</description>
      <require Tcompiler="GCC"/>
    </condition>
    <condition id="IAR Toolchain">
      <description>IAR compilation tools</description>
      <require Tcompiler="IAR"/>
    </condition>`;
  }

  private generateComponents(): string {
    const components = [`
    <component Cclass="RTOS" Cgroup="Azure RTOS" Csub="ThreadX" Cversion="${this.config.azureRTOSVersion}">
      <description>Azure RTOS ThreadX</description>
      <files>
        <file category="header" name="ThreadX/Inc/tx_user.h"/>
        <file category="source" name="ThreadX/Src/tx_initialize_low_level.s"/>
      </files>
    </component>`];

    const { middlewareConfig } = this.config.advancedSettings;

    if (middlewareConfig.fileX) {
      components.push(`
    <component Cclass="File System" Cgroup="Azure RTOS" Csub="FileX" Cversion="${this.config.azureRTOSVersion}">
      <description>Azure RTOS FileX</description>
      <files>
        <file category="header" name="FileX/Inc/fx_user.h"/>
        <file category="source" name="FileX/Src/fx_initialize_low_level.c"/>
      </files>
    </component>`);
    }

    if (middlewareConfig.netXDuo) {
      components.push(`
    <component Cclass="Network" Cgroup="Azure RTOS" Csub="NetX Duo" Cversion="${this.config.azureRTOSVersion}">
      <description>Azure RTOS NetX Duo</description>
      <files>
        <file category="header" name="NetXDuo/Inc/nx_user.h"/>
        <file category="source" name="NetXDuo/Src/nx_initialize_low_level.c"/>
      </files>
    </component>`);
    }

    if (middlewareConfig.usbX) {
      components.push(`
    <component Cclass="USB" Cgroup="Azure RTOS" Csub="USBX" Cversion="${this.config.azureRTOSVersion}">
      <description>Azure RTOS USBX</description>
      <files>
        <file category="header" name="USBX/Inc/ux_user.h"/>
        <file category="source" name="USBX/Src/ux_initialize_low_level.c"/>
      </files>
    </component>`);
    }

    return components.join('\n');
  }
}
