import { Component, OnInit, ComponentRef } from '@angular/core';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { PagerSettings, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { ColumnSettings } from '../../../utils/column-settings.interface';
import { GridSettings } from '../../../utils/grid-settings.interface';
import { ClaimConstant } from '../../../../constant/helpdesk/claim.constant';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { DocumentEnumerator, documentStatusCode } from '../../../../models/enumerators/document.enum';
import { PredicateFormat, Filter, Relation, Operation } from '../../../utils/predicate';
import { ActivatedRoute, Router } from '@angular/router';
import { process } from '@progress/kendo-data-query';
import { StockCorrectionConstant } from '../../../../constant/stock-correction/stock-correction.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';

const AND = 'and';
const SHOW = '/show/';
const EDIT = '/edit/';

@Component({
  selector: 'app-documents-associated',
  templateUrl: './documents-associated.component.html',
  styleUrls: ['./documents-associated.component.scss']
})
export class DocumentsAssociatedComponent implements OnInit, IModalDialog {
  isModal;
  selectedDocument: any;
  options: Partial<IModalDialogOptions<any>>;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  associatedTab = false;
  generatedTab = true;
  public predicate: PredicateFormat;
  public statusCode = documentStatusCode;
  public pageSize = 40;
  documentType;
  generatedDocumentsList;
  associatedDocumentsList;
  public showType = false ;
  public showRegion = false ;
  public tier_Name ='TierName';
  public status_Label ='StatusLabel';
  public tier_Region ='TierRegion' ;
  public idParentDocument;
  public permissionDoc ;
  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  /**
     * Grid columns proprety
     */
  public columnsConfig: ColumnSettings[] = [
    {
      field: this.tier_Name,
      title: DocumentConstant.SUPPLIER,
      filterable: true,
      _width: 90
    },
    {
      field: DocumentConstant.DOCUMENT_DATE,
      title: DocumentConstant.DATE,
      filterable: true,
      format: ClaimConstant.DOCUMENT_FORMAT,
      _width: 90
    },
    {
      field: DocumentConstant.CODE,
      title: DocumentConstant.CODE,
      filterable: true,
      _width: 80
    },
    {
      field: DocumentConstant.DPCUMENT_HTTPRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_HT,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 110
    },
    {
      field: DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY,
      title: DocumentConstant.AMOUNT_TTC,
      filterable: false,
      format: DocumentConstant.FORMAT_NUMBER,
      _width: 110
    },
    {
      field: this.status_Label,
      title: DocumentConstant.STATUS,
      filterable: true,
      _width: 90
    },
    {
      field: DocumentConstant.VALIDATOR_NAME,
      title: DocumentConstant.USER,
      filterable: true,
      _width: 130
    },
    {
      field: this.tier_Region,
      title: DocumentConstant.REGION,
      filterable: true,
      _width: 90
    },
  ];
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: AND,
      filters: []
    }
  };
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public AllDataList: any[] = [];
  constructor(public modalService: ModalDialogInstanceService, public documentService: DocumentService, private route: ActivatedRoute, 
    private router: Router, public authService: AuthService) {
  }
  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.selectedDocument = this.options.data.dataItem;
    this.documentType = this.selectedDocument.DocumentTypeCode;
  }
  public isSalesDocument: boolean;

  ngOnInit() {
    if (this.documentType === this.documentEnumerator.BS) {
      this.associatedTab = false;
      this.generatedTab = true;
    }
    if ( this.documentType === this.documentEnumerator.SalesOrder ) {
      this.showRegion= true ;
    }
    if (this.documentType === this.documentEnumerator.SalesDelivery ) {
      this.showType= true ;
    }
    this.preparePredicate();
    this.isSalesDocument = this.documentType === this.documentEnumerator.SalesInvoices ||
      this.documentType === this.documentEnumerator.SalesQuotations ||
      this.documentType === this.documentEnumerator.SalesDelivery ||
      this.documentType === this.documentEnumerator.SalesAsset ||
      this.documentType === this.documentEnumerator.SalesOrder;
    this.initGridDataSource();
  }

  initGridDataSource() {
    
    this.documentService.getDocumentsAssociated(this.predicate).subscribe((data) => {
      if (data) {
        this.associatedDocumentsList = data.AssociatedDocuments;
        this.generatedDocumentsList = data.GeneratedDocuments;
        this.idParentDocument = data.IdParentDocument;
        if (this.documentType === this.documentEnumerator.BS || this.generatedTab) {
          this.gridSettings.gridData = {
            data: this.generatedDocumentsList,
            total: this.generatedDocumentsList.length
          };
        }else if (this.associatedTab) {
          this.gridSettings.gridData = {
            data: this.associatedDocumentsList,
            total: this.associatedDocumentsList.length
          };
        } 
        this.AllDataList = this.gridSettings.gridData.data;
        const listData = Object.assign([], this.AllDataList);
        this.gridSettings.gridData = process(listData, this.gridState);
      }
    });
  }
  selectAssociatedTab() {
    this.showType = false; 
    this.showRegion = false;
    if (this.documentType === this.documentEnumerator.BS || this.documentType === this.documentEnumerator.SalesInvoices ) {
      this.showRegion= true ;
    }
    if (this.documentType === this.documentEnumerator.SalesAsset ) {
      this.showType= true ;
    }
    this.associatedTab = true;
    this.generatedTab = false;
    this.initGridDataSource();
  }
  selectGeneratedTab() {
    this.showType = false; 
    this.showRegion = false;
    if (this.documentType === this.documentEnumerator.SalesOrder) {
      this.showRegion= true ;
    }
    if (this.documentType === this.documentEnumerator.SalesDelivery) {
      this.showType= true ;
    }
    this.associatedTab = false;
    this.generatedTab = true;
   this.initGridDataSource();
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT, Operation.eq, this.selectedDocument.Id, false, true));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(DocumentConstant.ID_TIER_NAVIGATION)]);

  }
  /**
 * Data changed listener
 * @param state
 */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.gridState = state;
    this.initGridDataSource()
  }

  showDocument(document) {
    let url;
    // Create Url according to document type
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseDelivery) {
      url = DocumentConstant.PURCHASE_DELIVERY_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesOrder) {
      url = DocumentConstant.SALES_ORDER_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ORDER_SALES : PermissionConstant.CommercialPermissions.UPDATE_ORDER_SALES;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseOrder) {
      url = DocumentConstant.PURCHASE_ORDER_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE;
    } if (document.DocumentTypeCode === DocumentEnumerator.SalesInvoices) {
      url = DocumentConstant.SALES_INVOICE_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES : PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) {
      url = DocumentConstant.PURCHASE_INVOICE_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_INVOICE_PURCHASE;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesQuotations) {
      url = DocumentConstant.SALES_QUOTATION_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_QUOTATION_SALES : PermissionConstant.CommercialPermissions.UPDATE_QUOTATION_SALES;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchasesQuotations) {
      url = DocumentConstant.PURCHASE_REQUEST_URL;
    }

    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseRequest) {
      url = DocumentConstant.PURCHASE_REQUEST_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_PURCHASE_REQUEST : PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_REQUEST;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseBudget) {
      url = DocumentConstant.PURCHASE_ORDER_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseFinalOrder) {
      url = DocumentConstant.PURCHASE_FINAL_ORDER_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE;
    } if (document.DocumentTypeCode === DocumentEnumerator.SalesInvoiceAsset) {
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES : PermissionConstant.CommercialPermissions.UPDATE_INVOICE_ASSET_SALES
      if (document.IsRestaurn) {
        url = DocumentConstant.SALES_INVOICE_ASSEST_REST_URL;
      } else {
        url = DocumentConstant.SALES_INVOICE_ASSEST_URL;
      }
    } 

    if (document.DocumentTypeCode === DocumentEnumerator.SalesDelivery) {
      url = DocumentConstant.SALES_DELIVERY_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES : PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesAsset) {
      url = DocumentConstant.SALES_ASSET_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ASSET_SALES : PermissionConstant.CommercialPermissions.UPDATE_ASSET_SALES;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseAsset) {
      url = DocumentConstant.PURCHASE_ASSET_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE : PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.BE) {
      url = StockCorrectionConstant.BE_URL_LIST;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_ADMISSION_VOUCHERS : PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.BS) {
      url = StockCorrectionConstant.BS_URL;
      this.permissionDoc = document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT ? 
      PermissionConstant.CommercialPermissions.SHOW_EXIT_VOUCHERS : PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS;
    }
    if (document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT &&
      document.DocumentTypeCode != DocumentEnumerator.PurchaseRequest) {
      url = url.concat(SHOW);
    } else {
      url = url.concat(EDIT);
    }
    if(this.authService.hasAuthority(this.permissionDoc)){
      
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseBudget) {
    window.open(url.concat( this.idParentDocument).concat('/').concat(document.IdDocumentStatus), "_blank");
    }else if (document.DocumentTypeCode === DocumentEnumerator.PurchaseRequest) {
      window.open(url.concat(document.Id), "_blank");
    }else{
      window.open(url.concat(document.Id).concat('/').concat(document.IdDocumentStatus), "_blank");
    }
  }

  }

  showDocument1(document) {
    let url: string
    if (document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT) {
      url = '/'.concat(DocumentConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    } else {
      url = '/'.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    }
    if (this.isModal) {
      window.open(DocumentConstant.SALES_DELIVERY_URL.concat(url));
    } else {
      this.router.navigate(['.' + url], { relativeTo: this.route });
    }
  }
}
