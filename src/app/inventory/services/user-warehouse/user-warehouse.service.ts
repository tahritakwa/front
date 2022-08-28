import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "../../../../COM/config/app.config";
import { Operation } from "../../../../COM/Models/operations";
import { UserWarehouse } from "../../../models/inventory/user-warehouse.model";
import { ResourceService } from "../../../shared/services/resource/resource.service";

@Injectable()
export class UserWarehouseService extends ResourceService<UserWarehouse> {
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'userWarehouse', 'UserWarehouse', 'Inventory');
  }
  public updateUserWarehouse(email : string, idWarehouse : number): Observable<any> {
    const dataToSend = {
      'email': email,
      'idWarehouse': idWarehouse
  };
    return this.callService(Operation.POST, 'updateUserWarehouse', dataToSend);
  }

  public getWarehouse(email : string): Observable<any> {
    return this.callService(Operation.POST, 'getWarehouse', email);
  }
}
