
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export class FileGenerator {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  addFile(path: string, content: string) {
    this.zip.file(path, content);
  }

  async generateZip(filename: string): Promise<void> {
    const content = await this.zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
  }
}
