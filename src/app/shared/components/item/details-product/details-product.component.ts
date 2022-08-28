import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, AfterViewInit, ComponentRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { DocumentMovementDetail } from '../../../../models/sales/document-movement-detail.model';
import { ItemHistory } from '../../../../models/inventory/item-history.model';
import { DocumentEnumerator, documentStatusCode } from '../../../../models/enumerators/document.enum';
import { TranslateService } from '@ngx-translate/core';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { Observable } from 'rxjs/Observable';
import { RoleConfigConstant } from '../../../../Structure/_roleConfigConstant';
import { StarkRolesService } from '../../../../stark-permissions/service/roles.service';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { isNullOrUndefined } from 'util';
import { notEmptyValue } from '../../../../stark-permissions/utils/utils';
import { StockCorrectionConstant } from '../../../../constant/stock-correction/stock-correction.constant';
import { StarkPermissionsService } from '../../../../stark-permissions/stark-permissions.module';
import { MovementHistoryComponent } from '../../../../inventory/movement-history/movement-history.component';
import { DatePipe } from '@angular/common';
import { DocumentStatus } from '../../../../models/sales/document-status.model';
import { ListNegotiationComponent } from '../../../../inventory/list-negotiation/list-negotiation.component';
import { RowClassArgs, GridComponent } from '@progress/kendo-angular-grid';
import { ItemDropdownComponent } from '../../item-dropdown/item-dropdown.component';
import { dateValueGT, dateValueLT, ValidationService } from '../../../services/validation/validation.service';
import { StockDocumentConstant } from '../../../../constant/inventory/stock-document.constant';
import { ReducedCurrency } from '../../../../models/administration/reduced-currency.model';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { LocalStorageService } from '../../../../login/Authentification/services/local-storage-service';
import { ListTransferMovementComponent } from '../../../../inventory/stock-documents/transfer-movement/list-transfer-movement/list-transfer-movement.component';
const START_DATE = 'StartDate';
const END_DATE = 'EndDate';
const ID_ITEM = 'IdItem';
const STARTING_STOCK = 'STARTING_STOCK';
const ENDING_STOCK = 'ENDING_STOCK';
const TOTALS = 'TOTALS';
const SHOW = '/show/';
const EDIT = '/edit/';
@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
       .k-grid tr.lastLine {  color:  #4dbd74; font-weight: bold; font-size:15px; }
   `],
})
export class DetailsProductComponent implements OnInit, AfterViewInit, IModalDialog {
  @Input() isModalHtml: boolean;
  @Input() idItem: number;
  public availableQty: number;
  public numberDaysOutStock: number;
  public RoleConfigConstant = RoleConfigConstant;
  public documentStatusCode = documentStatusCode;
  public isModal: boolean;
  currentTab = 1;
  @Input() containerRef;
  @ViewChild('gridDetails') public grid: GridComponent;
  @ViewChild(MovementHistoryComponent) private movementHistoryComponent: MovementHistoryComponent;
  @ViewChild(ListNegotiationComponent) private listNegotiationComponent: ListNegotiationComponent;
  @ViewChild(ListTransferMovementComponent) private listTransferMovementComponent: ListTransferMovementComponent;

  @ViewChild('itemDrop') private dropdown: ItemDropdownComponent;
  // FormGroup
  itemFormGroup: FormGroup;

  // id item sent in URL
  id: number;

  /**
   * item History
   */
  itemHistory: ItemHistory = new ItemHistory();
  options: Partial<IModalDialogOptions<any>>;
  /**
   * Data of kendo Grid
   */
  view: DocumentMovementDetail[] = [];
  filteredview: DocumentMovementDetail[] = [];
  tiersNameSearch: any;
  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  formatSaleOptions: any;
  formatPurchaseOptions: any;
  symbole: string;

  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public minStartDate: Date;
  public maxStartDate: Date;
  public hideSearch: boolean;
  public loadHistoryMovementRole: boolean;
  /**
   * permissions
   */
   public hasShowCostPricePermission: boolean;
   public hasShowSalePricePermission: boolean;

   public hasShowPurchaseDeliveryPermission: boolean;
   public hasUpdatePurchaseDeliveryPermission: boolean;
   public hasShowPurchaseAssetPermission: boolean;
   public hasUpdatePurchaseAssetPermission: boolean;
   public hasShowSalesDeliveryPermission: boolean;
   public hasUpdateSalesDeliveryPermission: boolean;
   public hasShowSalesAssetPermission: boolean;
   public hasUpdateSalesAssetPermission: boolean;
   public hasShowBSPermission: boolean;
   public hasUpdateBSPermission: boolean;
   public hasShowBEPermission: boolean;
   public hasUpdateBEPermission: boolean;
  /**
   * formatDate
   */
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  changeTab(tab) {
    this.currentTab = tab;
    this.search();
  }
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
    public viewRef: ViewContainerRef, private documentService: DocumentService, private translate: TranslateService,
    public companyService: CompanyService, public intl: IntlService, private cdRef: ChangeDetectorRef,
    private rolesService: StarkRolesService, private permissionsService: StarkPermissionsService,
    private validationService: ValidationService, private authService: AuthService, private localStorageService : LocalStorageService) {
    // get id of the item
    this.activatedRoute.params.subscribe(params => {
      this.id = +params[SharedConstant.ID_LOWERCASE] || 0;
    });
  }

  ngOnInit() {
    this.hasShowCostPricePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_COST_PRICE_ITEM);
    this.hasShowSalePricePermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_SALES_PRICE);
    this.hasShowPurchaseDeliveryPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE);
    this.hasUpdatePurchaseDeliveryPermission =  this.authService
      .hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE);
    this.hasShowPurchaseAssetPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ASSET_PURCHASE);
    this.hasUpdatePurchaseAssetPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ASSET_PURCHASE);
    this.hasShowSalesDeliveryPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_DELIVERY_SALES);
    this.hasUpdateSalesDeliveryPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES);
    this.hasShowSalesAssetPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ASSET_SALES);
    this.hasUpdateSalesAssetPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ASSET_SALES);
    this.hasShowBSPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_EXIT_VOUCHERS);
    this.hasUpdateBSPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS);
    this.hasShowBEPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ADMISSION_VOUCHERS);
    this.hasUpdateBEPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS);
    if (this.isModalHtml) {
      this.isModal = true;
      this.id = this.idItem;
    }
    this.createForm();
    this.prepareDate();
    this.getSelectedCurrency();
    if (this.isModal === true) {
      // this.itemFormGroup.controls['IdItem'].disable();
      this.hideSearch = true;
    }
    // Make inventory for current item
    if (this.id) {
      this.search();
    }
  }

  focusOnComboBox() {
    this.dropdown.focusOnComboBox();
  }

  ngAfterViewInit(): void {
    if (!this.isModal) {
      this.dropdown.focusOnComboBox();
    }
  }

  getSelectedCurrency() {
      this.symbole = this.localStorageService.getCurrencySymbol();
      this.formatSaleOptions = {
        style: 'decimal',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
      this.formatPurchaseOptions = {
        style: 'decimal',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
  }

  /**
   *  prepare the form to do Search
   */
  private createForm(): void {
    this.itemFormGroup = this.fb.group({
      IdItem: new FormControl(this.id, [Validators.required]),
      StartDate: new FormControl('', [Validators.required]),
      EndDate: new FormControl('', [Validators.required]),
    });
    this.addDependentDateControls(this.itemFormGroup);
  }

  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setStartDateControl(currentformGroup);
    this.setEndDateControl(currentformGroup);
    currentformGroup.get(START_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(END_DATE).hasError('dateValueGT')) {
        currentformGroup.get(END_DATE).setErrors(null);
      }
    });
    currentformGroup.get(END_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(START_DATE).hasError('dateValueLT')) {
        currentformGroup.get(START_DATE).setErrors(null);
      }
    });

  }
  private setStartDateControl(currentformGroup: FormGroup) {
    const oEndDate = new Observable<Date>(observer => observer.next(currentformGroup.get(END_DATE).value));
    currentformGroup.setControl(START_DATE, this.fb.control(currentformGroup.value.startDate,
      [Validators.required, dateValueLT(oEndDate)]));
  }
  private setEndDateControl(currentformGroup: FormGroup) {
    const oStartDate = new Observable<Date>(observer => observer.next(currentformGroup.get(START_DATE).value));
    currentformGroup.setControl(END_DATE, this.fb.control(currentformGroup.value.endDate,
      [Validators.required, dateValueGT(oStartDate)]));
  }


  /**
   * This method calculate startDate and endDate
   */
  prepareDate() {
    // endDate is the current date
    const endDate = new Date(new Date().getFullYear(), 11, 31);
    // startDate is 1 date of the year
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    this.maxStartDate = endDate;
    this.minEndDate = startDate;
    // set form control
    this.itemFormGroup.controls[START_DATE].setValue(startDate);
    this.itemFormGroup.controls[END_DATE].setValue(endDate);
  }

  /**
   * Do Search
   */
  search() {
    if (this.itemFormGroup.valid) {
      const startDate = this.itemFormGroup.controls[START_DATE].value;
      const endDate = this.itemFormGroup.controls[END_DATE].value;
      if (this.currentTab === NumberConstant.ONE) {
        this.view = [];
        this.filteredview = [];  
        this.itemFormGroup.controls[START_DATE].setValue(
          new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())));
        this.itemFormGroup.controls[END_DATE].setValue(new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())));
        this.grid.loading = true;
        this.documentService.getItemHistoryMovement(this.itemFormGroup.value).subscribe(data => {
          this.itemHistory = data;
          this.grid.loading = false;
          if (this.itemFormGroup.controls[ID_ITEM].value) {
            const quantityStartLine = new DocumentMovementDetail();
            quantityStartLine.Code = `${this.translate.instant(STARTING_STOCK)} :`;
            quantityStartLine.DocumentDate = data.StartDate;
            quantityStartLine.PurchaseQuantity = data.StartQuantity;
            quantityStartLine.SalesQuantity = '-';
            quantityStartLine.PurchaseAmount = '-';
            quantityStartLine.PurchaseAmount = '-';
            quantityStartLine.SalesAmount = '-';
            this.view.push(quantityStartLine);
            this.filteredview.push(quantityStartLine);
            this.view.push(new DocumentMovementDetail());
            this.filteredview.push(new DocumentMovementDetail());
            this.availableQty = data.AvailableQty;
            this.numberDaysOutStock = data.NumberDayOutStock;
            this.itemHistory.Document.forEach(document => {
              if ((document.IsSalesDocument && document.DocumentTypeCode !== DocumentEnumerator.SalesAsset)) {
                document.PurchaseQuantity = '-';
                document.PurchaseAmount = '-';
              } else if (document.DocumentTypeCode === DocumentEnumerator.PurchaseAsset) {
                document.PurchaseQuantity = '-';
                document.SalesAmount = '-';
              } else if (document.DocumentTypeCode === DocumentEnumerator.SalesAsset) {
                document.SalesQuantity = '-';
                document.PurchaseAmount = '-';
              } else {
                document.SalesQuantity = '-';
                document.SalesAmount = '-';
              }
              this.view.push(document);
              this.filteredview.push(document);
            });
            this.view.push(new DocumentMovementDetail());
            this.filteredview.push(new DocumentMovementDetail());
            const quantityEndLine = new DocumentMovementDetail();
            quantityEndLine.Code = `${this.translate.instant(TOTALS)} :`;
            quantityEndLine.DocumentDate = data.EndDate;
            quantityEndLine.PurchaseQuantity = data.InQuantity;
            quantityEndLine.SalesQuantity = data.OutQuantity;
            quantityEndLine.PurchaseAmount = data.EndPurchaseAmount;
            quantityEndLine.SalesAmount = data.EndSaleAmount;
            quantityEndLine.IsLastLine = true;
            this.view.push(quantityEndLine);
            this.filteredview.push(quantityEndLine);
          }
        });
      }
      if (this.currentTab === NumberConstant.TWO) {
        this.listTransferMovementComponent.initGridDataSource(null,startDate,endDate);
      }
      if (this.currentTab === NumberConstant.THREE) {
        this.movementHistoryComponent.initGridDataSource();
      }
      if (this.currentTab === NumberConstant.FOUR) {
        this.listNegotiationComponent.gridSettings.state.skip = NumberConstant.ZERO;
        this.listNegotiationComponent.initGridDataSource();
      }
    } else {
      this.validationService.validateAllFormFields(this.itemFormGroup);
    }
  }

  changeStartDate() {
    if (this.itemFormGroup.get(START_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.itemFormGroup.get(START_DATE).value;
      if (!this.oldStartDateValue) {
        this.minEndDate = undefined;
      } else {
        this.minEndDate = this.oldStartDateValue;
      }
      this.cdRef.detectChanges();
    }
  }

  changeEndDate() {
    if (this.itemFormGroup.get(END_DATE).value !== this.oldEndDateValue) {
      this.oldEndDateValue = this.itemFormGroup.get(END_DATE).value;

      if (!this.oldEndDateValue) {
        this.maxStartDate = undefined;
      } else {
        this.maxStartDate = this.oldEndDateValue;
      }
      this.cdRef.detectChanges();
    }
  }



  /**
   * Navigate To DocumentDetail on click document code
   */
  onClickGoToDocument(documentTypeCode: string, idDocumentStatus: number, idDocument: number) {
    let url;
    // Create Url according to document type
    if (documentTypeCode === DocumentEnumerator.PurchaseDelivery) {
      url = DocumentConstant.PURCHASE_DELIVERY_URL;
    }
    if (documentTypeCode === DocumentEnumerator.SalesDelivery) {
      url = DocumentConstant.SALES_DELIVERY_URL;
    }
    if (documentTypeCode === DocumentEnumerator.SalesAsset) {
      url = DocumentConstant.SALES_ASSET_URL;
    }
    if (documentTypeCode === DocumentEnumerator.PurchaseAsset) {
      url = DocumentConstant.PURCHASE_ASSET_URL;
    }
    if (documentTypeCode === DocumentEnumerator.BE) {
      url = StockCorrectionConstant.BE_URL_LIST;
    }
    if (documentTypeCode === DocumentEnumerator.BS) {
      url = StockCorrectionConstant.BS_URL;
    }
    // test if is inventory documents
    if(documentTypeCode === StockDocumentConstant.Inventory){
      url = StockDocumentConstant.URI_INVENTORY_DOCUMENT;
      url = url.concat(SHOW);
      window.open(url.concat(idDocument),"_blank");
      return
    }
    if (idDocumentStatus != documentStatusCode.Provisional && idDocumentStatus != documentStatusCode.DRAFT) {
      url = url.concat(SHOW);
    } else {
      url = url.concat(EDIT);
    }

    window.open(url.concat(idDocument).concat('/').concat(idDocumentStatus), "_blank");
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.id = options.data;
  }

  showaction() {
    this.filterTiers();
  }

  pressKeybordEnter(event) {
    if (event.charCode === 13) {
      this.filterTiers();
    }
  }
  filterTiers() {
    if (this.tiersNameSearch) {
      this.filteredview = this.view.filter(x => !x.TiersName || (x.TiersName && x.TiersName.indexOf(this.tiersNameSearch) >= 0));
    } else {
      this.filteredview = this.view;
    }
  }

  public rowCallback(context: RowClassArgs) {
    if (context.dataItem.IsLastLine) {
      return { lastLine: true };
    }
  }

  public selectedItem() {
    this.search();
  }

}
