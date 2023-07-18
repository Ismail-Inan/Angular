export class FileListWrapper implements FileList {
    private files: File[];
    [index: number]: File;
  
    constructor(files: File[]) {
      this.files = files;
    }
  
    get length(): number {
      return this.files.length;
    }
  
    item(index: number): File {
      return this.files[index];
    }
  }