import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModelOfItemComboBoxComponent } from '../../../shared/components/model-of-item-combo-box/model-of-item-combo-box.component';
import { SubModelComboBoxComponent } from '../../../shared/components/sub-model-combo-box/sub-model-combo-box.component';
import { FileInfo } from '../../../models/shared/objectToSend';
import { VehicleBrand } from '../../../models/inventory/vehicleBrand.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BrandService } from '../../services/brand/brand.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import {Observable} from 'rxjs/Observable';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-item-brand',
  templateUrl: './item-brand.component.html',
  styleUrls: ['./item-brand.component.scss']
})
export class ItemBrandComponent implements OnInit {
  @Input() ItemBrandForm: FormGroup;
  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;
  @ViewChild(SubModelComboBoxComponent) subModelChild;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  public isUpdateMode = false;
  public BRANDS_LIST_URL = '/main/settings/inventory/list-brands';
  pictureFileInfo: FileInfo;
  public pictureBrandSrc: any;
  BrandToUpdate: VehicleBrand;
  idBrand: number;
  addBrandFormGroup: FormGroup;
  /**
   * permissions
   */
   public hasUpdatePermission: boolean;

  /**
   *
   * @param fb
   * @param brandService
   * @param validationService
   * @param router
   * @param swalWarring
   * @param activatedRoute
   */
  constructor(private fb: FormBuilder,
    private brandService: BrandService,
    private validationService: ValidationService,
    private router: Router,
    private swalWarring: SwalWarring,
    private activatedRoute: ActivatedRoute, private authService: AuthService) { }


  /**
   * On change brand, receive the selected value
   * */
  public receiveBrand($event) {
    this.modelOfItemChild.initDataSource($event);
  }
  /**
   * On change model, receive the selected value
   * */
 public receiveModel($event) {
    this.subModelChild.initDataSource($event);
  }


  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
    this.activatedRoute.params.subscribe(params => {
      this.idBrand = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isUpdateMode = this.idBrand !== NumberConstant.ZERO ? true : false;
    });
    this.createAddForm();
    if (this.ItemBrandForm && this.ItemBrandForm.value) {
      this.receiveBrand(this.ItemBrandForm.value['IdVehicleBrand']);
      this.receiveModel(this.ItemBrandForm.value['IdModel']);
    }
  }
  private createAddForm(): void {
    this.addBrandFormGroup = this.fb.group({
      Id: [0],
      Code: ['', [Validators.required]],
      Label: ['', [Validators.required]]
    });

  }
  private getDataToUpdate() {
    this.brandService.getById(this.idBrand).subscribe(data => {
      this.BrandToUpdate = data;
      this.addBrandFormGroup.patchValue(this.BrandToUpdate);
      if (this.BrandToUpdate.PictureFileInfo) {
        this.pictureBrandSrc = SharedConstant.PICTURE_BASE + this.BrandToUpdate.PictureFileInfo.Data;
      }
      this.pictureFileInfo = this.BrandToUpdate.PictureFileInfo;
    });
  }
  public onAddBrandClick() {
    if ((this.addBrandFormGroup as FormGroup).valid) {
      this.isSaveOperation = true;
      const brandToSave = this.addBrandFormGroup.getRawValue() as VehicleBrand;
      if (this.idBrand) {
        brandToSave.Id = this.idBrand;
      }
      brandToSave.PictureFileInfo = this.pictureFileInfo;
      this.brandService.save(brandToSave, !this.isUpdateMode).subscribe((data) => {
        if (data) {
          this.router.navigate([this.BRANDS_LIST_URL]);
        }
      }
      );
    } else {
      this.validationService.validateAllFormFields(this.addBrandFormGroup);
    }
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
  get CodeProduct(): FormControl {
    return this.addBrandFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.addBrandFormGroup.get(SharedConstant.LABEL) as FormControl;
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.addBrandFormGroup.touched;
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
}
