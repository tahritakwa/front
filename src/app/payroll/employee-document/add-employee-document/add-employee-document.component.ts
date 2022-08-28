import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-add-employee-document',
  templateUrl: './add-employee-document.component.html',
  styleUrls: ['./add-employee-document.component.scss']
})
export class AddEmployeeDocumentComponent implements OnInit, OnDestroy, IModalDialog {
  employeeDocumentFormGroup: FormGroup;
  /*
   * id Subscription
   */
  public idSubscription: Subscription;
  public employeeDocumentSubscription: Subscription;
  /**
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public data: any;

  constructor(private fb: FormBuilder, private validationService: ValidationService,
              private modalService: ModalDialogInstanceService) {
  }

  ngOnInit() {
    this.createAddForm();
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.data = options.data;
    this.closeDialogSubject = options.closeDialogSubject;
  }

  ngOnDestroy(): void {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
    if (this.employeeDocumentSubscription !== undefined) {
      this.employeeDocumentSubscription.unsubscribe();
    }
  }

  /**
   * Save employee document
   * */
  save() {
    if (this.isModal && this.employeeDocumentFormGroup.valid) {
      this.sentEmployeeDocumentFormToEmployee();
    } else if (this.employeeDocumentFormGroup.valid) {
      // treatment of not modal employee document add here
    } else {
      this.validationService.validateAllFormFields(this.employeeDocumentFormGroup);
    }
  }

  /**
   * Sent the contract formGroup to the employee formGroup
   * */
  sentEmployeeDocumentFormToEmployee(): any {
    this.options.data = this.employeeDocumentFormGroup;
    this.options.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  /**
   * Create the add form
   * */
  private createAddForm(): void {
    this.employeeDocumentFormGroup = this.fb.group({
      Id: [0],
      IdEmployee: [0, [Validators.required]],
      ExpirationDate: [''],
      Label: ['', [Validators.required, Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY)]],
      Type: ['', [Validators.required]],
      Value: ['', [Validators.minLength(NumberConstant.FOUR), Validators.maxLength(NumberConstant.SIXTEEN)]],
      AttachedFile: [],
      IsDeleted: [false],
      IsPermanent: [false]
    });
  }

}
