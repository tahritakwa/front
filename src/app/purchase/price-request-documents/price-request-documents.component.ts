import { Component, Input, OnInit } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { DocumentEnumerator, documentStatusCode } from '../../models/enumerators/document.enum';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { DocumentConstant } from '../../constant/sales/document.constant';
import { ClaimConstant } from '../../constant/helpdesk/claim.constant';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { StockCorrectionConstant } from '../../constant/stock-correction/stock-correction.constant';
import { DocumentService } from '../../sales/services/document/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { process } from '@progress/kendo-data-query';

const AND = 'and';
const SHOW = '/show/';
const EDIT = '/edit/';

@Component({
  selector: 'app-price-request-documents',
  templateUrl: './price-request-documents.component.html',
  styleUrls: ['./price-request-documents.component.scss']
})
export class PriceRequestDocumentsComponent implements OnInit {

  public statusCode = documentStatusCode;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public tier_Name = 'IdTiersNavigation.Name';
  public status_Label = 'StatusLabel';
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
  associatedDocumentsList = [];
  documentType: string;
  generatedTab: boolean;
  associatedTab: any;
  AllDataList: any[];
  @Input() documentId: number;


  constructor(public documentService: DocumentService, private route: ActivatedRoute, private router: Router) { }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.gridState = state;
    this.initGridDataSource();
  }

  initGridDataSource() {

    this.documentService.getDocumentsAssociatedForPriceRequest(this.documentId).subscribe((data) => {
      if (data) {
        this.associatedDocumentsList = data;
          this.gridSettings.gridData = {
          data: this.associatedDocumentsList,
          total: this.associatedDocumentsList.length
        };
      }
    });
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  showDocument(document) {
    let url;
    // Create Url according to document type
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseDelivery) {
      url = DocumentConstant.PURCHASE_DELIVERY_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesOrder) {
      url = DocumentConstant.SALES_ORDER_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseOrder) {
      url = DocumentConstant.PURCHASE_ORDER_URL;
    } if (document.DocumentTypeCode === DocumentEnumerator.SalesInvoices) {
      url = DocumentConstant.SALES_INVOICE_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseInvoices) {
      url = DocumentConstant.PURCHASE_INVOICE_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesQuotations) {
      url = DocumentConstant.SALES_QUOTATION_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchasesQuotations) {
      url = DocumentConstant.PURCHASE_REQUEST_URL;
    }

    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseRequest) {
      url = DocumentConstant.PURCHASE_REQUEST_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseBudget) {
      url = DocumentConstant.PURCHASE_ORDER_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseFinalOrder) {
      url = DocumentConstant.PURCHASE_FINAL_ORDER_URL;
    } if (document.DocumentTypeCode === DocumentEnumerator.SalesInvoiceAsset) {

      if (document.IsRestaurn) {
        url = DocumentConstant.SALES_INVOICE_ASSEST_REST_URL;
      } else {
        url = DocumentConstant.SALES_INVOICE_ASSEST_URL;
      }
    }

    if (document.DocumentTypeCode === DocumentEnumerator.SalesDelivery) {
      url = DocumentConstant.SALES_DELIVERY_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesAsset) {
      url = DocumentConstant.SALES_ASSET_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseAsset) {
      url = DocumentConstant.PURCHASE_ASSET_URL;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.BE) {
      url = StockCorrectionConstant.BE_URL_LIST;
    }
    if (document.DocumentTypeCode === DocumentEnumerator.BS) {
      url = StockCorrectionConstant.BS_URL;
    }
    if (document.IdDocumentStatus != documentStatusCode.Provisional && document.IdDocumentStatus != documentStatusCode.DRAFT &&
      document.DocumentTypeCode != DocumentEnumerator.PurchaseRequest) {
      url = url.concat(SHOW);
    } else {
      url = url.concat(EDIT);
    }
    if (document.DocumentTypeCode === DocumentEnumerator.PurchaseBudget) {
      //window.open(url.concat( this.idParentDocument).concat('/').concat(document.IdDocumentStatus), "_blank");
    } else if (document.DocumentTypeCode === DocumentEnumerator.PurchaseRequest) {
      window.open(url.concat(document.Id), "_blank");
    } else {
      window.open(url.concat(document.Id).concat('/').concat(document.IdDocumentStatus), "_blank");
    }

  }

}
