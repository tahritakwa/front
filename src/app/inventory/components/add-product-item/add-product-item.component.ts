import { Component, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ProductDropdownComponent } from '../../../shared/components/product-dropdown/product-dropdown.component';
import { ProductItemService } from '../../../shared/services/product-item/product-item.service';
import { ProductItem } from '../../../models/inventory/product-item.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { FileInfo } from '../../../models/shared/objectToSend';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import { Observable } from 'rxjs/Observable';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { Subscription } from 'rxjs/Subscription';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const ACTIVE_LIST_URL = 'main/inventory/list-product-brand';

@Component({
  selector: 'app-add-product-item',
  templateUrl: './add-product-item.component.html',
  styleUrls: ['./add-product-item.component.scss']
})
export class AddProductItemComponent implements OnInit, OnDestroy {

  /**
   * attribute to use while verifying the route leave
   */
  private isSaveOperation = false;
  /**
   * Form Group
   */
  addProductFormGroup: FormGroup;
  @ViewChild(ProductDropdownComponent) productDropdownComponent;
  public PRODUCT_ITEM_LIST_URL = '/main/settings/inventory/list-product-brand';
  pictureFileInfo: FileInfo;
  public pictureProductSrc: any;
  ProductToUpdate: ProductItem;
  idProduct: number;

  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  showAddForm = true;
  hideList = true;
  TecdocBrand: any;
  // predicate
  public predicate: PredicateFormat;


  public ProductItemSaved = false;
  public productItem: ProductItem;

  /*
   * Id Entity
   */
  private id: number;
  /*
   * is updateMode
   */
  public isUpdateMode = false;

  private productItemSubscription: Subscription;

  /*
   * product item to update
   */
  private productItemToUpdate: ProductItem;

  /**
   * If modal=true
   */
  public isModal: boolean;


  /*
   * id Subscription
   */
  private idSubscription: Subscription;
  public hasAddProductItemPermission: boolean;
  public hasUpdateProductItemPermission: boolean;

