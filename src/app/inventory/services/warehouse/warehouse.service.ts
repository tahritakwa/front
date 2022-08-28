import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {ResourceService} from '../../../shared/services/resource/resource.service';
import {Warehouse} from '../../../models/inventory/warehouse.model';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {WarehouseConstant} from '../../../constant/inventory/warehouse.constant';
import {Subject} from 'rxjs/Subject';
import { ObjectToSave } from '../../../models/shared/objectToSend';

@Injectable()
export class WarehouseService extends ResourceService<Warehouse> {
  public warehouseSaveOperationChange: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'warehouse', 'Warehouse', 'Inventory');
  }

  public getWarehouseList(searchWarehouse?: string): Observable<any> {
    const objectToSave: ObjectToSave = new ObjectToSave();
    objectToSave.Model = searchWarehouse;
    return this.callService(Operation.POST, 'getWarehouseList',objectToSave) as Observable<any>;;
  }

  public getCentralWarehouse(): Observable<Warehouse> {
    return this.callService(Operation.GET, 'getCentralWarehouse') as Observable<Warehouse>;
  }

  public getShelfByWarehouse(idWarehouse: Number): Observable<any> {
    return this.callService(Operation.GET, `${WarehouseConstant.GET_SHELF_BY_WAREHOUSE_API}${idWarehouse}`) as Observable<any>;
  }

  public getWarehouseById(idWarehouse: Number): Observable<any> {
    return this.callService(Operation.GET, `${WarehouseConstant.GET_BY_ID_API}${idWarehouse}`) as Observable<any>;
  }

  checkWarehouseNameExistence(warehouse: Warehouse): Observable<boolean> {
    return this.callService(Operation.POST, WarehouseConstant.CHECK_WAREHOUSE_NAME_EXISTENCE, warehouse) as Observable<boolean>;
  }
}
