import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { AppConfig } from '../../../../COM/config/app.config';
import { ClaimTypeConstant } from '../../../constant/helpdesk/claim-type.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ClaimType } from '../../../models/helpdesk/claim-type.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';

@Injectable()
export class ClaimTypeService extends ResourceService<ClaimType> {
  public ObjectToSend: any[] = [];
  public counter: number = NumberConstant.ZERO;
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, private translate: TranslateService) {
    super(httpClient, appConfig, 'claimtype', 'ClaimType', 'Helpdesk');
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
      field: ClaimTypeConstant.CODE_FIELD,
      title: ClaimTypeConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: ClaimTypeConstant.DATE_FIELD,
      title: ClaimTypeConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: ClaimTypeConstant.CLIENT_FIELD,
      title: ClaimTypeConstant.CLIENT_TITLE,
      filterable: true
    },
    {
      field: ClaimTypeConstant.ID_WAREHOUSE_FIELD,
      title: ClaimTypeConstant.ID_WAREHOUSE_FIELD,
      filterable: true,
    },
    {
      field: ClaimTypeConstant.ID_CLAIM_STATUS_FIELD,
      title: ClaimTypeConstant.ID_CLAIM_STATUS_TITLE,
      filterable: true,
    }
  ];


  // public getClaimTypeList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<DataResult> {
  //   const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
  //   this.prepareServerOptions(state, pred);
  //   return this.callService(Operation.POST, ClaimTypeConstant.GET_CLAIM_TYPE_LIST, pred).map(
  //     ({ listData, total }: any) =>
  //       <GridDataResult>{
  //         data: listData,
  //         total: total
  //       }
  //   );
  // }


  // public GetClaimType(): Observable<any> {
  //   return this.callService(Operation.POST, ClaimTypeConstant.GET_CLAIM_TYPE);
  // }

  // public saveClaimType(data: ObjectToSave): Observable<any> {
  //   return this.callService(Operation.POST, ClaimTypeConstant.SAVE, data.Model);
  // }
  
  // public getClaimTypeById(id: any): Observable<any> {
  //   return this.callService(Operation.GET, ClaimTypeConstant.GET_CLAIM_TYPE_BY_ID.concat(id));
  // }

  // public updateClaimType(data: ObjectToSave): Observable<any> {
  //   return this.callService(Operation.PUT, ClaimTypeConstant.UPDATE, data);
  // }

  // public deleteClaimType(data: ObjectToSave): Observable<any> {
  //   return this.callService(Operation.DELETE, ClaimTypeConstant.DELETE, data);
  // }

  

  OnDestroy() {
    this.ObjectToSend = [];
    this.counter = NumberConstant.ZERO;
  }

}