  /**/
  constructor(private fb: FormBuilder,
    private productItemService: ProductItemService,
    private modalService: ModalDialogInstanceService,
    private validationService: ValidationService,
    private activatedRoute: ActivatedRoute,
    private swalWarring: SwalWarring,
    private router: Router,
    private authService: AuthService,
    private styleConfigService: StyleConfigService) {
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'] || 0;
    });
  }

  ngOnInit() {
    this.hasAddProductItemPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_PRODUCTITEM);
    this.hasUpdateProductItemPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_PRODUCTITEM);
    this.createAddForm();
    this.activatedRoute.params.subscribe(params => {
      this.idProduct = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
    if (this.idProduct && !this.isModal) {
      this.isUpdateMode = true;
      this.getDataToUpdate();
    }
    this.showAddForm = true;


    if (this.options && this.options.data) {
      this.hideList = false;
      this.addProductFormGroup.controls['LabelProduct'].setValue(this.options.data);
      this.addProductFormGroup.controls['CodeProduct'].setValue(this.options.data);
      this.TecdocBrand = this.options.data;
    } else {
      this.hideList = true;
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(this.productDropdownComponent)) {
      this.productDropdownComponent.isFromModal = true;
    }
    if (this.productDropdownComponent != undefined) {
      this.productDropdownComponent.isFromModal = true;
    }
    this.isUpdateMode = this.id > 0;
    if (this.isUpdateMode && !this.isModal) {
      this.getDataToUpdate();
    }
  }

  /**
   * create main form
   */
  private createAddForm(): void {
    this.addProductFormGroup = this.fb.group({
      Id: [0],
      CodeProduct:["", {validators: Validators.required, asyncValidators: unique('CodeProduct', this.productItemService, String(this.id)), updateOn: 'blur'}],
      LabelProduct: ['', [Validators.required]],
      IdProductItem: [0]
    });
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

  public showListProductItem() {
    this.showAddForm = false;
    this.productDropdownComponent.initDataSource(false);

    this.createAddForm();
    this.addProductFormGroup.setControl('IdProductItem', this.fb.control(undefined,
      Validators.required));
    this.addProductFormGroup.get('LabelProduct').clearValidators();
    this.addProductFormGroup.get('CodeProduct').clearValidators();
  }

  public showAddProductItem() {
    this.showAddForm = true;
    this.createAddForm();
    if (this.options.data) {
      this.addProductFormGroup.setControl('LabelProduct', this.fb.control(this.options.data, Validators.required));
      this.addProductFormGroup.setControl('CodeProduct', this.fb.control(this.options.data, Validators.required));
    }
  }

  /**
   *  get data to update
   * */
  private getDataToUpdate(): void {
    this.productItemSubscription = this.productItemService.getById(this.id).subscribe(data => {
      this.productItemToUpdate = data;
      if (this.productItemToUpdate) {
        if (this.productItemToUpdate.UrlPicture) {
          this.productItemService.getPicture(this.productItemToUpdate.UrlPicture).subscribe((res: any) => {
            this.pictureProductSrc = SharedConstant.PICTURE_BASE + res;
          });
        }
        this.addProductFormGroup.patchValue(this.productItemToUpdate);
      }
      if (!this.hasUpdateProductItemPermission) {
        this.addProductFormGroup.disable();
      }
    });
  }

  public save(): void {
    if (this.addProductFormGroup.valid) {
      this.isSaveOperation = true;
      const ProductToAdd = this.addProductFormGroup.getRawValue() as ProductItem;
      ProductToAdd.LabelProduct = ProductToAdd.LabelProduct.toUpperCase().trim();
      ProductToAdd.CodeProduct = ProductToAdd.CodeProduct.toUpperCase().trim();
      if (this.isModal) {

        if (this.showAddForm) {
          this.productItemService.save(ProductToAdd, true, null, null, null, true).subscribe((data) => {
            this.isSaveOperation = true;
            this.options.data = data;
            this.options.onClose();
            this.modalService.closeAnyExistingModalDialog();
          });
        } else {
          this.options.data = this.addProductFormGroup.value['IdProductItem'];
          this.options.onClose();
          this.modalService.closeAnyExistingModalDialog();
        }
      } else {
        if (!this.ProductItemSaved && !this.isUpdateMode) {

          this.productItemService.save(ProductToAdd, !this.isUpdateMode).subscribe((data) => {
            this.isSaveOperation = true;
            this.ProductItemSaved = true;
            this.backToPrevious();
          });

        } else if (!this.ProductItemSaved && this.isUpdateMode) {
          if (this.addProductFormGroup.touched) {
            this.productItemService.save(ProductToAdd).subscribe(() => {
              this.isSaveOperation = true;
              this.backToPrevious();
            });
          }
        }
      }
    } else {
      this.validationService.validateAllFormFields(this.addProductFormGroup);
    }
  }

  onSelectFile(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.startsWith("image/")) {
        reader.onload = () => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
          this.pictureProductSrc = reader.result;
        };
      }
    }
  }

  get CodeProduct(): FormControl {
    return this.addProductFormGroup.get('CodeProduct') as FormControl;
  }

  get Label(): FormControl {
    return this.addProductFormGroup.get('LabelProduct') as FormControl;
  }

  removeProductPicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureProductSrc = null;
        this.pictureFileInfo = null;
      }
    });
  }

  public onAddProductItemClick(): void {
    if (this.addProductFormGroup.valid) {
      const productToSave = this.addProductFormGroup.getRawValue() as ProductItem;
      if (this.idProduct) {
        productToSave.Id = this.idProduct;
      }
      if(this.pictureFileInfo){
      productToSave.PictureFileInfo = this.pictureFileInfo;
      }else if(this.productItemToUpdate && this.productItemToUpdate.UrlPicture){
        productToSave.UrlPicture = this.productItemToUpdate.UrlPicture;
      }

      if (!this.ProductItemSaved) {
        this.productItemService.save(productToSave, !this.isUpdateMode).subscribe((data) => {
          this.isSaveOperation = true;
          if (data) {
            this.ProductItemSaved = true;
            this.router.navigate([this.PRODUCT_ITEM_LIST_URL]);
          }
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.addProductFormGroup);
    }
  }


  ngOnDestroy(): void {
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }
    if (this.productItemSubscription) {
      this.productItemSubscription.unsubscribe();
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
    return this.addProductFormGroup.touched;
  }
  backToPrevious() {
    this.router.navigate([ACTIVE_LIST_URL]);
  }

  getFooterClass() {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  isFormChanged(): boolean {
    return this.addProductFormGroup.touched;
  }
}
