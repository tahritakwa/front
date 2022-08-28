import { Component, OnInit, ComponentRef, Input } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { IModalDialogOptions, IModalDialog } from "ngx-modal-dialog";
import { ModalDialogInstanceService } from "ngx-modal-dialog/src/modal-dialog-instance.service";
import { unique, ValidationService } from "../../../shared/services/validation/validation.service";
import { SubModelService } from "../../services/sub-model/sub-model.service";
import { SubModel } from "../../../models/inventory/sub-model.model";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedConstant } from "../../../constant/shared/shared.constant";
import {
  PredicateFormat,
  Filter,
  Relation,
  Operation,
} from "../../../shared/utils/predicate";
import { ItemConstant } from "../../../constant/inventory/item.constant";
import { FileInfo } from "../../../models/shared/objectToSend";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { Observable } from "rxjs/Observable";
import { ContactConstants } from "../../../constant/crm/contact.constant";
import { SwalWarring } from "../../../shared/components/swal/swal-popup";
import { StyleConfigService } from "../../../shared/services/styleConfig/style-config.service";
import { PermissionConstant } from "../../../Structure/permission-constant";
import { AuthService } from "../../../login/Authentification/services/auth.service";

@Component({
  selector: "app-add-sub-model",
  templateUrl: "./add-sub-model.component.html",
  styleUrls: ["./add-sub-model.component.scss"],
})
export class AddSubModelComponent implements OnInit {
  /**
   * Form Group
   */
  subModelFormGroup: FormGroup;
  isWithIdParam: boolean;
  @Input() idModel: number;
  modelToEdit: any;
  id: number;
  cardMode: any;
  idVehicleBrand: number;
  public isUpdateMode = false;
  public SUB_MODEL_LIST_URL = "/main/settings/inventory/list-sub-models";
  SubModelToUpdate: SubModel;
  pictureFileInfo: FileInfo;
  public pictureSubModelSrc: any;
  public hasAddSubModelPermission: boolean;
  public hasUpdateSubModelPermission: boolean;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * If modal=true
   */
  public isModal: boolean;

  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;

  /**
   *
   * @param fb
   * @param subModelService
   * @param modalService
   * @param validationService
   * @param router
   * @param styleConfigService
   * @param swalWarring
   * @param activatedroute
   */
  constructor(
    private fb: FormBuilder,
    private subModelService: SubModelService,
    private modalService: ModalDialogInstanceService,
    private validationService: ValidationService,
    private router: Router,
    private styleConfigService: StyleConfigService,
    private swalWarring: SwalWarring,
    private authService: AuthService,
    private activatedroute: ActivatedRoute
  ) {
    this.cardMode = false;
    this.isWithIdParam = false;
    this.activatedroute.data.subscribe((data) => {
      this.cardMode = data.cardMode;
    });
    this.activatedroute.params.subscribe((params) => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
  }

  ngOnInit() {
    this.hasAddSubModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SUBMODEL);
    this.hasUpdateSubModelPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_SUBMODEL);
    this.id = this.isModal ? NumberConstant.ZERO : this.id;
    this.isWithIdParam = this.id > 0;
    this.createAddForm();
    if (this.isWithIdParam) {
      let predicate = this.preparePredicate();
      this.subModelService.getModelByCondition(predicate).subscribe((data) => {
        this.modelToEdit = data;
        this.subModelFormGroup.patchValue(data);
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
      new Relation("IdModelNavigation"),
    ]);
    return predicate;
  }
  /**
   * create main form
   */
  private createAddForm(): void {
    this.subModelFormGroup = new FormGroup({
      Id: new FormControl(0),
      Code: new FormControl("", {validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.subModelService, String(this.id)), updateOn: 'blur'}),
      Label: new FormControl("", [Validators.required]),
      IdModel: new FormControl(this.idModel, [Validators.required]),
      IsDeleted: new FormControl(false),
      CreationDate: new FormControl('')
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
    this.idModel = options.data;
  }

  /**
   * Save click
   */
  public onSubModelClick(): void {
    if (this.subModelFormGroup.valid) {
      this.isSaveOperation = true;
      const subModelToSave = this.subModelFormGroup.getRawValue() as SubModel;
      if (this.id) {
        subModelToSave.Id = this.id;
      }
      if(this.pictureFileInfo){
      subModelToSave.PictureFileInfo = this.pictureFileInfo;
      }else if(this.modelToEdit && this.modelToEdit.UrlPicture){
        subModelToSave.UrlPicture = this.modelToEdit.UrlPicture;
      }
      if (this.isModal) {
        this.subModelService
          .save(subModelToSave, true,null, null,null,true)
          .subscribe((data) => {
            if (data) {
              this.options.data = data;
              this.options.onClose();
              this.modalService.closeAnyExistingModalDialog();
            }
          });
      } else {
        this.subModelService
          .save(subModelToSave, !this.isUpdateMode)
          .subscribe((data) => {
            if (data) {
              this.router.navigate([this.SUB_MODEL_LIST_URL]);
            }
          });
      }
    } else {
      this.validationService.validateAllFormFields(this.subModelFormGroup);
    }
  }
  public backToList() {
    this.router.navigateByUrl(SharedConstant.SUB_MODEL_LIST_URL);
  }
  private getDataToUpdate() {
    this.subModelService.getById(this.id).subscribe((data) => {
      this.SubModelToUpdate = data;
      this.subModelFormGroup.patchValue(this.SubModelToUpdate);
      if (this.SubModelToUpdate.UrlPicture) {
        this.subModelService.getPicture(this.SubModelToUpdate.UrlPicture).subscribe((res: any) => {
          this.pictureSubModelSrc = SharedConstant.PICTURE_BASE + res;
        });
      }
      if (!this.hasUpdateSubModelPermission) {
        this.subModelFormGroup.disable();
      }
    });
  }
  get Code(): FormControl {
    return this.subModelFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.subModelFormGroup.get(SharedConstant.LABEL) as FormControl;
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
        this.pictureSubModelSrc = reader.result;
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
    return this.subModelFormGroup.touched;
  }

  public changeModelPhoto(event) {
    if (event && event.Picture) {
      this.pictureSubModelSrc = event.Picture;
      this.pictureFileInfo = new FileInfo();
      this.pictureFileInfo.Name = event.Label;
      this.pictureFileInfo.Extension = event.Label;
      this.pictureFileInfo.FileData = (<string>this.pictureSubModelSrc).split(
        ","
      )[1];
    } else {
      this.pictureFileInfo = null;
      this.pictureSubModelSrc = null;
    }
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
