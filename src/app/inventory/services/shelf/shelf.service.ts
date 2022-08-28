import { Inject, Injectable } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { Shelf } from '../../../models/inventory/shelf.model';
import { Subject } from 'rxjs/Subject';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ShelfService extends ResourceService<Shelf> {
  idWarehouseChange: Subject<number> = new Subject<number>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'shelf', 'Shelf', 'Inventory');
  }


  addNewShelfStorage(tecdocwithFilter): Observable<any> {
    return super.callService(Operation.POST, 'createNewShelfStorage', tecdocwithFilter);
  }
  checkShelfAndStorageExistenceInWarehouse(shelf: Shelf): Observable<boolean> {
    return this.callService(Operation.POST, 'checkShelfAndStorageExistenceInWarehouse', shelf) as Observable<boolean>;
  }

}
