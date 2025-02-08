
import { Template } from './types';

export class TemplateHandler {
  private templates: Map<string, Template>;
  private defaultTemplates: Map<string, string>;

  constructor() {
    this.templates = new Map();
    this.defaultTemplates = new Map([
      ['pdsc', this.getDefaultPDSCTemplate()],
      ['tx_user', this.getDefaultTXUserTemplate()],
      ['fx_user', this.getDefaultFXUserTemplate()],
      ['nx_user', this.getDefaultNXUserTemplate()]
    ]);
  }

  registerTemplate(name: string, template: Template) {
    this.templates.set(name, template);
  }

  getTemplate(name: string): Template | undefined {
    return this.templates.get(name);
  }

  getDefaultTemplate(name: string): string | undefined {
    return this.defaultTemplates.get(name);
  }

  processTemplate(name: string, variables: Record<string, any>): string {
    const template = this.templates.get(name);
    const defaultTemplate = this.defaultTemplates.get(name);
    
    if (!template && !defaultTemplate) {
      throw new Error(`Template ${name} not found`);
    }

    let content = template?.content || defaultTemplate || '';
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, String(value));
    });

    return content;
  }

  validateTemplate(content: string): boolean {
    const openTags = (content.match(/\{\{/g) || []).length;
    const closeTags = (content.match(/\}\}/g) || []).length;
    return openTags === closeTags;
  }

  private getDefaultPDSCTemplate(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<package xmlns:xs="http://www.w3.org/2001/XMLSchema-instance" schemaVersion="1.7.7" xs:noNamespaceSchemaLocation="PACK.xsd">
  <vendor>STMicroelectronics</vendor>
  <name>X-CUBE-AZRTOS-{{family}}</name>
  <description>STM32Cube Azure RTOS Software for {{family}} Series</description>
  <url>{{url}}</url>
  
  <releases>
    <release version="{{version}}">
      <description>{{releaseDescription}}</description>
    </release>
  </releases>

  <keywords>
    {{keywords}}
  </keywords>

  <conditions>
    {{conditions}}
  </conditions>

  <components>
    {{components}}
  </components>
</package>`;
  }

  private getDefaultTXUserTemplate(): string {
    return `#ifndef TX_USER_H
#define TX_USER_H

/* ThreadX User Configurations */
#define TX_TIMER_TICKS_PER_SECOND    {{timerTicks}}
#define TX_MAX_PRIORITIES            {{maxPriorities}}
#define TX_MINIMUM_STACK             {{minStack}}
#define TX_TIMER_THREAD_STACK_SIZE   {{timerStackSize}}
#define TX_TIMER_THREAD_PRIORITY     {{timerPriority}}

/* Feature Configuration */
{{featureConfig}}

/* Debug Configuration */
{{debugConfig}}

/* Architecture Configuration */
{{archConfig}}

#endif`;
  }

  private getDefaultFXUserTemplate(): string {
    return `#ifndef FX_USER_H
#define FX_USER_H

/* FileX User Configurations */
#define FX_MAX_LONG_NAME_LEN         {{maxLongNameLen}}
#define FX_MAX_LAST_NAME_LEN         {{maxLastNameLen}}
#define FX_MAX_SECTOR_CACHE          {{maxSectorCache}}
#define FX_FAT_MAP_SIZE              {{fatMapSize}}
#define FX_MAX_FAT_CACHE             {{maxFatCache}}

#endif`;
  }

  private getDefaultNXUserTemplate(): string {
    return `#ifndef NX_USER_H
#define NX_USER_H

/* NetX Duo User Configurations */
#define NX_TCP_MAXIMUM_RETRIES       {{tcpMaxRetries}}
#define NX_TCP_RETRY_SHIFT           {{tcpRetryShift}}
#define NX_TCP_KEEPALIVE_INITIAL     {{tcpKeepaliveInitial}}
#define NX_ARP_MAXIMUM_RETRIES       {{arpMaxRetries}}
#define NX_ARP_EXPIRATION_RATE       {{arpExpirationRate}}

/* Feature Flags */
{{featureFlags}}

#endif`;
  }
}
