import { Component, OnInit, Input, ComponentRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Qualification } from '../../../../models/payroll/qualification.model';
import { FileInfo } from '../../../../models/shared/objectToSend';
import { QualificationService } from '../../../../payroll/services/qualification/qualification.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { EmployeeConstant } from '../../../../constant/payroll/employee.constant';
import { QualificationConstant } from '../../../../constant/payroll/qualification.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-qualification',
  templateUrl: './add-qualification.component.html',
  styleUrls: ['./add-qualification.component.scss']
})
export class AddQualificationComponent implements OnInit, OnDestroy, IModalDialog {

  // Format Date
  public formatDate: string = this.translate.instant(SharedConstant.DATE_FORMAT);
  qualificationFormGroup: FormGroup;
  /*
   * form controle
   */
  @Input() control: FormControl;
  qualifiedColumnName: string = SharedConstant.ID_EMPLOYEE;
  /*
   * id Subscription
   */


  public idSubscription: Subscription;
  public qualificationSubscription: Subscription;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  /**
   * If modal=true
   */
  public isModal: boolean;
  /*
   * Tiers to update
   */
  public qualificationToUpdate: Qualification;

  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public data: any;

  public QualificationFileToUpload: Array<FileInfo>;
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data;
    if (this.data && this.data[SharedConstant.QUALIFIED_COLUMN_NAME]) {
      this.qualifiedColumnName = this.data[SharedConstant.QUALIFIED_COLUMN_NAME];
    }
    this.closeDialogSubject = options.closeDialogSubject;
    this.QualificationFileToUpload = new Array<FileInfo>();
  }
  ngOnDestroy(): void {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
    if (this.qualificationSubscription !== undefined) {
      this.qualificationSubscription.unsubscribe();
    }
  }

  constructor(public qualificationService: QualificationService, private fb: FormBuilder, private router: Router,
    private modalService: ModalDialogInstanceService, private validationService: ValidationService, private translate: TranslateService) {
    this.QualificationFileToUpload = new Array<FileInfo>();
  }

  ngOnInit() {
    this.createAddForm();
  }

  private createAddForm(): void {
    this.qualificationFormGroup = this.fb.group({
      Id: [0],
      University: ['', [Validators.required]],
      IdQualificationCountry: [''],
      IdQualificationType: [''],
      QualificationDescritpion: ['', [Validators.maxLength(NumberConstant.SIX_HUNDRED)]],
      GraduationYearDate: ['', [Validators.required]],
      IsDeleted: [false],
      QualificationFileInfo: []
    });
    this.qualificationFormGroup.addControl(this.qualifiedColumnName, new FormControl(0));
  }
  /**
  * Save Qualification
  * */
  save() {
    if (this.isModal && this.qualificationFormGroup.valid) {
      this.sentQualificationFormToEmployee();
    } else if (this.qualificationFormGroup.valid) {
      const obj: Qualification = Object.assign({}, new Qualification(), this.qualificationFormGroup.value);
      this.qualificationService.save(obj, !this.isUpdateMode).subscribe(() => {
        this.router.navigate([EmployeeConstant.EMPLOYEE_LIST_URL]);
      });
    } else {
      this.validationService.validateAllFormFields(this.qualificationFormGroup);
    }
  }
  /**
   * Sent the qualification formGroup to the employee formGroup
   * */
  sentQualificationFormToEmployee(): any {
    this.qualificationFormGroup.controls[QualificationConstant.QUALIFICATION_FILE_INFO] =
      new FormControl(this.QualificationFileToUpload);
    this.qualificationFormGroup.updateValueAndValidity();
    this.options.data = this.qualificationFormGroup;
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }
}
