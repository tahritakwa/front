import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { MovementHistory } from '../../../models/inventory/movement-history.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { Observable } from 'rxjs';
import { DataResult } from '@progress/kendo-data-query';
import { Operation } from '../../../../COM/Models/operations';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MovementHistoryConstant } from '../../../constant/inventory/movement-history.constant';

@Injectable()
export class MovementHistoryService extends ResourceService<MovementHistory> {

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'movementHistory', 'MovementHistory', 'Inventory');
  }

  public getMovementHistoryList(movementHistory: MovementHistory): Observable<DataResult> {

    return this.callService(Operation.POST, MovementHistoryConstant.GET_MOVEMENT_HISTORY_LIST, movementHistory).map(
      (listObject: any) =>
        <GridDataResult>{
          data: listObject.listData,
          total: listObject.total
        }
    );

  }

}
