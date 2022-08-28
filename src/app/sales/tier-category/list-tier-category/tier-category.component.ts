import { PricesConstant } from './../../../constant/sales/prices.constant';
import { PermissionConstant } from './../../../Structure/permission-constant';
import { AuthService } from './../../../login/Authentification/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalWarring } from './../../../shared/components/swal/swal-popup';
import { TierCategoryService } from './../../services/tier-category/tier-category.service';
import { GridSettings } from './../../../shared/utils/grid-settings.interface';
import { DocumentConstant } from './../../../constant/sales/document.constant';
import { ColumnSettings } from './../../../shared/utils/column-settings.interface';
import { NumberConstant } from './../../../constant/utility/number.constant';
import { State } from '@progress/kendo-data-query';
import { PredicateFormat, Relation, Filter , Operation} from './../../../shared/utils/predicate';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { Component, OnInit, ComponentRef } from '@angular/core';


const LOGIC_AND = 'and';
const ID = 'id';
const TIER_CATEGORY_EDIT_URL = 'main/settings/sales/list-tier-categorys/AdvancedEdit/';
@Component({
  selector: 'app-tier-category',
  templateUrl: './tier-category.component.html',
  styleUrls: ['./tier-category.component.css']
})
export class TierCategoryComponent implements OnInit   {

  // pager settings
  pagerSettings: PagerSettings = {
    buttonCount: 10, info: true, type: 'numeric', pageSizes: true, previousNext: true
  };

  public predicate: PredicateFormat;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: DocumentConstant.CODE,
      title: DocumentConstant.CODE_TITLE,
      filterable: false
    },
    {
      field: DocumentConstant.CATEGORY_TIER_NAME,
      title: DocumentConstant.DESIGNATION,
      filterable: false
    }
    
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  public categoryChoice;
  public hasShowTierCategoryModePermission: boolean;
  public hasAddTierCategoryPermission: boolean;
  public hasUpdateTierCategoryPermission: boolean;
  public hasDeleteTierCategoryPermission: boolean;
  constructor(public tierCategoryService: TierCategoryService, private swalWarrings: SwalWarring, private router: Router,
              private activatedRoute: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasShowTierCategoryModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_TIER_CATEGORY);
    this.hasAddTierCategoryPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_TIER_CATEGORY);
    this.hasDeleteTierCategoryPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_TIER_CATEGORY);
    this.hasUpdateTierCategoryPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_TIER_CATEGORY);

    this.preparePredicate();
    this.initGridDataSource();
  }

  /**
   * prepare filters and relationships
   */
   preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PricesConstant.ID_ITEM_NAVIGATION),
      new Relation(PricesConstant.ID_TIERS_NAVIGATION)]);
  }

   /**
   * Init grid with data from the datasource
   */
    initGridDataSource() {
      this.tierCategoryService.reloadServerSideData(this.gridSettings.state, this.predicate)
        .subscribe(data => {
          this.gridSettings.gridData = data;
        });
    }

     /**
   * Reload grid data when data is changed
   * @param state
   */
  public dataStateChange(state: State): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.tierCategoryService.reloadServerSideData(state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data);
  }

   /**
   * Delete Price
   * @param param0
   */
    public removeHandler(dataItem) {
      this.swalWarrings.CreateSwal(DocumentConstant.CATEGORY_DELETE_TEXT_MESSAGE, DocumentConstant.CATEGORY_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.tierCategoryService.remove(dataItem).subscribe(() => {
            this.initGridDataSource();
          });
        }
      });
    }

    public goToAdvancedEdit(dataItem) {
      this.router.navigateByUrl(TIER_CATEGORY_EDIT_URL.concat(dataItem.Id));
    }
    public filter() {
      this.preparePredicate();
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(DocumentConstant.CODE, Operation.contains, this.categoryChoice, false, true));
      this.predicate.Filter.push(new Filter(DocumentConstant.CATEGORY_TIER_NAME, Operation.contains, this.categoryChoice, false, true));
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.initGridDataSource();
    }


}
