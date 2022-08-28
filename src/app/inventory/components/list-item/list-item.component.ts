import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { process, State } from '@progress/kendo-data-query';
import { ItemService } from '../../services/item/item.service';
import { Item } from '../../../models/inventory/item.model';
import { GridComponent, GridDataResult, PageChangeEvent, PagerSettings, RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Router } from '@angular/router';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue, notEmptyValue } from '../../../stark-permissions/utils/utils';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { DetailsProductComponent } from '../../../shared/components/item/details-product/details-product.component';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ProvisioningDetails } from '../../../models/purchase/provisioning-details.model';
import { ProvisioningService } from '../../../purchase/services/order-project/provisioning-service.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

const EDIT_PROVISION = '/editProvision/';
const SHOW = '/show/';
const EDIT = '/edit/';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
      .k-grid tr.red {
          color: #ef5958;
          font-weight: bold;
      }

      .k-grid tr.orange {
          color: #ffc107;
          font-weight: bold;
      }

      .k-grid tr.green {
          color: #4dbd74;
          font-weight: bold;
      }

      .k-grid tr.blue {
          color: #63c2de;
          font-weight: bold;
      }
  `],
})
export class ListItemComponent implements OnInit {
  public RoleConfigConstant = RoleConfigConstant;
  @Input() gridSettings: GridSettings;
  @Input() grpList: Array<Item>;
  @Input() isEquivalenceGroupInterface = false;
  @Input() isToLoad = false;
  @Input() item: Item;
  @Input() isModal: boolean;
  @Input() modalOptions;
  @Input() sendToDocument: boolean;
  @Input() isForKit: boolean;
  @Input() isReplacementInterface: boolean;
  @Output() refreshItems: EventEmitter<any> = new EventEmitter<boolean>();
  @Output() removeEquivalentItem: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onRowClickEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemSelectedForGarage: EventEmitter<any> = new EventEmitter<any>();
  @Input() openedFromGarageAddCar;
  @ViewChild('grid') public grid: GridComponent;
  @Input() replacementItem;
  @Input() kitItems;
  @Input() isTecDocEquivalence: boolean;
  public openHistory: boolean;
  public isSales: boolean;
  selectedRow: any;
  public IdItemSelected: number;
  public documentType: string;
  public QuantityForDocumentLine: number;
  opentecdocdetails: boolean;
  SelectedForDetails: any;
  public FromApi: any;
  public selectedRowOfOnOrderQuantity;
  allDataDetailsOnOrderQuantity: any;
  dataDetailsOnOrderQuantity: GridDataResult;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public skipOnOrderQuantity = 0;
  public pageSizeOnOrderQuantity = 10;
  public statusCode = documentStatusCode;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  isAutoVersion: boolean;
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  public max = NumberConstant.MAX_QUANTITY;
  @Input() addItem: boolean;
  @Input() isForGarage: boolean;
  /**
   * Flag in case to show only product brand column
   */
  @Input() public isToOnlyShowBrand: boolean;
  /**
   * To select rows
   */
  public mySelection: any[] = [0];
  public hasAddBLPermission = false;
  public hasUpdateBLPermission = false;
  public hasClaimListPermission = false;
  public isRowSelected = (e: RowArgs) => this.mySelection.indexOf(e.index) >= 0;

  /**
   *
   * @param itemService
   * @param swalWarrings
   * @param searchItemService
   * @param modalService
   * @param router
   * @param formModalDialogService
   * @param viewRef
   * @param translate
   * @param companyService
   * @param provisioningService
   * @param authService
   */
  constructor(public itemService: ItemService, private swalWarrings: SwalWarring,
    private rolesService: StarkRolesService, public searchItemService: SearchItemService,
      private modalService: ModalDialogInstanceService, private router: Router, private authService: AuthService,
    protected formModalDialogService: FormModalDialogService, protected viewRef: ViewContainerRef,
    private translate: TranslateService, private localStorageService :LocalStorageService,
    private provisioningService: ProvisioningService) {
      this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

  }

  ngOnInit() {
    this.hasAddBLPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_DELIVERY_SALES);
    this.hasUpdateBLPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_DELIVERY_SALES);
    this.hasClaimListPermission =  this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_CLAIM_PURCHASE);
    this.itemService.getJson('environments/TecDocConf.json').subscribe(data => {
      this.FromApi = data.IsUseTecDocApi;
    });
    if (this.modalOptions && this.modalOptions.data.filtersItemDropdown.isForSale) {
      this.isSales = true;
    }
    if (this.isToLoad && this.grid) {
      this.grid.loading = true;
    }
    if (this.sendToDocument) {
      this.documentType = this.searchItemService.searchItemDocumentType;
    }
  }

  /**
   * To set data in the associated warehouse list off the first element in the data grid
   */
  public selectFirstElement() {
    if (this.gridSettings.gridData && this.gridSettings.gridData.data && this.gridSettings.gridData.total > 0) {
      this.setSelectedRowIndex(NumberConstant.ZERO + this.gridSettings.state.skip);
      const event = {
        dataItem: this.gridSettings.gridData.data[NumberConstant.ZERO],
        index: NumberConstant.ZERO
      };
      this.onRowClickEvent.emit(event);
    }
  }

  public onRowClick(event: any) {
    if (event && isNotNullOrUndefinedAndNotEmptyValue(event.selectedRows)) {
      this.onRowClickEvent.emit(event.selectedRows[0]);
      this.setSelectedRowIndex(event.selectedRows[NumberConstant.ZERO].index);
    } else {
      this.onRowClickEvent.emit(event);
    }
  }

  private setSelectedRowIndex(index: Number) {
    this.mySelection = [index];
  }

  /** show quantity details*/
  quantityDetails($event) {
    this.selectedRow = $event;
  }

  public onStateChange(state: State, grpList?: Array<Item>) {
    if (this.gridSettings.gridData) {
      this.gridSettings.gridData.data = [];
      this.onRowClick(null);
    }
    if (grpList !== undefined) {
      this.grpList = grpList;
      state.skip = NumberConstant.ZERO;
    }
    this.gridSettings.state = state;
    const listEquivalence = Object.assign([], this.grpList);
    this.gridSettings.gridData = process(listEquivalence, state);
    this.gridSettings.gridData.data.forEach(element => {
      if (!(element.QuantityForDocumentLine > 1)) {
        element.QuantityForDocumentLine = 1;
      }
    });
    if (this.gridSettings.gridData && this.gridSettings.gridData.total > NumberConstant.ZERO) {
      this.selectFirstElement();
      this.getPictures(this.gridSettings.gridData.data);
    } else {
      this.onRowClick(null);
    }

  }

  onClickGoToDetailsInModal(id) {
    if (this.searchItemService.isModal) {
      window.open('main/purchase/product/details/' + id, '_blank');
    } else {
      const title = ItemConstant.DETAILS_PRODUCT;
      this.formModalDialogService.openDialog(title, DetailsProductComponent,
        this.viewRef, null, id, false, SharedConstant.MODAL_DIALOG_SIZE_XXL);
      this.openHistory = true;
      this.IdItemSelected = id;
    }
  }

  public rowCallback(context: RowClassArgs) {
    if (context && context.dataItem) {
      if (context.dataItem.AllAvailableQuantity > 0 && !this.isEquivalenceGroupInterface) {
        return { available: context.dataItem.AllAvailableQuantity > 0 };
      } else {
        const isEven = context.index % 2 === 0;
        return {
          notecodd: !isEven && !context.dataItem.IsInDb && !context.dataItem.IdNature,
          noteceven: isEven && !context.dataItem.IsInDb && !context.dataItem.IdNature
        };
      }
    }
  }

  removeHandler(event) {
    if (event.dataItem.EquivalenceItem === this.item.EquivalenceItem) {
      this.swalWarrings.CreateSwal().then((result) => {
        if (result.value) {
          this.itemService.removeEquivalentItem(event.dataItem.Id).subscribe(() => {
            this.refreshItems.emit();
          });
        }
      });
    } else {
      this.removeEquivalentItem.emit(event);
    }
  }

  getItemId($event) {
    if (this.isModal && this.modalOptions) {
      this.modalOptions.data = $event.Id;
      this.modalOptions.onClose();
    }
    this.modalService.closeAnyExistingModalDialog();
  }

  onClickGoToDetails(id) {
    this.router.navigateByUrl(ItemConstant.DETAILS_URL.concat(id));
  }

  public getShowModalCondition(): boolean {
    return this.IdItemSelected > 0 && (!this.searchItemService.idDocument || this.searchItemService.idDocument === 0);
  }

  addDocument(event, documentType, QuantityForDocumentLine) {

    if (this.searchItemService.idProvision && !this.searchItemService.idDocument) {
      if (this.isTecDocEquivalence !== undefined) {
        const idsArray = [event];
        this.provisioningService.addEquivalentItemToProvisioningGrid(idsArray, this.searchItemService.idProvision, QuantityForDocumentLine).subscribe(x => {
        });
      } else {
        let provisioningDetails = new ProvisioningDetails();
        provisioningDetails.IdItem = event;
        provisioningDetails.IdProvisioning = this.searchItemService.idProvision;
        provisioningDetails.MvtQty = QuantityForDocumentLine;
        this.provisioningService.addItemFromModal(provisioningDetails).subscribe(data => {
        });
      }
    } else {
      const idwarehouse: number = this.modalOptions && this.modalOptions.data && this.modalOptions.data.filtersItemDropdown && this.modalOptions.data.filtersItemDropdown.idWarehouse ?
        this.modalOptions.data.filtersItemDropdown.idWarehouse : this.searchItemService.idWarehouse;
      this.documentType = documentType;
      this.searchItemService.searchItemDocumentType = documentType;
      this.QuantityForDocumentLine = QuantityForDocumentLine;
      this.IdItemSelected = event;
      this.searchItemService.addDocument(
        this.IdItemSelected, QuantityForDocumentLine, idwarehouse);
    }

  }

  addItemToIntervention(idItem, unitHtsalePrice, quantityForDocumentLine, description, code) {
    const itemForGarage = {};
    itemForGarage['IdItem'] = idItem;
    itemForGarage['UnitHtsalePrice'] = unitHtsalePrice;
    itemForGarage['Quantity'] = quantityForDocumentLine;
    itemForGarage['Description'] = description;
    itemForGarage['Code'] = code;
    this.itemSelectedForGarage.emit(itemForGarage);
  }

  removeEquivItemBtnCondition() {
    return (!this.searchItemService.isFromSearchItem_supplierInetrface && !this.isForKit && this.itemService.isForInventory)
      || this.isEquivalenceGroupInterface;
  }

  stepUp(item) {
    (!item.QuantityForDocumentLine) ? item.QuantityForDocumentLine = 1 : item.QuantityForDocumentLine++;
  }

  stepdown(item) {
    (!item.QuantityForDocumentLine && item.QuantityForDocumentLine === 0) ?
      item.QuantityForDocumentLine = 0 : item.QuantityForDocumentLine--;
  }

  showedtiqty(): boolean {
    return (this.isSales && this.searchItemService.isFromSearchItem_supplierInetrface);
  }

  closeModalAction() {
    this.IdItemSelected = 0;
    this.searchItemService.closeModalAction();
  }

  openTecdocModal(dataItem) {
    this.opentecdocdetails = true;
    this.SelectedForDetails = dataItem;
  }

  closeTecdocModal() {
    this.opentecdocdetails = false;
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


  public pageChangeOnOrderQuantity({ skip, take }: PageChangeEvent): void {
    this.skipOnOrderQuantity = skip;
    this.pageSizeOnOrderQuantity = take;
    this.loadOnOrderQuantity();
  }


  private fillItemsPictures(itemList, itemsPictures) {
    itemList.map((item: Item) => {
      if (item.UrlPicture) {
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === item.UrlPicture);
        if (dataPicture) {
          item.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

  private loadItemsPicture(itemList: Item[]) {
    var itemsPicturesUrls = [];
    itemList.forEach((item: Item) => {
      itemsPicturesUrls.push(item.UrlPicture);
    });
    if (itemsPicturesUrls.length > NumberConstant.ZERO) {
      this.itemService.getPictures(itemsPicturesUrls, false).subscribe(itemsPictures => {
        this.fillItemsPictures(itemList, itemsPictures);
      });
    }
  }
  public getPictures(data: any) {
    this.loadItemsPicture(data);
    data.forEach(product => {
      product.image = MediaConstant.PLACEHOLDER_PICTURE;
    });
  }
  public rowCallbackModal(context: RowClassArgs) {
    switch (context.dataItem.Color) {
      case 'red':
        return { red: true };
      case 'orange':
        return { orange: true };
      case 'green':
        return { green: true };
      case 'blue':
        return { blue: true };
      default:
        return {};
    }
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
      if (documentTypeCode === DocumentEnumerator.PurchaseOrder) {
        url = DocumentConstant.PURCHASE_ORDER_URL.concat(idDocumentStatus === this.statusCode.Provisional ? EDIT : SHOW);
      } else if (documentTypeCode === DocumentEnumerator.PurchaseFinalOrder) {
        url = DocumentConstant.PURCHASE_FINAL_ORDER_URL.concat(idDocumentStatus === this.statusCode.Provisional ? EDIT : SHOW);
      } else if (documentTypeCode === DocumentEnumerator.PurchaseDelivery) {
        url = DocumentConstant.PURCHASE_DELIVERY_URL.concat(idDocumentStatus === this.statusCode.Provisional ? EDIT : SHOW);
      }
      window.open(url.concat(idDocument).concat('/').concat(idDocumentStatus), '_blank');
    }
  }

  eliminateItem(dataItem) {
    if (this.isReplacementInterface) {
      if (dataItem.Id === this.replacementItem[0].Id) {
        const swalWarningMessage = `${this.translate.instant(ItemConstant.ELIMINATE_MESSAGE)}`;
        const swalWarningTitle = `${this.translate.instant(ItemConstant.ELIMINATE_TITLE)}`;
        const swalWarningConfirm = `${this.translate.instant(ItemConstant.ELIMINATE)}`;
        this.swalWarrings.CreateSwal(swalWarningMessage,
          swalWarningTitle, swalWarningConfirm).then((result) => {
            if (result.value) {
              this.itemService.removeReplacementItem(this.item.Id).subscribe(() => {
                this.refreshItems.emit();
              });
            }
          });
      }
    } else if (this.isForKit) {
      if (this.kitItems.find(x => x.Id === dataItem.Id)) {
        const swalWarningMessage = `${this.translate.instant(ItemConstant.ELIMINATE_MESSAGE)}`;
        const swalWarningTitle = `${this.translate.instant(ItemConstant.ELIMINATE_TITLE)}`;
        const swalWarningConfirm = `${this.translate.instant(ItemConstant.ELIMINATE)}`;
        this.swalWarrings.CreateSwal(swalWarningMessage,
          swalWarningTitle, swalWarningConfirm).then((result) => {
            if (result.value) {
              this.itemService.removeKitItem(dataItem.Id, this.item.Id).subscribe(() => {
                this.refreshItems.emit();
              });
            }
          });

      }
    } else {
      if (dataItem.EquivalenceItem === this.item.EquivalenceItem) {
        const swalWarningMessage = `${this.translate.instant(ItemConstant.ELIMINATE_MESSAGE)}`;
        const swalWarningTitle = `${this.translate.instant(ItemConstant.ELIMINATE_TITLE)}`;
        const swalWarningConfirm = `${this.translate.instant(ItemConstant.ELIMINATE)}`;
        this.swalWarrings.CreateSwal(swalWarningMessage,
          swalWarningTitle, swalWarningConfirm).then((result) => {
            if (result.value) {
              this.itemService.removeEquivalentItem(dataItem.Id).subscribe(() => {
                this.refreshItems.emit();
              });
            }
          });
      } else {
        this.removeEquivalentItem.emit(dataItem);
      }
    }
  }

  public getStyle(dataItem: Item): any {
    if (dataItem) {
      const isAvailable = dataItem.AllAvailableQuantity > 0;
      return {
        'color': isAvailable ? ItemConstant.ITEMS_STOCK_COLOR : ItemConstant.ITEMS_NOT_STOCK_FONT_WEIGHT,
        'font-weight': isAvailable ? ItemConstant.ITEMS_STOCK_FONT_WEIGHT : SharedConstant.EMPTY
      };
    }
  }
}
