import { Component, ComponentRef, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IModalDialog, IModalDialogOptions } from "ngx-modal-dialog";
import { ModalDialogInstanceService } from "ngx-modal-dialog/src/modal-dialog-instance.service";
import {
  unique,
  ValidationService,
} from "../../../shared/services/validation/validation.service";
import { SubFamilyService } from "../../services/sub-family/sub-family.service";
import { SubFamily } from "../../../models/inventory/sub-family.model";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import {
  Filter,
  Operation,
  PredicateFormat,
  Relation,
} from "../../../shared/utils/predicate";
import { FileInfo } from "../../../models/shared/objectToSend";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { Observable } from "rxjs";
import { ContactConstants } from "../../../constant/crm/contact.constant";
import { SwalWarring } from "../../../shared/components/swal/swal-popup";
import { StyleConfigService } from "../../../shared/services/styleConfig/style-config.service";
import { PermissionConstant } from "../../../Structure/permission-constant";
import { AuthService } from "../../../login/Authentification/services/auth.service";

@Component({
  selector: "app-add-sub-family",
  templateUrl: "./add-sub-family.component.html",
  styleUrls: ["./add-sub-family.component.scss"],
})
export class AddSubFamilyComponent implements OnInit {
  /**
   * Form Group
   */
  subFamilyFormGroup: FormGroup;
  isWithIdParam: boolean;
  id: number;
  modelToEdit;
  public isUpdateMode = false;
  public SUB_FAMILY_LIST_URL = "/main/settings/inventory/list-sub-family";
  SubFamilyToUpdate: SubFamily;
  pictureFileInfo: FileInfo;
  public pictureSubFamilySrc: any;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * If modal=true
   */
  public isModal: boolean;

  // id family
  @Input() idFamily: number;
  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;

  /**/
  public hasAddSubFamilyPermission: boolean;
  public hasUpdateSubFamilyPermission: boolean;
  constructor(
    private fb: FormBuilder,
    private subFamilyService: SubFamilyService,
    private modalService: ModalDialogInstanceService,
    private validationService: ValidationService,
    private router: Router,
    private swalWarring: SwalWarring,
    private styleConfigService: StyleConfigService,
    private authService: AuthService,
    private activatedroute: ActivatedRoute
  ) {
    this.activatedroute.params.subscribe((params) => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.hasAddSubFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SUBFAMILY);
    this.hasUpdateSubFamilyPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_SUBFAMILY);
    this.id = this.isModal ? NumberConstant.ZERO : this.id;
    this.isWithIdParam = this.id > NumberConstant.ZERO;
    this.createAddForm();
    if (this.isWithIdParam) {
      let predicate = this.preparePredicate();
      this.subFamilyService.getModelByCondition(predicate).subscribe((data) => {
        this.modelToEdit = data;
        data != null ? this.subFamilyFormGroup.patchValue(data) : '';
      });
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
  }

  preparePredicate(): PredicateFormat {
    let predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter("Id", Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [
      new Relation("IdFamilyNavigation"),
    ]);
    return predicate;
  }

  /**
   * create main form
   */
  private createAddForm(): void {
    this.subFamilyFormGroup = new FormGroup({
      Id: new FormControl(NumberConstant.ZERO),
      Code: new FormControl('',
        { validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.subFamilyService, String(this.id)),
          updateOn: 'blur'
        }
      ),
      Label: new FormControl('', [Validators.required]),
      IdFamily: new FormControl(this.idFamily, [Validators.required]),
      CreationDate: new FormControl(''),
    });
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
    this.idFamily = options.data;
  }

  /**
   * Save click
   */
  public onSubFamilyClick(): void {
    if (this.subFamilyFormGroup.valid) {
      this.isSaveOperation = true;
      const subFamilyToSave = this.subFamilyFormGroup.getRawValue() as SubFamily;
      if (this.id) {
        subFamilyToSave.Id = this.id;
      }
     this.preparePicture(subFamilyToSave);
      if (this.isUpdateMode) {
        if(subFamilyToSave.PictureFileInfo != undefined && subFamilyToSave.PictureFileInfo.Data != undefined){
          subFamilyToSave.PictureFileInfo.FileData = subFamilyToSave.PictureFileInfo.Data.toString();
        }else if(this.SubFamilyToUpdate.UrlPicture){
          subFamilyToSave.UrlPicture = this.SubFamilyToUpdate.UrlPicture;
        }
      }
      if (this.isModal) {
        this.subFamilyService
          .save(subFamilyToSave, true, null, null, null, true)
          .subscribe((data) => {
            if (data) {
              this.options.data = data;
              this.options.onClose();
              this.modalService.closeAnyExistingModalDialog();
            }
          });
      } else {
        this.subFamilyService
          .save(subFamilyToSave, !this.isUpdateMode)
          .subscribe((data) => {
            if (data) {
              this.router.navigate([this.SUB_FAMILY_LIST_URL]);
            }
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.subFamilyFormGroup);
    }
  }
  public preparePicture(modelToSave: SubFamily){
    if(this.pictureFileInfo){
    modelToSave.PictureFileInfo = this.pictureFileInfo;
    }
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.SUB_FAMILY_LIST_URL);
  }
  private getDataToUpdate() {
    this.subFamilyService.getById(this.id).subscribe((data) => {
      this.SubFamilyToUpdate = data;
      data != null ? this.subFamilyFormGroup.patchValue(this.SubFamilyToUpdate) : '';
      if (this.SubFamilyToUpdate.UrlPicture) {
        this.subFamilyService.getPicture(this.SubFamilyToUpdate.UrlPicture).subscribe((res: any) => {
          this.pictureSubFamilySrc = SharedConstant.PICTURE_BASE + res;
        });
      }
      if (!this.hasUpdateSubFamilyPermission) {
        this.subFamilyFormGroup.disable();
      }
    });
  }
  get Code(): FormControl {
    return this.subFamilyFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.subFamilyFormGroup.get(SharedConstant.LABEL) as FormControl;
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
        this.pictureFileInfo.FileData = (<string>reader.result).split(",")[1];
        this.pictureSubFamilySrc = reader.result;
      };
    }
    }
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
    return this.subFamilyFormGroup.touched;
  }
  removeSubFamilyPicture(event) {
    event.preventDefault();
    this.swalWarring
      .CreateDeleteSwal(
        ContactConstants.PICTURE_ELEMENT,
        ContactConstants.PRONOUN_CETTE
      )
      .then((result) => {
        if (result.value) {
          this.pictureSubFamilySrc = null;
          this.pictureFileInfo = null;
        }
      });
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
