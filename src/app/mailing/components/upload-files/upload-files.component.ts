import {Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileInfo} from '../../../models/shared/objectToSend';
import {AttchmentServiceService} from '../../services/send-mail/attchment-service.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit, OnChanges {
  @ViewChild('fileDocument') fileDocument: ElementRef;
  @Output() messageEvent = new EventEmitter<string[]>();
  @Output() fileValid = new EventEmitter<boolean>();
  @Output() deleteFileEvent = new EventEmitter<boolean>();
  fileFormGroup: FormGroup;
  data;
  listFilePaths: string[] = [];
  public fileDocumentToUpload;
  public fileSizeIsValid = true;
  public fileExtensionIsValid = true;
  private fiveMegaBytes = 5242880;
  private allowedExtensions = ['csv', 'xls', 'doc', 'txt', 'pdf', 'zip', 'jpg', 'png', 'jpeg'];
  public attachmentSavedName;
  public listFile = [];
  public currentFile;

  constructor(private attachmentService: AttchmentServiceService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.initMessagesErrors();
  }

  initMessagesErrors() {
    this.fileSizeIsValid = true;
    this.fileExtensionIsValid = true;
  }

  createFormGroup() {
    this.fileFormGroup = this.formBuilder.group({
      pathAttachment: ['', Validators.required],
    });
  }

  public uploadPictureFile(event) {
    this.fileDocumentToUpload = event.target.files[0];
    if (this.fileDocumentToUpload) {
      this.currentFile = {
        fileDocument: this.fileDocumentToUpload,
        sizeValid: this.checkFileSize(this.fileDocumentToUpload.size),
        extensionValid: this.checkFileExtension(this.allowedExtensions, this.fileDocumentToUpload),
        fileName: this.fileDocumentToUpload.name
      };

      if (this.checkFileSize(this.fileDocumentToUpload.size) &&
        this.checkFileExtension(this.allowedExtensions, this.fileDocumentToUpload)) {
        const reader = new FileReader();
        reader.readAsBinaryString(this.fileDocumentToUpload);
        this.handleInputChange(this.fileDocumentToUpload);
        this.messageEvent.emit(this.listFilePaths);
        this.fileFormGroup.controls['pathAttachment'].reset();
      } else {
        this.listFile.push(this.currentFile);
        this.fileValid.emit(this.checkFileList());
      }
    }
  }

  checkFileSize(size) {
    this.fileSizeIsValid = size < this.fiveMegaBytes;
    return this.fileSizeIsValid;
  }

  getExtension(fileName: string): null | string {
    if (fileName.indexOf('.') === -1) {
      return null;
    }
    return fileName.split('.').pop().toLowerCase();
  }

  showFileFile() {
    return this.listFile;
  }

  checkFileExtension(allowedExtensions: Array<string>, file: File): boolean {
    const fileExtension = this.getExtension(file.name);
    this.fileExtensionIsValid = allowedExtensions.indexOf(fileExtension) !== -1;
    return this.fileExtensionIsValid;
  }

  saveFile(base64Picture, file) {
    this.attachmentService.getJavaGenericService().uploadFile('upload', {
      'base64File': base64Picture,
      'name': file.name,
      'directoryName': 'attchments'
    }).subscribe((data: String) => {
      if (data !== null) {
        this.attachmentSavedName = data;
        this.listFilePaths.push(this.attachmentSavedName);
        this.currentFile.fileName = this.attachmentSavedName;
        this.listFile.push(this.currentFile);
        this.fileValid.emit(this.checkFileList());
        const reader = new FileReader();
        reader.readAsDataURL(file);
      }
    });
  }

  checkFileList(): boolean {
    let valid = true;
    this.listFile.forEach(file => {
      if (!file.sizeValid || !file.extensionValid) {
        valid = false;
      }
    });
    return valid;
  }
  handleInputChange(file) {
    const pattern = /image-*/;
    const reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this, file);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    if (base64result !== undefined) {
      this.saveFile(base64result, file);

    }
  }

  deleteFile(file, index): void {
    if (file.sizeValid && file.extensionValid) {
      this.attachmentService.getJavaGenericService().deleteFile('delete'
        , {
          'fileName': file.fileName,
          'directoryName': 'attchments'
        }).subscribe((data) => {
          if (data) {
            this.deleteFileFromList(file.fileName);
            this.listFile.splice(index, 1);
            this.fileValid.emit(this.checkFileList());
            if (this.listFilePaths.length === 0) {
              this.resetFileField();
            }
            this.deleteFileEvent.emit(true);
          }
        }
      );
    } else {
      this.listFile.splice(index, 1);
      this.fileValid.emit(this.checkFileList());
    }

  }

  deleteFileFromList(filename: string) {
    const index: number = this.listFilePaths.indexOf(filename);
    if (index !== -1) {
      this.listFilePaths.splice(index, 1);
    }
  }

  resetFileField() {
    this.fileDocumentToUpload = false;
    this.fileDocument.nativeElement.value = null;
    this.attachmentSavedName = '';
  }

  /**
   * Download file By index
   * @param i
   */
  downloadFile(i: number) {
    const fileinfo = this.listFile[i];
    if (fileinfo.fileDocument.FileData) {
      this.downLoadFile(fileinfo);
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
    downloadLink.href = window.URL.createObjectURL(new Blob([byteArray], {type: 'application/octet-stream'}));
    downloadLink.download = fileinfo.Name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  ngOnChanges() {
    this.messageEvent.emit(this.listFilePaths);
  }


}
