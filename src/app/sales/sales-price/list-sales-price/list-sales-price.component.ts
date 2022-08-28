import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { SalesPriceConstant } from '../../../constant/sales/sales-price.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SalesPriceService } from '../../services/sales-price/sales-price.service';

@Component({
  selector: 'app-list-sales-price',
  templateUrl: './list-sales-price.component.html',
  styleUrls: ['./list-sales-price.component.scss']
})
export class ListSalesPriceComponent implements OnInit {

  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  salesPrice: string;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public hasAddPermission = false ;
  public hasUpdatePermission = false ;
  public hasDeletePermission = false ;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: SalesPriceConstant.Code,
      title: SalesPriceConstant.Code,
      filterable: false,
      _width: 240
    },
    {
      field: SalesPriceConstant.Label,
      title: this.translate.instant(SalesPriceConstant.LABEL),
      filterable: false,
      _width: 240
    },
    {
      field: SalesPriceConstant.Value,
      title: this.translate.instant(SalesPriceConstant.PROPORTION),
      filterable: false,
      _width: 160
    },
    {
      field: SalesPriceConstant.State,
      title: this.translate.instant(SalesPriceConstant.STATE),
      filterable: false,
      _width: 160
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(public salesPriceService: SalesPriceService,
              private swalWarrings: SwalWarring,
              private translate: TranslateService,
              private router: Router,
              public authService: AuthService) {
    this.preparePrediacte();
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_PRICECATEGORY) ;
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_PRICECATEGORY) ;
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_PRICECATEGORY) ;
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.salesPriceService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.salesPriceService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }
  /**
   * Remove an item of taxe
   * @param param
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(SalesPriceConstant.SALES_PRICE_SUPPRESSION, SalesPriceConstant.SALES_PRICE_DELETE_TEXT_MESSAGE).then((result) => {
      if (result.value) {
        this.salesPriceService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  preparePrediacte(): void {
    this.predicate = new PredicateFormat();
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(SalesPriceConstant.SALES_PRICE_ADVANCED_EDIT_URL.concat(dataItem.Id));
  }
  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SalesPriceConstant.Code, Operation.contains, this.salesPrice, false, true));
    this.predicate.Filter.push(new Filter(SalesPriceConstant.Label, Operation.contains, this.salesPrice, false, true));
    this.predicate.Filter.push(new Filter(SalesPriceConstant.Value, Operation.eq, this.salesPrice, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

}
