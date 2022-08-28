import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FileDrive } from '../../../models/rh/file-drive.model';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { StarkdriveConstant } from '../../../constant/rh/starkdrive.constant';
import { StarkdriveFileService } from '../../services/starkdrive-file/starkdrive-file.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-upload-filedrive',
  templateUrl: './upload-filedrive.component.html',
  styleUrls: ['./upload-filedrive.component.scss']
})
export class UploadFiledriveComponent implements OnInit {
  @Input() idParent: number;
  @Input() path: string;
  public fileToUpload: Array<FileDrive>;
  @Output() selectedFiles = new EventEmitter<FileDrive[]>();
  @Input() onlyPdf: boolean;
  isUpdateMode = false;

  constructor(public growlService: GrowlService, private translate: TranslateService,
    public starkdriveFileService: StarkdriveFileService, private localStorageService : LocalStorageService) {
    this.fileToUpload = new Array<FileDrive>();
  }

  ngOnInit() {
  }

  public uploadFile(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      const fileInfo = new FileDrive();
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
      this.save(this.fileToUpload);
    };
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
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
