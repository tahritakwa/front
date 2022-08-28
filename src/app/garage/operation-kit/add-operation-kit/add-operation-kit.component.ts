import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { OperationKitItem } from '../../../models/garage/operation-kit-item.model';
import { OperationKitOperation } from '../../../models/garage/operation-kit-operation.model';
import { OperationKit } from '../../../models/garage/operation-kit.model';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { GridSparePartsComponent } from '../../components/grid-spare-parts/grid-spare-parts.component';
import { OperationForKitOperationComponent } from '../../components/operation-for-kit-operation/operation-for-kit-operation.component';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-operation-kit',
  templateUrl: './add-operation-kit.component.html',
  styleUrls: ['./add-operation-kit.component.scss']
})
export class AddOperationKitComponent implements OnInit {
  @ViewChild('operationKitOperationViewChild') operationKitOperationViewChild: OperationForKitOperationComponent;
  @ViewChild('sparePartsViewChild') sparePartsViewChild: GridSparePartsComponent;
  // Urls
  listUrl = GarageConstant.KITS_LIST_URL;

  /**
   * Form Group
   */
  public kitFormGroup: FormGroup;

  /**
   * is updateMode
   */
  public id: number;
  public isUpdateMode = false;
  operationKitToUpdate: OperationKit;

  operationsAssociated: any[] = [];
  operationListIdsToIgnore: Array<number> = [];
  itemsAssociated: any[] = [];

  isFromItem: boolean;


  /**
   * open colaps by default
   */

  public openOperationFirstCollapse = true;
  public openItemFirstCollapse = true;

  private saveDone = false;
    // Permission Parameters
    public hasAddPermission: boolean;
    public hasUpdatePermission: boolean;

  constructor(private fb: FormBuilder, private validationService: ValidationService, private operationKitService: OperationKitService,
    private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[GarageConstant.ID] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_OPERATIONKIT);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_OPERATIONKIT);
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  private createAddForm(dataItem?): void {
    this.kitFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      Name: [dataItem ? dataItem.Name : undefined, {
        validators: [Validators.required,Validators.maxLength(NumberConstant.TWO_HUNDRED_FIFTY_FIVE)],
        asyncValidators: unique(GarageConstant.NAME, this.operationKitService, this.id ? String(this.id) : String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }],
    });
  }

  private getDataToUpdate() {
    this.operationKitService.getOperationKitByCondiction(this.id).subscribe((data) => {
      this.operationKitToUpdate = data;
      this.kitFormGroup.patchValue(this.operationKitToUpdate);
      if (data.OperationKitOperation) {
        data.OperationKitOperation.forEach((x: OperationKitOperation) => {
          this.operationsAssociated.unshift(new OperationKitOperation(x));
          this.operationListIdsToIgnore.unshift(x.IdOperation);
        });
      }
      if (data.OperationKitItem) {
        data.OperationKitItem.forEach((x: OperationKitItem) => {
          this.itemsAssociated.unshift((x));
        });
      }
      if (!this.hasUpdatePermission) {
        this.kitFormGroup.disable();
      }
    });
  }

  save() {
    if (this.kitFormGroup.valid) {
      this.operationKitToUpdate = Object.assign({}, this.operationKitToUpdate, this.kitFormGroup.getRawValue());
      // set operations associated
      if (this.operationKitOperationViewChild) {
        this.operationKitToUpdate.OperationKitOperation = this.operationKitOperationViewChild.getListOperation();
      }
      // set items associated
      if (this.sparePartsViewChild) {
        this.operationKitToUpdate.OperationKitItem = this.sparePartsViewChild.getListItems();
      }
      if (this.isUpdateMode) {
        this.operationKitService.updateOperationKit(this.operationKitToUpdate).subscribe(() => {
          this.saveDone = true;
          this.router.navigateByUrl(GarageConstant.KITS_LIST_URL);
        });
      } else {
        this.operationKitService.addOperationKit(this.operationKitToUpdate).subscribe(() => {
          this.saveDone = true;
          this.router.navigateByUrl(GarageConstant.KITS_LIST_URL);
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.kitFormGroup);
    }
  }

  /**
  * this method will be called by CanDeactivateGuard service to check the leaving component possibility
  */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.kitFormGroup.dirty);
  }
  receiveDataFromItem($event) {
    this.isFromItem = $event;
  }
}

