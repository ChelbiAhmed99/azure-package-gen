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

  private async generateThreadXConfig(): Promise<string> {
    const { threadxConfig } = this.config.advancedSettings;
    
    return `
#ifndef TX_USER_H
#define TX_USER_H

/* Define various ThreadX parameters */
#define TX_TIMER_TICKS_PER_SECOND    ${1000 / threadxConfig.timeSlice}
#define TX_MAX_PRIORITIES            32
#define TX_MINIMUM_STACK             ${this.calculateMinStack()}
#define TX_TIMER_THREAD_STACK_SIZE   ${threadxConfig.stackSize}
#define TX_TIMER_THREAD_PRIORITY     ${threadxConfig.preemptionThreshold}

/* Enable ThreadX features based on configuration */
${this.generateFeatureConfig()}

/* Performance and Debug Configuration */
#define TX_ENABLE_EVENT_TRACE        ${this.config.advancedSettings.debugConfig.traceEnabled ? 1 : 0}
#define TX_ENABLE_STACK_CHECKING     ${this.config.advancedSettings.debugConfig.stackMonitoring ? 1 : 0}
#define TX_ENABLE_PERFORMANCE_INFO   ${this.config.advancedSettings.debugConfig.performanceMetrics ? 1 : 0}

/* CPU and Architecture Configuration */
#define TX_THREAD_SMP_CLUSTERS       ${this.family.cores.length}
#define TX_PORT_SPECIFIC_PRE_SCHEDULER_INITIALIZATION /* STM32 specific initialization */

#endif
`;
  }

  private calculateMinStack(): number {
    const baseStack = this.family.cores[0].includes('M7') ? 2048 : 1024;
    const debugOverhead = (
      (this.config.advancedSettings.debugConfig.traceEnabled ? 512 : 0) +
      (this.config.advancedSettings.debugConfig.performanceMetrics ? 256 : 0) +
      (this.config.advancedSettings.debugConfig.stackMonitoring ? 128 : 0)
    );
    return baseStack + debugOverhead;
  }

  private generateFeatureConfig(): string {
    const { middlewareConfig } = this.config.advancedSettings;
    const features = [];

    if (middlewareConfig.fileX) {
      features.push('#define FX_ENABLED');
      features.push('#define FX_MAX_LONG_NAME_LEN     256');
      features.push('#define FX_MAX_LAST_NAME_LEN     256');
      features.push('#define FX_UPDATE_RATE_IN_SECONDS 10');
    }

    if (middlewareConfig.netXDuo) {
      features.push('#define NX_ENABLED');
      features.push('#define NX_TCP_ENABLE');
      features.push('#define NX_UDP_ENABLE');
      features.push('#define NX_IPV6_ENABLE');
    }

    if (middlewareConfig.usbX) {
      features.push('#define UX_ENABLED');
      features.push('#define UX_DEVICE_ENABLE');
      features.push('#define UX_HOST_ENABLE');
    }

    if (middlewareConfig.guix) {
      features.push('#define GX_ENABLED');
      features.push('#define GX_SYSTEM_TIMER_MS  20');
      features.push('#define GX_DISABLE_MULTITHREAD_SUPPORT');
    }

    return features.join('\n');
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
      <description>X-CUBE-AZRTOS-${this.config.selectedFamily} v${this.config.azureRTOSVersion} for STM32Cube</description>
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
    </condition>
  </conditions>

  <components>
    <component Cclass="RTOS" Cgroup="Azure RTOS" Csub="ThreadX" Cversion="${this.config.azureRTOSVersion}">
      <description>Azure RTOS ThreadX</description>
      <files>
        <file category="header" name="ThreadX/Inc/tx_user.h" version="${this.config.azureRTOSVersion}"/>
        <file category="source" name="ThreadX/Src/tx_initialize_low_level.s" version="${this.config.azureRTOSVersion}"/>
      </files>
    </component>
    ${this.generateMiddlewareComponents()}
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

  private generateMiddlewareKeywords(): string {
    const { middlewareConfig } = this.config.advancedSettings;
    const keywords = [];
    
    if (middlewareConfig.fileX) keywords.push('<keyword>FileX</keyword>');
    if (middlewareConfig.netXDuo) keywords.push('<keyword>NetX Duo</keyword>');
    if (middlewareConfig.usbX) keywords.push('<keyword>USBX</keyword>');
    if (middlewareConfig.guix) keywords.push('<keyword>GUIX</keyword>');
    
    return keywords.join('\n    ');
  }

  private generateMiddlewareComponents(): string {
    const { middlewareConfig } = this.config.advancedSettings;
    const components = [];

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

    if (middlewareConfig.guix) {
      components.push(`
    <component Cclass="Graphics" Cgroup="Azure RTOS" Csub="GUIX" Cversion="${this.config.azureRTOSVersion}">
      <description>Azure RTOS GUIX</description>
      <files>
        <file category="header" name="GUIX/Inc/gx_user.h"/>
        <file category="source" name="GUIX/Src/gx_initialize_low_level.c"/>
      </files>
    </component>`);
    }

    return components.join('\n');
  }

  async generateIPMode(): Promise<GenerationResult> {
    try {
      const threadxConfig = await this.generateThreadXConfig();
      
      this.fileGenerator.addFile('tx_user.h', threadxConfig);
      this.fileGenerator.setMetadata('type', 'ip_mode');
      
      return {
        success: true,
        message: 'IP Mode configuration generated successfully',
        files: ['tx_user.h']
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
      const { middlewareConfig } = this.config.advancedSettings;
      const files: string[] = [];

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

      if (middlewareConfig.guix) {
        const gxConfig = this.generateGUIXConfig();
        this.fileGenerator.addFile('gx_user.h', gxConfig);
        files.push('gx_user.h');
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

  private generateFileXConfig(): string {
    return `#ifndef FX_USER_H
#define FX_USER_H

#define FX_MAX_LONG_NAME_LEN                 256
#define FX_MAX_LAST_NAME_LEN                 256
#define FX_MAX_SECTOR_CACHE                  256
#define FX_FAT_MAP_SIZE                      128
#define FX_MAX_FAT_CACHE                     16

#endif
`;
  }

  private generateNetXDuoConfig(): string {
    return `#ifndef NX_USER_H
#define NX_USER_H

#define NX_ENABLE_IP_RAW_PACKET_FILTER
#define NX_ENABLE_TCP_WINDOW_SCALING
#define NX_ENABLE_EXTENDED_NOTIFY_SUPPORT
#define NX_TCP_MAXIMUM_RETRIES              10
#define NX_TCP_RETRY_SHIFT                  1
#define NX_TCP_KEEPALIVE_INITIAL           600
#define NX_ARP_MAXIMUM_RETRIES             18
#define NX_ARP_EXPIRATION_RATE             600

#endif
`;
  }

  private generateUSBXConfig(): string {
    return `#ifndef UX_USER_H
#define UX_USER_H

#define UX_ENABLE_ASSERT
#define UX_MAX_DEVICES                      8
#define UX_MAX_HCD                          2
#define UX_MAX_ED                           80
#define UX_MAX_TD                           128
#define UX_MAX_ISO_TD                       1

#endif
`;
  }

  private generateGUIXConfig(): string {
    return `#ifndef GX_USER_H
#define GX_USER_H

#define GX_SYSTEM_TIMER_MS                  20
#define GX_DISABLE_MULTITHREAD_SUPPORT
#define GX_ENABLE_DEPRECATED_STRING_API
#define GX_ENABLE_DEPRECATED_SHOW_HIDE_API

#endif
`;
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

      // Validate package structure
      const structureErrors = this.packageValidator.validatePackageStructure(allFiles);
      if (structureErrors.length > 0) {
        throw new Error(`Package structure validation failed:\n${structureErrors.join('\n')}`);
      }

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

  async generateH7Package(): Promise<GenerationResult> {
    try {
      // Set up H7-specific configuration
      const h7Config = {
        family: 'H7',
        version: '3.3.0',
        releaseDescription: 'X-CUBE-AZRTOS-H7 v3.3.0 for STM32Cube',
        url: 'https://github.com/STMicroelectronics/x-cube-azrtos-h7',
        keywords: [
          '<keyword>RTOS</keyword>',
          '<keyword>ThreadX</keyword>',
          '<keyword>Azure RTOS</keyword>',
          '<keyword>STM32Cube</keyword>',
          '<keyword>H7</keyword>'
        ].join('\n    ')
      };

      // Generate core files
      const pdscResult = await this.generatePDSC(h7Config);
      const ipModeResult = await this.generateIPMode();
      const ipConfigResult = await this.generateIPConfig();

      const allFiles = [
        ...pdscResult.files,
        ...ipModeResult.files,
        ...ipConfigResult.files
      ];

      // Validate package structure
      const structureErrors = this.packageValidator.validatePackageStructure(allFiles);
      if (structureErrors.length > 0) {
        throw new Error(`Package structure validation failed:\n${structureErrors.join('\n')}`);
      }

      // Generate package with proper naming
      const packageName = this.packageValidator.validatePackageName('H7', '3.3.0');
      const zipFileName = `${packageName}.zip`;
      
      // Add documentation
      this.fileGenerator.addFile('Documentation/README.md', this.generateReadme());
      this.fileGenerator.addFile('Documentation/LICENSE.md', this.generateLicense());

      await this.fileGenerator.generateZip(zipFileName);
      
      return {
        success: true,
        message: 'H7 package generated successfully',
        files: [zipFileName]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate H7 package: ${error}`,
        files: []
      };
    }
  }

  private generateReadme(): string {
    return `# X-CUBE-AZRTOS-${this.config.selectedFamily} v${this.config.azureRTOSVersion}

This package contains the Azure RTOS middleware for STM32${this.config.selectedFamily} series.

## Overview

Azure RTOS is a real-time operating system (RTOS) designed for Internet of Things (IoT) and edge devices. 
This package provides middleware components including:

- ThreadX
- FileX
- NetX Duo
- USBX
- GUIX

## Version

- Package version: ${this.config.azureRTOSVersion}
- Azure RTOS version: ${this.config.azureRTOSVersion}

## Documentation

For more information, please visit:
https://github.com/STMicroelectronics/x-cube-azrtos-${this.config.selectedFamily.toLowerCase()}
`;
  }

  private generateLicense(): string {
    return `Copyright (c) 2023 STMicroelectronics.
All rights reserved.

This software is licensed under terms that can be found in the LICENSE file
in the root directory of this software component.
If no LICENSE file comes with this software, it is provided AS-IS.
`;
  }
}
