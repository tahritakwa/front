import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DataStateChangeEvent, GridComponent, PagerSettings, SelectableSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import {
  DocumentEnumerator,
  documentStateCode,
  documentStatusCode,
  documentStatusCodeToSearch,
  DocumentTypesEnumerator
} from '../../../../models/enumerators/document.enum';
import { Observable } from 'rxjs/Observable';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../utils/column-settings.interface';
import { GridSettings } from '../../../utils/grid-settings.interface';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalWarring } from '../../swal/swal-popup';
import { ListDocumentService } from '../../../services/document/list-document.service';
import { DocumentLineService } from '../../../../sales/services/document-line/document-line.service';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from '../../../services/file/file-service.service';
import { MessageService } from '../../../services/signalr/message/message.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { FormModalDialogService } from '../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClaimConstant } from '../../../../constant/helpdesk/claim.constant';
import { ClaimService } from '../../../../helpdesk/services/claim/claim.service';
import { StarkPermissionsService, StarkRolesService } from '../../../../stark-permissions/stark-permissions.module';
import { isNotNullOrUndefinedAndNotEmptyValue, notEmptyValue } from '../../../../stark-permissions/utils/utils';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { Currency } from '../../../../models/administration/currency.model';
import { DocumentsAssociatedComponent } from '../documents-associated/documents-associated.component';
import { MassValidationComponent } from '../mass-validation/mass-validation.component';
import { RoleConfigConstant } from '../../../../Structure/_roleConfigConstant';
import { TiersConstants } from '../../../../constant/purchase/tiers.constant';
import { InformationTypeEnum } from '../../../services/signalr/information/information.enum';
import { DailySalesDeliveryReportQueryViewModel } from '../../../../models/sales/daily-sales-delivery-report-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { EcommerceProductService } from '../../../../ecommerce/services/ecommerce-product/ecommerce-product.service';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { MediaConstant } from '../../../../constant/utility/Media.constant';
import { SearchDocumentComponent } from '../search-document/search-document.component';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../../constant/shared/fieldType.constant';
import { CounterSalesConstant } from '../../../../constant/sales/counter-sales.constant';
import swal from 'sweetalert2';

