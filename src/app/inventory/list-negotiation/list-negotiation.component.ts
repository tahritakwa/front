import { Component, OnInit, Input } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { NegotitateQtyService } from '../../purchase/services/negotitate-qty/negotitate-qty.service';
import { DataStateChangeEvent, PagerSettings, RowClassArgs } from '@progress/kendo-angular-grid';
import { PredicateFormat } from '../../shared/utils/predicate';
import { FormGroup } from '@angular/forms';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { DocumentEnumerator, documentStatusCode } from '../../models/enumerators/document.enum';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { CompanyService } from '../../administration/services/company/company.service';
import { ReducedCurrency } from '../../models/administration/reduced-currency.model';
import { NumberConstant } from '../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../login/Authentification/services/local-storage-service';
const SHOW = '/show/';
const EDIT = '/edit/';
@Component({
  selector: 'app-list-negotiation',
  templateUrl: './list-negotiation.component.html',
  styleUrls: ['./list-negotiation.component.scss'],
  styles: [`
       .k-grid tr.red { color: #ef5958; font-weight: bold; }
       .k-grid tr.orange { color: #ffc107; font-weight: bold; }
       .k-grid tr.green { color:  #4dbd74; font-weight: bold; }
   `],
})
export class ListNegotiationComponent implements OnInit {
  public predicate: PredicateFormat;
  @Input() itemFormGroup: FormGroup;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public documentStatusCode = documentStatusCode;
  public formatSaleOptions: any;
  public gridState: State = {
    skip: 0,
    take: 5,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: 'IdDocumentLineNavigation.IdDocumentNavigation.Code',
      title: 'DOCUMENT',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: 'CreationDate',
      title: 'DATE',
      filterable: true,
      filter: 'date',
        format: this.translate.instant(SharedConstant.DATE_FORMAT),
        _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: 'Qty',
      title: 'QUANTITE',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: 'Price',
      title: 'PRICE',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: 'QteSupplier',
      title: 'QUANTITY_SUPPLIER',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: 'PriceSupplier',
      title: 'PRICE_SUPPLIER',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  constructor(public negotiationService: NegotitateQtyService,public companyService :CompanyService,
    private translate: TranslateService, private localStorageService : LocalStorageService) { }

  ngOnInit() {
      this.formatSaleOptions = {
        style: 'currency',
        currency: this.localStorageService.getCurrencyCode(),
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
  }
  initGridDataSource() {
    const filters = [
      {
        field: 'IdItem', operator: 'eq', value: this.itemFormGroup.value['IdItem']
      },
      {
        field: 'CreationDate', operator: 'gte', value: this.itemFormGroup.value['StartDate']
      },
      {
        field: 'CreationDate', operator: 'lte', value: this.itemFormGroup.value['EndDate']
      }
    ];
    this.gridSettings.state.filter.filters = this.gridSettings.state.filter.filters.concat(filters);
    this.negotiationService.getListNegotiationByItem(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = {
          data: data.listData,
          total: data.total
        }
      }
    );
    this.gridSettings.state.filter.filters = this.gridSettings.state.filter.filters.slice
      (0, this.gridSettings.state.filter.filters.length - 3);
  }
  /**
* Data changed listener
* @param state
*/
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Navigate To DocumentDetail on click document code
   */
  onClickGoToDocument(documentTypeCode: string, idDocumentStatus: number, idDocument: number) {
    let url;
    // Create Url according to document type
    if (documentTypeCode === DocumentEnumerator.PurchaseOrder) {
      url = DocumentConstant.PURCHASE_ORDER_URL;
    }

    if (idDocumentStatus != documentStatusCode.Provisional && idDocumentStatus != documentStatusCode.DRAFT) {
      url = url.concat(SHOW);
    } else {
      url = url.concat(EDIT);
    }
    window.open(url.concat(idDocument).concat('/').concat(idDocumentStatus), "_blank");
  }

  public rowCallback(context: RowClassArgs) {
    if (!context.dataItem.IsAccepted && !context.dataItem.IsRejected) {
      return { orange: true };
    }

    if (context.dataItem.IsAccepted) {
      return { green: true };
    }

    if (context.dataItem.IsRejected) {
      return { red: true };
    }

   
  }
  changeDate(date) {

    let state: any = this.gridSettings.state;

    let filterDate: any = state.filter.filters.find((x: any) => x.field == 'CreationDate');
    if (!filterDate) {
      state.filter.filters.push({
        field: 'CreationDate',
        operator: 'gte',
        value: date
      });
    }
    else {
      filterDate.value = date;
      let index = state.filter.filters.findIndex((x: any) => x.field == 'CreationDate');
      state.filter.filters[index] = filterDate;
    }

    this.dataStateChange(state);
  }
}
