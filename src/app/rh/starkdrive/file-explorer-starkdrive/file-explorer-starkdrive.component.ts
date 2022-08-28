import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { FileDrive } from '../../../models/rh/file-drive.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FolderModalStarkdriveComponent } from '../folder-modal-starkdrive/folder-modal-starkdrive.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { StarkdriveFileService } from '../../services/starkdrive-file/starkdrive-file.service';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { Resource } from '../../../models/shared/ressource.model';
import { DetailsModalStarkdriveComponent } from '../details-modal-starkdrive/details-modal-starkdrive.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { StarkdriveConstant } from '../../../constant/rh/starkdrive.constant';
import { SharedModalStarkdriveComponent } from '../shared-modal-starkdrive/shared-modal-starkdrive.component';
import { UploadFiledriveModalComponent } from '../upload-filedrive-modal/upload-filedrive-modal.component';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-file-explorer-starkdrive',
  templateUrl: './file-explorer-starkdrive.component.html',
  styleUrls: ['./file-explorer-starkdrive.component.scss'],
})
export class FileExplorerStarkdriveComponent implements OnInit {
  constructor(public dialog: MatDialog, private swalWarrings: SwalWarring, public starkdriveFileService: StarkdriveFileService,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef, private localStorageService : LocalStorageService) {
    this.fileToUpload = new Array<FileDrive>();
  }

  @Input() fileElements: FileDrive[];
  @Input() canNavigateUp: string;
  @Input() path: string;
  @Input() idParent: number;
  @Input() fileToUpload: Array<FileDrive>;
  @Input() service: ResourceService<Resource>;
  @Output() folderAdded = new EventEmitter<{ Name: string }>();
  @Output() elementRemoved = new EventEmitter<FileDrive>();
  @Output() elementRenamed = new EventEmitter<FileDrive>();
  @Output() navigatedDown = new EventEmitter<FileDrive>();
  @Output() elementMoved = new EventEmitter<{ element: FileDrive; moveTo: FileDrive }>();
  @Output() navigatedUp = new EventEmitter();
  @Output() actionSelected = new EventEmitter<boolean>();
  public fileToShare = new Array<FileDrive>();
  public fileToMove = new Array<FileDrive>();
  public fileId: number;
  public nameOfFolder: string;
  isUpdateMode = false;
  folderToUpdate: FileDrive;
  fileToRename = new FileDrive();
  fileToDelete = new Array<FileDrive>();

  ngOnInit() {
  }

  /**
   * Move to trash
   * @param element
   */
  deleteElement(element: FileDrive, trash: FileDrive) {
    this.swalWarrings.CreateSwal(StarkdriveConstant.DELETE_SWAL).then((result) => {
      if (result.value) {
        if (element.Type) {
          trash = new FileDrive();
          trash.Id = 5;
          trash.Path = StarkdriveConstant.TRASH_PATH;
          this.moveElement(element, trash);
        } else {
          this.starkdriveFileService.remove(element).subscribe(res => {
            this.elementRemoved.emit(element);
          });
        }
      }
    });
  }

  /**
   * Permanent delete
   * @param element
   */
  permanantDelete(element: FileDrive) {
    this.swalWarrings.CreateSwal(StarkdriveConstant.DELETE_SWAL_PERMANENTLY).then((result) => {
      if (result.value) {
        this.starkdriveFileService.uploadFileDrive(element).subscribe(fileData => {
          if (fileData) {
            const fileInfo = new FileDrive();
            const FileDriveInfo = new Array<FileDrive>();
            fileInfo.Id = element.Id;
            fileInfo.Name = element.Name;
            fileInfo.Path = element.Path;
            FileDriveInfo.push(fileInfo);
            this.fileToDelete = FileDriveInfo;
            this.starkdriveFileService.permanantDelete(this.fileToDelete).subscribe(data => {
              if (data) {
              }
            });
            this.elementRemoved.emit(element);
          }
        });
      }
    });
  }

