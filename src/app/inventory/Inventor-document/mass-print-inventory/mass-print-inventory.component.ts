import { Component, OnInit } from '@angular/core';
import { StockDocumentConstant } from '../../../constant/inventory/stock-document.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PagerSettings, PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { StockDocumentsService } from '../../services/stock-documents/stock-documents.service';
import { PredicateFormat, Filter, Operation, Relation, OrderBy, OrderByDirection } from '../../../shared/utils/predicate';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-mass-print-inventory',
  templateUrl: './mass-print-inventory.component.html',
  styleUrls: ['./mass-print-inventory.component.scss']
})
export class MassPrintInventoryComponent implements OnInit {

  public gridView: GridDataResult;

  public WAREHOUSE = StockDocumentConstant.WAREHOUSE;

  public mySelection: any[] = [];


  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10000,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public pageSize = 20;
  public skip = 0;


  public columnsConfig: ColumnSettings[] = [
    {
      field: StockDocumentConstant.CODE_FIELD,
      title: StockDocumentConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: StockDocumentConstant.DATE_FIELD,
      title: StockDocumentConstant.DATE_TITLE,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      filter: 'date',
    },
    {
      field: StockDocumentConstant.ID_WAREHOUSE_SOURCE_FIELD,
      title: StockDocumentConstant.ID_WAREHOUSE_SOURCE_TITLE,
      filterable: false,
    },
    {
      field: StockDocumentConstant.SHELF_FIELD,
      title: StockDocumentConstant.SHELF_TITLE,
      filterable: true,
    },
    {
      field: StockDocumentConstant.ID_TIERS_FIELD,
      title: StockDocumentConstant.ID_TIERS_TITLE,
      filterable: true,
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public selectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };
  choosenFilter: any;
  predicate: any;
  choosenFilterNumber: number;
  inventorylist: any;
  selectedDocument: any;

  constructor(public stockDocumentsService: StockDocumentsService, public translate: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.preparePredicate();
    let predicate = new PredicateFormat();
    this.stockDocumentsService.getInventoryMovementList(this.gridSettings.state, this.predicate,
      null, null, null, 1)
      .subscribe(data => {
        this.inventorylist = data;
        this.loadItems();
      });

  }

  public preparePredicate(status = 1): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    // Set default filter to all transfert movement
    this.choosenFilter = this.translate.instant(StockDocumentConstant.ALL_Inventory);
    if (status !== 0) {
      this.choosenFilter = this.translate.instant(documentStatusCode[status].toUpperCase());
      this.predicate.Filter.push(new Filter(StockDocumentConstant.ID_DOCUMENT_STATUS_FIELD, Operation.eq, status));
    }
    this.choosenFilterNumber = status;
    // Add filter by type of stock document (TM)
    this.predicate.Filter.push(new Filter(StockDocumentConstant.TYPE_STOCK_DOCUMENT, Operation.eq, StockDocumentConstant.Inventory));
    this.predicate.Filter.push(new Filter(StockDocumentConstant.IS_DELETED, Operation.eq, NumberConstant.ZERO));
    this.predicate.Relation = new Array<Relation>();
    // Add relation idDocumentStatus
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION));
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_WAREHOUSE_SOURCE_NAVIGATION));
    this.predicate.Relation.push(new Relation(StockDocumentConstant.ID_TIERS_NAVIGATION));
    this.predicate.OrderBy = new Array<OrderBy>();
    // Add order by DocumentDate
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(StockDocumentConstant.DATE_FIELD, OrderByDirection.desc)]);

  }


  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();

    // Optionally, clear the selection when paging
    // this.mySelection = [];
  }
  private loadItems(): void {
    this.gridView = {
      data: this.inventorylist.data.slice(this.skip, this.skip + this.pageSize),
      total: this.inventorylist.data.length
    };
  }
  onSelect(dataitem): void {
    this.selectedDocument = dataitem;
    const index = this.mySelection.findIndex(doc => doc === this.selectedDocument);
    if (index < 0) {
      this.mySelection.push(this.selectedDocument);
      dataitem.selected = true;
    } else {
      this.mySelection = this.mySelection.filter(x => x !== dataitem);
      dataitem.selected = false;
    }
  }

  IsSelected(dataitem) {
    return (this.mySelection.findIndex(doc => doc === dataitem)) >= 0;
  }
}
