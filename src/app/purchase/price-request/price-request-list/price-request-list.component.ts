import { Component, OnInit } from '@angular/core';
import { PriceRequestService } from '../../services/price-request/PriceRequestService';
import { DataSourceRequestState, State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { PriceRequestConstant } from '../../../constant/sales/price-request.constant';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const PRICE_REQUEST_EDIT_URL = 'main/purchase/pricerequest/edit/';
@Component({
  selector: 'app-price-request-list',
  templateUrl: './price-request-list.component.html',
  styleUrls: ['./price-request-list.component.scss']
})
export class PriceRequestListComponent implements OnInit {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public priceReq;
  public gridState: DataSourceRequestState = {
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
      field: PriceRequestConstant.CODE,
      title: PriceRequestConstant.CODE.toUpperCase(),
      _width: 180,
      filterable: false
    },
    {
      field: PriceRequestConstant.REFERENCE,
      title: PriceRequestConstant.REFERENCE.toUpperCase(),
      _width: 150,
      filterable: false
    },
    {
      field: PriceRequestConstant.DOCUMENT_DATE,
      title: PriceRequestConstant.REQUEST_DATE,
      _width: 150,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),

    },
    {
      field: 'Suppliers',
      title: PriceRequestConstant.SUPPLIERS,
      _width: 300,
      filterable: false
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  idDoc: number;
  openModal = false;
  public haveAddPermission = false;
  public haveShowPermission = false;
  public haveDeletePermission = false;
  public haveUpdatePermission = false;

  constructor(public priceRequestService: PriceRequestService, private router: Router,
    private swalWarrings: SwalWarring, private translate: TranslateService , public authService: AuthService) { }
  /**
   * Initialise the component
   */
  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PRICEREQUEST);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_PRICEREQUEST);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_PRICEREQUEST);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PRICEREQUEST);
    this.preparePredicate();
    this.initGridDataSource();
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PriceRequestConstant.PRICE_REQUEST_DETAILS)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PriceRequestConstant.TIERS_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(PriceRequestConstant.ITEM_NAVIGATION)]);
  }

  /**
   * Load 10 lignes (the state declared) of Resquests Price from server
   */
  initGridDataSource() {
    this.priceRequestService.reloadServerSideData(this.gridSettings.state, this.predicate).
      subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Get message to display in the tooltip
   */
  getMessageToDisplay(data) {
    let message = `${this.translate.instant('SUPPLIERS')}: `;
    data.forEach(element => {
      message += element + ' / ';
    });
    return message.slice(0, message.length - NumberConstant.TWO);
  }

  /**
   * load data from server if state has been changed
   * @param state
   */
  public dataStateChange(state: State): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.priceRequestService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }

  /**
   * Remove PriceRequest
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(PurchaseRequestConstant.PRICE_REQUEST_DELETE_TEXT_MESSAGE,
      PurchaseRequestConstant.PRICE_REQUEST_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.priceRequestService.remove(dataItem).subscribe(() => {
            this.initGridDataSource();
          });
        }
      });
  }

  public addHandler($event) {

  }

  public editHandler($event) {

  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(PRICE_REQUEST_EDIT_URL.concat(dataItem.Id));
  }

  filter() {
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(PriceRequestConstant.CODE, Operation.contains, this.priceReq, false, true));
    this.predicate.Filter.push(new Filter(PriceRequestConstant.REFERENCE, Operation.contains, this.priceReq, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  openDocAssociated(idDocument) {
    this.idDoc = idDocument;
    this.openModal = true;
  }
  closeDocAssociated() {
    this.openModal = false;
  }
}
