import { GeneratorConfig, GenerationResult, Template, STM32Family, STM32FamilyKey } from './types';
import { STM32_FAMILIES } from './stm32-families';
import { FileGenerator } from './file-generator';

export class Generator {
  private config: GeneratorConfig;
  private templates: Template[] = [];
  private family: STM32Family;
  private fileGenerator: FileGenerator;

  constructor(config: GeneratorConfig) {
    this.config = config;
    this.family = STM32_FAMILIES[config.selectedFamily as STM32FamilyKey];
    this.fileGenerator = new FileGenerator();
  }

  private async generateThreadXConfig(): Promise<string> {
    const { threadxConfig } = this.config.advancedSettings;
    
    return `
#ifndef THREADX_CONFIG_H
#define THREADX_CONFIG_H

/* ThreadX Configuration */
#define TX_MAX_PRIORITIES                       32
#define TX_MAX_THREADS                         ${threadxConfig.maxThreads}
#define TX_TIMER_THREAD_STACK_SIZE             ${threadxConfig.stackSize}
#define TX_TIMER_THREAD_PREEMPTION_THRESHOLD   ${threadxConfig.preemptionThreshold}
#define TX_TIMER_THREAD_TIME_SLICE             ${threadxConfig.timeSlice}

/* Debug Features */
#define TX_ENABLE_EVENT_TRACE                  ${this.config.advancedSettings.debugConfig.traceEnabled ? 1 : 0}
#define TX_ENABLE_PERFORMANCE_INFO             ${this.config.advancedSettings.debugConfig.performanceMetrics ? 1 : 0}
#define TX_ENABLE_STACK_CHECKING              ${this.config.advancedSettings.debugConfig.stackMonitoring ? 1 : 0}

/* CPU Configuration */
#define TX_CORTEX_M_TYPE                      ${this.getCortexMType()}
#define TX_PORT_SPECIFIC_BUILD_OPTIONS        "${this.getPortSpecificOptions()}"

/* Memory Configuration */
#define TX_MINIMUM_STACK                       ${this.calculateMinStack()}

/* Feature Configuration */
${this.generateFeatureConfig()}

#endif /* THREADX_CONFIG_H */
    `;
  }

  private getCortexMType(): number {
    const core = this.family.cores[0];
    switch (core) {
      case 'Cortex-M0': return 0;
      case 'Cortex-M3': return 3;
      case 'Cortex-M4': return 4;
      case 'Cortex-M7': return 7;
      case 'Cortex-M33': return 33;
      default: return 0;
    }
  }

  private getPortSpecificOptions(): string {
    const options = [];
    if (this.family.features.fpu) {
      options.push('TX_ENABLE_FPU_SUPPORT');
    }
    if (this.family.features.trustZone) {
      options.push('TX_ENABLE_TRUSTZONE');
    }
    return options.join(' ');
  }

  private calculateMinStack(): number {
    // Base stack size calculation based on core type
    let baseStack = 1024;
    if (this.family.cores[0].includes('M7')) {
      baseStack = 2048;
    } else if (this.family.cores[0].includes('M33')) {
      baseStack = 1536;
    }
    
    // Add extra stack for enabled features
    if (this.config.advancedSettings.debugConfig.traceEnabled) {
      baseStack += 512;
    
    }
    if (this.config.advancedSettings.debugConfig.performanceMetrics) {
      baseStack += 256;
    }
    
    return baseStack;
  }

  private generateFeatureConfig(): string {
    const { middlewareConfig } = this.config.advancedSettings;
    const config = [];
    
    if (middlewareConfig.fileX) {
      config.push('#define TX_ENABLE_FILEX_INTEGRATION');
    }
    if (middlewareConfig.netXDuo) {
      config.push('#define TX_ENABLE_NETX_INTEGRATION');
    }
    if (middlewareConfig.usbX) {
      config.push('#define TX_ENABLE_USBX_INTEGRATION');
    }
    if (middlewareConfig.guix) {
      config.push('#define TX_ENABLE_GUIX_INTEGRATION');
    }
    
    return config.join('\n');
  }

