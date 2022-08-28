import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { PurchaseRequest } from '../../../models/purchase/purchase-request.model';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { ObjectToSave } from '../../../models/shared/objectToSend';
import { DocumentService } from '../../../sales/services/document/document.service';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { PurchaseRequestService } from '../../services/purchase-request/purchase-request.service';
import { PurchaseRequestSerachComponent } from '../purchase-request-serach/purchase-request-serach.component';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

const PURCHASE_REQUEST_EDIT_URL = 'main/purchase/purchaserequest/edit/';
const PURCHASE_REQUEST_SHOW_URL = 'main/purchase/purchaserequest/show/';

@Component({
  selector: 'app-purchase-request-list-grid',
  templateUrl: './purchase-request-list-grid.component.html',
  styleUrls: ['./purchase-request-list-grid.component.scss']
})
export class PurchaseRequestListGridComponent implements OnInit, OnDestroy {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @Input() form: FormGroup;
  @Input() dataOfGridPurchaseRequest;
  company: any;
  swalNotif: SwalWarring;
  public isMyPR: boolean;
  public generateOrderPermission = false;
  public generatePriceRequestPermission = false;
  public haveShowPermission = false;
  public haveDeletePermission = false;
  public haveValidatePermission = false;
  public haveAddPermission = false;
  @ViewChild(PurchaseRequestSerachComponent) purchaseRequestSerachComponent: PurchaseRequestSerachComponent;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: PurchaseRequestConstant.CODE,
      title: PurchaseRequestConstant.N_PURCHASE_REQUEST,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true,
    },
    {
      field: PurchaseRequestConstant.DOCUMENT_DATE,
      title: PurchaseRequestConstant.DATE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      format: this.translate.instant(SharedConstant.DATE_FORMAT)
    },

    {
      field: PurchaseRequestConstant.CREATOR_FULLNAME_FIELD,
      title: PurchaseRequestConstant.COLLABORATER,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: PurchaseRequestConstant.ITEM_NAME,
      title: PurchaseRequestConstant.ITEM,
      _width: NumberConstant.TWO_HUNDRED,
      filterable: true
    },
    {
      field: PurchaseRequestConstant.DOCUMENT_HT_PRICE_WITHCURRENCY,
      title: PurchaseRequestConstant.TOTAL,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    },
    {
      field: PurchaseRequestConstant.DOCUMENT_STATUS,
      title: PurchaseRequestConstant.STATUS,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    },
    {
      field: PurchaseRequestConstant.VALIDATOR_FULLNAME_FIELD,
      title: PurchaseRequestConstant.VALIDATOR,
      _width: NumberConstant.ONE_HUNDRED_FIFTY,
      filterable: true
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  predicateList: PredicateFormat[] = [];
  quickSearchPredicate: PredicateFormat;
  advancedSearchPredicate: PredicateFormat;
  purchaseRequestTypePredicate: PredicateFormat;
  purchaseRequestTypePredicateForExport: PredicateFormat;
  public choosenFilter: number;
  public choosenFilterNumber: number;
  public purchaseRequestListSelected: Array<any> = [];
  private objectToSend: ObjectToSave;
  private purchaseRequestSubscription: Subscription;
  public isProvisionalStatus = documentStatusCode.Provisional;
  public isValidDocumentStatus = documentStatusCode.Valid;
  public isToOrderStatus = documentStatusCode.ToOrder;
  @ViewChild(ItemDropdownComponent) childItem;
  // Filtre config
  public filtreFieldsColumns = [];
  public filtreFieldsInputs = [];

  /**
   * flag to identify the searchType
   * advanced search = 0 ,quick search = 1
   */
  public searchType = NumberConstant.ONE;
  public isPurchasingManager;
  public allRowsSelected = false;
  public haveUpdatePermission = false;
  public idUser : number;
  constructor(public purchaseRequestService: PurchaseRequestService, private swalWarrings: SwalWarring,
              private router: Router, public translate: TranslateService, private documentService: DocumentService,
      private growlService: GrowlService, private companyService: CompanyService, public authService: AuthService, private localStorageService : LocalStorageService) {
    this.purchaseRequestTypePredicate = PredicateFormat.prepareDocumentPredicate(NumberConstant.ZERO, DocumentEnumerator.PurchaseRequest, false);
    this.purchaseRequestTypePredicate.IsDefaultPredicate = true;
    this.purchaseRequestTypePredicate.Relation.push.apply(this.purchaseRequestTypePredicate.Relation, [new Relation(DocumentConstant.ID_CREATOR_NAVIGATION),
      new Relation(DocumentConstant.ID_VALIDATOR_NAVIGATION)]);
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

  /**
   * Prepare predicate
   */
  public preparePredicate(): PredicateFormat {
    const myPredicate = PredicateFormat.preparePurchaseRequestDocumentPredicateWithSpecificFiltre();
    myPredicate.Relation.push(new Relation(PurchaseRequestConstant.DOCUMENT_LINE));
    return myPredicate;
  }


  /**
   * Remove handler
   * @param dataItem
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.quickSearchPredicate = this.preparePredicate();
        this.documentService.removeDocument(dataItem).subscribe(() => {
          this.initGridDataSource(true);
        });
      }
    });
  }

  /**
   * Init data source of grid
   */
  public initGridDataSource(isQuickSearch) {
    this.purchaseRequestSubscription = this.purchaseRequestService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.predicateList,
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
        this.dataOfGridPurchaseRequest = data;
      });
  }

  /**
   * Prepare object To save
   */
  prepareObjectToSave() {
    this.objectToSend = new ObjectToSave();
    this.objectToSend.Model = new Object();
    this.objectToSend.Model[PurchaseRequestConstant.LIST_OF_ID_DOCUMENT] = this.purchaseRequestListSelected;
  }

  /**
   * Generate Purchase order from list of purchase request
   */
  generatePurchaseOrder() {
    if (this.purchaseRequestListSelected.length > NumberConstant.ZERO) {
      this.prepareObjectToSave();
      this.purchaseRequestService.validateDocumentAndGenerate(this.objectToSend).subscribe((res) => {
          let message: string = this.translate.instant(PurchaseRequestConstant.SUCCESS_GENERATE_BC).concat(':');
          if (res.ListOfCreatedData && res.ListOfCreatedData.length > NumberConstant.ZERO) {
            res.ListOfCreatedData.forEach((x) => {
              message = message.concat('<a target="_blank" rel="noopener noreferrer" href="/main/purchase/purchaseorder/edit/' +
                x.Id + '/1" > ' + x.Code + '</a> ');
            });
          }
          swal.fire({
            html: message,
            icon: SharedConstant.SUCCESS
          }).then(() => {
          });
          this.deselectAll();
          this.initGridDataSource(true);
        }
      );
    } else {
      this.growlService.InfoNotification(this.translate.instant(PurchaseRequestConstant.SELECT_PURCHASE_REQUEST_REQUIRED_To_GENERATE_PO));
    }
  }

  /**
   * Generate Purchase order from list of purchase request
   */
  generatePriceRequest() {
    if (this.purchaseRequestListSelected.length > NumberConstant.ZERO) {
      this.prepareObjectToSave();
      this.purchaseRequestService.validateDocumentAndGeneratePriceRequest(this.objectToSend).subscribe((res) => {
          let message: string = this.translate.instant(PurchaseRequestConstant.SUCCESS_GENERATE_PRICE_REQUEST).concat(': \n');
          if (res.Code != null) {
            if(this.authService.hasAuthorities([PermissionConstant.CommercialPermissions.UPDATE_PRICEREQUEST,PermissionConstant.CommercialPermissions.SHOW_PRICEREQUEST]))
            {
              message = message.concat('<a target="_blank" rel="noopener noreferrer" href="/main/purchase/pricerequest/edit/' +
              res.Id + '" > ' + res.Code + '</a>');
            } else {
              message = message.concat('<span>' + res.Code + '</span>');
            }

          }
          swal.fire({

            html: message,
            icon: SharedConstant.SUCCESS
          }).then(() => {
          });
          this.deselectAll();
          this.initGridDataSource(true);
        }
      );
    } else {
      this.growlService.InfoNotification(this.translate.instant
      (PurchaseRequestConstant.SELECT_PURCHASE_REQUEST_REQUIRED_To_GENERATE_PRICE_REQUEST));
    }
  }

  ngOnInit() {
    this.generateOrderPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_ORDER_PURCHASE_REQUEST);
    this.generatePriceRequestPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_PRICE_REQUEST);
    this.haveShowPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_PURCHASE_REQUEST);
    this.haveDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_PURCHASE_REQUEST);
    this.haveValidatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_PURCHASE_REQUEST);
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PURCHASE_REQUEST);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_REQUEST);
    this.purchaseRequestTypePredicateForExport =PredicateFormat.prepareDocumentPredicate(NumberConstant.ZERO, DocumentEnumerator.PurchaseRequest, false);
    this.initPurchaseRequestListFiltreConfig();
    let predicateAd = this.preparePredicate();
    let predicateQuick = this.preparePredicate();
    this.advancedSearchPredicate = predicateAd;
    this.quickSearchPredicate = predicateQuick;
    this.predicateList.push(this.purchaseRequestTypePredicate);
    this.predicateList.push(this.mergefilters());
    this.initGridDataSource(true);
    this.checkPurchasingManager();
  }

  /**
   * Redirect to Edit form
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(PURCHASE_REQUEST_EDIT_URL.concat(dataItem.Id), {queryParams: dataItem, skipLocationChange: true});
  }

  /**
   * Redirect to Show form
   */
  public goToShowForm(dataItem) {
    this.router.navigateByUrl(PURCHASE_REQUEST_SHOW_URL.concat(dataItem.Id), {queryParams: dataItem, skipLocationChange: true});
  }

  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.purchaseRequestSubscription) {
      this.purchaseRequestSubscription.unsubscribe();
    }
  }

  changeSelection() {
    if (this.allRowsSelected) {
      this.deselectAll();
      this.allRowsSelected = false;
    } else {
      if (this.dataOfGridPurchaseRequest.data) {
        const selectedData = this.getValidPurchaseRequests();
        if (selectedData && selectedData.length > NumberConstant.ZERO) {
          this.purchaseRequestListSelected = [];
          selectedData.forEach((purchase) => {
            this.purchaseRequestListSelected.push(purchase.Id);
          });
        }
        this.allRowsSelected = true;
      }
    }
  }

  getValidPurchaseRequests(): any[] {
    if (this.dataOfGridPurchaseRequest && this.dataOfGridPurchaseRequest.data) {
      return this.dataOfGridPurchaseRequest.data.filter((purchaseElem: PurchaseRequest) => {
        return purchaseElem.IdDocumentStatus === this.isValidDocumentStatus;
      });
    } else {
      return [];
    }
  }

  deselectAll() {
    this.purchaseRequestListSelected = [];
  }

  pictureTierSrc(dataItem) {
  }

  /**
   * load advancedSearch parameters config
   * @private
   */
  private initPurchaseRequestListFiltreConfig() {
    this.filtreFieldsColumns.push(new FiltrePredicateModel(DocumentConstant.STATUS, FieldTypeConstant.purchaseRequestDropdownComponent,
      DocumentConstant.ID_DOCUMENT_STATUS));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(PurchaseRequestConstant.ITEM, FieldTypeConstant.itemDropDownComponent,
      PurchaseRequestConstant.ITEM, true, SharedConstant.SALES_MODULE,
      PurchaseRequestConstant.DOCUMENT_LINE, PurchaseRequestConstant.ID_DOCUMENT,
      PurchaseRequestConstant.ID_ITEM_NAVIGATION_ID));
    this.filtreFieldsColumns.push(new FiltrePredicateModel(PurchaseRequestConstant.N_PURCHASE_REQUEST, FieldTypeConstant.TEXT_TYPE,
      PurchaseRequestConstant.CODE));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseRequestConstant.COLLABORATER, FieldTypeConstant.TEXT_TYPE,
      PurchaseRequestConstant.ID_CREATOR_NAVIGATION_FULLNAME));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(PurchaseRequestConstant.VALIDATOR, FieldTypeConstant.TEXT_TYPE,
      PurchaseRequestConstant.ID_VALIDATOR_NAVIGATION_FULLNAME));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(DocumentConstant.DOCUMENT_DATE_TITLE, FieldTypeConstant.DATE_TYPE,
      PurchaseRequestConstant.DOCUMENT_DATE));
  }

  getFiltrePredicate(filtre) {
    this.searchType = NumberConstant.ZERO;
    this.predicateList = [];
    this.predicateList.push(this.purchaseRequestTypePredicate);
    this.prepareSpecificFiltreFromAdvancedSearch(filtre);
    this.prepareFiltreFromAdvancedSearch(filtre);
    this.predicateList.push(this.mergefilters());
    this.gridState.filter.logic = SharedConstant.LOGIC_AND;
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtreFromAdvSearch
   * @private
   */
  private prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.advancedSearchPredicate.Filter = this.advancedSearchPredicate.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.advancedSearchPredicate.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
      this.advancedSearchPredicate.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    } else if (filtreFromAdvSearch.operation && isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.advancedSearchPredicate.Filter.push(filtreFromAdvSearch);
    }
  }

  private prepareSpecificFiltreFromAdvancedSearch(filtre) {
    if (filtre.SpecificFiltre && !filtre.SpecificFiltreToDelete) {
      this.advancedSearchPredicate.SpecFilter = this.advancedSearchPredicate.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
      this.advancedSearchPredicate.SpecFilter.push(filtre.SpecificFiltre);
    } else if (filtre.SpecificFiltreToDelete) {
      this.advancedSearchPredicate.SpecFilter = this.advancedSearchPredicate.SpecFilter.filter(value => value.Prop !== filtre.SpecificFiltre.Prop);
    }
  }

  resetClickEvent() {
    this.advancedSearchPredicate = PredicateFormat.preparePurchaseRequestDocumentPredicateWithSpecificFiltre();
    this.predicateList[NumberConstant.ONE].Filter = [];
    this.predicateList = [];
    this.purchaseRequestSerachComponent.searchValue = SharedConstant.EMPTY;
    this.predicateList.push(this.purchaseRequestTypePredicate);
    this.predicateList.push(this.mergefilters());
    this.predicateList[NumberConstant.ONE].Filter = [];
    this.initGridDataSource(true);
  }

  mergefilters() {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
     if (this.advancedSearchPredicate.Filter.length !== 0 || this.advancedSearchPredicate.SpecFilter.length !== 0 ) {
       this.cloneAdvancedSearchPredicate(predicate);
       this.gridState.filter.logic = SharedConstant.LOGIC_AND;
       if (this.quickSearchPredicate.Filter.length !== NumberConstant.ZERO) {
        predicate.Filter = predicate.Filter.concat(this.quickSearchPredicate.Filter);
      }
     }
     else {
       this.cloneQuickSearchPredeicate(predicate);
       this.gridState.filter.logic = SharedConstant.LOGIC_OR;
     }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat){
    targetPredicate.Filter = this.advancedSearchPredicate.Filter;
    targetPredicate.IsDefaultPredicate = this.advancedSearchPredicate.IsDefaultPredicate;
    targetPredicate.Operator = this.advancedSearchPredicate.Operator;
    targetPredicate.OrderBy = this.advancedSearchPredicate.OrderBy;
    targetPredicate.Relation = this.advancedSearchPredicate.Relation;
    targetPredicate.SpecFilter = this.advancedSearchPredicate.SpecFilter;
    targetPredicate.SpecificRelation = this.advancedSearchPredicate.SpecificRelation;
    targetPredicate.page = this.advancedSearchPredicate.page;
    targetPredicate.pageSize = this.advancedSearchPredicate.pageSize;
    targetPredicate.values = this.advancedSearchPredicate.values;
  }

  public cloneQuickSearchPredeicate (targetPredicate: PredicateFormat){
    targetPredicate.Filter = this.quickSearchPredicate.Filter;
    targetPredicate.IsDefaultPredicate = this.quickSearchPredicate.IsDefaultPredicate;
    targetPredicate.Operator = this.quickSearchPredicate.Operator;
    targetPredicate.OrderBy = this.quickSearchPredicate.OrderBy;
    targetPredicate.Relation = this.quickSearchPredicate.Relation;
    targetPredicate.SpecFilter = this.quickSearchPredicate.SpecFilter;
    targetPredicate.SpecificRelation = this.quickSearchPredicate.SpecificRelation;
    targetPredicate.page = this.quickSearchPredicate.page;
    targetPredicate.pageSize = this.quickSearchPredicate.pageSize;
    targetPredicate.values = this.quickSearchPredicate.values;
  }

  private setPredicateFiltre(isQuickSearch) {
    this.predicateList = [];
    this.predicateList.push(this.purchaseRequestTypePredicate);
    if (isQuickSearch) {
      this.gridState.filter.logic = SharedConstant.LOGIC_OR;
      this.predicateList.push(this.quickSearchPredicate);
    } else {
      this.gridState.filter.logic = SharedConstant.LOGIC_AND;
      this.predicateList.push(this.advancedSearchPredicate);
    }
  }

  receiveData(searchPredicate) {
    this.searchType = NumberConstant.ONE;
    if(searchPredicate.Filter[NumberConstant.ZERO].value === ""){
      this.quickSearchPredicate = this.preparePredicate();
    }
    else {
    this.quickSearchPredicate = searchPredicate;
    }
    this.gridState.filter.logic = SharedConstant.LOGIC_OR;
    this.predicateList = [];
    this.predicateList.push(this.purchaseRequestTypePredicate);
    this.predicateList.push(this.mergefilters());
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource(true);
  }

  public checkPurchasingManager() {
    this.companyService.getCurrentCompany().subscribe(company => {
      this.company = company;
      this.isPurchasingManager = this.company.PurchaseSettings.IdPurchasingManager === this.localStorageService.getUserId();
      this.idUser = this.localStorageService.getUserId();
    });
  }
}
