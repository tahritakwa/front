import {Component, ComponentRef, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileService} from '../../../services/file/file.service';
import {AttachmentService} from '../../../services/attachment/attachment.service';
import {OpportunityService} from '../../../services/opportunity.service';
import {ValidationService} from '../../../../shared/services/validation/validation.service';
import {FileConstant} from '../../../../constant/crm/file.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import * as fileSaver from 'file-saver';

const mime = require('mime-types');

@Component({
  selector: 'app-file-add',
  templateUrl: './file-add.component.html',
  styleUrls: ['./file-add.component.scss']
})
export class FileAddComponent implements OnInit, IModalDialog {
  @ViewChild('fileDocument') fileDocument: ElementRef;
  public fileFormGroup: FormGroup;
  private isUpdateMode = false;
  public fileDocumentToUpload;
  public fileSizeIsValid = true;
  public fileExtensionIsValid = true;
  private fiveMegaBytes = 5242880;
  private allowedExtensions = ['csv', 'xls', 'doc', 'txt', 'pdf', 'zip', 'jpg', 'png', 'jpeg'];
  public attachmentsavedName;
  public fileDetails;
  public contactCrm;
  public opportunityEntityName = OpportunityConstant.OPPORTUNITY_ENTITY.toLowerCase();
  public source: string;
  public sourceId;
  public isProspect: boolean;
  public opportunityList;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public isModal;
  public isReadOnly = false;
  public opportunity: any;
  public originalName;

  /**
   * @param formBuilder
   * @param attachmentService
   * @param fileService
   * @param opportunityService
   * @param validationService
   * @param modalService
   * @param translateService
   * @param growlService
   */
  constructor(private formBuilder: FormBuilder,
              private attachmentService: AttachmentService,
              private  fileService: FileService,
              private opportunityService: OpportunityService,
              private validationService: ValidationService,
              private modalService: ModalDialogInstanceService,
              private translateService: TranslateService,
              private growlService: GrowlService) {
  }

  ngOnInit() {
    this.createFormGroup();
    this.initOpportunityDropDown();
    if (this.isUpdateMode) {
      this.fileDocumentToUpload = this.fileDetails.pathAttachment;
      this.attachmentsavedName = this.fileDetails.pathAttachment;
      this.originalName = this.fileDetails.originalName;
      this.fileFormGroup.patchValue(this.fileDetails);
    }
    this.initMessagesErrors();
  }

  initMessagesErrors() {
    this.fileSizeIsValid = true;
    this.fileExtensionIsValid = true;
  }

  createFormGroup() {
    this.fileFormGroup = this.formBuilder.group({
      title: ['', Validators.required],
      pathAttachment: ['', Validators.required],
      idContact: [''],
      idOpportunity: [''],
      idOrganisation: [''],
      originalName: [''],
      idAction: [''],
      idClaim: [''],
      idConClient: [''],
      idOrgClient: ['']
    });
  }

  initOpportunityDropDown() {
    this.opportunityService.getJavaGenericService().getEntityList().subscribe((_data) => {
        if (_data) {
          this.opportunityList = _data;
        }
      }, () => {
        this.growlService.successNotification(this.translateService.instant(SharedCrmConstant.FAILURE_OPERATION));
      },
      () => {
        this.initDefaultOpportunity();
      });
  }

