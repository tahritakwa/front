import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SubFamily } from '../../models/inventory/sub-family.model';
import { unique, ValidationService } from '../../shared/services/validation/validation.service';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { SubFamilyService } from '../services/sub-family/sub-family.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { PredicateFormat, Relation, Filter, Operation } from '../../shared/utils/predicate';
import { FamilyService } from '../services/family/family.service';
import { ItemConstant } from '../../constant/inventory/item.constant';
import { Router } from '@angular/router';
import { EcommerceProductService } from '../../ecommerce/services/ecommerce-product/ecommerce-product.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { PermissionConstant } from '../../Structure/permission-constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
const ID_FAMILY_NAVIGATION_LABEL = 'IdFamilyNavigation.Label';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';

@Component({
  selector: 'app-list-sub-family',
  templateUrl: './list-sub-family.component.html',
  styleUrls: ['./list-sub-family.component.scss']
})
export class ListSubFamilyComponent implements OnInit {
  public columnActionsWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  public subFamilyFormGroup: FormGroup;
  private editedRowIndex: number;
  subfamilyFilter:string;
  private dataT: {
    'Id': 0,
    'Code': '',
    'Label': '',
    'Category': ''
  };
  private family;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private btnEditVisible: boolean;
  public hasAddSubFamilyPermission: boolean;
  public hasUpdateSubFamilyPermission: boolean;
  public hasDeleteSubFamilyPermission: boolean;
  public hasShowSubFamilyPermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.CODE_COLUMN,
      title: ItemConstant.CODE_TITLE,
      filterable: false,
      _width: 240
    },
    {
      field: ItemConstant.DESIGNATION_COLUMN,
      title: ItemConstant.DESIGNATION_TITLE,
      filterable: false,
      _width: 220
    },
    {
      field: 'IdFamilyNavigation.Label',
      title: 'FAMILY',
      filterable: false,
      _width: 220
    }
  ];
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
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
  constructor(public subFamilyService: SubFamilyService, private fb: FormBuilder,
              private validationService: ValidationService, private router: Router,
              private authService: AuthService,
              private swalWarrings: SwalWarring, public ecommerceProductService: EcommerceProductService) {
    this.btnEditVisible = true;
  }
  ngOnInit() {
    this.hasAddSubFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SUBFAMILY);
    this.hasUpdateSubFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_SUBFAMILY);
    this.hasDeleteSubFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_SUBFAMILY);
    this.hasShowSubFamilyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_SUBFAMILY);
    this.preparePredicate();
    this.initGridDataSource();
  }
  
  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation('IdFamilyNavigation'));
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
    this.subFamilyService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateList, API_GET_DATA_WITH_SPEC_FILTRE).subscribe((data) => {
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
      this.subFamilyFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }
  /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.subFamilyFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Code: [dataItem.Code, Validators.required, unique('Code', this.subFamilyService, String(dataItem.Id))],
      Label: [dataItem.Label, Validators.required],
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.subFamilyFormGroup);
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
    this.subFamilyFormGroup = new FormGroup({
      Family: new FormControl('', Validators.required),
      Code: new FormControl('', Validators.required, unique('Code', this.subFamilyService, '0')),
      Label: new FormControl('', Validators.required),
    });
    sender.addRow(this.subFamilyFormGroup);
    this.btnEditVisible = false;
  }
  /**
   * Save handler
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      const item: SubFamily = formGroup.value;
      this.subFamilyService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());
      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }
  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(ItemConstant.SUB_FAMILY_DELETE_TEXT_MESSAGE,
      ItemConstant.SUB_FAMILY_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
          if (dataItem.IdSubCategoryEcommerce){
         this.removeFromEcommerce(dataItem);
          }else {
            this.subFamilyService.remove(dataItem).subscribe(() => {this.initGridDataSource();});
          }
      }
    });
  }
  /***
   * remove Subfamily from ecommerce
   */
  public removeFromEcommerce(dataItem){
    this.swalWarrings.CreateSwal(SharedConstant.DELETE_FAMILY_ECOMMERCE_TEXT, ItemConstant.SUB_FAMILY_DELETE_TITLE_MESSAGE,SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.subFamilyService.remove(dataItem).subscribe(() => {
          this.ecommerceProductService.UpdateSubCategoryFromMagento(dataItem).subscribe(() => {});
          this.initGridDataSource();
        });
      }
    })
  }
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.SUB_FAMILY_ADVANCED_EDIT.concat(dataItem.Id));
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.subfamilyFilter, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.LABEL, Operation.contains, this.subfamilyFilter, false, true));
    this.predicate.Filter.push(new Filter(ID_FAMILY_NAVIGATION_LABEL, Operation.contains, this.subfamilyFilter, false, true));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation('IdFamilyNavigation'));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  pictureSubFamilyData(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.PictureFileInfo.Data;
    }
  }
  /**
 * Synchronized sub family with magento
 * @param dataItem
 */
sychronizeWithEcommerce(dataItem:any ){
  this.ecommerceProductService.AddSubCategoryFromMagento(dataItem).subscribe((data) => {
    if (data){
      this.initGridDataSource();
    }
  });
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

private loadFamilyPicture(familyList: SubFamily[]) {
  var familyPicturesUrls = [];
  familyList.forEach((family: SubFamily) => {
    familyPicturesUrls.push(family.UrlPicture);
  });
  if (familyPicturesUrls.length > NumberConstant.ZERO) {
    this.subFamilyService.getPictures(familyPicturesUrls, false).subscribe(familyPictures => {
      this.fillFamilyPictures(familyList, familyPictures);
    });
  }
}
private fillFamilyPictures(familyList, familyPictures) {
  familyList.map((family: SubFamily) => {
    if (family.UrlPicture) {
      let dataPicture = familyPictures.objectData.find(value => value.FulPath === family.UrlPicture);
      if (dataPicture) {
        family.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
      }
    }
  });
}

}
