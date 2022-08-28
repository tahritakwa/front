import {Component, ComponentRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NomenclaturesConstant} from '../../../constant/manufuctoring/nomenclature.constant';
import {OperationService} from '../../service/operation.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OperationConstant} from '../../../constant/manufuctoring/operation.constant';
import {Operation} from '../../../../COM/Models/operations';
import {DISABLED} from '@angular/forms/src/model';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';

@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.scss']
})
export class AddOperationComponent implements OnInit {

  public isUpdateMode = false;
  public formGroup: FormGroup;
  public idOperationOnUpdate;
  public operationToBeUpdated;
  /*
  * dialog subject
  */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public operationModalOpenedFromGamme = false;

  constructor(private operationService: OperationService, private growlService: GrowlService, private router: Router,
              private fb: FormBuilder, private activatedRoute: ActivatedRoute,
              private validationService: ValidationService, private translate: TranslateService,
              private modalService: ModalDialogInstanceService) {
    this.activatedRoute.params.subscribe(params => {
      this.idOperationOnUpdate = +params['id'] || 0;
      this.isUpdateMode = this.idOperationOnUpdate > 0;
    });
  }

  ngOnInit() {
    this.createFormGroup();
    if (this.idOperationOnUpdate > 0 && !this.operationModalOpenedFromGamme) {
      this.getDataToUpdate();
    } else {
      this.getLastCode();
    }
  }

  createFormGroup() {
    this.formGroup = this.fb.group({
      code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  getDataToUpdate() {
    if (this.idOperationOnUpdate) {
      this.operationService.getJavaGenericService().getEntityById(this.idOperationOnUpdate)
        .subscribe(operation => {
          this.operationToBeUpdated = operation;
          this.formGroup.patchValue({
            code: operation.code,
            description: operation.description
          });
        });
    }
  }

  save() {
    if (this.isUpdateMode && !this.operationModalOpenedFromGamme) {
      this.editOperation();
    } else {
      this.saveOperation();
    }
  }


  private editOperation() {
    this.operationService.getJavaGenericService().updateEntity(
      {
        code: this.formGroup.value.code,
        description: this.formGroup.value.description
      }, this.operationToBeUpdated.id)
      .subscribe(result => {
        this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
        this.router.navigateByUrl(OperationConstant.OPERATION_URL);
      });
  }

  private saveOperation() {
    if (this.formGroup.valid) {
      const operationToSave = {
        code: this.formGroup.controls['code'].value,
        description: this.formGroup.controls['description'].value
      };
      this.operationService.getJavaGenericService()
        .saveEntity(operationToSave, '')
        .subscribe(data => {
          this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
          if (this.operationModalOpenedFromGamme) {
            this.dialogOptions.data = data;
            this.dialogOptions.data.source = SharedConstant.GAMME;
            this.dialogOptions.onClose();
          } else {
            this.router.navigateByUrl(OperationConstant.OPERATION_URL);
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  private getLastCode() {
    this.operationService.callService(Operation.GET, 'get-last-code').subscribe((result) => {
      this.formGroup.controls['code'].patchValue(result);
      this.formGroup.controls['code'].disable();
    });
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.operationModalOpenedFromGamme = true;
    this.dialogOptions = options;
  }
}
