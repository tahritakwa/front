import { Component, OnInit, ComponentRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { IModalDialogOptions, IModalDialog } from "ngx-modal-dialog";
import { ModalDialogInstanceService } from "ngx-modal-dialog/src/modal-dialog-instance.service";
import { unique, ValidationService } from "../../../shared/services/validation/validation.service";
import { VehicleBrand } from "../../../models/inventory/vehicleBrand.model";
import { BrandService } from "../../../inventory/services/brand/brand.service";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import { Filter, Operation, PredicateFormat } from "../../utils/predicate";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription, Observable } from "rxjs";
import { GrowlService } from "../../../../COM/Growl/growl.service";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { FileInfo } from "../../../models/shared/objectToSend";
import { StyleConfigService } from "../../services/styleConfig/style-config.service";
import { ContactConstants } from "../../../constant/crm/contact.constant";
import { SwalWarring } from "../swal/swal-popup";
import { AuthService } from "../../../login/Authentification/services/auth.service";
import { PermissionConstant } from "../../../Structure/permission-constant";

@Component({
  selector: "app-add-band",
  templateUrl: "./add-band.component.html",
  styleUrls: ["./add-band.component.scss"],
})
export class AddBandComponent implements OnInit {
  /**
   * If modal=true
   */
  public isModal: boolean;

  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  /**/

  /*
   * Id Entity
   */
  private id: number;

  /*
   * is updateMode
   */
  public isUpdateMode = false;
/**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;

  private currencySubscription: Subscription;

  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  public BRANDS_LIST_URL = "/main/settings/inventory/list-brands";
  pictureFileInfo: FileInfo;
  public pictureBrandSrc: any;
  BrandToUpdate: VehicleBrand;
  idBrand: number;
  addBrandFormGroup: FormGroup;
  public hasAddBrandPermission: boolean;
  public hasUpdateBrandPermission: boolean;
  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private modalService: ModalDialogInstanceService,
    private validationService: ValidationService,
    private styleConfigService: StyleConfigService,
    private activatedRoute: ActivatedRoute,
    private swalWarring: SwalWarring,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.hasAddBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_VEHICLEBRAND);
    this.hasUpdateBrandPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_VEHICLEBRAND);
    this.idSubscription = this.activatedRoute.params.subscribe((params) => {
      this.idBrand = !this.isModal ? +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO : NumberConstant.ZERO;
    });
    this.createAddForm();
    if (this.idBrand) {
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
  }

  /**
   * mode modal init
   * @param reference
   * @param options
   */
  dialogInit(
    reference: ComponentRef<IModalDialog>,
    options: Partial<IModalDialogOptions<any>>
  ) {
    this.isModal = true;
    this.options = options;
  }

  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.currencySubscription) {
      this.currencySubscription.unsubscribe();
    }
  }

  private createAddForm(): void {
    this.addBrandFormGroup = this.fb.group({
      Id: [0],
      Code: ["", {validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.brandService, String(this.idBrand)), updateOn: 'blur'}],
      Label: ["", Validators.required],
      CreationDate: ['']
    });
  }
  private getDataToUpdate() {
    this.brandService.getById(this.idBrand).subscribe((data) => {
      this.BrandToUpdate = data;
      this.addBrandFormGroup.patchValue(this.BrandToUpdate);
      if (this.BrandToUpdate.UrlPicture) {
        this.brandService.getPicture(this.BrandToUpdate.UrlPicture).subscribe((res: any) => {
          this.pictureBrandSrc = SharedConstant.PICTURE_BASE + res;
        });
      }
      if (!this.hasUpdateBrandPermission) {
        this.addBrandFormGroup.disable();
      }
    });
  }
  public onAddBrandClick() {
    if ((this.addBrandFormGroup as FormGroup).valid) {
      this.isSaveOperation = true;
      const brandToSave = this.addBrandFormGroup.getRawValue() as VehicleBrand;
      if (this.idBrand) {
        brandToSave.Id = this.idBrand;
      }
      this.preparePicture(brandToSave);
      if (this.isModal) {
        this.brandService
          .save(brandToSave, true,null,null,null,true)
          .subscribe((data) => {
            if (data) {
              this.options.data = data;
              this.options.onClose();
              this.modalService.closeAnyExistingModalDialog();
            }
          });
      } else {
        this.brandService
          .save(brandToSave, !this.isUpdateMode)
          .subscribe((data) => {
            if (data) {
              this.router.navigate([this.BRANDS_LIST_URL]);
            }
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.addBrandFormGroup);
    }
  }
  public preparePicture(modelToSave:  VehicleBrand){
    if(this.pictureFileInfo){
    modelToSave.PictureFileInfo = this.pictureFileInfo;
    } else if (this.BrandToUpdate && this.BrandToUpdate.UrlPicture) {
      modelToSave.UrlPicture = this.BrandToUpdate.UrlPicture;
    }
  }
   onSelectFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.startsWith("image/")){
        reader.onload = () => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
          this.pictureBrandSrc = reader.result;
        };
      }
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
  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(
      this.isFormGroupChanged.bind(this)
    );
  }

  private isFormGroupChanged(): boolean {
    return this.addBrandFormGroup.touched;
  }
  get CodeProduct(): FormControl {
    return this.addBrandFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.addBrandFormGroup.get(SharedConstant.LABEL) as FormControl;
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
