import {Injectable} from '@angular/core';
import {DocumentAccountService} from './document-account.service';
import {DocumentAccountConstant} from '../../../constant/accounting/document-account.constant';
import {DocumentAccountAttachement} from '../../../models/accounting/document-account-attachement';
import {saveAs} from '@progress/kendo-file-saver';

@Injectable()
export class DocumentAccountFileStorageService {
  private documentAccountId: number;
  private listFile = new Array<DocumentAccountAttachement>();
  private attachmentFilesToUpload = new Array<any>();

  /**
   * Constructor
   * @param documentAccountService
   */
  constructor(private  documentAccountService: DocumentAccountService) {
  }

  /**
   * uploadFiles
   * @param attachmentFilesToUpload
   */
  public uploadFiles(attachmentFilesToUpload: Array<any>, documentAccountId: number) {
    if (attachmentFilesToUpload) {
      this.documentAccountId = documentAccountId;
      this.attachmentFilesToUpload = attachmentFilesToUpload;
      this.listFile = [];
      for (const file of attachmentFilesToUpload) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        this.handleInputChange(file);
      }
    }
  }

  /**
   * handleInputChange
   * @param file
   */
  handleInputChange(file) {
    const reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this, file);
    reader.readAsDataURL(file);
  }

  /**
   * handle reader loaded
   *@param file
   * @param e
   */
  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    const documentAccountAttachement = new DocumentAccountAttachement(null, base64result, file.name, this.documentAccountId);
    this.listFile.push(documentAccountAttachement);
    if (this.attachmentFilesToUpload.length === this.listFile.length) {
      this.saveFile(this.listFile);
    }
  }

  /**
   *  Save file
   * @param listeFiles
   * */
  saveFile(listeFiles: Array<DocumentAccountAttachement>) {
    this.documentAccountService.getJavaGenericService().uploadFile(DocumentAccountConstant.UPLOAD_DOCUMENT_ACCOUNT_ATTACHEMENT, listeFiles
    ).subscribe();
  }

  /**
   * Delete File with index
   * @param attachmentFilesToUpload
   * @param index
    */
  deleteFile(attachmentFilesToUpload: Array<any>, index: number): Array<any> {

    attachmentFilesToUpload.splice(index, 1);
    return attachmentFilesToUpload;
  }

  /**
   * Delete File from directory
   * @param documentAccountAttachementsToDelete
   */
  deleteFileFromDirectory(documentAccountAttachementsToDelete: Array<DocumentAccountAttachement>) {
    const ids = documentAccountAttachementsToDelete.map(file => file.id);
     this.documentAccountService.getJavaGenericService().deleteList(DocumentAccountConstant.DOCUMENT_ACCOUNT_ATTACHEMENT + '?filesIds=' + ids.toString())
      .subscribe();
  }

  /**
   * Download file By index
   * @param fileName
   */
  downloadFile(fileName: string) {
    this.documentAccountService.getJavaGenericService().downloadFile(
      DocumentAccountConstant.DOWNLOAD_DOCUMENT_ACCOUNT_ATTACHEMENT, fileName)
      .subscribe(response => {
        saveAs(response, fileName);
      });
  }
}
