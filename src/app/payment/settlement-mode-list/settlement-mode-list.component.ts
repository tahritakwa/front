import { Component, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import {Filter, Operation, PredicateFormat, Relation} from '../../shared/utils/predicate';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { PricesConstant } from '../../constant/sales/prices.constant';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { PricesService } from '../../sales/services/prices/prices.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { PaymentConstant } from '../payment.constant';
import { FileInfo } from '../../models/shared/objectToSend';
import { SettlementMethodService } from '../services/payment-method/settlement-method.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

const LOGIC_AND = 'and';
const ID = 'id';

@Component({
  selector: 'app-settlement-mode-list',
  templateUrl: './settlement-mode-list.component.html',
  styleUrls: ['./settlement-mode-list.component.scss']
})
export class SettlementModeListComponent implements OnInit {
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
      field: PaymentConstant.CODE_FIELD,
      title: PaymentConstant.CODE,
      filterable: false
    },
    {
      field: PaymentConstant.DESIGNATION_LABEL,
      title: PaymentConstant.DESIGNATION,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public paymentChoice;
  public hasAddSettlementModePermission: boolean;
  public hasUpdateSettlementModePermission: boolean;
  public hasShowSettlementModePermission: boolean;
  public hasDeleteSettlementModePermission: boolean;
  constructor(public settlementMethodService: SettlementMethodService, private swalWarrings: SwalWarring, private router: Router,
              private activatedRoute: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasAddSettlementModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_SETTLEMENTMODE);
    this.hasShowSettlementModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_SETTLEMENTMODE);
    this.hasDeleteSettlementModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_SETTLEMENTMODE);
    this.hasUpdateSettlementModePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_SETTLEMENTMODE);
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
    this.settlementMethodService.reloadServerSideData(this.gridSettings.state, this.predicate)
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
    this.settlementMethodService.reloadServerSideData(state, this.predicate)
      .subscribe(data => this.gridSettings.gridData = data);
  }

  /**
   * Delete Price
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(PaymentConstant.PAYMENT_DELETE_TEXT_MESSAGE, PaymentConstant.PAYMENT_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.settlementMethodService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(PaymentConstant.SETTLEMENT_EDIT_URL.concat(dataItem.Id));
  }
  public filter() {
    this.preparePredicate();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(PaymentConstant.CODE_FIELD, Operation.contains, this.paymentChoice, false, true));
    this.predicate.Filter.push(new Filter(PaymentConstant.DESIGNATION_LABEL, Operation.contains, this.paymentChoice, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
}
