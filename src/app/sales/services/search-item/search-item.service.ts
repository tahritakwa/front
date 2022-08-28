import { Injectable, Inject, EventEmitter } from '@angular/core';
import { SearchItemSupplier } from '../../../models/sales/search-item-supplier.model';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { SearchItem } from '../../../models/sales/search-item.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { SearchItemObjectToSave } from '../../../models/sales/search-item-obecjt-to-send.model';
import { Observable } from 'rxjs/Observable';
import { Operation } from '../../../../COM/Models/operations';
import { HttpClient } from '@angular/common/http';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { DocumentService } from '../document/document.service';
import { SearchItemToGenerateDoc } from '../../../models/sales/search-item-to-generate-document';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { Subject } from 'rxjs/Subject';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { ObjectToSave, ObjectToSend } from '../../../models/sales/object-to-save.model';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Injectable()
export class SearchItemService extends ResourceService<SearchItem> {
  public isFromSearchItem_supplierInetrface = false;
  public idSupplier: number;
  public typeSupplier: number;
  public idDocument: number;
  public idProvision: number;
  public closeFetchProductsModalSubject = new Subject();
  public itemForGarageSubject = new Subject();
  public openedModalOptions: Partial<IModalDialogOptions<any>>;
  public supplierName: string;
  public valueSearch: SearchItemSupplier;
  public disableFields = true;
  public url: string;
  public isForPurchase: boolean;
  public isFromHandlerChange = false;
  public code: string;
  public searchItemDocumentType: string;
  public isMoadlBtnFocus: boolean;
  public destroySearchModal = new EventEmitter();
  public loadItems = new EventEmitter();
  public isModalClose: boolean;
  public isClosed: boolean;
  public isInDocument: boolean;
  public idWarehouse: number;
  public hideDocumentDetail: boolean;
  public serviceHasEmitData: boolean;
  public isModal: boolean;
  public statusDocument: number;
  public idSelectedSalesPrice: number ;
  public idSelectedVehicle: number;
  /**
   *constructor
   */
  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig,
              private localStorageService : LocalStorageService, private swalWarrings: SwalWarring) {
    super(httpClient, appConfig, 'searchItem', 'SearchItem', 'Sales');
  }
  public addSearch(data: SearchItemObjectToSave): Observable<any> {
    return this.callService(Operation.POST, 'addSearch', data);
  }
  public getSearchedSuppliers(data: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, 'getSearchedSuppliers', data);
  }
  public getSerachDetailPeerSupplier(data: PredicateFormat): Observable<any> {
    return this.callService(Operation.POST, 'getSerachDetailPeerSupplier', data);
  }
  public setSearchValues(idSupplier: number) {
    this.idSupplier = idSupplier;
  }
  public setIsFromSearchItem_supplierInetrface(isFromSearchItem_supplierInetrface: boolean) {
    this.isFromSearchItem_supplierInetrface = isFromSearchItem_supplierInetrface;
  }
  public generateDocument(searchItemToGenerateDoc: SearchItemToGenerateDoc): Observable<any> {
    return this.callService(Operation.POST, 'generateDocument', searchItemToGenerateDoc);
  }
  public insertUpdateDocumentLine(searchItemToGenerateDoc: SearchItemToGenerateDoc): Observable<any> {
    return this.callService(Operation.POST, 'insertUpdateDocumentLine', searchItemToGenerateDoc);
  }
  public checkRealAndProvisionalStock(searchItemToGenerateDoc: SearchItemToGenerateDoc): Observable<any> {
    return this.callService(Operation.POST, 'checkRealAndProvisionalStock', searchItemToGenerateDoc);
  }
  public tiersDetails(idTiers: number): Observable<any> {
    return this.callService(Operation.POST, 'tiersDetails/' + idTiers);
  }

  public isValidDocument(idDocument: number): Observable<any> {
    return this.callService(Operation.POST, 'isValidDocument/' + idDocument);
  }
  public saveSearch(valueSearch: SearchItemSupplier): SearchItemObjectToSave {
    let searchItemObjectToSave = new SearchItemObjectToSave();
    searchItemObjectToSave.IdCashier = this.localStorageService.getUserId();
    searchItemObjectToSave.IdTiers = this.idSupplier;
    searchItemObjectToSave.SearchItemSupplierViewModel = valueSearch;
    return searchItemObjectToSave;
  }
  public saveStockDocumentLineInRealTime(data: ObjectToSave): Observable<any> {
    return this.callService(Operation.POST, 'insertStockDocumentLineInRealTime', data);
  }
  addDocument(IdItemSelected, QuantityForDocumentLine, idWarehouse, selectedType?: string) {
    selectedType = this.searchItemDocumentType ? this.searchItemDocumentType : selectedType;
    const searchItemToGenerateDoc: SearchItemToGenerateDoc =
      new SearchItemToGenerateDoc(IdItemSelected,
        this.idDocument, QuantityForDocumentLine, this.idSupplier, idWarehouse, selectedType);
    // case update documnet
    if (this.idDocument) {
      // if in document no need to create a new document if the document is valid
      if (this.isInDocument) {
        this.insertDocLineOperations(searchItemToGenerateDoc);
      } else {
        this.createNewDocumentIfCurrentDocumentIsValid(searchItemToGenerateDoc);
      }
      // case add new document
    } else {
      this.generateDocumentOperations(searchItemToGenerateDoc);
    }
  }

  private createNewDocumentIfCurrentDocumentIsValid(searchItemToGenerateDoc: SearchItemToGenerateDoc) {
    this.isValidDocument(this.idDocument).subscribe(isValid => {
      if (isValid.objectData) {
        this.generateDocumentOperations(searchItemToGenerateDoc);
      } else {
        this.insertDocLineOperations(searchItemToGenerateDoc);
      }
    });
  }

  public generateDocumentOperations(searchItemToGenerateDoc: SearchItemToGenerateDoc) {
    if (searchItemToGenerateDoc.DocumentTypeCode === DocumentEnumerator.SalesQuotations) {
      this.url = DocumentConstant.SALES_QUOTATION_URL;
    } else {
      this.url = DocumentConstant.SALES_DELIVERY_URL;
    }
    if(searchItemToGenerateDoc.DocumentTypeCode === DocumentEnumerator.SalesDelivery &&  this.idSelectedVehicle ){
      searchItemToGenerateDoc.IdVehicle = this.idSelectedVehicle;
    }
    this.generateDocument(searchItemToGenerateDoc).subscribe(x => {
      this.statusDocument = documentStatusCode.Provisional;
      searchItemToGenerateDoc.IdDocument = x.Id;
      this.setDocumentData(x.Id, x.Code);
      if (!this.isModalClose) {
        this.isModalClose = true;
      }
      this.insertDocLineOperations(searchItemToGenerateDoc);
    });
  }
  private setDocumentData(idDocument, Code) {
    this.idDocument = idDocument;
    this.code = Code;
  }
  public insertDocLineOperations(searchItemToGenerateDoc: SearchItemToGenerateDoc) {
    this.checkRealAndProvisionalStock(searchItemToGenerateDoc).subscribe(isAvailableOnlyInProvisionalStock => {
      if (isAvailableOnlyInProvisionalStock &&  this.statusDocument === 1) {
        // check if the user want to use provisional stock (to reserve quantity)
        this.swalWarrings.CreateSwal(DocumentConstant.DO_YOU_WANT_TO_RESERVE_QUANTITY_FROM_INCOMING_ORDERS,
          DocumentConstant.ORDER_IN_PROGRESS_BUT_NO_REAL_STOCK_AVAILABLE,
          DocumentConstant.YES,
          DocumentConstant.NO).then((result) => {
            if (result.value) {
              searchItemToGenerateDoc.IsValidReservationFromProvisionalStock = true;
            }
            this.insertDocLine(searchItemToGenerateDoc);
          });
      } else {
        this.insertDocLine(searchItemToGenerateDoc);
      }
    });
  }
  private insertDocLine(searchItemToGenerateDoc: SearchItemToGenerateDoc) {
    this.insertUpdateDocumentLine(searchItemToGenerateDoc).subscribe(x => {
      if (!this.hideDocumentDetail) {
        this.serviceHasEmitData = false;
        this.loadItems.emit(this.idDocument);
      }
    });
  }

  public destroyModal() {
    this.serviceHasEmitData = false;
    this.destroySearchModal.emit(this.idDocument);
  }
  public setWarehouse(idWarehouse: number) {
    this.idWarehouse = idWarehouse;
  }
  closeModalAction(setAllToUdefined?: boolean) {
    if (this.hideDocumentDetail) {
      this.code = undefined;
      this.idDocument = undefined;
    }
    if (!this.isInDocument || setAllToUdefined) {
      this.isMoadlBtnFocus = false;
      this.isModalClose = true;
    }
  }
}