const EMPTY_STRING = '';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public formatDateFilter = this.translate.instant(SharedConstant.FORMAT_DATE_PLACEHOLDER);
  @Input() documentType;
  @Input() advencedAddLink;
  @Input() translateFilterName;
  @Input() filterList: Array<documentStatusCode>;
  @Input() isRestaurn = false;
  /**
   * property to initialize Tier filter in advenced search
   */
  @Input() idSelectedTier;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('massValidation') public massValidation: MassValidationComponent;
  @ViewChild(SearchDocumentComponent) searchDocumentComponent: SearchDocumentComponent;
  public statusCode = documentStatusCode;
  private hasTermBillingRol = false;
  dataToUpdate: Observable<any>;
  filterValueProvisional: string;
  filteredData;
  isFiltredByProvCode = false;
  disableProvCode: boolean;
  @Input() containerRef;
  /**
   * Grid state proprety
   */
  public gridState: DataSourceRequestState = this.documentListService.gridState;
  @Input() isFromDeliveryModal: boolean;

  /**
   * Select grid settings
   */
  public selectableSettings: SelectableSettings;
  /**
   * Grid columns proprety
   */
  public columnsConfig: ColumnSettings[] = this.documentListService.columnsConfig;
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = this.documentListService.gridSettingsDocList;
  public excelGridSettings : GridSettings = this.documentListService.excelGridSettings;

  public isSalesDelivery = false;
  // choosenFilter name proprety
  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;

  public dataToSave: any[];
  massiveValidationOpen = false;
  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();

  public documentsIdsSelected: number[] = [];
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public AlldocumentsIds: number[] = [];
  TermFailed = true;
  @Input() statusList;
  public selectedRow;
  public haveCancelOrderRole = false;
  public deliveryRole = false;
  @ViewChild('closebutton1') closebutton1;

  public numberOfFailedDelivery = 0;
  companycurrency: ReducedCurrency;
  public formatFoSalesOptions;
  public isSalesDocument = false;
  public DetailsModal = false;
  selectedDocument: any;
  options;
  public haveTermBillingRole = false;
  //  /**
  // * Grid state
  // */
  public claimGridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public claimColumnsConfig: ColumnSettings[] = [
    {
      field: ClaimConstant.CODE_FIELD,
      title: ClaimConstant.CODE_TITLE,
      filterable: true,
      _width: 80
    },
    {
      field: ClaimConstant.DATE_FIELD,
      title: ClaimConstant.DATE_TITLE,
      filterable: true,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 90
    },
    {
      field: ClaimConstant.CLIENT_FIELD,
      title: ClaimConstant.CLIENT_TITLE,
      filterable: true,
      _width: 100
    },
    {
      field: ClaimConstant.ID_ITEM_NAVIGATION_DESIGNATION_FIELD,
      title: ClaimConstant.ITEM_TITLE,
      filterable: true,
      _width: 90
    },
    {
      field: ClaimConstant.ID_WAREHOUSE_FIELD,
      title: ClaimConstant.ID_WAREHOUSE_TITLE,
      filterable: true,
      _width: 60
    },
    {
      field: ClaimConstant.ID_CLAIM_TYPE_FIELD,
      title: ClaimConstant.ID_CLAIM_TYPE_TITLE,
      filterable: true,
      _width: 60
    },
    {
      field: ClaimConstant.ID_CLAIM_STATUS_FIELD,
      title: ClaimConstant.ID_CLAIM_STATUS_TITLE,
      filterable: true,
      _width: 90
    },
    {
      field: ClaimConstant.SUPPLIER_FIELD,
      title: ClaimConstant.SUPPLIER_TITLE,
      filterable: true,
      _width: 90
    },
    {
      field: ClaimConstant.IsBToB,
      title: ClaimConstant.IsBToB,
      hidden: true,
      filterable: false,
      _width: 60
    }
  ];

  // Grid settings
  public claimGridSettings: GridSettings = {
    state: this.claimGridState,
    columnsConfig: this.claimColumnsConfig
  };
  isModal = false;
  tableHeight: number;
  public checkDeleteDocRole = false;
  // Predicates proprety
  private predicateAdvancedSearch: PredicateFormat;
  private predicateQuickSearch: PredicateFormat;
  private predicateDocumentType: PredicateFormat;
  public predicateDocument: PredicateFormat[] = [];
  // Filtre config
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];
  public docListFormGroup: FormGroup;
  /**
   * flag to identify the searchType
   * advanced search = 0 ,quick search = 1
   */
  public searchType = NumberConstant.ONE;
  private startDate;
  private endDate;
  private status;
  private idTiers;
  public fileName: string;
  public checkDeleteDocPermission = false;
  public checkAddDocPermission = false;
  public checkUpdateDocPermission = false;
  public checkShowDocPermission = false;
  public checkListDocPermission = false;
  public checkUpdateValidDoc = false;
  public checkPrintDeliverySales = false;
  public listOrdersBToB = false;
  public synchronizaOrdersBToB = false;
  public selectedIdTiers : number;
  public isVisibleGenerateInvoiceButton = false;
  public isVisibleSelectAll = true;
  public invoiceGeneratedCode;
  public invoiceGeneratedId;



  constructor(public documentService: DocumentService, private router: Router, private swalWarrings: SwalWarring,
    public documentListService: ListDocumentService, private service: DocumentLineService,
    private messageService: MessageService, private viewRef: ViewContainerRef, public intl: IntlService,
    private modalService: ModalDialogInstanceService, public claimService: ClaimService,
    private formModalDialogService: FormModalDialogService, private growlService: GrowlService,
    private permissionsService: StarkPermissionsService, private rolesService: StarkRolesService,
    private translate: TranslateService, private route: ActivatedRoute, private fileService: FileService, public fb: FormBuilder,
    protected serviceComany: CompanyService, public ecommerceProductService: EcommerceProductService ,public authService: AuthService,
    private localStorageService : LocalStorageService) {
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.loadDocPermission()
    this.predicateAdvancedSearch = PredicateFormat.prepareDocumentPredicateWithSpecificFiltre(this.isRestaurn, this.idSelectedTier);
    this.predicateQuickSearch = PredicateFormat.prepareDocumentPredicateWithSpecificFiltre(this.isRestaurn, this.idSelectedTier);
    this.predicateDocumentType = PredicateFormat.prepareDocumentTypePredicate(this.documentType);
    this.predicateDocumentType.Filter.push(new Filter(DocumentConstant.ISRESTAURN, Operation.eq, this.isRestaurn));
    if( this.documentType === DocumentEnumerator.SalesDelivery){
      this.isVisibleSelectAll = false;
      this.predicateDocumentType.Relation.push(new Relation(DocumentConstant.ID_SESSION_COUNTER_SALES_NAVIGATION));
    }
    this.isSalesDoucment();
    this.isSalesDelivryDocument();
    this.getSelectedCurrency();
    this.choosenFilter = this.documentListService.getChoosenFilter(this.translateFilterName);
    this.gridSettings.state.skip = 0;
    this.gridSettings.state.filter.filters = [];
    this.gridSettings.state.sort = [];
    this.gridSettings.gridData = {
      data: [],
      total: 0
    };
    if (this.documentType === this.documentEnumerator.SalesQuotations) {
      this.fileName = this.translate.instant('DISPLAY_DEVIS');
    }
    if (this.documentType === this.documentEnumerator.SalesOrder || this.documentType === this.documentEnumerator.PurchaseOrder) {
      this.fileName = this.translate.instant("SALES_ORDER_LIST");
    }
    if (this.documentType === this.documentEnumerator.SalesDelivery) {
      this.fileName = this.translate.instant("DELIVERY_FORMS_LIST");
    }
    if (this.documentType === this.documentEnumerator.SalesInvoices || this.documentType === this.documentEnumerator.PurchaseInvoices) {
      this.fileName = this.translate.instant("INVOICE_LIST");
    }
    if (this.documentType === this.documentEnumerator.SalesAsset || this.documentType === this.documentEnumerator.PurchaseAsset) {
      this.fileName = this.translate.instant("ASSET_LIST");
    }
    if (this.documentType === this.documentEnumerator.SalesInvoiceAsset) {
      this.fileName = this.translate.instant("ASSET_LIST");
    }
    if (this.documentType === this.documentEnumerator.PurchaseFinalOrder) {
      this.fileName = this.translate.instant("PURCHASE_FINAL_ORDER_LIST");
    }
    if (this.documentType === this.documentEnumerator.PurchaseDelivery) {
      this.fileName = this.translate.instant("PURCHASE_DELIVERY_LIST");
    }
    if (this.documentType === this.documentEnumerator.BE) {
      this.fileName = this.translate.instant("BE_LIST");
    }
    if (this.documentType === this.documentEnumerator.BS) {
      this.fileName = this.translate.instant("BS_LIST");
    }
    if (this.isSalesDocument) {
      this.excelGridSettings.columnsConfig[NumberConstant.ZERO].title = DocumentConstant.CLIENT;
    } else {
      this.excelGridSettings.columnsConfig[NumberConstant.ZERO].title = DocumentConstant.SUPPLIER;
    }
    //this.loadDeleteDocRole();
    this.deliveryRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELIVER_DELIVERY_SALES);
    this.haveCancelOrderRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.CANCEL_ORDER_SALES);
    this.haveTermBillingRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_TERM_BILLING);
    this.prepareClaimsPredicate();
    this.predicateDocument.push(this.predicateDocumentType);
    this.initGridDataSource();
    this.initDocumentFiltreConfig();
  }

  public loadDocPermission() {
    // sales doc permissions
    if (this.documentType === this.documentEnumerator.SalesQuotations) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_QUOTATION_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_QUOTATION_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_QUOTATION_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_QUOTATION_SALES);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_SALES);
    } else if (this.documentType === this.documentEnumerator.SalesOrder) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ORDER_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ORDER_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ORDER_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ORDER_SALES);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_QUOTATION_SALES)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES);
      this.checkUpdateValidDoc = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_ORDER_SALES);
      this.listOrdersBToB = this.authService.hasAuthority(PermissionConstant.BToBPermissions.LIST_ORDERS_BTOB);
      this.synchronizaOrdersBToB = this.authService.hasAuthority(PermissionConstant.BToBPermissions.SYNCHRONIZATION_ORDERS_BTOB);
    } else if (this.documentType === this.documentEnumerator.SalesDelivery) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_DELIVERY_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_SALES)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES);
      this.checkPrintDeliverySales = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_DELIVERY_SALES);
      this.checkUpdateValidDoc = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_DELIVERY_SALES);
    } else if (this.documentType === this.documentEnumerator.SalesInvoices) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_INVOICE_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVOICE_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_DELIVERY_SALES)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ASSET_SALES);
    } else if (this.documentType === this.documentEnumerator.SalesAsset) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ASSET_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ASSET_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ASSET_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ASSET_SALES);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_SALES)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES);
      this.checkUpdateValidDoc = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_ASSET_SALES);
    } else if (this.documentType === this.documentEnumerator.SalesInvoiceAsset && !this.isRestaurn) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_INVOICE_ASSET_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVOICE_ASSET_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_ASSET_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_ASSET_SALES);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ASSET_SALES);
    } else if (this.documentType === this.documentEnumerator.SalesInvoiceAsset && this.isRestaurn) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_FINANCIAL_ASSET_SALES);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_FINANCIAL_ASSET_SALES);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_FINANCIAL_ASSET_SALES);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_FINANCIAL_ASSET_SALES);
    } else if (this.documentType === this.documentEnumerator.PurchaseOrder) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions
        .DELETE_ORDER_QUOTATION_PURCHASE);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ORDER_QUOTATION_PURCHASE);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions
        .UPDATE_ORDER_QUOTATION_PURCHASE);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseFinalOrder) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_FINAL_ORDER_PURCHASE);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_FINAL_ORDER_PURCHASE);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ORDER_QUOTATION_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseDelivery) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_RECEIPT_PURCHASE);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_RECEIPT_PURCHASE)
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_FINAL_ORDER_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseInvoices) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_INVOICE_PURCHASE);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_INVOICE_PURCHASE);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_PURCHASE);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_PURCHASE);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_ASSET_PURCHASE)
        || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_RECEIPT_PURCHASE);
    } else if (this.documentType === this.documentEnumerator.PurchaseAsset) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ASSET_PURCHASE);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ASSET_PURCHASE);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE);
      this.checkListDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_PURCHASE);
    } else if (this.documentType == this.documentEnumerator.BE) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ADMISSION_VOUCHERS);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ADMISSION_VOUCHERS);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ADMISSION_VOUCHERS);

    } else if (this.documentType == this.documentEnumerator.BS) {
      this.checkDeleteDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_EXIT_VOUCHERS);
      this.checkAddDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_EXIT_VOUCHERS);
      this.checkUpdateDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS);
      this.checkShowDocPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_EXIT_VOUCHERS);
    }
  }

  private isSalesDelivryDocument() {
    this.isSalesDelivery = this.documentType === DocumentEnumerator.SalesDelivery;
  }

  public loadDeleteDocRole() {
    if (this.documentType === DocumentEnumerator.BE || this.documentType === DocumentEnumerator.BS) {
      this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
        this.rolesService.hasOnlyRoles(RoleConfigConstant.DELETEDOCUMENTSTOCKCONFIG)
          .then(x => {
            this.checkDeleteDocRole = x;
          });
      });

    } else if (this.documentType === DocumentEnumerator.SalesInvoices || this.documentType === DocumentEnumerator.SalesQuotations
      || this.documentType === DocumentEnumerator.SalesDelivery || this.documentType === DocumentEnumerator.SalesAsset
      || this.documentType === DocumentEnumerator.SalesOrder || this.documentType === DocumentEnumerator.SalesInvoiceAsset) {
      this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
        this.rolesService.hasOnlyRoles(RoleConfigConstant.DELETEDOCUMENTSALESCONFIG)
          .then(x => {
            this.checkDeleteDocRole = x;
          });
      });
    } else {
      this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
        this.rolesService.hasOnlyRoles(RoleConfigConstant.DELETEDOCUMENTPURCHASECONFIG)
          .then(x => {
            this.checkDeleteDocRole = x;
          });
      });
    }
  }

  searchClick() {
    this.searchType = NumberConstant.ZERO;
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
    this.prepareJasperReportParams();
  }

  /**
   * preapre jasper params from advanced search filtre component
   * @private
   */
  private prepareJasperReportParams() {
    const idStatus = this.predicateAdvancedSearch.Filter.find(value => value.prop === DocumentConstant.ID_DOCUMENT_STATUS);
    const idTiers = this.predicateAdvancedSearch.Filter.find(value => value.prop === DocumentConstant.ID_TIER);
    const startDate = this.predicateAdvancedSearch.Filter.find(value => value.prop === DocumentConstant.DOCUMENT_DATE && value.operation === Operation.gte);
    const endDate = this.predicateAdvancedSearch.Filter.find(value => value.prop === DocumentConstant.DOCUMENT_DATE && value.operation === Operation.lte);
    this.status = idStatus ? idStatus.value : NumberConstant.MINUS_ONE;
    this.idTiers = idTiers ? idTiers.value : NumberConstant.MINUS_ONE;
    this.startDate = startDate ? startDate.value : NumberConstant.MINUS_ONE;
    this.endDate = endDate ? endDate.value : NumberConstant.MINUS_ONE;
  }

  initGridDataSource(isQuickSearch?) {
    this.grid.loading = true
    this.filteredData = [];
    this.columnsConfig = this.documentListService.getColumnsConfig(this.documentType);
    if(this.idSelectedTier){
      this.predicateDocument[0].Filter.push(new Filter(DocumentConstant.ID_TIER, Operation.eq, this.idSelectedTier));
    }
    if(this.isFromDeliveryModal){
      this.predicateDocument[0].Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, documentStatusCodeToSearch.Valid));
    }
    this.documentService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateDocument,
      DocumentConstant.GET_DATASOURCE_WITH_SPECIFC_PREDICATE, false).subscribe((res :any) => {
        this.gridSettings.gridData = res;

        // get  picture
        if (res) {
          const data = res.data || res.listData;
          this.loadItemsPicture(data);
          data.forEach(product => {
            product.imageTiers = MediaConstant.PLACEHOLDER_PICTURE;
          });
        }

        this.getAllDocumentsIdsFromServer(res.data);
        this.grid.loading = false
      });

    this.documentListService.idClient = 0;

    if (this.isSalesDelivery) {
      this.documentService.getFailedSalesDeliveryCount().subscribe(res => {
        this.numberOfFailedDelivery = res.total;
      });
    }
  }


  private loadItemsPicture(doclist: any[]) {
    var tiersPicturesUrls = [];
    doclist.forEach((doc: any) => {
      tiersPicturesUrls.push(doc.PictureUrlTiers);
    });
    if (tiersPicturesUrls.length > NumberConstant.ZERO) {
      this.documentService.getPictures(tiersPicturesUrls, false).subscribe(tierssPictures => {
        this.fillItemsPictures(doclist, tierssPictures);
      });
    }
  }

  private fillItemsPictures(doclist, itemsPictures) {
    doclist.map((doc: any) => {
      if (doc.PictureUrlTiers) {
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === doc.PictureUrlTiers);
        if (dataPicture) {
          doc.imageTiers = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }



  cancelDocument(data) {
    var text ;
    if(data && data.IdSalesDepositInvoice){
      this.documentService.checkOrderToCancel(data.Id).subscribe(result=> {
        if(result){
          if(result.CodeInvoice && result.IdInvoiceStatus && result.IdInvoiceStatus == documentStatusCode.Provisional){
            text= this.translate.instant('A_STANDARD_INVOICE')+ " "+result.CodeInvoice + " "+ this.translate.instant('ASSOCIATED_WILL_BE_DELETED');
          }else if(result.CodeInvoice && result.IdInvoiceStatus && result.IdInvoiceStatus != documentStatusCode.Provisional){
            this.growlService.ErrorNotification(this.translate.instant("CANNOT_CANCEL_ORDER"));
          }else if(!result.CodeInvoice && result.IdDepositInvoiceStatus && result.IdDepositInvoiceStatus == documentStatusCode.Provisional){
            text= this.translate.instant('A_DEPOSIT_INVOICE')+ " "+result.CodeDepositInvoice + " "+ this.translate.instant('ASSOCIATED_WILL_BE_DELETED');
          }else if(!result.CodeInvoice && result.IdDepositInvoiceStatus && result.IdDepositInvoiceStatus != documentStatusCode.Provisional){
            text= this.translate.instant('A_DEPOSIT_INVOICE')+ " "+result.CodeDepositInvoice + " "+ this.translate.instant('ASSOCIATED_DEPOSIT_INVOICE');
          }
          const title = this.translate.instant(DocumentConstant.TITLE_SWAL_CANCEL_SALES_ORDER_DOCUMENT);
        this.swalWarrings.CreateSwal(text, title).then((result) => {
          if(result.value){
            this.documentService.cancelDocument(data.Id).subscribe(() => {
              this.initGridDataSource(true);
            });
          }
        });
        }
      });
    }else
    {
      text = this.translate.instant(DocumentConstant.TEXT_SWAL_CANCEL_SALES_ORDER_DOCUMENT);
    const title = this.translate.instant(DocumentConstant.TITLE_SWAL_CANCEL_SALES_ORDER_DOCUMENT);
    this.swalWarrings.CreateSwal(text, title).then((result) => {
      if (result.value) {
        this.documentService.cancelDocument(data.Id).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }
  }

/**
 * Cancel order btob
 * @param id
 */
  cancelOrderBtobDocument(id: number) {
    const text = this.translate.instant(DocumentConstant.TEXT_SWAL_CANCEL_SALES_ORDER_DOCUMENT_BTOB);
    const title = this.translate.instant(DocumentConstant.TITLE_SWAL_CANCEL_SALES_ORDER_DOCUMENT_BTOB);
    const text_Swal = this.translate.instant(DocumentConstant.TEXT_SWAL_CANCEL_BL_DOCUMENT_BTOB);
    const title_Swal = this.translate.instant(DocumentConstant.TITLE_SWAL_CANCEL_BL_DOCUMENT_BTOB);
    this.documentService.ExistingBLToBToBOrder(id).subscribe(x => {
      if (x.objectData === false) {
    this.swalWarrings.CreateSwal(text, title).then((result) => {
      if (result.value) {
        this.documentService.CanceledOrderBtobFromStark(id).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  } else {
    this.swalWarrings.CreateSwal(text_Swal, title_Swal).then((result) => {
      if (result.value) {
        this.documentService.CanceledOrderBtobFromStark(id).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }
});
  }
  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    const isQuickSearch = this.searchType === NumberConstant.ONE;
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource(isQuickSearch);
  }

  private prepareClaimsPredicate(): void {
    if (this.documentType === this.documentEnumerator.SalesAsset || this.documentType === this.documentEnumerator.PurchaseAsset) {
      const claimNavigation = 'ClaimIdAssetDocumentNavigation.';
      const relations = [new Relation('ClaimIdAssetDocumentNavigation'),
      new Relation(claimNavigation + ClaimConstant.ID_CLAIM_STATUS_NAVIGATION),
      new Relation(claimNavigation + ClaimConstant.ID_CLAIM_TYPE_NAVIGATION),
      new Relation(claimNavigation + ClaimConstant.ID_WAREHOUSE_NAVIGATION),
      new Relation(claimNavigation + ClaimConstant.ID_CLIENT_NAVIGATION),
      new Relation(claimNavigation + ClaimConstant.ID_ITEM_NAVIGATION),
      new Relation(claimNavigation + 'IdDocumentNavigation'),
      new Relation(claimNavigation + 'IdDocumentLineNavigation'),
      new Relation(claimNavigation + 'ClaimInteraction')];
      this.predicateAdvancedSearch.Relation.push.apply(this.predicateAdvancedSearch.Relation, relations);
      this.predicateQuickSearch.Relation.push.apply(this.predicateQuickSearch.Relation, relations);
    }
  }

  showDocument(document) {
    let url: string;
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

  public setDocumentDelivered(document) {
    if (document.IdInvoiceEcommerce) {
      this.ecommerceProductService.AddTotalShipmentFromMagento(document).subscribe((data) => {
        if (data) {
          this.initGridDataSource();
        }
      });
    } else {
      this.documentService.setDocumentDelivered(document).subscribe(() => {
        this.initGridDataSource();
      });
    }
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(DocumentConstant.DOCUMENT_DELETE_TEXT_MESSAGE,
      DocumentConstant.DOCUMENT_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.documentService.removeDocument(dataItem).subscribe((data) => {
            this.initGridDataSource(true);
          });
        }
      });
  }

  /**
   *  retrieve the list of documents ids by type
   */
  getAllDocumentsIdsFromServer(data) {
    this.AlldocumentsIds = [];
    if (!isNullOrUndefined(data)) {
      this.AlldocumentsIds = data.map(element => element.Id);
    }
  }

  /**
   * check the state of the select all checkbox in the kendo grid
   */
  public onSelectedKeysChange(e) {
    const len = this.documentsIdsSelected.length;
    if (len === 0) {
      if( this.documentType === DocumentEnumerator.SalesDelivery){
        this.isVisibleGenerateInvoiceButton = false;
        this.isVisibleSelectAll = false;
      }
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
      this.idSelectedTier = undefined;
      this.predicateDocumentType = undefined;
      this.predicateDocumentType = PredicateFormat.prepareDocumentTypePredicate(this.documentType);
      this.predicateDocumentType.Filter.push(new Filter(DocumentConstant.ISRESTAURN, Operation.eq, this.isRestaurn));
      this.resetClickEvent();
    } else if (len > 0 && len < this.AlldocumentsIds.length) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
      if( this.documentType === DocumentEnumerator.SalesDelivery){
        this.isVisibleGenerateInvoiceButton = true;
        this.isVisibleSelectAll = true;
      }
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
      if( this.documentType === DocumentEnumerator.SalesDelivery){
        this.isVisibleGenerateInvoiceButton = true;
        this.isVisibleSelectAll = true;
      }
    }
    // initGridDataSource for the first check and the last unchek
    if(this.documentType === this.documentEnumerator.SalesDelivery && len === 1){
      if(!this.idSelectedTier || (this.idSelectedTier !== e)){
        this.idSelectedTier = this.gridSettings.gridData.data.filter(doc => doc.Id === e[0])[0].IdTiers;
        this.initGridDataSource();
      }
    }
  }

  /**
   * this method aims to select all elements of the grid or deselect it
   */
  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.documentsIdsSelected = Object.assign([], this.AlldocumentsIds);
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    } else {
      this.documentsIdsSelected = [];
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    }
  }

  /**
   *Download files of selected document
   * */
  public downloadSelectedFiles() {
    if (this.documentsIdsSelected.length === 0) {
      this.growlService.ErrorNotification(this.translate.instant('NO_SELECtED_LINE'));

    } else {
      this.documentService.downloadZipFile(this.documentsIdsSelected, 'downloadZipFileDocument').subscribe((res) => {
        if (res.objectData.Name) {
          this.fileService.downLoadFile(res.objectData);
        } else {
          this.growlService.ErrorNotification(this.translate.instant('SELECTED_LINES'));
        }
      });

    }
  }

  /**
   * TODO : condition isClientFiltred ---> to be verifed
   * @param isClientFiltred
   */
  searchDocuments(isClientFiltred?: boolean) {
    this.predicateAdvancedSearch = PredicateFormat.prepareDocumentPredicateWithSpecificFiltre(false);
    /*  if (isClientFiltred) {
        this.docListFormGroup.controls['IdTiers'].setValue(this.documentListService.idClient);
        this.docListFormGroup.controls['Status'].setValue(documentStatusCode.Valid);
        const currentMonth = new Date().getMonth() + 1;
        this.predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, documentStatusCode.Valid));
        this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_DATE_Month, Operation.eq, currentMonth));
      }*/
    this.initGridDataSource();
  }

  clickSearch() {
    this.gridSettings.state.skip = 0;
    this.searchDocuments();
  }

  /// Print Report Telerik
  printDocument() {
    const idtiers = this.docListFormGroup.controls['IdTiers'].value;
    const idstatus = this.docListFormGroup.controls['Status'].value;
    const startdate = this.docListFormGroup.controls['StartDate'].value;
    const enddate = this.docListFormGroup.controls['EndDate'].value;
    const queryvm = new DailySalesDeliveryReportQueryViewModel();
    queryvm.ListTiers = idtiers;
    queryvm.StartDate = startdate;
    queryvm.EndDate = enddate;
    queryvm.IdStatus = idstatus;
    if (this.isSalesDelivery) {
      const dataToSend = {
        'idtiers': isNullOrUndefined(idtiers) ? -1 : idtiers,
        'idstatus': isNullOrUndefined(idstatus) ? -1 : idstatus,
        'startdate': startdate ? new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate()) : undefined,
        'enddate': enddate ? new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate()) : undefined,
        'printType': NumberConstant.MINUS_ONE,
        'reportName': DocumentConstant.DAILY_SALES_DELIVERY_DETAILED_REPORT_NAME
      };
      this.downloadReport(dataToSend);
      // this.formModalDialogService.openDialog(null, ReportingInModalComponent, this.viewRef, null, dataToSend, null,
      //   SharedConstant.MODAL_DIALOG_SIZE_ML);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  /// Print Report Jasper
  printJasperDocument(event: any) {
    const idtiers = this.idTiers;
    const idstatus = this.status;
    const startdate = this.startDate;
    const enddate = this.endDate;
    const queryvm = new DailySalesDeliveryReportQueryViewModel();
    queryvm.ListTiers = idtiers;
    queryvm.StartDate = startdate;
    queryvm.EndDate = enddate;
    queryvm.IdStatus = idstatus;
    if (this.isSalesDelivery) {
      const params = {
        'idtiers': isNullOrUndefined(idtiers) ? NumberConstant.MINUS_ONE : idtiers,
        'idstatus': isNullOrUndefined(idstatus) || idstatus==documentStatusCode['DRAFT'] ? NumberConstant.MINUS_ONE : idstatus,
        'startdate': startdate && startdate!=-1 ? new Date(startdate).getFullYear() +
          ',' + (new Date(startdate).getMonth() + NumberConstant.ONE) + ',' + new Date(startdate).getDate() : NumberConstant.MINUS_ONE,
        'enddate': enddate && enddate!=-1 ? new Date(enddate).getFullYear() + ',' +
          (new Date(enddate).getMonth() + NumberConstant.ONE) + ',' + new Date(enddate).getDate() : NumberConstant.MINUS_ONE
      };
      const dataToSend = {
        'documentName': DocumentConstant.BL_STATE,
        'reportName': event === 'DETAILED' ?
          DocumentConstant.DAILY_SALES_DELIVERY_DETAILED_REPORT_NAME : DocumentConstant.DAILY_SALES_DELIVERY_LISTED_REPORT_NAME,
        'reportFormatName': DocumentConstant.PDF,
        'printCopies': NumberConstant.ONE,
        'printType': NumberConstant.MINUS_ONE,
        'reportType': DocumentConstant.PDF,
        'reportparameters': params
      };
      this.downloadJasperReport(dataToSend);
    } else {
      this.messageService.startSendMessage(null, InformationTypeEnum.INVENTORY_INVENTORY_MVT_PRINT_REPORT, null, false);
    }
  }

  /// Download Report Telerik
  public downloadReport(dataItem): void {
    this.documentService.downloadDailySalesDeliveryReport(dataItem).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      });
  }

  /// Download Report Jasper
  public downloadJasperReport(dataItem): void {
    this.documentService.downloadJasperReport(dataItem).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      });
  }

  /** show quantity details*/
  documentRowDetails($event) {
    this.selectedRow = $event;
  }


  /**
   * Data changed listener
   * @param state
   */
  public claimDataStateChange(state: DataStateChangeEvent): void {
    this.claimGridSettings.state = state;
    this.claimService.getClaimList(state, this.predicateQuickSearch).subscribe(
      data => this.claimGridSettings.gridData = data
    );
  }


  getSelectedCurrency() {
      this.formatFoSalesOptions = {
        style: 'currency',
        currency: this.localStorageService.getCurrencyCode(),
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
  }

  getDetailsModal(dataItem) {
    const data = { dataItem: dataItem };
    const modalTitle = this.translate.instant('DETAILS');
    this.formModalDialogService.openDialog(modalTitle, DocumentsAssociatedComponent,
      this.viewRef, this.ClosedetailsModal.bind(this), data, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  ClosedetailsModal() {
    this.DetailsModal = false;

  }

  closeMassValidation() {
    this.massiveValidationOpen = false;
    const DocumentList = this.massValidation.mySelection;
    this.documentService.massValidate(DocumentList).subscribe(() => {
      this.initGridDataSource(true);
    });
    this.closebutton1.nativeElement.click();
  }

  openMassiveValidation() {
    this.massiveValidationOpen = true;

  }

  public showDownloadDataButton(): boolean {
    return (this.documentType === this.documentEnumerator.PurchaseAsset || this.documentType === this.documentEnumerator.PurchaseInvoices
      || this.documentType === this.documentEnumerator.PurchaseDelivery) && this.documentsIdsSelected.length !== 0;
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initDocumentFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(DocumentConstant.STATUS, FieldTypeConstant.documentStatusComponent,
      DocumentConstant.ID_DOCUMENT_STATUS, false, SharedConstant.EMPTY, SharedConstant.EMPTY,
      SharedConstant.EMPTY, SharedConstant.EMPTY, this.documentType));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(DocumentConstant.CODE_TITLE, FieldTypeConstant.TEXT_TYPE,
      DocumentConstant.CODE));
      if(this.isSalesDocument){
    this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.BILLING_METHOD, FieldTypeConstant.CATEGORY_COMPONENT_DROPDOWN,
      TiersConstants.TIER_CATEGORY_NAVIGATION_ID_DOC));
    }
    this.filtreFieldsInputs.push(new FiltrePredicateModel(FieldTypeConstant.USER,
      FieldTypeConstant.userDropdownComponent, DocumentConstant.ID_CREATOR));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(DocumentConstant.AMOUNT_TTC, FieldTypeConstant.numerictexbox_type,
      DocumentConstant.DOCUMENT_TTC_PRICE_WITH_CURRENCY));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(DocumentConstant.AMOUNT_HT, FieldTypeConstant.numerictexbox_type,
      DocumentConstant.DOCUMENT_HT_PRICE_WITH_CURRENCY));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(DocumentConstant.DOCUMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE,
      DocumentConstant.DOCUMENT_DATE));
    this.initTiersConfig();
    this.initInvoiceTypeDropDownConfig();
  }

  private initTiersConfig() {
    if (!this.idSelectedTier) {
      if (!this.isSalesDocument) {
        this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.SUPPLIER, FieldTypeConstant.supplierComponent, DocumentConstant.ID_TIER));
      } else {
        this.filtreFieldsColumns.push(new FiltrePredicateModel(TiersConstants.CUSTOMER, FieldTypeConstant.customerComponent, DocumentConstant.ID_TIER));
      }
    }
  }

  private initInvoiceTypeDropDownConfig() {
    if (this.isSalesInvoiceDocument()) {
      this.filtreFieldsInputs.push(new FiltrePredicateModel(DocumentConstant.TYPE_TITLE, FieldTypeConstant.invoiceTypeDropdownComponent, DocumentConstant.INVOICING_TYPE));
    }
  }

  public isSalesInvoiceDocument() {
    return this.documentType === this.documentEnumerator.SalesInvoices;
  }

  /**
   * get array<Filtre> from advancedSearchComponenet
   * remove old filter property from the predicate filter list
   * case filtre type date between
   * @param filtre
   */
  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.predicateDocument = [];
    this.predicateDocument.push(this.predicateDocumentType);
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateDocument.push(this.mergefilters());
  }

  mergefilters() {
    let predicate = new PredicateFormat();
     if (this.predicateAdvancedSearch) {
       this.cloneAdvancedSearchPredicate(predicate);
     }
    if (this.predicateQuickSearch.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.predicateQuickSearch.Filter);
    }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat){
    targetPredicate.Filter = this.predicateAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateAdvancedSearch.values;
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.predicateAdvancedSearch.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.predicateAdvancedSearch.SpecFilter = this.predicateAdvancedSearch.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @private
   * @param filtreFromAdvSearch
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    let isDefaultCodeField = this.predicateAdvancedSearch.Filter.filter(value => value.prop == DocumentConstant.CODE).length == NumberConstant.ZERO ? true : false;
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    }
    else if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
      this.setStatusEcommerceFiltrePredicate(filtreFromAdvSearch);
    }
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  /**
   * Reset dataGrid filtrestartSendMessage
   */
  resetClickEvent() {
    this.predicateAdvancedSearch = PredicateFormat.prepareDocumentPredicateWithSpecificFiltre(this.isRestaurn);
    this.predicateQuickSearch.Filter = [];
    this.searchDocumentComponent.documentSearch = SharedConstant.EMPTY;
    this.searchType = NumberConstant.ONE;
    this.gridSettings.state.skip = 0;
    this.predicateDocument = [];
    this.predicateDocument.push(this.predicateDocumentType);
    //this.predicateDocument.push(this.mergefilters());
    this.initGridDataSource(true);
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicateDocument = [];
    this.predicateDocument.push(this.predicateDocumentType);
    if (isQuickSearch) {
      this.gridState.filter.logic = SharedConstant.LOGIC_OR;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_OR;
      this.predicateDocument.push(this.predicateQuickSearch);
    } else {
      this.predicateAdvancedSearch.Operator = Operator.and;
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.gridSettings.state.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateDocument.push(this.predicateAdvancedSearch);
    }
  }

  private setStatusEcommerceFiltrePredicate(filtreFromAdvSearch: Filter) {
    if (filtreFromAdvSearch.prop === DocumentConstant.ID_DOCUMENT_STATUS && filtreFromAdvSearch.value === documentStatusCodeToSearch.ECOMMERCE) {
      this.predicateAdvancedSearch.Filter.push(new Filter(DocumentConstant.ID_INVOICE_ECOMMERCE, Operation.isnotnull, undefined));
    }
  }


  public getDocumentCurrency(Code,Precision) {
    return {
      style: 'currency',
      currency: Code,
      currencyDisplay: 'symbol',
      minimumFractionDigits: Precision
    };
  }

  private isSalesDoucment() {
    this.isSalesDocument = this.documentType === this.documentEnumerator.SalesInvoices ||
      this.documentType === this.documentEnumerator.SalesQuotations ||
      this.documentType === this.documentEnumerator.SalesDelivery ||
      this.documentType === this.documentEnumerator.SalesAsset ||
      this.documentType === this.documentEnumerator.SalesOrder ||
      this.documentType === this.documentEnumerator.SalesInvoiceAsset;
  }


  receiveData(event) {
    this.searchType = NumberConstant.ONE;
    if(event.predicate.Filter[NumberConstant.ZERO].value === ""){
      this.predicateQuickSearch = PredicateFormat.prepareDocumentPredicateWithSpecificFiltre(this.isRestaurn, this.idSelectedTier);
    }
    else {
    this.predicateQuickSearch = event.predicate;
    }
    this.predicateDocument = [];
    this.predicateDocument.push(this.predicateDocumentType);
    this.predicateDocument.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  public isOpenTermBilling() {
    return (this.documentType === this.documentEnumerator.SalesInvoices
      || this.documentType === DocumentEnumerator.SalesInvoiceAsset) && !this.isRestaurn && this.haveTermBillingRole;
  }
  public synchronizeAllBtoBOrders(){
    this.documentService.SynchronizeAllBToBDocuments().subscribe(() => {
      this.initGridDataSource();
    });
  }

  public generateInvoice(){
    this.documentService.generateInvoice(this.documentsIdsSelected).subscribe(data => {
      if(data.objectData.Id > NumberConstant.ZERO){
        this.invoiceGeneratedCode = data.objectData.Code;
        this.invoiceGeneratedId = data.objectData.Id;
        let message: string = this.translate.instant(
          CounterSalesConstant.SUCCESS_GENERATE_INVOICE_MESSAGE
        );
        message = message.concat(
          '<a target="_blank" rel="noopener noreferrer" href="' + this.getInvoiceUrl() + '" > ' + data.objectData.Code + ' </a>');
          let codesMessage: string = this.translate.instant(
            DocumentConstant.DELIVERY_CODES_MESSAGE
          );
          codesMessage = codesMessage.concat(data.objectData.AssociatedDocumentsCode);
          message = message.concat(codesMessage);
        swal.fire({
          icon: SharedConstant.SUCCESS,
          html: message,
        });
      }
      else {
        let message: string = this.translate.instant(
          DocumentConstant.ERROR_GENERATE_INVOICE_MESSAGE
        );
        swal.fire({
          icon: SharedConstant.ERROR,
          html: message,
        });
      }
      this.documentsIdsSelected = [];
      this.isVisibleSelectAll = false;
      this.isVisibleGenerateInvoiceButton = false;
      this.idSelectedTier = undefined;
      this.predicateDocumentType = undefined;
      this.predicateDocumentType = PredicateFormat.prepareDocumentTypePredicate(this.documentType);
      this.predicateDocumentType.Filter.push(new Filter(DocumentConstant.ISRESTAURN, Operation.eq, this.isRestaurn));
      this.resetClickEvent();
    });
  }

  getInvoiceUrl() {
    return '/main/sales/invoice/show/' + this.invoiceGeneratedId + '/' + documentStatusCode.Provisional;
  }

}


/**
 * InvoicingType model
 * */
export class InvoicingType {
  constructor(public value: number, public text: string) {
  }
}


