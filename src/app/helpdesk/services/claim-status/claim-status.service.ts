import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Operation } from '../../../../COM/Models/operations';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ClaimStatusConstant } from '../../../constant/helpdesk/claim-status.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ClaimStatus } from '../../../models/helpdesk/claim-status.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ClaimStatusService extends ResourceService<ClaimStatus> {
  public ObjectToSend: any[] = [];
  public counter: number = NumberConstant.ZERO;
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private translate: TranslateService) {
    super(httpClient, appConfig, 'claimstatus', 'ClaimStatus', 'Helpdesk');
  }


  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: ClaimStatusConstant.CODE_FIELD,
      title: ClaimStatusConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: ClaimStatusConstant.DATE_FIELD,
      title: ClaimStatusConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: ClaimStatusConstant.CLIENT_FIELD,
      title: ClaimStatusConstant.CLIENT_TITLE,
      filterable: true
    },
    {
      field: ClaimStatusConstant.ID_WAREHOUSE_FIELD,
      title: ClaimStatusConstant.ID_WAREHOUSE_FIELD,
      filterable: true,
    },
    {
      field: ClaimStatusConstant.ID_CLAIM_STATUS_FIELD,
      title: ClaimStatusConstant.ID_CLAIM_STATUS_TITLE,
      filterable: true,
    }
  ];


  public getClaimStatusList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<DataResult> {
    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    return this.callService(Operation.POST, ClaimStatusConstant.GET_CLAIM_STATUS_LIST, pred).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }

  public saveClaimStatus(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimStatusConstant.SAVE, data.Model);
  }
  
  public getClaimStatusById(id: any): Observable<any> {
    return this.callService(Operation.GET, ClaimStatusConstant.GET_CLAIM_STATUS_BY_ID.concat(id));
  }

  public updateClaimStatus(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.PUT, ClaimStatusConstant.UPDATE, data);
  }

  public deleteClaimStatus(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.DELETE, ClaimStatusConstant.DELETE, data);
  }

  OnDestroy() {
    this.ObjectToSend = [];
    this.counter = NumberConstant.ZERO;
  }

}