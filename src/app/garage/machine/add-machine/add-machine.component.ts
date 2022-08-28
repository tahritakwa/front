import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Machine } from '../../../models/garage/machine.model';
import { ReducedOperation } from '../../../models/garage/reduced-operation.model';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { MachineService } from '../../services/machine/machine.service';
import { OperationService } from '../../services/operation/operation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})
export class AddMachineComponent implements OnInit {
  listUrl = GarageConstant.MACHINES_LIST_URL;

  /**
   * Form Group
   */
  public machineFormGroup: FormGroup;

  /**
   * is updateMode
   */
  private id: number;
  public isUpdateMode = false;
  public machineToUpdate: Machine;

  operationsAssociated: ReducedOperation[] = [];
  operationIdsToIgnore: Array<number> = [];

  private saveDone = false;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
   /**
   * open colaps by default
   */

    public openOperationFirstCollapse = true;

  constructor(private fb: FormBuilder, private validationService: ValidationService, private operationService: OperationService,
    private machineService: MachineService, private router: Router, private translateService: TranslateService,
    private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = Number.parseInt(params.get('id'));
    });
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_MACHINE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_MACHINE);
    this.createAddForm();
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode) {
      this.machineService.getById(this.id).subscribe(data => {
        this.machineToUpdate = data;
        this.machineFormGroup.patchValue(this.machineToUpdate);
        if (this.machineToUpdate.ReducedOperation) {
          this.machineToUpdate.ReducedOperation.forEach((x) => {
            const reducedOperation: ReducedOperation = x;
            reducedOperation.ExpectedDurationFormat = this.operationService.getExpectedDuration(x, this.translateService);
            this.operationsAssociated.unshift(reducedOperation);
            this.operationIdsToIgnore.unshift(reducedOperation.Id);
          });
        }
        if (!this.hasUpdatePermission) {
          this.machineFormGroup.disable();
        }
      });
    }
  }

  private createAddForm(dataItem?): void {
    this.machineFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      Name: [dataItem ? dataItem.Name : undefined, {
        validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)],
        asyncValidators: unique('Name', this.machineService, this.id ?
          String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
      }],
      State: [dataItem ? dataItem.State : 1, Validators.required],
      Constructor: [dataItem ? dataItem.Constructor : '', Validators.required],
      Model: [dataItem ? dataItem.Model : '', Validators.required]
    });
  }

  save() {
    if (this.machineFormGroup.valid) {
      const machine: Machine = Object.assign({}, this.machineToUpdate, this.machineFormGroup.getRawValue());
      machine.ReducedOperation = this.operationsAssociated;
      this.machineService.save(machine, !this.isUpdateMode).subscribe(() => {
        this.saveDone = true;
        this.router.navigateByUrl(GarageConstant.MACHINES_LIST_URL);
      });
    } else {
      this.validationService.validateAllFormFields(this.machineFormGroup);
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.machineFormGroup.dirty);
  }

}
