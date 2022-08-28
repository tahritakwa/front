import { ResourceService } from '../../../shared/services/resource/resource.service';
import { StockDocument } from '../../../models/inventory/stock-document.model';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';
import { Operation } from '../../../../COM/Models/operations';
import { Observable } from 'rxjs/Observable';
import { StockDocumentConstant } from '../../../constant/inventory/stock-document.constant';
import { DataSourceRequestState, DataResult } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ObjectToSave, ObjectToSend } from '../../../models/sales/object-to-save.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentLinesWithPaging } from '../../../models/sales/document-lines-with-paging.model';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { StockDocumentLine } from '../../../models/inventory/stock-document-line.model';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
export const linesToAdd = [];
@Injectable()
export class StockDocumentsService extends ResourceService<StockDocument> {

  public currentStockDate = `${this.translate.instant(StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE)}` + new Date();
  public inventoryMovementForm: FormGroup;
  public formGroupFilter: FormGroup;
  public inventoryView: StockDocumentLine[];
  public stockDocument: StockDocument;
  public lineData: any[] = linesToAdd;
  public counter: number = linesToAdd.length;
  public ObjectToSend: any[] = [];
  public FormatNumber = SharedConstant.NUMBER_FORMAT;


  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.FIFTY,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public dailyInventoryColumnsConfig: ColumnSettings[] = [

    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_FIELD_ITEM,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_FIELD_ITEM,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: 350
    },
    {
      field: StockDocumentConstant.WAREHOUSE_NAME,
      title: StockDocumentConstant.ID_WAREHOUSE_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: 180
    },
    {
      field: StockDocumentConstant.SHELF_FIELD,
      title: StockDocumentConstant.SHELF_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: 200
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_AVAILABLEQUANTITY_FIELD,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      format: this.FormatNumber,
      filter: 'numeric'
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_SOLDQUANTITY_FIELD,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_SOLDQUANTITY_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: NumberConstant.ONE_HUNDRED,
      format: this.FormatNumber,
      filter: 'numeric'
    }


  ];

  public inventoryColumnsConfig: ColumnSettings[] = [

    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_FIELD,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_CODE_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: 200
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_FIELD,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_DESCRIPTION_TITLE,
      filterable: true,
      hidden: false,
      editable: false,
      _width: 350
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_FIELD,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_ACTUALQUANTITY_TITLE,
      filterable: false,
      hidden: false,
      editable: false,
      _width: 400
    },
    {
      field: StockDocumentConstant.ID_ITEM_NAVIGATION_FORECASTQUANTITY_FIELD,
      title: StockDocumentConstant.ID_ITEM_NAVIGATION_FORECASTQUANTITY_TITLE,
      filterable: false,
      hidden: false,
      editable: true,
      _width: 120
    }


  ];

  public inventoryGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.dailyInventoryColumnsConfig
  };

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
    public translate: TranslateService) {
    super(httpClient, appConfig, 'stockDocument', 'StockDocument', 'Inventory');
  }

  public LinesToAdd(): any[] {
    return this.lineData;
  }



  OnDestroy() {
    this.lineData = [];
    this.ObjectToSend = [];
    this.counter = NumberConstant.ZERO;
  }

  public removeStockDocumentLines(rowIndex: any): void {
    this.lineData.splice(rowIndex, NumberConstant.ONE);
  }

  public saveStockInventoryDocumentLines(stockDocumentLine: any, isNew: boolean): void {
    if (isNew) {
      stockDocumentLine.IdLine = this.counter++;
      this.lineData.splice(NumberConstant.ZERO, NumberConstant.ZERO, stockDocumentLine);
      this.ObjectToSend.splice(NumberConstant.ZERO, NumberConstant.ZERO, stockDocumentLine);
    } else {
      if (this.lineData.length > NumberConstant.ZERO) {
        Object.assign(
          this.lineData.find(({ IdLine }) => IdLine === stockDocumentLine.IdLine),
          stockDocumentLine
        );
        Object.assign(
          this.ObjectToSend.find(({ IdLine }) => IdLine === stockDocumentLine.IdLine),
          stockDocumentLine
        );
      }
    }
  }

  public saveStockDocumentLines(stockDocumentLine: any, isNew: boolean): void {

    if (isNew) {
      stockDocumentLine.IdLine = this.counter++;
      this.lineData.splice(NumberConstant.ZERO, NumberConstant.ZERO, stockDocumentLine);
      this.ObjectToSend.splice(NumberConstant.ZERO, NumberConstant.ZERO, stockDocumentLine);
    } else {
      if (this.lineData.length > NumberConstant.ZERO) {
        Object.assign(
          this.lineData.find(({ IdLine }) => IdLine === stockDocumentLine.IdLine),
          stockDocumentLine
        );
        Object.assign(
          this.ObjectToSend.find(({ IdLine }) => IdLine === stockDocumentLine.IdLine),
          stockDocumentLine
        );
      }
    }
  }

  public saveStockDocumentLine(stockDocumentLine?: any): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.UPDATE_INVENTORY_DOCUMENT_LINE, stockDocumentLine);
  }

  public GenerateNewStockDocument(route?: string, data?: any): Observable<any> {
    const objectToSave: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, route, objectToSave);
  }

  public GetStockDoucment(data?: any): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.GET_STOCK_DOCUMENT, data);
  }

  public GetStockDocumentLineList(data?: any): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.GET_STOCK_DOCUMENT_LINE_LIST, data);
  }

  public GetStockDailyDocumentLineList(data?: any): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.GET_DAILY_STOCK_DOCUMENT_LINE_LIST, data);
  }

  public GetInventoryDocumentLineList(data?: any): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.GET_INVENTORY_DOCUMENT_LINE_LIST, data);
  }

  public getStockDocumentById(id: any): Observable<any> {
    return this.callService(Operation.GET, StockDocumentConstant.GET_STOCK_DOCUMENT_BY_ID.concat(id));
  }

  public getItemQtyInWarehouse(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, 'getItemQtyInWarehouse', data);
  }

  public validateTransfertMovement(id: number): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.VALIDATE, id);
  }

  public savePlannedInventoryMovement(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.SAVE_PLANNED_INVENTORY, data.Model);
  }

  public validateInventoryDocument(id: number): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.VALIDATE_INVENTORY, id);
  }
  public unvalidateInventoryDocument(id: number): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.UNVALIDATE_INVENTORY, id);
  }

  public transfertValidateStockDocument(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.TRANSFERT, data);
  }

  public receiveValidateStockDocument(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.RECEIVE, data);
  }

  public getItemByBarCodeOrReference(barcodeFilter: any): Observable<any> {
    return super.callService(Operation.POST, StockDocumentConstant.GET_ITEM_TECDOC_BY_REF_OR_BARCODE, barcodeFilter);
  }

  public IsUserInRoleList(stockDocument: StockDocument): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.IS_USER_IN_INVENTORY_LIST_ROLE, stockDocument);
  }
  public saveStockDocumentInRealTime(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, 'insertStockDocumentInRealTime', data);
  }
  public saveStockDocumentLineInRealTime(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, 'insertStockDocumentLineInRealTime', data);
  }

  public removeDocumentLineInRealTime(id: any): Observable<any> {
    return super.callService(Operation.POST, 'deleteLineInRealTime', id);
  }

  public MassPrintInventoryDocs(documentsIds: number[]): Observable<any> {
    return super.callService(Operation.POST, 'massPrintInventoryDocuments', documentsIds);
  }
  public getStockDocumentWithStockDocumentLine(documentLinesWithPaging: DocumentLinesWithPaging): Observable<DataResult> {

    return this.callService(Operation.POST, 'getStockDocumentWithStockDocumentLine', documentLinesWithPaging).map(
      (listObject: any) =>
        <GridDataResult>{
          data: listObject.listData,
          total: listObject.total
        }
    );

  }

  public saveStockDocumentEcommerce(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.SAVE_ECOMMERCE, data);
  }

  public updateStockDocumentEcommerce(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.PUT, StockDocumentConstant.UPDATE_ECOMMERCE, data);
  }



  public getInventoryMovementList(state: DataSourceRequestState,
    predicate?: PredicateFormat, startDate?, endDate?, idWarehouseSource?, status?, idWarehouseDestination?): Observable<any> {
    const pred = this.preparePrediacteFormat(state, predicate);
    return this.callService(Operation.POST, StockDocumentConstant.GET_INVENTORY_MOVEMENT_LIST,
      {
        Predicate: pred, StartDate: startDate, EndDate: endDate, IdWarehouseSource: idWarehouseSource, Status: status,
        IdWarehouseDestination: idWarehouseDestination
      }).map(
        ({ listData, total }: any) =>
          <GridDataResult>{
            data: listData,
            total: total
          }
      ) as Observable<any>;
  }

  public getStockDocumentLineByIdItem(state: DataSourceRequestState,predicate: PredicateFormat): Observable<any>{
    const pred = this.preparePrediacteFormat(state, predicate);
    return this.callService(Operation.POST, 'getStockDocumentLineByIdItem', pred)
    .map(
      ({ listData, total }: any) =>
        <GridDataResult>{
          data: listData,
          total: total
        }
    ) as Observable<any>;
  }

  public downloadJasperReport(dataItem: any): Observable<any> {
    return super.callService(Operation.POST,
      `${StockDocumentConstant.REPORT_ROOT_DOWNLOAD}`, dataItem);
  }

  public validateStorageTransfertMovement(id: number): Observable<any> {
    return this.callService(Operation.POST, StockDocumentConstant.VALIDATE_STORAGE, id);
  }

  public translaiteData(data: any){
    if(data.IdDocumentStatus == documentStatusCode.Provisional){
      data.DocumentStatus =  this.translate.instant('PROVISOIRE')
    }else if(data.IdDocumentStatus == documentStatusCode.Valid){
      data.DocumentStatus =  this.translate.instant('VALID')
    }else{
      data.DocumentStatus =  this.translate.instant('DRAFT')
    }
  }
}