  /**
   *
   * @param element
   */
  navigate(element: FileDrive) {
    if (element.Type == null) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  /**
   *
   * @param element
   * @param moveTo
   */
  moveElement(element: FileDrive, moveTo: FileDrive) {
    this.elementMoved.emit({element: element, moveTo: moveTo});
    this.starkdriveFileService.uploadFileDrive(element).subscribe(fileData => {
      if (fileData) {
        const fileInfo = new FileDrive();
        const FileDriveInfo = new Array<FileDrive>();
        fileInfo.Id = element.Id;
        fileInfo.Name = element.Name;
        fileInfo.Type = element.Type;
        fileInfo.Size = element.Size;
        fileInfo.Data = fileData.Data;
        fileInfo.Path = element.Path;
        fileInfo.CreatedBy = element.CreatedBy;
        fileInfo.CreationDate = element.CreationDate;
        FileDriveInfo.push(fileInfo);
        this.fileToMove = FileDriveInfo;
        this.starkdriveFileService.moveElement(this.fileToMove, moveTo).subscribe(data => {
          if (data) {
          }
        });
      }
    });
  }

  openNewFolderDialog() {
    const dialogRef = this.dialog.open(FolderModalStarkdriveComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.nameOfFolder = res;
        this.save(this.nameOfFolder);
        this.folderAdded.emit({Name: res});
      }
    });
  }

  /**
   *
   * @param element
   */
  openRenameDialog(element: FileDrive) {
    const dialogRef = this.dialog.open(FolderModalStarkdriveComponent);
    if (element.Type) {
      this.starkdriveFileService.uploadFileDrive(element).subscribe(fileData => {
        if (fileData) {
          this.fileToRename.Data = fileData.Data;
        }
      });
    }
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        element.Name = res;
        this.update(element.Name, element.Id, this.fileToRename.Data);
        this.elementRenamed.emit(element);
      }
    });
  }

  /**
   *
   * @param event
   * @param viewChild
   */
  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  /**
   *
   * @param fileinfo
   */
  downloadFile(fileinfo: FileDrive) {
    if (fileinfo && fileinfo.FileData) {
      this.downLoadFile(fileinfo);
    } else {
      this.starkdriveFileService.uploadFileDrive(fileinfo).subscribe(data => {
        if (data) {
          this.downLoadFile(data);
        }
      });
    }
  }

  /**
   *
   * @param fileinfo
   */
  downLoadFile(fileinfo: FileDrive) {
    let byteArray: any;
    if (fileinfo.FileData) {
      byteArray = new Buffer(fileinfo.FileData, StarkdriveConstant.BASE_64);
    } else {
      byteArray = new Buffer(fileinfo.Data.toString(), StarkdriveConstant.BASE_64);
    }
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob([byteArray], {type: StarkdriveConstant.APPLICATION_TYPE}));
    downloadLink.download = fileinfo.Name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  /**
   *
   * @param element
   */
  openDetailsModalDialog(element: FileDrive) {
    this.formModalDialogService.openDialog(StarkdriveConstant.DETAILS,
      DetailsModalStarkdriveComponent, this.viewRef, this.onCloseDetailsModal.bind(this),
      element, true, SharedConstant.MODAL_DIALOG_SIZE_S);
  }

  openSharedModalDialog(element: FileDrive) {

    this.starkdriveFileService.uploadFileDrive(element).subscribe(fileData => {
      if (fileData) {
        const fileInfo = new FileDrive();
        const fileInfos = new Array<FileDrive>();
        fileInfo.Name = element.Name;
        fileInfo.Type = element.Type;
        fileInfo.Data = fileData.Data;
        fileInfos.push(fileInfo);
        this.fileToShare = fileInfos;
      }
      this.formModalDialogService.openDialog(StarkdriveConstant.SHARE_DOCUMENT,
        SharedModalStarkdriveComponent, this.viewRef, this.onCloseDetailsModal.bind(this),
        this.fileToShare, true, SharedConstant.MODAL_DIALOG_SIZE_S);
    });
  }

  save(nameOfFolder: string) {
    const requestToSave: FileDrive = new FileDrive();
    requestToSave.Name = nameOfFolder;
    requestToSave.CreatedBy = this.localStorageService.getUserId();
    requestToSave.CreationDate = new Date();
    requestToSave.Path = this.path;
    requestToSave.IdParent = this.idParent;
    this.starkdriveFileService.save(requestToSave, !this.isUpdateMode).subscribe(result => {
    });
  }

  openUploadModalDialog() {
    const objectToSend = {data: {path: this.path, idParent: this.idParent}};
    this.dialog.open(UploadFiledriveModalComponent, objectToSend);
  }

  update(newNameOfFolder: string, idOfSelectedFolder: number, dataOfFile?) {
    this.starkdriveFileService.getById(idOfSelectedFolder)
      .subscribe(res => {

        this.folderToUpdate = res;
        this.folderToUpdate.Name = newNameOfFolder;
        this.folderToUpdate.Data = dataOfFile;
        this.starkdriveFileService.save(this.folderToUpdate, this.isUpdateMode).subscribe();
      });
  }

  private onCloseDetailsModal(data: any): void {
    this.actionSelected.emit();
  }
}
