import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WarehouseService} from '../../services/warehouse/warehouse.service';
import {ListProductsComponent} from '../../../shared/components/item/list-item/list-products.component';
import {WarehouseConstant} from '../../../constant/inventory/warehouse.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-warehouse-items-detail',
  templateUrl: './warehouse-items-detail.component.html',
  styleUrls: ['./warehouse-items-detail.component.scss']
})
export class WarehouseItemsDetailComponent implements OnInit {
  @ViewChild(ListProductsComponent) public listProductsComponent: ListProductsComponent;
  public warehouseId;
  public warehouse;
  public warehouseType;
  public warehouseIcon;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState,
    //columnsConfig: this.columnsConfig,
  };
  /**
   *
   * @param activatedRoute
   * @param warehouseService
   */
  constructor(private activatedRoute: ActivatedRoute, private warehouseService: WarehouseService) {
    this.activatedRoute.params.subscribe(data => {
      this.warehouse = data['id'];
    });
  }

  ngOnInit() {
    this.warehouseService.getWarehouseById(this.warehouse).subscribe(warehouse => {
      this.warehouse = warehouse;
      this.laodWarehouseType(warehouse);
     // this.listProductsComponent.selectedItemToOpen = {'item': this.warehouse};
     // this.listProductsComponent.getPredicateFromAdvancedSearch();
    });
  }

  private laodWarehouseType(warehouse) {
    if (warehouse.IsCentral) {
      this.warehouseType = WarehouseConstant.CENTRAL;
      this.warehouseIcon = WarehouseConstant.FA_UNIVERSITY;
    } else if (warehouse.IsWarehouse) {
      this.warehouseType = WarehouseConstant.WAREHOUSE;
      this.warehouseIcon = WarehouseConstant.FA_BUILDING;
    } else {
      this.warehouseType = WarehouseConstant.ZONE;
      this.warehouseIcon = WarehouseConstant.FA_MAP_MARKER;
    }
  }
}
