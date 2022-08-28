import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FileDrive } from '../../../models/rh/file-drive.model';
import { StarkdriveFileService } from '../../services/starkdrive-file/starkdrive-file.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { StarkdriveConstant } from '../../../constant/rh/starkdrive.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-upload-filedrive-modal',
  templateUrl: './upload-filedrive-modal.component.html',
  styleUrls: ['./upload-filedrive-modal.component.scss']
})
export class UploadFiledriveModalComponent implements OnInit {
  @Output() selectedFiles = new EventEmitter<FileDrive[]>();
  @Input() onlyPdf: boolean;
  public fileToUpload: Array<FileDrive>;
  files: File[] = [];
  isUpdateMode = false;
  idParent: number;
  path: string;

  constructor(public dialogRef: MatDialogRef<UploadFiledriveModalComponent>, public starkdriveFileService: StarkdriveFileService,
    public growlService: GrowlService, private translate: TranslateService, @Inject(MAT_DIALOG_DATA) public data: any,
              private localStorageService : LocalStorageService) {
    this.fileToUpload = new Array<FileDrive>();
  }

  ngOnInit() {
    this.path = this.data.path;
    this.idParent = this.data.idParent;
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    this.uploadFile(this.files);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), NumberConstant.ONE);
  }

  public uploadFile(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileInfo = new FileDrive();
        fileInfo.CreationDate = new Date();
        fileInfo.Name = file.name;
        fileInfo.Type = file.type;
        fileInfo.Size = file.size;
        fileInfo.Path = this.path;
        fileInfo.FileData = (<string>reader.result).split(StarkdriveConstant.COMMA)[NumberConstant.ONE];
        if (!this.onlyPdf || (this.onlyPdf && file.type === StarkdriveConstant.PDF)) {
          this.fileToUpload.push(fileInfo);
        } else {
          this.growlService.ErrorNotification(this.translate.instant(StarkdriveConstant.FILE_FORMAT_NOT_RESPECTED));
        }
      };
    });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length > NumberConstant.ZERO) {
      for (const file of event.target.files) {
        this.uploadFile(file);
      }
    }
  }

  save(fileToUpload: Array<FileDrive>) {
    const requestToSave: FileDrive = new FileDrive();
    requestToSave.FileDriveInfo = fileToUpload;
    requestToSave.CreatedBy = this.localStorageService.getUserId();
    requestToSave.CreationDate = new Date();
    requestToSave.IdParent = this.idParent;
    this.starkdriveFileService.save(requestToSave, !this.isUpdateMode).subscribe(result => {
    });
  }
}
