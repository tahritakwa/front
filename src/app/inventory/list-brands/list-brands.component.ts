import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../shared/utils/predicate';
import { BrandService } from '../services/brand/brand.service';
import {BrandConstant} from '../../constant/inventory/brand.constant';
import {TranslateService} from '@ngx-translate/core';
import { NumberConstant } from '../../constant/utility/number.constant';
import { VehicleBrand } from '../../models/inventory/vehicleBrand.model';
import { MediaConstant } from '../../constant/utility/Media.constant';
import { PermissionConstant } from '../../Structure/permission-constant';
import { AuthService } from '../../login/Authentification/services/auth.service';

const BRAND_EDIT_URL = 'main/settings/inventory/list-brands/AdvancedEdit/';
const API_GET_DATA_WITH_SPEC_FILTRE = 'getDataWithSpecificFilter';
@Component({
  selector: 'app-list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.scss']
})
export class ListBrandsComponent implements OnInit {


  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  public actionColumnTitle = SharedConstant.COLUMN_ACTIONS_TITLE;
  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public brandFormGroup: FormGroup;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicateList: PredicateFormat[];
  public predicate: PredicateFormat;
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public hasAddBrandPermission: boolean;
  public hasUpdateBrandPermission: boolean;
  public hasDeleteBrandPermission: boolean;
  public hasShowBrandPermission: boolean;
  /* Grid state
  */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'CODE',
      filterable: false,
      _width: 200
    },
    {
      field: 'Label',
      title: 'Designation',
      filterable: false,
      _width: 300
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public brandService: BrandService, private router: Router, private translate: TranslateService,
     private authService: AuthService,
    private validationService: ValidationService, private swalWarrings: SwalWarring, private fb: FormBuilder) {
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_VEHICLEBRAND);
    this.hasUpdateBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_VEHICLEBRAND);
    this.hasDeleteBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_VEHICLEBRAND);
    this.hasShowBrandPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_VEHICLEBRAND);
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
    this.brandService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateList, API_GET_DATA_WITH_SPEC_FILTRE)
      .subscribe(data => {
        this.prepareList(data);
      });
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(BrandConstant.BRAND_DELETE_TEXT_MESSAGE, BrandConstant.BRAND_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.brandService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

 dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
   this.dialogOptions = options;
 }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(BRAND_EDIT_URL.concat(dataItem.Id));
  }

  public receiveData(event: any) {
    const predicates: PredicateFormat = Object.assign({}, null, event.predicate);
    this.predicate = predicates;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadBrandPicture(data);
      data.forEach(brand => {
        brand.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadBrandPicture(brandList: VehicleBrand[]) {
    var brandPicturesUrls = [];
    brandList.forEach((brand: VehicleBrand) => {
      brandPicturesUrls.push(brand.UrlPicture);
    });
    if (brandPicturesUrls.length > NumberConstant.ZERO) {
      this.brandService.getPictures(brandPicturesUrls, false).subscribe(brandPictures => {
        this.fillBrandPictures(brandList, brandPictures);
      });
    }
  }
  private fillBrandPictures(brandList, brandPictures) {
    brandList.map((brand: VehicleBrand) => {
      if (brand.UrlPicture) {
        let dataPicture = brandPictures.objectData.find(value => value.FulPath === brand.UrlPicture);
        if (dataPicture) {
          brand.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
}
