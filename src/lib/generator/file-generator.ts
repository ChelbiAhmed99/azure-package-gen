
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export class FileGenerator {
  private zip: JSZip;
  private metadata: any;

  constructor() {
    this.zip = new JSZip();
    this.metadata = {
      generator: "ACTIA Engineering Services - X-CUBE Azure RTOS Generator",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };
  }

  addFile(path: string, content: string) {
    this.zip.file(path, content);
  }

  addMetadata() {
    this.zip.file('metadata.json', JSON.stringify(this.metadata, null, 2));
  }

  async generateZip(filename: string): Promise<void> {
    this.addMetadata();
    const content = await this.zip.generateAsync({ 
      type: 'blob',
      compression: "DEFLATE",
      compressionOptions: {
        level: 9
      }
    });
    saveAs(content, `ACTIA_${filename}`);
  }

  setMetadata(key: string, value: any) {
    this.metadata[key] = value;
  }
}
