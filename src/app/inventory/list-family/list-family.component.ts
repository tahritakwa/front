import { Component, OnInit, ComponentRef } from '@angular/core';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { FamilyService } from '../services/family/family.service';
import {Filter, Operation, PredicateFormat} from '../../shared/utils/predicate';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { unique, ValidationService } from '../../shared/services/validation/validation.service';
import { Family } from '../../models/inventory/family.model';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import {Router} from '@angular/router';
import {NumberConstant} from '../../constant/utility/number.constant';
import { EcommerceProductService } from '../../ecommerce/services/ecommerce-product/ecommerce-product.service';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { PermissionConstant } from '../../Structure/permission-constant';
import { AuthService } from '../../login/Authentification/services/auth.service';

const ACTIVE_EDIT_URL = 'main/settings/inventory/list-family/AdvancedEdit/';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';

@Component({
  selector: 'app-list-family',
  templateUrl: './list-family.component.html',
  styleUrls: ['./list-family.component.scss']
})
export class ListFamilyComponent implements OnInit {

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  public familyFormGroup: FormGroup;
  private editedRowIndex: number;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private btnEditVisible: boolean;
  family: string;
  public hasAddFamilyPermission: boolean;
  public hasUpdateFamilyPermission: boolean;
  public hasDeleteFamilyPermission: boolean;
  public hasShowFamilyPermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'CODE',
      filterable: true,
      _width: 240
    },
    {
      field: 'Label',
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

  constructor(public familyService: FamilyService, private router: Router, private fb: FormBuilder, private authService: AuthService,
              private validationService: ValidationService, private swalWarrings: SwalWarring,
              public ecommerceProductService:EcommerceProductService) {
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_FAMILY);
    this.hasUpdateFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_FAMILY);
    this.hasDeleteFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_FAMILY);
    this.hasShowFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_FAMILY);
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
    this.familyService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateList, API_GET_DATA_WITH_SPEC_FILTRE)
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
      this.familyFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }
  /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.familyFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Code: [dataItem.Code, { validators:  [Validators.required],
        asyncValidators: [ unique('Code', this.familyService, String(dataItem.Id))],  updateOn: 'blur'}],
      Label: [dataItem.Label, Validators.required],
      IsStockManaged: [dataItem.IsStockManaged],
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.familyFormGroup);
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
    this.familyFormGroup = new FormGroup({
      Code: new FormControl('', Validators.required, unique('Code', this.familyService, '0')),
      Label: new FormControl('', Validators.required),
      IsStockManaged: new FormControl(false),
    });

    sender.addRow(this.familyFormGroup);
    this.btnEditVisible = false;

  }
  /**
   * Save handler
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {

      const item: Family = formGroup.value;
      this.familyService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());

      sender.closeRow(rowIndex);
      this.btnEditVisible = true;

    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }
   /**
   * Synchronized family with magento
   * @param dataItem
   */
  sychronizeWithEcommerce(dataItem:any ){
    this.ecommerceProductService.AddCategoryFromMagento(dataItem).subscribe((data) => {
      if (data){
        this.initGridDataSource();
      }
    });
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(SharedConstant.FAMILY_DELETE_TEXT_MESSAGE, SharedConstant.FAMILY_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
          if (dataItem.IdCategoryEcommerce){
            this.removeFromEcommerce(dataItem);
          }else {
            this.familyService.remove(dataItem).subscribe(() => {
              this.initGridDataSource();
            });
          }
      }
    })
  }
  /***
   * remove family from ecommerce
   */
  public removeFromEcommerce(dataItem){
    this.swalWarrings.CreateSwal(SharedConstant.DELETE_FAMILY_ECOMMERCE_TEXT, SharedConstant.FAMILY_DELETE_TITLE_MESSAGE,SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.familyService.remove(dataItem).subscribe(() => {
          this.ecommerceProductService.UpdateCategoryFromMagento(dataItem).subscribe(() => {});
          this.initGridDataSource();
        });
      }
    })
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ACTIVE_EDIT_URL.concat(dataItem.Id));
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.family, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.family, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadFamilyPicture(data);
      data.forEach(family => {
        family.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadFamilyPicture(familyList: Family[]) {
    var familyPicturesUrls = [];
    familyList.forEach((family: Family) => {
      familyPicturesUrls.push(family.UrlPicture);
    });
    if (familyPicturesUrls.length > NumberConstant.ZERO) {
      this.familyService.getPictures(familyPicturesUrls, false).subscribe(familyPictures => {
        this.fillFamilyPictures(familyList, familyPictures);
      });
    }
  }
  private fillFamilyPictures(familyList, familyPictures) {
    familyList.map((family: Family) => {
      if (family.UrlPicture) {
        let dataPicture = familyPictures.objectData.find(value => value.FulPath === family.UrlPicture);
        if (dataPicture) {
          family.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
}
