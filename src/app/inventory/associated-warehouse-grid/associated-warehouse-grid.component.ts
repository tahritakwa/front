import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef} from '@angular/core';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {GridDataResult, PageChangeEvent, PagerSettings, RowClassArgs} from '@progress/kendo-angular-grid';
import {PredicateFormat} from '../../shared/utils/predicate';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../constant/utility/number.constant';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {Item} from '../../models/inventory/item.model';
import {WarehouseConstant} from '../../constant/inventory/warehouse.constant';
import {ItemService} from '../services/item/item.service';
import {ColorConstant} from '../../constant/utility/color.constant';
import {DocumentConstant} from '../../constant/sales/document.constant';
import {DocumentEnumerator, documentStatusCode} from '../../models/enumerators/document.enum';
import {SearchItemService} from '../../sales/services/search-item/search-item.service';
import {Router} from '@angular/router';
import {DetailsProductComponent} from '../../shared/components/item/details-product/details-product.component';
import {FormModalDialogService} from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';
import { TranslateService } from '@ngx-translate/core';

const SHOW = '/show/';
const EDIT = '/edit/';
const EDIT_PROVISION = '/editProvision/';
const GRID_DATA = 'gridData';

@Component({
  selector: 'app-associated-warehouse-grid',
  templateUrl: './associated-warehouse-grid.component.html',
  styleUrls: ['./associated-warehouse-grid.component.scss']
})
export class AssociatedWarehouseGridComponent implements OnInit, OnChanges {

  /**
   * To Hold item and its warehouses to bve shown in the dataGrid
   */
  @Input() item: Item;
  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: WarehouseConstant.WAREHOUSE_NAME,
      title: WarehouseConstant.WAREHOUSES,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_SIXTY
    },
    {
      field: WarehouseConstant.WAREHOUSE_SHELF,
      title: WarehouseConstant.SHELF_STORAGE_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: WarehouseConstant.AVAILABLE_QUANTITY_FIELD,
      title: WarehouseConstant.AVAILABLE_QUANTITY_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    }, {
      field: WarehouseConstant.FINAL_ON_ORDER_QUANTITY_FIELD,
      title: WarehouseConstant.FINAL_ON_ORDER_QUANTITY_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    }, {
      field: WarehouseConstant.CRP,
      title: WarehouseConstant.CRP,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: WarehouseConstant.MIN_QUANTITY_FIELD,
      title: WarehouseConstant.MIN_QUANTITY_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: WarehouseConstant.ORDER_SALES_QUANTITY_FIELD,
      title: WarehouseConstant.ORDER_SALES_QUANTITY_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: WarehouseConstant.TRADED_QUANTITY_FIELD,
      title: WarehouseConstant.TRADED_QUANTITY_TITLE,
      filterable: false,
      _width: NumberConstant.ONE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: SharedConstant.DEFAULT_GRID_STATE,
    columnsConfig: this.columnsConfig
  };
  @Input() public gridData: GridDataResult = {
    data: [],
    total: NumberConstant.ZERO
  };
  /**
   * Sales quantity modal data
   */
  public selectedRow;

  /**
   * Order quantity modal data
   */
  private allDataDetailsOnOrderQuantity: any;
  public selectedRowOfOnOrderQuantity: any;
  public dataDetailsOnOrderQuantity: any;
  public skipOnOrderQuantity = NumberConstant.ZERO;
  public pageSizeOnOrderQuantity = NumberConstant.TEN;
  public statusCode = documentStatusCode;
  public documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() public assoicatedWarehouseGridHeight = '100';
  /**
   * permissions
   */
   public hasHistoryPermission: boolean;
  public rowCallback(context: RowClassArgs) {
    switch (context.dataItem.Color) {
      case ColorConstant.RED:
        return {red: true};
      case ColorConstant.ORANGE_LABEL:
        return {orange: true};
      case ColorConstant.GREEN_LABEL:
        return {green: true};
      case ColorConstant.BLUE_LABEL:
        return {blue: true};
      default:
        return {};
    }
  }
