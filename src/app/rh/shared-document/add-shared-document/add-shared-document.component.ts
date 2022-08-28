import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileInfo} from '../../../models/shared/objectToSend';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {SharedDocument} from '../../../models/payroll/shared-document.model';
import {SharedDocumentService} from '../../services/shared-document/shared-document.service';
import {SharedDocumentConstant} from '../../../constant/payroll/shared-document.constant';
import {Subscription} from 'rxjs/Subscription';
import { DocumentRequest } from '../../../models/payroll/document-request.model';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { DocumentRequestConstant } from '../../../constant/payroll/document-request.constant';
import { Router } from '@angular/router';
import { DocumentRequestService } from '../../../payroll/services/document-request/document-request.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-shared-document',
  templateUrl: './add-shared-document.component.html',
  styleUrls: ['./add-shared-document.component.scss']
})
export class AddSharedDocumentComponent implements OnInit, OnDestroy {
  filesInfos: Array<FileInfo>;
  /*
   * Form Group
   */
  sharedDocumentFormGroup: FormGroup;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private subscription: Subscription;
  isDocumentValidation: boolean;
  isDocumentUploaded: boolean;
   /**
   * Enum  Waiting , Accepted , Refused
   */
  public statusCode = AdministrativeDocumentStatusEnumerator;
  private subscriptions: Subscription[] = [];

  constructor(private modalService: ModalDialogInstanceService,
              private fb: FormBuilder, private validationService: ValidationService,
              private sharedDocumentService: SharedDocumentService,
              private router: Router, private documentRequestService: DocumentRequestService,
              private translate: TranslateService, private growlService: GrowlService,) {
  }

  ngOnInit() {
    if(this.dialogOptions.data)
    {
      this.isDocumentValidation = true;
      this.AddSharedDocumentFormGroup(this.dialogOptions.data)
    } else 
    {
      this.AddSharedDocumentFormGroup();
    }
    this.filesInfos = new Array<FileInfo>();
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
  }

  shareDocument() {
      if (this.sharedDocumentFormGroup.valid) {
        if(this.isDocumentValidation)
        {
          const documentToSave: DocumentRequest = new DocumentRequest();
          // Update Mode
          Object.assign(documentToSave, this.dialogOptions.data);
          documentToSave.Status = this.statusCode.Accepted;
          documentToSave.Code = this.dialogOptions.data['Code'];
          documentToSave.FilesInfos = this.filesInfos;
          documentToSave.EncryptFile = this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ENCRYPT_FILE].value ?
          this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ENCRYPT_FILE].value : false;
          const objectToSend = new ObjectToSend(documentToSave);
          this.subscriptions.push(this.documentRequestService.validateDocumentRequest(objectToSend).subscribe(() => {
            this.router.navigate([DocumentRequestConstant.DOCUMENT_REQUEST_LIST_URL]);
          }));
        } else
        {
          const sharedDocument: SharedDocument = new SharedDocument();
          sharedDocument.IdEmployee = this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ID_EMPLOYEE].value;
          sharedDocument.IdType = this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ID_DOCUMENT_REQUEST_TYPE].value;
          sharedDocument.FilesInfos = this.filesInfos;
          sharedDocument.EncryptFile = this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ENCRYPT_FILE].value ?
            this.sharedDocumentFormGroup.controls[SharedDocumentConstant.ENCRYPT_FILE].value : false;
          this.subscription = this.sharedDocumentService.saveSharedDocumentAndSendMail(sharedDocument).subscribe(() => {
            if (this.isModal) {
              this.dialogOptions.onClose();
              this.modalService.closeAnyExistingModalDialog();
            }
          });
        }
      } else {
        this.validationService.validateAllFormFields(this.sharedDocumentFormGroup);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  private AddSharedDocumentFormGroup(documentRequest ?: DocumentRequest) {
    this.sharedDocumentFormGroup = this.fb.group({
      Id: [documentRequest ? documentRequest.Id : ''],
      IdEmployee: [documentRequest ? documentRequest.IdEmployee : '', Validators.required],
      IdDocumentRequestType: [documentRequest ? documentRequest.IdDocumentRequestType : '', Validators.required],
      filesInfos: [null],
      EncryptFile: ['']
    });
  }
}
