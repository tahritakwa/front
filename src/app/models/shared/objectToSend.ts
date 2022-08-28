
/**
 *
 * Object data to send in call service
 *
 * */
export class ObjectToSave {
  EntityAxisValues: Array<EntityAxisValues>;
  Model;
  VerifyUnicity?:any;
  IsFromModal? : boolean;
  constructor() { }
}
/**
 *
 * Entity axis value model
 *
 * */
export class EntityAxisValues {
  IdAxisValue: number;
  IdEntityItem: number;
  Entity: number;
  constructor() { }
}

export class FileInfo {
  IdOfCarrierModel?: number;
  Name: string;
  FileData: string;
  Extension: string;
  Data: string[];
  Size: number;
  constructor() { }

  public static generateFileInfoFromFile(file, reader): FileInfo {
    const myFileInfo = new FileInfo();
    myFileInfo.Name = file.name;
    myFileInfo.Extension = file.type;
    myFileInfo.FileData = reader.result.split(',')[1];
    return myFileInfo;
  }
}
export class MediaInfo {
  fileInfo: FileInfo;
  src: string;
  embededIframe: any;
  constructor(fileInfo?, src?, embededIframe?) {
    this.fileInfo = fileInfo;
    this.src = src;
    this.embededIframe = embededIframe;
  }
}



