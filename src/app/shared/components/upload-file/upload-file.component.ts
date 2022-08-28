import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Resource } from '../../../models/shared/ressource.model';
import { ResourceService } from '../../services/resource/resource.service';
const FILE_SIZE_MUTLIPLIER = 1024;

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Input()
  fileToUpload: Array<FileInfo>;
  @Input()
  service: ResourceService<Resource>;
  @Input() fileNameCharactersToShow: number;
  @Output() selectedFiles = new EventEmitter<FileInfo[]>();
  @Input() showLabel = true;
  @Input() canUpdateFile: boolean;
  @Input() isFromTiers: boolean;
  @Input() authorisedTypes: string;
  @Input() maxFileSize: number;
  @Input() maxNumberOfFiles: number;
  @Input() currentNumberOfFiles: number;
  @ViewChild('File') File: ElementRef;
  constructor(public growlService: GrowlService, private translate: TranslateService) { }
  ngOnInit() {
  }

  /**
   * on file Change
   * @param event
   */
  onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      for (const file of event.target.files) {
        this.uploadFile(file);
      }
    }
  }

  /**
   * Upload file
   * @param file
   */
  public uploadFile(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (!this.fileToUpload.find(x => x.Name === file.name)) {
        const fileInfo = new FileInfo();
        fileInfo.Name = file.name;
        fileInfo.Extension = file.type;
        fileInfo.FileData = (<string>reader.result).split(',')[1];
        const data: any = {
          Name: file.name,
          Extension: file.type,
          FileData: (<string>reader.result).split(',')[1]
        };
        this.verifyAndUploadFile(file, data);
      } else {
        this.File.nativeElement.value = null;
        this.growlService.ErrorNotification(this.translate.instant(SharedConstant.FILE_AlREADY_IMPORTED));
      }
    };
  }

  /***
   * Verify and upload file
   */
  verifyAndUploadFile(file, data) {
    if (this.verifyFileAuthorizedTypes(file)) {
      if (!this.verifyFileMaxSizeAuthorized(file, data)) {
        if (!this.verifyMaxNumberOfFiles()) {
          this.fileToUpload.push(data);
          this.selectedFiles.emit(this.fileToUpload);
          this.File.nativeElement.value = null;
        } else {
          this.growlService.ErrorNotification(this.translate.instant(SharedConstant.MAX_NUMBER_OF_FILES_EXCEEDED));
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(SharedConstant.FILE_MAX_EXCEEDED));
      }
    } else {
      let errorMessage = `${this.translate.instant(SharedConstant.AUTHORIZED_FILE_FORMAT_ARE)}`;
      errorMessage = errorMessage.replace('{' + SharedConstant.FILE_TYPES.concat('}'),
        this.authorisedTypes.split(',').filter(x => x.trim()).toString());
      this.growlService.ErrorNotification(this.translate.instant(errorMessage));
    }
  }


  /**
   * return true if the type of the file belong to the authorized types, otherwise return false
   * @param file
   */
  verifyFileAuthorizedTypes(file): boolean {
    if (!this.authorisedTypes) {
      return true;
    }
    const typeFiltered = this.authorisedTypes.split(',').filter(x => x.trim() === file.type);
    return this.authorisedTypes && typeFiltered && (typeFiltered.length > NumberConstant.ZERO);
  }

  /**
   * Return true if the maximum size is exceeded, otherwise return false
   * @param file
   * @param data
   */
  verifyFileMaxSizeAuthorized(file, data): boolean {
    return this.maxFileSize && (file.size > (this.maxFileSize * FILE_SIZE_MUTLIPLIER * FILE_SIZE_MUTLIPLIER));
  }

  /**
   *   Return true if the maximum number of files is reached, otherwise return false
   */
  verifyMaxNumberOfFiles(): boolean {
    return this.maxNumberOfFiles && this.currentNumberOfFiles && (this.maxNumberOfFiles === this.currentNumberOfFiles);
  }

  /**
   * Delet File with index
   * @param i
   */
  deleteFile(i: number): void {
    this.fileToUpload.splice(i, 1);
    this.selectedFiles.emit(this.fileToUpload);
  }

  /**
   * Download file By index
   * @param i
   */
  downloadFile(i: number) {
    const fileinfo = this.fileToUpload[i];
    if (fileinfo.FileData) {
      this.downLoadFile(fileinfo);
    } else {
      this.service.uploadFile(fileinfo).subscribe(data => {
        this.downLoadFile(data);
      });
    }
  }

  /**
     * Method is use to download file.
     * file info
     */
  downLoadFile(fileinfo: FileInfo) {
    let byteArray: any;
    if (fileinfo.FileData) {
      byteArray = new Buffer(fileinfo.FileData, 'base64');
    } else {
      byteArray = new Buffer(fileinfo.Data.toString(), 'base64');
    }
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
    downloadLink.download = fileinfo.Name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  showSeparator(i): boolean {
    return this.canUpdateFile && i < (this.fileToUpload.length - 1);
  }

  /**
   * Get short file name to display
   * @param file
   */
  getShortFileName(file): string {
    // If upload file get the extension using split else just get the extension
    const fileSplitted = file.Name.split('.');
    const fileExtention = fileSplitted[fileSplitted.length - 1];
    const extendionIndex = file.Name.indexOf(fileExtention);
    let fileName: string = file.Name.substring(0, extendionIndex);
    if (this.fileNameCharactersToShow < fileName.length) {
      fileName = fileName.substring(0, this.fileNameCharactersToShow);
      fileName = fileName.concat('...' + fileExtention);
    } else {
      fileName = fileName.concat(fileExtention);
    }
    return fileName;
  }
}
