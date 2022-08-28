import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ItemWarehouse } from '../../../models/inventory/item-warehouse.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
let data: any;
@Injectable()
export class WarehouseItemService extends ResourceService<ItemWarehouse> {
  public listWarehouseSubject: Subject<any> = new Subject<any>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'itemWarehouse', 'ItemWarehouse', 'Inventory');
  }
  public getStorage(itemWarehouse: ItemWarehouse): Observable<any> {
    return super.callService(Operation.POST, 'getStorageDataSourceFromWarhouse', itemWarehouse, null, false, false);
  }
  public getShelf(idWarehouse: number): Observable<any> {
    return super.callService(Operation.POST, 'getShelfDataSourceFromWarhouse', idWarehouse, null, false, false);
  }
  public generateItemsFromShelfAndStorage(stateSort , itemWarehouseViewModel: ItemWarehouse): Observable<any> {
    let state = null;
    if(stateSort){
      state = this.preparePrediacteFormat(stateSort);
    }
      data = {
        state: state,
        itemWarehouseViewModel: itemWarehouseViewModel
      }

    return super.callService(Operation.POST, 'generateItemsFromShelfAndStorage', data, null, false, false);
  }
  public ChangeItemStorage(itemWarehouseViewModel: Array<any>): Observable<any> {
    return super.callService(Operation.POST, 'ChangeItemStorage', itemWarehouseViewModel, null, false, false);
  }
  public ChangeOneItemtorage(itemWarehouseViewModel: any): Observable<any> {
    return super.callService(Operation.POST, 'ChangeOneItemtorage', itemWarehouseViewModel, null, false, false);
  }
  public getItemWarehouseData(itemWarehouseViewModel: ItemWarehouse): Observable<any> {
    return super.callService(Operation.POST, 'getItemWarehouseData', itemWarehouseViewModel, null, false, false);
  }
}
