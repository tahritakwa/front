import {Component, Input, OnInit} from '@angular/core';
import {WarehouseConstant} from '../../../constant/inventory/warehouse.constant';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {WarehouseItemService} from '../../services/warehouse-item/warehouse-item.service';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';

@Component({
  selector: 'app-search-item-warehouse',
  templateUrl: './search-item-warehouse.component.html',
  styleUrls: ['./search-item-warehouse.component.scss']
})
export class SearchItemWarehouseComponent implements OnInit {
  public searchPlaceHolder = WarehouseConstant.SEARCH_ITEM_ARTICLE_PLACEHOLDER;
  @Input() public itemWarehouseSearched: string;
  public predicateFormat: PredicateFormat;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 20,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  /**
   *
   * @param warehouseItemService
   */
  constructor(public warehouseItemService: WarehouseItemService) {
  }


  /**
   * filtre warehouse by item
   */
  filter() {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.itemWarehouseSearched)) {
      this.predicateFormat = new PredicateFormat();
      this.predicateFormat.Filter = new Array<Filter>();
      this.predicateFormat.Relation = new Array<Relation>();
      this.predicateFormat.Filter.push(new Filter(ItemConstant.ID_ITEM_NAVIGATION_CODE, Operation.contains, this.itemWarehouseSearched,
        false, true));
      this.predicateFormat.Relation.push(new Relation(ItemConstant.ID_ITEM_NAVIGATION), new Relation(ItemConstant.ID_WAREHOUSE_NAVIGATION));
      this.warehouseItemService.reloadServerSideDataWithListPredicate(this.gridState, [this.predicateFormat],
        SharedConstant.GET_DATA_WAREHOUSE_WITH_SPECIFIC_FILTER).subscribe(res => {
        this.warehouseItemService.listWarehouseSubject.next([this.itemWarehouseSearched, res.data]);
      });
    } else {
      this.warehouseItemService.listWarehouseSubject.next([SharedConstant.EMPTY, []]);
    }

  }

  ngOnInit() {
  }


}
