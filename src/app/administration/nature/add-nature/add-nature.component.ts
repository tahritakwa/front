import {Component, ComponentRef, OnInit} from '@angular/core';
import {Nature} from '../../../models/administration/nature.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {NatureService} from '../../../shared/services/nature/nature.service';
import {FileInfo} from '../../../models/shared/objectToSend';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Observable} from 'rxjs/Observable';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { NatureCodeEnum } from '../../../models/enumerators/nature-code.enum';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';

@Component({
  selector: 'app-add-nature',
  templateUrl: './add-nature.component.html',
  styleUrls: ['./add-nature.component.scss']
})
export class AddNatureComponent implements OnInit {
  public isUpdateMode = false;
  public NATURE_LIST_URL = '/main/settings/administration/nature';
  public productTypeFormGroup: FormGroup;
  pictureFileInfo: FileInfo;
  public pictureNatureSrc: any;
  public IsStockManagedChecked = false;
  public id: number;
  natureToUpdate: Nature;
  public hasAddNaturePermission: boolean;
  public hasUpdateNaturePermission: boolean;
  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;

  /**
   * If modal=true
   */
  public isModal: boolean;
  public disabledCheckStockManaged = false;

  options: Partial<IModalDialogOptions<any>>;
  /**
   *
   * @param fb
   * @param router
   * @param activatedRoute
   * @param styleConfigService
   * @param natureService
   * @param validationService
   * @param swalWarrings
   */
  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private styleConfigService: StyleConfigService,
              public natureService: NatureService, private validationService: ValidationService, private swalWarrings: SwalWarring,
              private authService: AuthService,
              private modalService: ModalDialogInstanceService) {
  }

  ngOnInit() {
    this.hasAddNaturePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_NATURE);
    this.hasUpdateNaturePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_NATURE);
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
    this.createAddForm();

    if (this.id && !this.isModal) {
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
  }
/**
   * mode modal init
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.options = options;
    this.isModal = true;
  }
  private getDataToUpdate() {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter('Id', Operation.eq, this.id))
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push(new Relation('Item'));
    this.natureService.getModelByCondition(predicate).subscribe(data => {
      this.natureToUpdate = data;
      this.IsStockManagedChecked = !this.natureToUpdate.IsStockManaged;
      this.CheckStockManaged();
      this.productTypeFormGroup.patchValue(this.natureToUpdate);
      if (this.natureToUpdate.UrlPicture) {
        this.natureService.getPicture(this.natureToUpdate.UrlPicture).subscribe((res: any) => {
          this.pictureNatureSrc = SharedConstant.PICTURE_BASE + res;
        });
      }
      if (this.natureToUpdate.Code === NatureCodeEnum.Produit || this.natureToUpdate.Code === NatureCodeEnum.Service ||
        this.natureToUpdate.Code === NatureCodeEnum.Expense || this.natureToUpdate.Code === NatureCodeEnum.Ristourne || this.natureToUpdate.Code === NatureCodeEnum.AdvancePayment
        || this.natureToUpdate.Item && this.natureToUpdate.Item.length > 0) {
        this.productTypeFormGroup.controls['Code'].disable();
        if(this.natureToUpdate.Item && this.natureToUpdate.Item.length > 0){
          this.disabledCheckStockManaged = true;
        }
      }
      if (!this.hasUpdateNaturePermission) {
         this.productTypeFormGroup.disable();
      }
    });
  }

  public onAddNatureClick() {
    if ((this.productTypeFormGroup as FormGroup).valid) {
      const natureToSave = this.productTypeFormGroup.getRawValue() as Nature;
      if (this.id) {
        natureToSave.Id = this.id;
      }
      if(!this.isUpdateMode && this.id && this.id > 0){
        natureToSave.Id = 0;
      }
      natureToSave.PictureFileInfo = this.pictureFileInfo;
      if (natureToSave.PictureFileInfo) {
        natureToSave.PictureFileInfo.FileData = natureToSave.PictureFileInfo.Data !== undefined ?
          natureToSave.PictureFileInfo.Data.toString() : natureToSave.PictureFileInfo.FileData;
      }else if(this.natureToUpdate && this.natureToUpdate.UrlPicture){
        natureToSave.UrlPicture = this.natureToUpdate.UrlPicture;
      }
      this.isSaveOperation = true;
      if (this.isModal) {
        this.natureService.save(natureToSave, true,null,null,null,true).subscribe((data) => {
          if (data) {
            this.options.data = data;
            this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
          }
        }
      );
      } else{
        this.natureService.save(natureToSave, !this.isUpdateMode).subscribe((data) => {
          if (data) {
            this.router.navigate([this.NATURE_LIST_URL]);
          }
        }
      );
      }

    } else {
      this.validationService.validateAllFormFields(this.productTypeFormGroup);
    }
  }

  private createAddForm(): void {
    this.productTypeFormGroup = this.fb.group({
      Code: ['', {
        validators: Validators.required, asyncValidators: unique(SharedConstant.CODE, this.natureService, String(this.id)),
        updateOn: 'blur'
      }],
      Label: ['', Validators.required],
      IsStockManaged: [false],
    });
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
        this.pictureNatureSrc = reader.result;
      };
    }
    }
  }

  get Code(): FormControl {
    return this.productTypeFormGroup.get(SharedConstant.CODE) as FormControl;
  }

  get IsStockManaged(): FormControl {
    return this.productTypeFormGroup.get(SharedConstant.IS_STOCK_MANAGED) as FormControl;
  }

  get Label(): FormControl {
    return this.productTypeFormGroup.get(SharedConstant.LABEL) as FormControl;
  }

  CheckStockManaged() {
    this.IsStockManagedChecked = !this.IsStockManagedChecked;
    this.productTypeFormGroup.controls[SharedConstant.IS_STOCK_MANAGED].setValue(this.IsStockManagedChecked);
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
    return this.productTypeFormGroup.touched;
  }

  removeNaturePicture(event) {
    event.preventDefault();
    this.swalWarrings.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureNatureSrc = null;
        this.pictureFileInfo = null;
      }
    });
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

}
