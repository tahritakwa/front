import { Component, OnInit, Input } from '@angular/core';
import { DataSourceRequestState, FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { MovementHistoryConstant } from '../../constant/inventory/movement-history.constant';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { MovementHistoryService } from '../services/movement-history/movement-history.service';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { MovementHistory } from '../../models/inventory/movement-history.model';
import { FormGroup } from '@angular/forms';
import { Filter, Operation, Operator } from '../../shared/utils/predicate';
import { filter } from '@progress/kendo-data-query/dist/npm/transducers';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { operators } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-movement-history',
  templateUrl: './movement-history.component.html',
  styleUrls: ['./movement-history.component.scss']
})
export class MovementHistoryComponent implements OnInit {
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  // pager settings
  public pagerSettings: PagerSettings = MovementHistoryConstant.PAGER_SETTINGS;
  /**
* Grid state
*/
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 20,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  @Input() itemFormGroup: FormGroup;
  @Input() isModalHtml: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: MovementHistoryConstant.SUPPLIER_CODE_FIELD,
      title: MovementHistoryConstant.SUPPLIER_CODE_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: MovementHistoryConstant.ITEM_CODE_FIELD,
      title: MovementHistoryConstant.ITEM_CODE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.ITEM_DESIGNATION_FIELD,
      title: MovementHistoryConstant.ITEM_DESIGNATION_TITLE,
      filterable: true,
      _width: 400
    },
    {
      field: MovementHistoryConstant.DOCUMENT_TYPE_FIELD,
      title: MovementHistoryConstant.DOCUMENT_TYPE_TITLE,
      filterable: true,
      _width: 120
    },
    {
      field: MovementHistoryConstant.CUSTOMER_CODE_FIELD,
      title: MovementHistoryConstant.CUSTOMER_CODE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.CUSTOMER_NAME_FIELD,
      title: MovementHistoryConstant.CUSTOMER_NAME_TITLE,
      filterable: true,
      _width: 400
    },
    {
      field: MovementHistoryConstant.DATE_FIELD,
      title: MovementHistoryConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 120
    },
    {
      field: MovementHistoryConstant.ORDER_FIELD,
      title: MovementHistoryConstant.ORDER_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.QUANTITY_FIELD,
      title: MovementHistoryConstant.Quantity_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.PUHT_FIELD,
      title: MovementHistoryConstant.PUHT_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: MovementHistoryConstant.PUHT1_FIELD,
      title: MovementHistoryConstant.PUHT1_TITLE,
      filterable: true,
      _width: 160
    },
    {
      field: MovementHistoryConstant.PRICE_FIELD,
      title: MovementHistoryConstant.PRICE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.DISCOUNT_FIELD,
      title: MovementHistoryConstant.DISCOUNT_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.IS_PURCHASE_FIELD,
      title: MovementHistoryConstant.IS_PURCHASE_TITLE,
      filterable: true,
      _width: 150
    },
    {
      field: MovementHistoryConstant.FISCAL_YEAR_FIELD,
      title: MovementHistoryConstant.FISCAL_YEAR_TITLE,
      filterable: true,
      _width: 120
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  data = [{label : "TOUT" , value : null},
  {label : "Vente" , value : 0},{label : "Achat" , value : 1}]
  selectedTypeValue = null;
  constructor(public movementHistoryService: MovementHistoryService, private translate: TranslateService) { }

  ngOnInit() {
    this.initGridDataSource();
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
  * Init grid with data from the datasource
  */
  initGridDataSource() {
    if (this.isModalHtml) {
      const filters = [
        {
          field: 'IdItem', operator: 'eq', value: this.itemFormGroup.value['IdItem']
        },
        {
          field: 'Date', operator: 'gte', value: this.itemFormGroup.value['StartDate']
        },
        {
          field: 'Date', operator: 'lte', value: this.itemFormGroup.value['EndDate']
        }
      ];
      this.gridSettings.state.filter.filters = this.gridSettings.state.filter.filters.concat(filters);
    }
    this.movementHistoryService.reloadServerSideData(this.gridSettings.state, undefined, undefined, undefined, true).subscribe(data =>{

      this.gridSettings.gridData = data;
    }
    );
    if (this.isModalHtml) {
      this.gridSettings.state.filter.filters = this.gridSettings.state.filter.filters.slice
        (0, this.gridSettings.state.filter.filters.length - 3);
    }
    // this.movementHistoryService.getMovementHistoryList(this.gridSettings.state, this.predicate).subscribe(data =>
    //   this.gridSettings.gridData = data
    // );

  }

  changeDate(date) {

    let state: any = this.gridSettings.state;

    let filterDate: any = state.filter.filters.find((x: any) => x.field == 'Date');
    if (!filterDate) {
      state.filter.filters.push({
        field: 'Date',
        operator: 'gte',
        value: date
      });
    }
    else {
      filterDate.value = date;
      let index = state.filter.filters.findIndex((x: any) => x.field == 'Date');
      state.filter.filters[index] = filterDate;
    }

    this.dataStateChange(state);
  }

  ValueChange(){
    let state: any = this.gridSettings.state;
    let filterType: any 
    state.filter.filters = state.filter.filters.filter(x =>x.field != 'IsPurchase' && x.field != 'IsSale')
    if(this.selectedTypeValue!= null && this.selectedTypeValue.value == 0 ){
      state.filter.filters.push({
        field: 'IsSale',
        operator: 'eq',
        value: true
      });
    }
    else if(this.selectedTypeValue!= null && this.selectedTypeValue.value == 1){
      state.filter.filters.push({
        field: 'IsPurchase',
        operator: 'eq',
        value: true
      });
    }
    this.dataStateChange(state);
  }
}