  public uploadPictureFile(event) {
    this.fileDocumentToUpload = event.target.files[0];
    this.originalName = this.fileDocumentToUpload.name ? this.fileDocumentToUpload.name : this.fileDocumentToUpload;
    if (this.fileDocumentToUpload) {
      if (this.checkFileSize(this.fileDocumentToUpload.size) &&
        this.checkFileExtension(this.allowedExtensions, this.fileDocumentToUpload)) {
        const reader = new FileReader();
        reader.readAsBinaryString(this.fileDocumentToUpload);
        this.handleInputChange(this.fileDocumentToUpload);
        this.fileFormGroup.controls['pathAttachment'].reset();
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

  showNoSuchFileMessage() {
    return !this.fileDocumentToUpload || !this.fileSizeIsValid || !this.fileExtensionIsValid;
  }

  showFileName() {
    return this.fileDocumentToUpload && this.fileSizeIsValid && this.fileExtensionIsValid;
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
      'directoryName': this.source
    }).subscribe((data: String) => {
      if (data !== null) {
        this.attachmentsavedName = data;
        const reader = new FileReader();
        reader.readAsDataURL(file);
      }
    });
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

  deleteFile(): void {
    if (this.isUpdateMode) {
      this.attachmentService.getJavaGenericService().deleteFile('delete'
        , {
          'id': this.fileDetails.id,
          'fileName': this.attachmentsavedName ? this.attachmentsavedName : this.fileDocumentToUpload,
          'directoryName': this.source
        }).subscribe((data) => {
          if (data) {
            this.resetFileField();
          }
        }
      );
    } else {
      this.resetFileField();
    }
  }

  resetFileField() {
    this.fileDocumentToUpload = false;
    this.fileDocument.nativeElement.value = null;
    this.attachmentsavedName = '';
  }

  downloadFileSystem() {
    const EXT = this.attachmentsavedName.substr(this.attachmentsavedName.lastIndexOf('.') + 1);
    this.fileService.downloadFile(this.attachmentsavedName, this.source)
      .subscribe(data => {
        fileSaver.saveAs(new Blob([data], {type: mime.lookup(EXT)}), this.attachmentsavedName);
      });
  }

  saveFileData() {
    this.fileFormGroup.patchValue({'pathAttachment': this.attachmentsavedName});
    this.fileFormGroup.patchValue({'originalName': this.originalName});
    if (this.fileFormGroup.valid) {
      if (!this.isUpdateMode) {
        this.setRelatedToIdBySource();
        this.fileService.getJavaGenericService().saveEntity(this.fileFormGroup.value, '/save').subscribe(data => {
          if (data !== null) {
            this.resetAll();
            this.onBackToListOrCancel();
          }
        });
      } else {
        this.resetForeignKeys();
        this.fileService.getJavaGenericService().updateEntity(this.fileFormGroup.value, this.fileDetails.id).subscribe((data) => {
          if (data !== null) {
            this.resetAll();
            this.isUpdateMode = false;
            this.onBackToListOrCancel();
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.fileFormGroup);
    }
  }

  private resetForeignKeys() {
    if (this.fileDetails.organisation) {
      this.fileFormGroup.patchValue({'idOrganisation': this.fileDetails.organisation.id});
    }
    if (this.fileDetails.action) {
      this.fileFormGroup.patchValue({'idAction': this.fileDetails.action.id});
    }
    if (this.fileDetails.claim) {
      this.fileFormGroup.patchValue({'idClaim': this.fileDetails.claim.id});
    }
    if (this.fileDetails.idOpportunity) {
      this.fileFormGroup.patchValue({'idOpportunity': this.fileDetails.idOpportunity});
    }
  }

  private setRelatedToIdBySource() {
    if (this.source === FileConstant.ORGANISATION) {
      if (this.isProspect) {
        this.fileFormGroup.patchValue({'idOrganisation': this.sourceId});
      } else {
        this.fileFormGroup.patchValue({'idOrgClient': this.sourceId});
      }
    }
    if (this.source === FileConstant.OPPORTUNITY) {
      this.fileFormGroup.patchValue({'idOpportunity': this.sourceId});
    }
    if (this.source === FileConstant.ACTION) {
      this.fileFormGroup.patchValue({'idAction': this.sourceId});
    }
    if (this.source === FileConstant.CLAIM) {
      this.fileFormGroup.patchValue({'idClaim': this.sourceId});
    }
    if (this.source === FileConstant.CONTACT) {
      if (this.isProspect) {
        this.fileFormGroup.patchValue({'idOrganisation': this.contactCrm.organisationId});
        this.fileFormGroup.patchValue({'idContact': this.sourceId});
      } else {
        this.fileFormGroup.patchValue({'idConClient': this.sourceId});
      }
    }
  }

  resetAll() {
    this.resetFileField();
    this.fileFormGroup.reset();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.optionDialog = options;
    this.isUpdateMode = this.optionDialog.data.isUpdateMode;
    this.fileDetails = this.optionDialog.data.file;
    this.contactCrm = this.optionDialog.data.contactCrm;
    this.source = this.optionDialog.data.source;
    this.sourceId = this.optionDialog.data.sourceId;
    this.isProspect = this.optionDialog.data.isProspect;
  }

  onBackToListOrCancel() {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  private initDefaultOpportunity() {
    if (this.source === this.opportunityEntityName) {
      this.opportunity = this.opportunityList.find(opportunity => opportunity.id === this.sourceId);
      this.isReadOnly = true;
    }
  }
}
