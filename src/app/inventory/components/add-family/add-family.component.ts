import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FamilyService} from '../../services/family/family.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {Family} from '../../../models/inventory/family.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FileInfo} from '../../../models/shared/objectToSend';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Observable} from 'rxjs/Observable';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {Subscription} from 'rxjs/Subscription';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const ACTIVE_LIST_URL = '/main/settings/inventory/list-family/';

@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.component.html',
  styleUrls: ['./add-family.component.scss']
})
export class AddFamilyComponent implements OnInit, OnDestroy {
  public FAMILY_LIST_URL = '/main/settings/inventory/list-family';
  pictureFileInfo: FileInfo;
  public pictureFamilySrc: any;

  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * Form Group
   */
  familyFormGroup: FormGroup;


  /**
   * If modal=true
   */
  public isModal: boolean;

  // id family
  idFamily: number;
  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;

  /*
   * Id Entity
   */
  private id: number;

  /*
   * is updateMode
   */
  public isUpdateMode = false;

  private familySubscription: Subscription;

  /*
   * family to update
   */
  private familyToUpdate: Family;
  /*
 * id Subscription
 */
  private idSubscription: Subscription;
  public hasAddFamilyPermission: boolean;
  public hasUpdateFamilyPermission: boolean;
  constructor(private fb: FormBuilder,
              private familyService: FamilyService,
              private modalService: ModalDialogInstanceService,
              private styleConfigService: StyleConfigService,
              private validationService: ValidationService,
              private activatedRoute: ActivatedRoute,
              private swalWarrings: SwalWarring,
              private authService: AuthService,
              private router: Router) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.hasAddFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_FAMILY);
    this.hasUpdateFamilyPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_FAMILY);
    this.createAddForm();
    this.isUpdateMode = this.id > NumberConstant.ZERO;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  /**
   * create main form
   */
  private createAddForm(): void {
    this.familyFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      Code: [SharedConstant.EMPTY, {validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.familyService, String(this.id)), updateOn: 'blur'}],
      Label: [SharedConstant.EMPTY, [Validators.required]],
      CreationDate: ['']
    });
  }


  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.familySubscription = this.familyService.getById(this.id).subscribe(data => {
      this.familyToUpdate = data;
      this.familyFormGroup.patchValue(this.familyToUpdate);
      if (this.familyToUpdate.UrlPicture) {
        this.familyService.getPicture(this.familyToUpdate.UrlPicture).subscribe((res: any) => {
          this.pictureFamilySrc = SharedConstant.PICTURE_BASE + res;
        });
      }
      this.pictureFileInfo = this.familyToUpdate.PictureFileInfo;
      if (!this.hasUpdateFamilyPermission) {
        this.familyFormGroup.disable();
      }
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
    this.idFamily = options.data;
  }

  /**
   * Save click
   */
  public onAddFamilyClick(): void {
    if (this.familyFormGroup.valid) {
      const unicityData = this.setCodeUnicity();
      const modelToSave = this.familyFormGroup.getRawValue() as Family;
      this.setFamilyPicture(modelToSave);
      this.setFamilyId(modelToSave);
      if (this.isUpdateMode) {
        if(modelToSave.PictureFileInfo != undefined && modelToSave.PictureFileInfo.Data != undefined){
          modelToSave.PictureFileInfo.FileData = modelToSave.PictureFileInfo.Data.toString();
        }else if (this.familyToUpdate.UrlPicture){
          modelToSave.UrlPicture = this.familyToUpdate.UrlPicture;
        }
      }
      if(this.isModal){
        this.familyService.save(modelToSave, true, undefined, false, unicityData, true).subscribe((data) => {
          this.isSaveOperation = true;
          this.options.data = data;
          this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
        });
      } else {
        this.familyService.save(modelToSave, !this.isUpdateMode, undefined, false, unicityData).subscribe(() => {
          this.isSaveOperation = true;
          this.backToPrevious();
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.familyFormGroup);
    }
  }


  private setFamilyPicture(modelToSave: Family) {
    if (this.pictureFileInfo){
    modelToSave.PictureFileInfo = this.pictureFileInfo;
  }
  }

  private setFamilyId(modelToSave: Family) {
    if (this.id) {
      modelToSave.Id = this.id;
    }
  }

  private setCodeUnicity() {
    return {
      'property': SharedConstant.CODE,
      'value': this.Code.value,
      'valueBeforUpdate': this.id
    };
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
        this.pictureFamilySrc = reader.result;
      };
    }
    }
  }

  get Code(): FormControl {
    return this.familyFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get Label(): FormControl {
    return this.familyFormGroup.get(SharedConstant.LABEL) as FormControl;
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
    return this.familyFormGroup.touched;
  }

  removeFamilyPicture(event) {
    event.preventDefault();
    this.swalWarrings.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureFamilySrc = null;
        this.pictureFileInfo = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.familySubscription) {
      this.familySubscription.unsubscribe();
    }
  }

  backToPrevious() {
    if (!this.isModal) {
      this.router.navigate([ACTIVE_LIST_URL]);
    } else {
      this.options.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
