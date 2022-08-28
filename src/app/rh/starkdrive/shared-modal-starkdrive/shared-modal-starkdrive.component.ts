import {Component, ComponentRef, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FileDrive} from '../../../models/rh/file-drive.model';
import {StarkdriveFileService} from '../../services/starkdrive-file/starkdrive-file.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileDriveSharedDocument} from '../../../models/rh/file-drive-shared-document.model';
import {SharedDocumentConstant} from '../../../constant/payroll/shared-document.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {StarkdriveSharedDocumentServiceService} from '../../services/starkdrive-shared-document/starkdrive-shared-document-service.service';

@Component({
  selector: 'app-shared-modal-starkdrive',
  templateUrl: './shared-modal-starkdrive.component.html',
  styleUrls: ['./shared-modal-starkdrive.component.scss']
})
export class SharedModalStarkdriveComponent implements OnInit {
  fileDriveInfo: Array<FileDrive>;
  sharedDocumentFormGroup: FormGroup;
  public data: any;
  public fileDrive: FileDrive;
  public isModal: boolean;
  public options: Partial<IModalDialogOptions<any>>;
  public reference: ComponentRef<IModalDialog>;
  dialogOptions: Partial<IModalDialogOptions<any>>;


  constructor(public starkdriveFileService: StarkdriveFileService, private modalService: ModalDialogInstanceService,
              private fb: FormBuilder, private validationService: ValidationService,
              private starkdriveSharedDocumentService: StarkdriveSharedDocumentServiceService) {
  }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.fileDriveInfo = options.data;

  }

  initGridDataSource() {
    this.starkdriveFileService.getById(this.data.Id).subscribe(res => {
      this.fileDrive = res;

    });
  }

  shareDocument() {
    if (this.sharedDocumentFormGroup.valid && this.fileDriveInfo) {
      const sharedDocument: FileDriveSharedDocument = new FileDriveSharedDocument();
      sharedDocument.IdEmployee = this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ID_EMPLOYEE].value;
      sharedDocument.FilesInfos = this.options.data;
      sharedDocument.EncryptFile = this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ENCRYPT_FILE].value ?
        this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ENCRYPT_FILE].value : false;
      this.starkdriveSharedDocumentService.saveSharedDocumentAndSendMail(sharedDocument).subscribe(() => {
        if (this.isModal) {
          this.dialogOptions.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }
      });

    } else {
      this.validationService.validateAllFormFields(this.sharedDocumentFormGroup);
    }

  }

  ngOnInit() {
    this.AddSharedDocumentFormGroup();
    this.fileDriveInfo = new Array<FileDrive>();
  }

  private AddSharedDocumentFormGroup() {
    this.sharedDocumentFormGroup = this.fb.group({
      Id: [''],
      IdEmployee: ['', Validators.required],
      EncryptFile: ['']

    });
  }
}
