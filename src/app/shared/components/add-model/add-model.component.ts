import { Component, OnInit, ComponentRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ModelOfItem } from '../../../models/inventory/model-of-item.model';
import { ModelOfItemService } from '../../../inventory/services/model-of-item/model-of-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat, Filter, Relation, Operation } from '../../utils/predicate';
import { FileInfo } from '../../../models/shared/objectToSend';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Observable } from 'rxjs/Observable';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import { SwalWarring } from '../swal/swal-popup';
import { ReducedBrand } from '../../../models/inventory/reduced-brand.model';
import { StyleConfigService } from '../../services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent implements OnInit {

  /**
   * Form Group
   */
  public ModelFormGroup: FormGroup;
  @Input() idVehicleBrand: number;
  id: number;
  public isUpdateMode = false;
  public MODEL_LIST_URL = '/main/settings/inventory/list-model';
  ModelToUpdate: ModelOfItem;
  pictureFileInfo: FileInfo;
  public pictureModelSrc: any;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * If modal=true
   */
  public isModal: boolean;
  cardMode: any;
  isWithIdParam: boolean;
  modelToEdit: any;
  vehicleBrand: any;
  public hasAddModelPermission: boolean;
  public hasUpdateModelPermission: boolean;
  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;

  /**
   *
   * @param fb
   * @param modelService
   * @param modalService
   * @param validationService
   * @param brandService
   * @param swalWarring
   * @param activatedroute
   * @param router
   */
  constructor(private fb: FormBuilder,
    private modelService: ModelOfItemService,
    private modalService: ModalDialogInstanceService,
    private validationService: ValidationService,
    private swalWarring: SwalWarring,
    private styleConfigService: StyleConfigService,
    private activatedroute: ActivatedRoute,
    private authService: AuthService,
    private router: Router) {
    this.cardMode = false;
    this.isWithIdParam = false;
    this.activatedroute.data.subscribe(data => {
      this.cardMode = data.cardMode;
    });
    this.activatedroute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
      if (this.id > 0) {
        this.isWithIdParam = this.id > 0;
      }
    });
  }

  ngOnInit() {
    this.hasAddModelPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_MODELOFITEM);
    this.hasUpdateModelPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_MODELOFITEM);
    this.id = this.isModal ? NumberConstant.ZERO : this.id;
    this.createAddForm();
    if (this.id) {
      let predicate = this.preparePredicate();
      this.modelService.getModelByCondition(predicate).subscribe(data => {
        this.modelToEdit = data;
        this.ModelFormGroup.patchValue(data);
      });
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
  }

  preparePredicate(): PredicateFormat {
    let predicate: PredicateFormat = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(
      new Filter('Id', Operation.eq, this.id));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation('IdVehicleBrandNavigation')]);
    return predicate;
  }

  /**
   * create main form
   */
  private createAddForm(modelToEdit?): void {
    this.ModelFormGroup = new FormGroup({
      Id: new FormControl(0),
      Code: new FormControl("", {validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.modelService, String(this.id)), updateOn: 'blur'}),
      Label: new FormControl('', [Validators.required]),
      IdVehicleBrand: new FormControl(this.idVehicleBrand, [Validators.required]),
      IsDeleted: new FormControl(false),
      CreationDate: new FormControl('')
    });
  }

  /**
   * mode modal init
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.idVehicleBrand = options.data;
  }

  /**
   * Save click
   */
  public onAddModelClick(): void {
    if (this.ModelFormGroup.valid) {
      this.isSaveOperation = true;
      const modelToSave = this.ModelFormGroup.getRawValue() as ModelOfItem;
      if (this.id && !this.isModal) {
        modelToSave.Id = this.id;
      }
      this.preparePicture(modelToSave);
      if (this.isUpdateMode) {
        if (modelToSave.PictureFileInfo != undefined && modelToSave.PictureFileInfo.Data != undefined) {
          modelToSave.PictureFileInfo.FileData = modelToSave.PictureFileInfo.Data.toString();
        }else if(this.ModelToUpdate.UrlPicture){
          modelToSave.UrlPicture = this.ModelToUpdate.UrlPicture;
        }
      }
      if (this.isModal) {
        this.modelService.save(modelToSave, true, null, null, null, true).subscribe((data) => {
          if (data) {
            this.options.data = data;
            this.options.onClose();
            this.modalService.closeAnyExistingModalDialog();
          }
        });
      } else {
        this.modelService.save(modelToSave, !this.isUpdateMode).subscribe((data) => {
          if (data) {
            this.router.navigate([this.MODEL_LIST_URL]);
          }
        });
      }

    } else {
      this.validationService.validateAllFormFields(this.ModelFormGroup);
    }
  }
  public preparePicture(modelToSave: ModelOfItem) {
    if (this.pictureFileInfo) {
      modelToSave.PictureFileInfo = this.pictureFileInfo;
    }
  }

  public backToList() {
    this.router.navigateByUrl(SharedConstant.Model_LIST_URL);
  }

  private getDataToUpdate() {
    this.modelService.getById(this.id).subscribe(data => {
      this.ModelToUpdate = data;
      this.ModelFormGroup.patchValue(this.ModelToUpdate);
      if (this.ModelToUpdate.UrlPicture) {
        this.modelService.getPicture(this.ModelToUpdate.UrlPicture).subscribe((res: any) => {
          this.pictureModelSrc = SharedConstant.PICTURE_BASE + res;
        });
      }
      if (!this.hasUpdateModelPermission) {
        this.ModelFormGroup.disable();
      }
    });
  }

  get Code(): FormControl {
    return this.ModelFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.ModelFormGroup.get(SharedConstant.LABEL) as FormControl;
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
        this.pictureModelSrc = reader.result;
      };
    }
    }
  }

  public changeBrandPhoto(event: ReducedBrand) {
    if (event && event.Picture) {
      this.pictureModelSrc = event.Picture;
      this.pictureFileInfo = new FileInfo();
      this.pictureFileInfo.Name = event.Label;
      this.pictureFileInfo.Extension = event.Label;
      this.pictureFileInfo.FileData = (<string>this.pictureModelSrc).split(',')[1];
    } else {
      this.pictureFileInfo = null;
      this.pictureModelSrc = null;
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
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.ModelFormGroup.touched;
  }

  removeModelPicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureModelSrc = null;
        this.pictureFileInfo = null;
      }
    });
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
