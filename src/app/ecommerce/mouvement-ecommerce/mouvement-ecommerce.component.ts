import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReportingInUrlComponent } from '../../shared/components/reports/reporting-in-url/reporting-in-url.component';
import { NumberConstant } from '../../constant/utility/number.constant';
import { PredicateFormat, Filter, Relation, OrderBy, OrderByDirection, Operation } from '../../shared/utils/predicate';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { StockDocumentConstant } from '../../constant/inventory/stock-document.constant';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { StockDocumentsService } from '../../inventory/services/stock-documents/stock-documents.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { documentStatusCode, EcommerceReservationStatusCode } from '../../models/enumerators/document.enum';
import { EcommerceConstant } from '../../constant/ecommerce/ecommerce.constant';

@Component({
  selector: 'app-mouvement-ecommerce',
  templateUrl: './mouvement-ecommerce.component.html',
  styleUrls: ['./mouvement-ecommerce.component.scss']
})
export class MouvementEcommerceComponent implements OnInit {

  @ViewChild(ReportingInUrlComponent) report;
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  public predicate: PredicateFormat;
  // pager settings
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
      field: StockDocumentConstant.CODE_FIELD,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: StockDocumentConstant.DATE_FIELD,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: StockDocumentConstant.TYPE_FIELD,
      title: StockDocumentConstant.TYPE_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD,
      title: StockDocumentConstant.ID_DOCUMENT_STATUS_TITLE,
      filterable: true,
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public stockDocumentsService: StockDocumentsService, private swalWarrings: SwalWarring,
    private router: Router, public translate: TranslateService) { }

  /**
* Data changed listener
* @param state
*/
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.stockDocumentsService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }

  /**
* Remove handler
* @param param0
*/
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.stockDocumentsService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }
  /**
   *  Go to edit form
   * @param id
   */
  public goToAdvancedEdit(id: number) {
    this.router.navigateByUrl(StockDocumentConstant.URI_ECOMMERCE_EDIT.concat(id.toString()));
  }

  /**
* Init grid with data from the datasource
*/
  initGridDataSource() {
    this.stockDocumentsService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data =>
      this.gridSettings.gridData = data
    );
  }


  /**
   * Prepare predicate
   * @param status
   */
  public preparePredicate(status: number): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    // Set default filter to all transfert movement
    this.choosenFilter = this.translate.instant(EcommerceConstant.ALL_RESERVATIONS);
    if (status !== 0) {
      const isReservation = status === 1;
      this.choosenFilter = this.translate.instant(EcommerceReservationStatusCode[status].toUpperCase());
      this.predicate.Filter.push(new Filter('IdWarehouseSourceNavigation.IsCentral', Operation.eq, isReservation));
    }
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ECOMMERCE_WAREHOUSE_SOURCE, Operation.eq, 1));
    this.predicate.Filter.push(new Filter(StockDocumentConstant.ECOMMERCE_WAREHOUSE_DESTINATION, Operation.eq, 1));
    this.choosenFilterNumber = status;
    // Add filter by type of stock document (TM)
    this.predicate.Filter.push(new Filter(StockDocumentConstant.TYPE_STOCK_DOCUMENT, Operation.eq, StockDocumentConstant.TM));
    this.predicate.Relation = new Array<Relation>();
    // Add relation idDocumentStatus
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
    // Add relation IdWarehouseSourceNavigation
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION));
    // Add relation IdWarehouseDestinationNavigation
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_DESTINATION_NAVIGATION));
    this.predicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy("Id", OrderByDirection.desc)]);
  }

  /**
 * onChange Status Transfert Movement
 * */
  public onChangeStatusTransfertMovement(status: number) {
    // Prepare predicate
    this.preparePredicate(status);
    // Init grid data source
    this.initGridDataSource();
  }

  ngOnInit() {
    // Prepare predicate
    this.preparePredicate(NumberConstant.ZERO);
    // Init grid data source
    this.initGridDataSource();
  }

}
