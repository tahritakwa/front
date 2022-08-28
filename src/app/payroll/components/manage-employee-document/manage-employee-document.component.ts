import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
import { Resource } from '../../../models/shared/ressource.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';

@Component({
  selector: 'app-manage-employee-document',
  templateUrl: './manage-employee-document.component.html',
  styleUrls: ['./manage-employee-document.component.scss']
})
export class ManageEmployeeDocumentComponent implements OnInit {
  public fileDocumentToUpload: Array<FileInfo>;
  @Input() group: FormGroup;
  @Input() service: ResourceService<Resource>;
  @Input() canUpdateFile: boolean;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(private translate: TranslateService, private swalWarrings: SwalWarring, private rolesService: StarkRolesService,
  ) {
    this.fileDocumentToUpload = new Array<FileInfo>();
  }

  /**
   * Type getter
   */
  get Type(): FormControl {
    return this.group.get(EmployeeConstant.TYPE) as FormControl;
  }

  /**
   * TypeName getter
   */
  get TypeName(): string {
    const type = this.Type.value as number;
    let typeName = EmployeeConstant.PASSPORT;

    switch (type) {
      case NumberConstant.TWO: {
        typeName = EmployeeConstant.WORK_AUTHORIZATION;
        break;
      }
      case NumberConstant.THREE: {
        typeName = EmployeeConstant.VISA;
        break;
      }
      case NumberConstant.FOUR: {
        typeName = EmployeeConstant.RESIDENCE_PERMIT;
        break;
      }
      case NumberConstant.FIVE: {
        typeName = EmployeeConstant.AUTHER;
        break;
      }
    }

    return `${this.translate.instant(typeName)}`;
  }

  /**
   * Label getter
   */
  get Label(): FormControl {
    return this.group.get(EmployeeConstant.LABEL) as FormControl;
  }

  /**
   * TraductedLabel getter
   */
  get TraductedLabel(): string {
    return `${this.translate.instant(this.Label.value)}`;
  }

  /**
   * Value getter
   */
  get Value(): FormControl {
    return this.group.get(EmployeeConstant.VALUE) as FormControl;
  }

  /**s
   * ExpirationDate getter
   */
  get ExpirationDate(): FormControl {
    return this.group.get(EmployeeConstant.EXPIRATION_DATE) as FormControl;
  }

  /**
   * IsDeleted getter
   */
  get IsDeleted(): FormControl {
    return this.group.get(EmployeeConstant.IS_DELETED) as FormControl;
  }

  /**
   * IsDeleted getter
   */
  get IsPermanent(): FormControl {
    return this.group.get(EmployeeConstant.IS_PERMANENT) as FormControl;
  }

  /**
   * AttachedFileInfo
   */
  get AttachedFileInfo(): FormControl {
    return this.group.get(EmployeeConstant.ATTACHED_FILE_INFO) as FormControl;
  }

  /**
   * AttachedFile
   */
  get AttachedFile(): FormControl {
    return this.group.get(EmployeeConstant.ATTACHED_FILE) as FormControl;
  }

  ngOnInit() {
    if (this.AttachedFile.value) {
      this.fileDocumentToUpload = this.AttachedFileInfo.value;
    }
  }


  /**
   * delete the current employee document
   * */
  deleteEmployeeDocument(): void {
    this.swalWarrings.CreateSwal(EmployeeConstant.WONT_BE_ABLE_TO_REVERT_AFTER_SAVING).then((result) => {
      if (result.value) {
        this.group.controls[EmployeeConstant.IS_DELETED] = new FormControl(true);
        this.group.controls[EmployeeConstant.VALUE] = new FormControl(this.Value.value);
        this.group.controls[EmployeeConstant.EXPIRATION_DATE] = new FormControl(this.ExpirationDate.value);
        this.group.updateValueAndValidity();
      }
    });
  }


  /**
   * on file Change
   * @param event
   */
  onFileChange(event) {
    this.uploadFile(event[0]);
  }

  /**
   * Upload file
   * @param file
   */
  public uploadFile(file: any) {
    if (file) {
      this.fileDocumentToUpload = [];
      const fileInfo = new FileInfo();
      fileInfo.Name = file.Name;
      fileInfo.Extension = file.Extension;
      fileInfo.FileData = file.FileData;
      this.fileDocumentToUpload.push(fileInfo);
      this.updateFormGroupAttachedFile();
    }
  }

  /**
   * Delet File with index
   * @param i
   */
  deleteFile(i: number): void {
    this.fileDocumentToUpload.splice(i, 1);
    this.updateFormGroupAttachedFile();
  }

  /**
   * Download file By index
   * @param i
   */
  downloadFile(i: number) {
    const fileinfo = this.fileDocumentToUpload[i];
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
    downloadLink.href = window.URL.createObjectURL(new Blob([byteArray], {type: 'application/octet-stream'}));
    downloadLink.download = fileinfo.Name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  /**
   *  // update Form control Attached File Info
   * */
  private updateFormGroupAttachedFile() {
    this.group.controls[EmployeeConstant.ATTACHED_FILE_INFO] = new FormControl(this.fileDocumentToUpload);
    this.group.updateValueAndValidity();
  }

}
