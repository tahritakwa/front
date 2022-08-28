import { Component, ComponentRef, OnInit } from '@angular/core';
import { VehicleCategoryEnumerator } from '../../../../models/enumerators/vehicle-category.enum';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ActivatedRoute } from '@angular/router';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';

@Component({
  selector: 'app-add-customer-vehicle',
  templateUrl: './add-customer-vehicle.component.html',
  styleUrls: ['./add-customer-vehicle.component.scss']
})
export class AddCustomerVehicleComponent implements OnInit {
  public vehicleCategory = VehicleCategoryEnumerator.Customer;
  isUpdateMode = false;
  id: number;
  idTiers: number;
  isModal: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private modalService: ModalDialogInstanceService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.id = NumberConstant.ZERO;
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.idTiers = this.dialogOptions.data;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_CUSTOMER_VEHICLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_CUSTOMER_VEHICLE);
  }

  saveDoneEvent() {
    this.dialogOptions.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

}