  async generatePDSC(): Promise<GenerationResult> {
    try {
      const pdscContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<package schemaVersion="1.7.7" xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" xs:noNamespaceSchemaLocation="PACK.xsd">
  <vendor>STMicroelectronics</vendor>
  <name>${this.config.selectedFamily}_AZURE_RTOS</name>
  <description>Azure RTOS Software for ${this.config.selectedFamily} Series</description>
  <url>https://github.com/azure-rtos</url>
  <supportContact>https://github.com/azure-rtos/threadx/issues</supportContact>
  <license>LICENSE.txt</license>
  
  <releases>
    <release version="${this.config.azureRTOSVersion}">
      <description>Azure RTOS ${this.config.azureRTOSVersion} release for ${this.config.selectedFamily}</description>
    </release>
  </releases>
  
  <keywords>
    <keyword>Azure RTOS</keyword>
    <keyword>ThreadX</keyword>
    <keyword>${this.config.selectedFamily}</keyword>
    ${this.generateMiddlewareKeywords()}
  </keywords>
  
  <devices>
    ${this.generateDeviceSupport()}
  </devices>
</package>`;

      const filename = `${this.config.selectedFamily.toLowerCase()}_azure_rtos_pdsc.xml`;
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
    const keywords = [
      '<keyword>ThreadX</keyword>',
      '<keyword>CMSIS</keyword>',
      '<keyword>STM32Cube</keyword>'
    ];
    
    if (middlewareConfig.fileX) keywords.push('<keyword>FileX</keyword>');
    if (middlewareConfig.netXDuo) {
      keywords.push('<keyword>NetX Duo</keyword>');
      keywords.push('<keyword>Networking</keyword>');
    }
    if (middlewareConfig.usbX) {
      keywords.push('<keyword>USBX</keyword>');
      keywords.push('<keyword>USB</keyword>');
    }
    if (middlewareConfig.guix) {
      keywords.push('<keyword>GUIX</keyword>');
      keywords.push('<keyword>Display</keyword>');
    }
    
    return keywords.join('\n    ');
  }

  private generateDeviceSupport(): string {
    return this.family.series.map(series => `
    <family Dfamily="${series}">
      <processor Dcore="${this.family.cores[0]}"
                DcoreVersion="${this.getCoreVersion()}"
                Dfpu="${this.family.features.fpu ? '1' : '0'}"
                Dmpu="${this.family.features.trustZone ? '1' : '0'}"
                Dendian="Little-endian"
                Dclock="${this.getDefaultClock(series)}"/>
      ${this.generateMemoryVariants(series)}
    </family>`
    ).join('\n');
  }

  private getCoreVersion(): string {
    const core = this.family.cores[0];
    switch (core) {
      case 'Cortex-M7': return 'r1p1';
      case 'Cortex-M4': return 'r0p1';
      case 'Cortex-M33': return 'r1p0';
      default: return 'r0p0';
    }
  }

  private getDefaultClock(series: string): string {
    if (series.includes('H7')) return '480000000';
    if (series.includes('F7')) return '216000000';
    return '180000000';
  }

  private generateMemoryVariants(series: string): string {
    return Object.entries(this.family.memoryVariants).map(([variant, memory]) => `
      <device Dname="${series}_${variant}">
        <memory id="IROM1" start="0x08000000" size="${memory.flashSize}" startup="1" default="1"/>
        <memory id="IRAM1" start="0x20000000" size="${memory.ramSize}" init="0" default="1"/>
        ${this.generatePeripherals()}
      </device>`
    ).join('\n');
  }

  private generatePeripherals(): string {
    return this.family.supportedPeripherals.map(peripheral => 
      `<peripheral>${peripheral}</peripheral>`
    ).join('\n        ');
  }

  async generateIPMode(): Promise<GenerationResult> {
    try {
      const threadxConfig = await this.generateThreadXConfig();
      const txUserContent = this.generateTxUserContent();
      
      this.fileGenerator.addFile('threadx_config.h', threadxConfig);
      this.fileGenerator.addFile('tx_user.h', txUserContent);
      
      return {
        success: true,
        message: 'IP Mode files generated successfully',
        files: ['threadx_config.h', 'tx_user.h']
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to generate IP Mode: ${error}`,
        files: []
      };
    }
  }

  private generateTxUserContent(): string {
    return `
#ifndef TX_USER_H
#define TX_USER_H

/* USER CODE BEGIN 1 */

/* USER CODE END 1 */

/* Define various build options for the ThreadX port.  The application should either make changes
   here by commenting or un-commenting the conditional compilation defined OR supply the defines 
   though the compiler's equivalent of the -D option.  */

/* For ThreadX/STM32Cube integration, see the following defines: TX_INCLUDE_USER_DEFINE_FILE, TX_CORTEX_M_TYPE,
   TX_TIMER_TICKS_PER_SECOND, TX_TIMER_PROCESS_IN_ISR, TX_PORT_SPECIFIC_BUILD_OPTIONS */

/* USER CODE BEGIN 2 */

/* USER CODE END 2 */

#endif
`;
  }

  async generateIPConfig(): Promise<GenerationResult> {
    try {
      const { middlewareConfig } = this.config.advancedSettings;
      const files: string[] = [];
      
      if (middlewareConfig.fileX) {
        const fxContent = this.generateFileXConfig();
        this.fileGenerator.addFile('fx_user.h', fxContent);
        files.push('fx_user.h');
      }
      
      if (middlewareConfig.netXDuo) {
        const nxContent = this.generateNetXConfig();
        this.fileGenerator.addFile('nx_user.h', nxContent);
        files.push('nx_user.h');
      }
      
      if (middlewareConfig.usbX) {
        const uxContent = this.generateUSBXConfig();
        this.fileGenerator.addFile('ux_user.h', uxContent);
        files.push('ux_user.h');
      }
      
      if (middlewareConfig.guix) {
        const gxContent = this.generateGUIXConfig();
        this.fileGenerator.addFile('gx_user.h', gxContent);
        files.push('gx_user.h');
      }
      
      return {
        success: true,
        message: 'IP Config files generated successfully',
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
    return `${this.config.outputPath}/fx_user.h`;
  }

  private generateNetXConfig(): string {
    return `${this.config.outputPath}/nx_user.h`;
  }

  private generateUSBXConfig(): string {
    return `${this.config.outputPath}/ux_user.h`;
  }

  private generateGUIXConfig(): string {
    return `${this.config.outputPath}/gx_user.h`;
  }

  async generateAll(): Promise<GenerationResult> {
    try {
      await this.generatePDSC();
      await this.generateIPMode();
      await this.generateIPConfig();
      
      const zipFileName = `${this.config.selectedFamily.toLowerCase()}_azure_rtos_package.zip`;
      await this.fileGenerator.generateZip(zipFileName);
      
      return {
        success: true,
        message: 'Complete package generated and downloaded successfully',
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
}
