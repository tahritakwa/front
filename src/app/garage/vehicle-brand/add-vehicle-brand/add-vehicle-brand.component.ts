import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { VehicleBrand } from '../../../models/garage/vehicle-brand.model';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { VehicleBrandService } from '../../services/vehicle-brand/vehicle-brand.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
const BRANDS_LIST_URL = '/main/settings/garage/brands';
@Component({
  selector: 'app-add-vehicle-brand',
  templateUrl: './add-vehicle-brand.component.html',
  styleUrls: ['./add-vehicle-brand.component.scss']
})
export class AddVehicleBrandComponent implements OnInit {
  brandFormGroup: FormGroup;
  private saveDone = false;
  // update properties
  isUpdateMode = false;
  BrandToUpdate: VehicleBrand;
  id: number;

  // Pictures
  pictureFileInfo: FileInfo;
  public pictureBrandSrc: any;
  public hasAddBrandPermission: boolean;
  public hasUpdateBrandPermission: boolean;
  constructor(private fb: FormBuilder,
              private vehicleBrandService: VehicleBrandService,
              private validationService: ValidationService,
              private router: Router,
              private swalWarring: SwalWarring,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute) {
              this.activatedRoute.params.subscribe(params => {
                  this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
              });
  }

  ngOnInit() {
    this.hasAddBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.ADD_VEHICLE_BRAND);
    this.hasUpdateBrandPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsGaragePermissions.UPDATE_VEHICLE_BRAND);
    this.createAddForm();
    this.isUpdateMode = this.id ? true : false;
    if (this.isUpdateMode) {
        this.getDataToUpdate();
    }
  }

  private createAddForm(dataItem?): void {
    this.brandFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      Code: [dataItem ? dataItem.Code : '', { validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)], asyncValidators:
        unique(GarageConstant.CODE, this.vehicleBrandService,  this.id ?
          String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'}],
      Designation: [dataItem ? dataItem.Designation : '', { validators: [Validators.required, Validators.maxLength(NumberConstant.FIFTY)], asyncValidators:
         unique(GarageConstant.DESIGNATION, this.vehicleBrandService, String(dataItem ? dataItem.Id : 0)), updateOn: 'blur'}]
    });
  }

  private getDataToUpdate() {
    this.vehicleBrandService.getById(this.id).subscribe(data => {
      this.BrandToUpdate = data;
      if (!this.hasUpdateBrandPermission) {
        this.brandFormGroup.disable();
      }
      this.createAddForm(data);
      if (this.BrandToUpdate.PictureFileInfo) {
        this.pictureBrandSrc = GarageConstant.BASE_IMAGE + this.BrandToUpdate.PictureFileInfo.Data;
      }
      this.pictureFileInfo = this.BrandToUpdate.PictureFileInfo;
    });
  }

  backToList() {
    this.router.navigateByUrl(BRANDS_LIST_URL);
  }
  onSelectFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.pictureFileInfo = new FileInfo();
        this.pictureFileInfo.Name = file.name;
        this.pictureFileInfo.Extension = file.type;
        this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
        this.pictureBrandSrc = reader.result;
      };
    }
  }

  removeBrandPicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureBrandSrc = null;
        this.pictureFileInfo = null;
      }
    });
  }

  public onAddBrandClick() {
    if ((this.brandFormGroup as FormGroup).valid) {
      this.BrandToUpdate = Object.assign({}, this.BrandToUpdate, this.brandFormGroup.getRawValue());
      this.BrandToUpdate.PictureFileInfo = this.pictureFileInfo;
      this.vehicleBrandService.save(this.BrandToUpdate, !this.isUpdateMode).subscribe(
        (data) => {
          if (data) {
            this.saveDone = true;
            this.router.navigate([BRANDS_LIST_URL]);
          }
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.brandFormGroup);
    }
  }
  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(() => !this.saveDone && this.brandFormGroup.dirty);
  }
}