// Permissions
hasShowCommande : boolean;
hasUpdateCommande : boolean;
hasShowFinalOrder : boolean;
hasUpdateFinalOrder : boolean;
hasShowReceivedOrder : boolean;
hasUpdateReceivedOrder : boolean;
hasShowOrderProject : boolean;
  constructor(private itemService: ItemService, private searchItemService: SearchItemService,
              private router: Router, private formModalDialogService: FormModalDialogService,
      private viewRef: ViewContainerRef, private translate: TranslateService, private authService: AuthService) {
  }

  ngOnInit() {
    this.hasShowCommande = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_ORDER_QUOTATION_PURCHASE);
    this.hasUpdateCommande = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ORDER_QUOTATION_PURCHASE);
    this.hasShowFinalOrder = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_FINAL_ORDER_PURCHASE);
    this.hasUpdateFinalOrder = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_FINAL_ORDER_PURCHASE);
    this.hasShowReceivedOrder = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_RECEIPT_PURCHASE);
    this.hasUpdateReceivedOrder = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_RECEIPT_PURCHASE);
    this.hasShowOrderProject = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_PROVISIONING) ||
    this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PROVISIONING) ;
    this.hasHistoryPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.HISTORY_ITEM);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes[GRID_DATA] && (changes[GRID_DATA].currentValue)) {
      this.gridSettings.gridData = changes[GRID_DATA].currentValue;
    }
  }

  /** show quantity details */
  onOrderQuantityDetails(IdItem) {
    this.selectedRowOfOnOrderQuantity = IdItem;
    this.itemService.getOnOrderQuantityDetails(IdItem).subscribe((dataOfOnOrderQuantityDetails) => {
      this.allDataDetailsOnOrderQuantity = dataOfOnOrderQuantityDetails;
      this.loadOnOrderQuantity();
    });
  }

  private loadOnOrderQuantity(): void {
    this.dataDetailsOnOrderQuantity = {
      data: this.allDataDetailsOnOrderQuantity.listData.slice(this.skipOnOrderQuantity,
        this.skipOnOrderQuantity + this.pageSizeOnOrderQuantity),
      total: this.allDataDetailsOnOrderQuantity.total
    };
  }

  public pageChangeOnOrderQuantity({skip, take}: PageChangeEvent): void {
    this.skipOnOrderQuantity = skip;
    this.pageSizeOnOrderQuantity = take;
    this.loadOnOrderQuantity();
  }

  /**
   * Navigate To DocumentDetail on click document code
   */
  onClickGoToDocument(documentTypeCode: string, idDocumentStatus: number, idDocument: number, isOrderProject) {
    let url;
    if (isOrderProject) {
      url = DocumentConstant.ORDER_PROJECT_URL.concat(EDIT_PROVISION);
      window.open(url.concat(idDocument), '_blank');
    } else {
      this.setUrlByDocumentType(url, documentTypeCode, idDocumentStatus, idDocument);
    }
  }

  private setUrlByDocumentType(url, documentTypeCode, idDocumentStatus, idDocument) {
    if (documentTypeCode === DocumentEnumerator.PurchaseOrder) {
      url = DocumentConstant.PURCHASE_ORDER_URL.concat(idDocumentStatus === this.statusCode.Provisional ? EDIT : SHOW);
    } else if (documentTypeCode === DocumentEnumerator.PurchaseFinalOrder) {
      url = DocumentConstant.PURCHASE_FINAL_ORDER_URL.concat(idDocumentStatus === this.statusCode.Provisional ? EDIT : SHOW);
    } else if (documentTypeCode === DocumentEnumerator.PurchaseDelivery) {
      url = DocumentConstant.PURCHASE_DELIVERY_URL.concat(idDocumentStatus === this.statusCode.Provisional ? EDIT : SHOW);
    }
    window.open(url.concat(idDocument).concat('/').concat(idDocumentStatus), '_blank');
  }

  /** show quantity details*/
  public quantityDetails($event) {
    this.selectedRow = $event;
  }

  /**
   * Go to item details to see movement history
   */
  onClickGoToDetails(id) {
      this.formModalDialogService.openDialog(null, DetailsProductComponent, this.viewRef, null, id,
        true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

}
