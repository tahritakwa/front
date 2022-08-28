import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WarehouseService} from '../../services/warehouse/warehouse.service';
import {TranslateService} from '@ngx-translate/core';
import {WarehouseItemService} from '../../services/warehouse-item/warehouse-item.service';
import {Subscription} from 'rxjs/Subscription';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { WarehouseCentralComponent } from '../warehouse-central/warehouse-central.component';

@Component({
  selector: 'app-warehouse-org',
  templateUrl: './warehouse-org.component.html',
  styleUrls: ['./warehouse-org.component.scss']
})
export class WarehouseOrgComponent implements OnInit, OnDestroy {
  /**
   * list of central warehouse
   */
  public listWarehousesCentral = [];
  private subscription$: Subscription;
  public itemWarehouseSearched = SharedConstant.EMPTY;

  @ViewChild('WarehouseCentral') warehouseCentral : WarehouseCentralComponent;
  /**
   *
   * @param warehouseService
   * @param warehouseItemService
   * @param translate
   */
  @HostListener('document:click')
  clickout() {
    if (this.warehouseCentral && this.warehouseCentral.isVisibleAllShelf) {
      this.warehouseCentral.isVisibleAllShelf = false;
    }
  }
  constructor(private warehouseService: WarehouseService, private warehouseItemService: WarehouseItemService, public translate: TranslateService) {
      }

  handleSaveWarehouseOperationEvent() {
    this.subscription$ = this.warehouseService.warehouseSaveOperationChange.subscribe(data => {
      if (data) {
        this.initGridDataSource();
      }
    });
  }

  /**
   * Retreive the data from the server
   */
  initGridDataSource(searchWarehouse?) {
    this.subscription$ = this.warehouseService.getWarehouseList(searchWarehouse).subscribe(warehousesCentrals => {
        this.listWarehousesCentral = warehousesCentrals;
        this.itemWarehouseSearched = searchWarehouse;
      }
    );
  }

  handleWarehouseSearch() {
    this.subscription$ = this.warehouseItemService.listWarehouseSubject.subscribe(data => {
      if (data && data[NumberConstant.ONE].length > NumberConstant.ZERO) {
        this.listWarehousesCentral = data[NumberConstant.ONE];
      } else if (data && data[NumberConstant.ONE].length === NumberConstant.ZERO &&
        data[NumberConstant.ZERO] !== SharedConstant.EMPTY) {
        this.listWarehousesCentral[NumberConstant.ZERO].Items = [];
      } else {
        this.initGridDataSource();
      }
      this.itemWarehouseSearched = data[NumberConstant.ZERO];
    });
  }

  ngOnInit() {
    this.handleWarehouseSearch();
    this.handleSaveWarehouseOperationEvent();
    this.initGridDataSource();
  }

  ngOnDestroy(): void {
    this.warehouseService.warehouseSaveOperationChange.observers.forEach(value => value.complete());
    this.subscription$.unsubscribe();
  }

}
