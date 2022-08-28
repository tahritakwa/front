import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { AppConfig } from '../../../../COM/config/app.config';
import { Claim } from '../../../models/helpdesk/claim.model';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { Operation } from '../../../../COM/Models/operations';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ClaimConstant } from '../../../constant/helpdesk/claim.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { ClaimQuery } from '../../../shared/utils/dropdown-query';
import { Document } from '../../../models/sales/document.model';
import { ItemPrice } from '../../../models/sales/item-price.model';
import { TranslateService } from '@ngx-translate/core';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Injectable()
export class ClaimService extends ResourceService<Claim> {
  public ObjectToSend: any[] = [];
  public counter: number = NumberConstant.ZERO;
  public enableAllButton: boolean = false;
  public hasSaleDeliveryToUpdate: boolean = false;
  public hasSaleInvoiceToGenerateSaleAsset: boolean = false;
  public hasBSToUpdate: boolean = false;
  public authorizedToUpdate: boolean = true;
  public saleDeliveryDocument: Document = new Document();
  public saleInvoiceDocument: Document = new Document();
  public bSDocumentToUpdate: Document = new Document();
  public disableButtonWhenTreatment: boolean = false;
  public disableOldButton: boolean = true;
  public checkNewButton: boolean = true;
  public hasOnlyOldDocument: boolean = false;
  public saleDocument: Document = new Document();
  public movementDocument: Document = new Document();
  public assetDocument: Document = new Document();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig, public translate: TranslateService) {
    super(httpClient, appConfig, 'claim', 'Claim', 'Helpdesk');
  }


  public setEnableAllButton(state: boolean) {
    this.enableAllButton = state;
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
      field: ClaimConstant.CODE_FIELD,
      title: ClaimConstant.CODE_TITLE,
      filterable: true
    },
    {
      field: ClaimConstant.DATE_FIELD,
      title: ClaimConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },
    {
      field: ClaimConstant.CLIENT_FIELD,
      title: ClaimConstant.CLIENT_TITLE,
      filterable: true
    },
    {
      field: ClaimConstant.ID_WAREHOUSE_FIELD,
      title: ClaimConstant.ID_WAREHOUSE_FIELD,
      filterable: true,
    },
    {
      field: ClaimConstant.ID_CLAIM_STATUS_FIELD,
      title: ClaimConstant.ID_CLAIM_STATUS_TITLE,
      filterable: true,
    }
  ];


  public getClaimList(state: DataSourceRequestState, predicate: PredicateFormat): Observable<DataResult> {
    const pred: PredicateFormat = predicate ? JSON.parse(JSON.stringify(predicate)) : new PredicateFormat();
    this.prepareServerOptions(state, pred);
    return this.callService(Operation.POST, ClaimConstant.GET_CLAIM_LIST, pred).map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    );
  }
  public VerifyExistingPurchaseDocument(predicate: any): Observable<boolean> {
    const pred: any = predicate ? JSON.parse(JSON.stringify(predicate)) : new ClaimQuery();
    return this.callService(Operation.POST, ClaimConstant.VERIFY_EXISTING_PURCHASE_DOCUMENT, pred) as Observable<boolean>;
  }

  public GetBLFromClaimItem(predicate: ClaimQuery): Observable<Document> {
    return this.callService(Operation.POST, ClaimConstant.GET_CLAIM_BL_DROPDOWN_LIST_FROM_CLAIM_ITEM, predicate) as Observable<Document>;
  }

  public GetSIFromClaimItem(predicate: ClaimQuery): Observable<Document> {
    return this.callService(Operation.POST, ClaimConstant.GET_CLAIM_SI_DROPDOWN_LIST_FROM_CLAIM_ITEM, predicate) as Observable<Document>;
  }

  public GetBSFromClaimItem(predicate: ClaimQuery): Observable<Document> {
    return this.callService(Operation.POST, ClaimConstant.GET_CLAIM_BS_DROPDOWN_LIST_FROM_CLAIM_ITEM, predicate) as Observable<Document>;
  }

  public GenerateNewClaim(route?: string, data?: any): Observable<any> {
    return this.callService(Operation.POST, route, data);
  }

  public GetClaim(data?: any): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.GET_CLAIM, data);
  }

  public GetClaimLineList(data?: any): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.GET_CLAIM_LINE_LIST, data);
  }

  public saveClaim(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.INSERT_CLAIM, data);
  }


  public getClaimById(id: any): Observable<any> {
    return this.callService(Operation.GET, ClaimConstant.GET_CLAIM_BY_ID.concat(id));
  }
  public updateClaim(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.UPDATE, data);
  }

  public deleteClaim(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.DELETE, data);
  }

  public addClaimTiersAsset(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.ADD_CLAIM_TIERS_ASSET, data);
  }

  public addClaimStockMovement(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.ADD_CLAIM_STOCK_MOVEMENT, data);
  }

  public addClaimMovement(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, ClaimConstant.ADD_CLAIM_MOVEMENT, data);
  }


  public updateRelatedDocumentToClaim(documentLine: ItemPrice): Observable<any> {
    return super.callService(Operation.POST, 'updateRelatedDocumentToClaim', documentLine, null, null, false);
  }

  public updateRelatedBSToClaim(documentLine: ItemPrice): Observable<any> {
    return super.callService(Operation.POST, 'updateRelatedBSToClaim', documentLine, null, null, false);
  }

  OnDestroy() {
    this.ObjectToSend = [];
    this.counter = NumberConstant.ZERO;
    this.authorizedToUpdate = true;
    this.enableAllButton = false;
    this.hasSaleDeliveryToUpdate = false;
    this.hasSaleInvoiceToGenerateSaleAsset = false;
    this.hasBSToUpdate = false;
    this.saleDeliveryDocument = new Document();
    this.saleInvoiceDocument = new Document();
    this.bSDocumentToUpdate = new Document();
    this.disableButtonWhenTreatment = false;
    this.disableOldButton = false;
    this.checkNewButton = true;
    this.hasOnlyOldDocument = false;
    this.saleDocument = new Document();
    this.movementDocument = new Document();
    this.assetDocument = new Document();
  }
public translaiteData(data:any){
  data.ClaimTypeNavigation.Description = this.translate.instant(data.ClaimTypeNavigation.TranslationCode);
  data.IdClaimStatusNavigation.Label = this.translate.instant(data.IdClaimStatusNavigation.TranslationCode)
}
}
