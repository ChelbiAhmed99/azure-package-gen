
import { Template } from './types';

export class TemplateHandler {
  private templates: Map<string, Template>;

  constructor() {
    this.templates = new Map();
  }

  registerTemplate(name: string, template: Template) {
    this.templates.set(name, template);
  }

  getTemplate(name: string): Template | undefined {
    return this.templates.get(name);
  }

  processTemplate(name: string, variables: Record<string, any>): string {
    const template = this.templates.get(name);
    if (!template) {
      throw new Error(`Template ${name} not found`);
    }

    let content = template.content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, String(value));
    });

    return content;
  }

  validateTemplate(content: string): boolean {
    // Basic validation to check for matching template tags
    const openTags = (content.match(/\{\{/g) || []).length;
    const closeTags = (content.match(/\}\}/g) || []).length;
    return openTags === closeTags;
  }
}

