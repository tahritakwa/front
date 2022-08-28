import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { TranslateService } from '@ngx-translate/core';
import { ReportingInUrlComponent } from '../../shared/components/reports/reporting-in-url/reporting-in-url.component';
import { NumberConstant } from '../../constant/utility/number.constant';
import { PredicateFormat, Filter, Relation, OrderBy, OrderByDirection } from '../../shared/utils/predicate';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { StockDocumentsService } from '../../inventory/services/stock-documents/stock-documents.service';
import { EcommerceConstant } from '../../constant/ecommerce/ecommerce.constant';
import { LogService } from '../services/log/log.service';
import { EcommerceSalesDeliveryService } from '../services/ecommerce-sales-delivery/ecommerce-sales-delivery.service';

@Component({
  selector: 'app-error-sales-delivery-generation-list',
  templateUrl: './error-sales-delivery-generation-list.component.html',
  styleUrls: ['./error-sales-delivery-generation-list.component.scss']
})
export class ErrorSalesDeliveryGenerationListComponent implements OnInit {

  @ViewChild(ReportingInUrlComponent) report;
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  public predicate: PredicateFormat;

  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /**
* Grid state
*/
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };


  public columnsConfig: ColumnSettings[] = [

    {
      field: EcommerceConstant.CUSTOMER_FIRSTNAME,
      title: EcommerceConstant.FULLNAME_TITLE,
      filterable: true
    },
    {
      field: EcommerceConstant.ADRESSE_PHONE,
      title: EcommerceConstant.TELEPHONE_TITLE,
      filterable: true
    },
    {
      field: EcommerceConstant.CUSTOMER_EMMAIL,
      title: EcommerceConstant.EMAIL_TITLE,
      filterable: true
    },
    {
      field: EcommerceConstant.CREATED_AT,
      title: EcommerceConstant.CREATIONDATE_TITLE,
      filterable: true
    },

  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public stockDocumentsService: StockDocumentsService,
    public translate: TranslateService, public ecommerceSalesDeliveryService: EcommerceSalesDeliveryService) { }


  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.ecommerceSalesDeliveryService.getFailedSalesDeliveryList(this.gridSettings.state, this.predicate).subscribe(result => {
        this.gridSettings.gridData = result;
      });
  }

  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();

    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation('IdItemNavigation')]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy("Id", OrderByDirection.desc)]);
  }



  ngOnInit() {
    this.preparePredicate();
    this.initGridDataSource();
  }
  public formatDate(): string {
    return this.translate.instant(SharedConstant.DATE_FORMAT) + ' à HH:mm';
  }


}
