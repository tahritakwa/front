import { Component, OnInit } from '@angular/core';
import { VehicleCategoryEnumerator } from '../../../../models/enumerators/vehicle-category.enum';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { PermissionConstant } from '../../../../Structure/permission-constant';

@Component({
  selector: 'app-add-loan-vehicle',
  templateUrl: './add-loan-vehicle.component.html',
  styleUrls: ['./add-loan-vehicle.component.scss']
})
export class AddLoanVehicleComponent implements OnInit {
  public vehicleCategory = VehicleCategoryEnumerator.Loan;
  isUpdateMode = false;
  id: number;
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
    });
   }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_LOAN_VEHICLE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_LOAN_VEHICLE);
  }

}
