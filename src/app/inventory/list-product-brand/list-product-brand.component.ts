import { Component, OnInit, ComponentRef } from '@angular/core';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../constant/shared/shared.constant';
import {Filter, Operation, PredicateFormat} from '../../shared/utils/predicate';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { ProductItemService } from '../../shared/services/product-item/product-item.service';
import { ValidationService, unique } from '../../shared/services/validation/validation.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { ProductItem } from '../../models/inventory/product-item.model';
import {Router} from '@angular/router';
import {NumberConstant} from '../../constant/utility/number.constant';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

const ACTIVE_EDIT_URL = 'main/settings/inventory/list-product-brand/AdvancedEdit/';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';

@Component({
  selector: 'app-list-product-brand',
  templateUrl: './list-product-brand.component.html',
  styleUrls: ['./list-product-brand.component.scss']
})
export class ListProductBrandComponent implements OnInit {

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  public productBrandFormGroup: FormGroup;
  private editedRowIndex: number;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private btnEditVisible: boolean;
  productFilter: string;
  public hasAddProductBrandPermission: boolean;
  public hasUpdateProductBrandPermission: boolean;
  public hasDeleteProductBrandPermission: boolean;
  public hasShowProductBrandPermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'CodeProduct',
      title: 'CODE',
      filterable: true,
      _width: 240
    },
    {
      field: 'LabelProduct',
      title: 'Designation',
      filterable: true,
      _width: 240
    }
  ];
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: SharedConstant.DEFAULT_ITEMS_NUMBER,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  constructor(public productItemService: ProductItemService,
     private router: Router, private fb: FormBuilder, private validationService: ValidationService,
    private authService: AuthService,
    private swalWarrings: SwalWarring) {
    this.btnEditVisible = true;
  }
  ngOnInit() {
    this.hasAddProductBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_PRODUCTITEM);
    this.hasDeleteProductBrandPermission =
     this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_PRODUCTITEM);
     this.hasUpdateProductBrandPermission =
     this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_PRODUCTITEM);
    this.hasShowProductBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_PRODUCTITEM);
    this.initGridDataSource();
  }
  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.predicateList = [this.predicate];
    this.productItemService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.predicateList, API_GET_DATA_WITH_SPEC_FILTRE)
      .subscribe(data => {
       this.prepareList(data);
      });
  }
  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.productBrandFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }
  /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.productBrandFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      CodeProduct: new FormControl(dataItem.Code, { validators: Validators.required,
        asyncValidators: unique('CodeProduct', this.productItemService, String(0)),
        updateOn: 'blur'}),
      LabelProduct: [dataItem.LabelProduct, Validators.required],
      IsStockManaged: [dataItem.IsStockManaged],
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.productBrandFormGroup);
    this.btnEditVisible = false;
  }
  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }
  /**
   * Quick add
   * @param param0
   */
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.productBrandFormGroup = new FormGroup({
      CodeProduct: new FormControl('', { validators: Validators.required, asyncValidators:
        unique('CodeProduct', this.productItemService, String(0)),
        updateOn: 'blur'}),
      LabelProduct: new FormControl('', Validators.required),
      IsStockManaged: new FormControl(false),
    });
    sender.addRow(this.productBrandFormGroup);
    this.btnEditVisible = false;
  }
  /**
   * Save handler
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      const item: ProductItem = formGroup.value;
      this.productItemService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());
      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }
  /**
   * Remove handler
   * @param dataItem
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(SharedConstant.PRODUCT_BRAND_DELETE_TEXT_MESSAGE,
       SharedConstant.PRODUCT_BRAND_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.productItemService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ACTIVE_EDIT_URL.concat(dataItem.Id));
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter('CodeProduct', Operation.contains, this.productFilter, false, true));
    this.predicate.Filter.push(new Filter('LabelProduct', Operation.contains, this.productFilter, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadProductPicture(data);
      data.forEach(product => {
        product.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadProductPicture(productList: ProductItem[]) {
    var productPicturesUrls = [];
    productList.forEach((family: ProductItem) => {
      productPicturesUrls.push(family.UrlPicture);
    });
    if (productPicturesUrls.length > NumberConstant.ZERO) {
      this.productItemService.getPictures(productPicturesUrls, false).subscribe(productPictures => {
        this.fillProductPictures(productList, productPictures);
      });
    }
  }
  private fillProductPictures(productList, productPictures) {
    productList.map((product: ProductItem) => {
      if (product.UrlPicture) {
        let dataPicture = productPictures.objectData.find(value => value.FulPath === product.UrlPicture);
        if (dataPicture) {
          product.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

}
