import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {
  DataStateChangeEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  PagerSettings,
  RowClassArgs
} from '@progress/kendo-angular-grid';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { FormGroup, Validators } from '@angular/forms';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { ProvisioningConstant } from '../../../constant/purchase/provisioning.constant';
import { Filter, Operation, Operator, PredicateFormat } from '../../../shared/utils/predicate';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { OrderProjectService } from '../../services/order-project/order-project.service';
import { ProvisioningService } from '../../services/order-project/provisioning-service.service';
import { CmdNotDecomposable, digitsAfterCommaCMD, ValidationService } from '../../../shared/services/validation/validation.service';
import { ItemService } from '../../../inventory/services/item/item.service';
import { Router } from '@angular/router';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { DetailsProductComponent } from '../../../shared/components/item/details-product/details-product.component';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { Currency } from '../../../models/administration/currency.model';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { CompanyService } from '../../../administration/services/company/company.service';
import { isBetweenKendoDropdowns } from '../../../shared/helpers/component.helper';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { PeriodConstant } from '../../../constant/Administration/period.constant';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';

const DETAILS_URL = 'main/inventory/product/details/';
export const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);
const SHOW = '/show/';
const EDIT = '/edit/';
const EDIT_PROVISION = '/editProvision/';
const ACTION = 'ACTIONS';

@Component({
  selector: 'app-grid-provision',
  templateUrl: './grid-provision.component.html',
  styleUrls: ['./grid-provision.component.scss'],
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
  `],
})
export class GridProvisionComponent implements OnInit {
  @Input() idProvision: number;
  @Input() selectedRow;
  @Input() selectedValueMultiSelect;
  @Input() isTheOrderBtnDisabled: boolean;
  @Input() isForReappro: boolean;
  @Output() htPeerSupplier = new EventEmitter<any>();
  @Output() generateEquivalentProduct = new EventEmitter<any>();
  @Output() quantityDetails = new EventEmitter<any>();
  @Output() updateSupplierSelectedList = new EventEmitter<any>();
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild('provisionGrid') public provisionGrid: GridComponent;
  @ViewChild(ItemDropdownComponent) itemDropDown;
  public haveUpdatePermission : boolean;
  public haveAddPermission : boolean;
  public docClickSubscription: any;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private editedRowIndex: number;
  public formGroup: FormGroup;
  isNew: boolean;
  public formatOptions: any;
  public companyFormatOptions: any;
  itemToBeRemoved: boolean;
  gridObject: any;
  predicate: PredicateFormat;
  itemSected: number;
  Warehouse: number;
  /**
   * The value of the search text input
   */
  public searchValue: string;
  public mySelection: number[] = [NumberConstant.ZERO];
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 20,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };

  public skip = 0;
  public pageSize = 20;

  dataDetailsOnOrderQuantity: GridDataResult;
  public selectedRowOfOnOrderQuantity;
  allDataDetailsOnOrderQuantity: any;
  public skipOnOrderQuantity = 0;
  public pageSizeOnOrderQuantity = 20;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public statusCode = documentStatusCode;
  formatSaleOptions: any;
  currency: any;
  public FormatNumber = SharedConstant.NUMBER_FORMAT;

  constructor(private OrderService: OrderProjectService,
    private provisioningService: ProvisioningService, private router: Router,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
    private modalService: ModalDialogInstanceService, private swalWarrings: SwalWarring,
    private validationService: ValidationService, public itemService: ItemService,
      private renderer: Renderer2, private companyService: CompanyService, private translate: TranslateService, public authService: AuthService,
    private serachItemSearvice: SearchItemService, private localStorageService : LocalStorageService) {
    this.closeSearchFetchModalSubscription();
  }

  closeSearchFetchModalSubscription() {
    this.serachItemSearvice.closeFetchProductsModalSubject.observers = [];
    this.serachItemSearvice.closeFetchProductsModalSubject.subscribe((provisionId: number) => {
      this.closeItemModalEvent(provisionId);
    });
  }

  public ngOnInit() {
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PROVISIONING);
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_PROVISIONING);
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    if (this.idProvision > 0) {
      this.preparePredicate();
      this.getDataWithPaging();
    }
      this.formatSaleOptions = {
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
      this.currency = this.localStorageService.getCurrencySymbol();
      this.companyFormatOptions = {
        style: 'currency',
        currency: this.localStorageService.getCurrencyCode(),
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
      };
  }

  /** get supplier currency */
  public getSelectedCurrency(data?) {
    let currencyInfo;
    if (data) {
      currencyInfo = data;
    } else {
      currencyInfo = this.formGroup.getRawValue();
    }
    this.formatOptions = {
      style: 'currency',
      currency: currencyInfo.CurrencyCode,
      currencyDisplay: currencyInfo.symbol,
      minimumFractionDigits: currencyInfo.CurrencyPrecision
    };
  }

  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.page = this.skip;
    this.predicate.pageSize = this.pageSize;
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.preparePredicate();
    this.getDataWithPaging();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.skip = state.skip;
    this.pageSize = state.take;
    this.preparePredicate();
    if (!this.predicate.Filter) {
      this.predicate.Filter = new Array<Filter>();
    }
    if (this.gridSettings.state.filter && this.gridSettings.state.filter.filters.length > 0) {
      this.gridSettings.state.filter.filters.forEach((element: any) => {
        const o = Operation[element.operator] as any;
        this.predicate.Filter.push(new Filter(element.field, o, element.value));
      });
    }
    this.getDataWithPaging();
  }

  public itecmChange() {
    if (this.itemDropDown) {
      this.itemDropDown.getAllItems();
    }
  }

  public getItemRelatedToClient(suppliers) {
    if (this.itemDropDown) {
      this.itemDropDown.getItemRelatedToClient(suppliers);
    }
  }

  /**check if the line is in editing mode */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  @HostListener('keyup', ['$event'])
  keyEvent(event) {
    let selectedIndex: number;
    let OpenLineIndex: number;
    // get data from grid
    const dataGrid = this.grid.data as { data, total };
    if (dataGrid) {
      if (!isBetweenKendoDropdowns(event)) {

        if (event.key === KeyboardConst.ARROW_DOWN &&
          event.path[3].rowIndex < dataGrid.data.length - 1) {

          // get next index
          selectedIndex = event.path[3].rowIndex + 1;
          OpenLineIndex = this.editedRowIndex + 1;

          this.moveToNexLine(selectedIndex, dataGrid, OpenLineIndex);
        } else if (event.key === KeyboardConst.ARROW_UP && event.path[3].rowIndex > 0) {

          // get previous index
          selectedIndex = event.path[3].rowIndex - 1;
          OpenLineIndex = this.editedRowIndex - 1;
          this.moveToNexLine(selectedIndex, dataGrid, OpenLineIndex);

          // if it is the first or last line at the grid
        } else if ((event.key === KeyboardConst.ARROW_DOWN || event.key === KeyboardConst.ARROW_UP)) {
          this.saveCurrent();
        }

      }

      if (event.key === KeyboardConst.ENTER) {
        this.saveCurrent();
      }


      if (event.key === KeyboardConst.ESCAPE) {
        this.closeRow();
      }
      if (event.key === KeyboardConst.F2) {
        this.onClickGoToDetails(dataGrid.data[this.editedRowIndex].IdItem);
      }
    }
  }

  moveToNexLine(selectedIndex: number, dataGrid: any, OpenLineIndex: number) {
    this.gridObject = { isEdited: false, dataItem: dataGrid.data[selectedIndex], rowIndex: OpenLineIndex };
    this.saveCurrent();
  }

  public opneNextLineWithKeyBoard() {
    if (this.gridObject) {
      this.editHandler(this.gridObject);
    }
  }

  public loadItems(data?): void {
    if (data && data.listObject !== null) {
      this.gridSettings.gridData = data.listObject;
      this.gridSettings.gridData.data = data.listObject.listData;
      this.gridSettings.gridData.total = data.listObject.total;
    }
  }

  /**Add new line to grid */
  public addLineToGrid(): void {
    this.itemSected = null;
    this.Warehouse = null;
    this.clearGridRow();
    this.formGroup = this.OrderService.createFormGroup(null, this.idProvision);
    this.isNew = true;
    this.grid.addRow(this.formGroup);
    this.formGroup.disable();
    this.formGroup.controls[ProvisioningConstant.ID_ITEM].enable();
    this.formGroup.controls['IdItem']
    .setValidators([Validators.required,Validators.minLength(1),Validators.min(0)]);
    this.formGroup.controls[ProvisioningConstant.MOUVEMENT_QUANTITY].enable();
    this.gridObject = undefined;
  }

  /**When the cell grdi is selected */
  public editHandler({ isEdited, dataItem, rowIndex }): void {
    if (isEdited || (this.formGroup && !this.formGroup.valid) || !this.haveUpdatePermission || this.isInEditingMode || this.isTheOrderBtnDisabled === true) {
      return;
    }
    this.selectedRow = dataItem;
    this.mySelection = [dataItem.IdItem];
    this.formGroup = this.OrderService.createFormGroup(dataItem, this.idProvision);
    this.formGroup.disable();
    this.formGroup.controls[ProvisioningConstant.MOUVEMENT_QUANTITY].enable();
    this.formGroup.controls[ProvisioningConstant.ID_ITEM].enable();
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.formGroup);
    this.gridObject = undefined;
    this.generateEquivalentProduct.emit(this.selectedRow);
  }

  public cancelHandler(): void {
    this.clearGridRow();
  }

  /**close current edited line  */
  private clearGridRow(): void {
    this.closeRow();
    this.opneNextLineWithKeyBoard();
  }

  private closeRow() {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isNew = false;
  }

  /**Save the current edited line */
  public saveCurrent(): void {
    if (this.formGroup) {
      if (this.formGroup.valid) {
        this.saveItem(false);
      } else {
        this.validationService.validateAllFormFields(this.formGroup);
      }
    }
  }

  private saveItem(isToUpdate: boolean, dataItem?) {
    let valueToSend;
    if (dataItem) {
      valueToSend = dataItem;
    } else {
      valueToSend = this.formGroup.getRawValue();
    }
    this.provisioningService.itemDetails(valueToSend, isToUpdate).subscribe(data => {
      if (data && data.objectData !== null) {
        this.addOrUpdateLine(data);
        this.cancelHandler();
        this.htPeerSupplier.emit(data.objectData.Id);
      } else {
        this.getDataWithPaging();
        this.htPeerSupplier.emit();
      }
    });
  }

  selecteText() {
    if (document.getElementById('prov_MvtQty')) {
      const selectedQty = document.getElementById('prov_MvtQty') as any;
      selectedQty.focus();
      selectedQty.select();
    }
  }

  private addOrUpdateLine(data) {
    if (this.isNew === true) {
      this.getDataWithPaging();
    } else {
      this.updateExsitingLine(data);
    }
  }

  closeItemModalEvent(provisionId?: number) {
    this.getDataWithPaging();
    this.cancelHandler();
    this.htPeerSupplier.emit(provisionId);
  }

  private updateExsitingLine(data) {
    if (data.objectData[0].IdTiersNavigation === null) {
      data.objectData[0].IdTiersNavigation = data.objectData[0].IdItemNavigation.ItemTiers.filter(x => x.idTiers == data.objectData[0].idTiers)[0].IdTiersNavigation;
    }
    Object.assign(this.gridSettings.gridData.data.find(({ Id }) => Id === data.objectData[0].Id), data.objectData[0]);
  }

  /**remove line */
  public removeDocumentLine({ dataItem }) {
    this.swalWarrings.CreateSwal(ItemConstant.ITEM_DELETE_TEXT_MESSAGE, ItemConstant.ITEM_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.itemToBeRemoved = true;
        dataItem.IsDeleted = true;
        this.saveItem(true, dataItem);
        this.updateSupplierSelectedList.emit(this.idProvision);
      }
    });
  }

  public getDataWithPaging() {
    if (this.idProvision > 0) {

      this.provisionGrid.loading = true;
      this.provisioningService.GetItemsWithPaging(this.idProvision, this.predicate).subscribe(data => {
        if (data.listObject && data.listObject.listData.length > 0) {
          data.listObject.listData.forEach(element => {
            this.getSelectedCurrency(element);
            element.formatOptions = this.formatOptions;
          });
        }
        this.loadItems(data);
        this.clearGridRow();

        this.provisionGrid.loading = false;
      });
    }
  }

  /**Grid cell click */
  public cellClickHandler({ isEdited, dataItem, rowIndex, column }) {
    if (this.isNotLastColumnInDataGrid(column)) {
      if (this.itemToBeRemoved !== true) {
        this.editHandler({ isEdited, dataItem, rowIndex });
      }
      this.itemToBeRemoved = false;
    }
  }


  private isNotLastColumnInDataGrid(column): boolean {
    return !(column && column.title === this.translate.instant(ACTION));
  }

  public setQuantityDetails($event) {
    this.quantityDetails.emit($event);
  }

  public setIdProvision(id: number) {
    this.idProvision = id;
    this.getDataWithPaging();
  }

  /** show quantity details */
  onOrderQuantityDetails(IdItem) {
    this.selectedRowOfOnOrderQuantity = IdItem;
    this.itemService.getOnOrderQuantityDetails(IdItem).subscribe((dataOfOnOrderQuantityDetails) => {
      this.allDataDetailsOnOrderQuantity = dataOfOnOrderQuantityDetails;
      this.loadOnOrderQuantity();
    });
  }

  public pageChangeOnOrderQuantity({ skip, take }: PageChangeEvent): void {
    this.skipOnOrderQuantity = skip;
    this.pageSizeOnOrderQuantity = take;
    this.loadOnOrderQuantity();
  }

  private loadOnOrderQuantity(): void {
    this.dataDetailsOnOrderQuantity = {
      data: this.allDataDetailsOnOrderQuantity.listData.slice(this.skipOnOrderQuantity,
        this.skipOnOrderQuantity + this.pageSizeOnOrderQuantity),
      total: this.allDataDetailsOnOrderQuantity.total
    };
  }

  public rowCallback(context: RowClassArgs) {
    switch (context.dataItem.Color) {
      case 'red':
        return { red: true };
      case 'orange':
        return { orange: true };
      case 'green':
        return { green: true };
      default:
        return {};
    }
  }

  onClickGoToDetails(id) {
    const title = ItemConstant.DETAILS_PRODUCT;
    this.formModalDialogService.openDialog(title, DetailsProductComponent,
      this.viewRef, this.close.bind(this), id, true,
      SharedConstant.MODAL_DIALOG_SIZE_XXL);
  }

  close() {
    this.modalService.closeAnyExistingModalDialog();
    this.selecteText();
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
      }
      window.open(url.concat(idDocument).concat('/').concat(idDocumentStatus), '_blank');
    }
  }

  public onDocumentClick(e: any): void {
    if (!matches(e.target,
      'tbody *, .k-grid-toolbar .k-button, .k-grid-add-command, .k-link, .input-checkbox100, .label-checkbox100, .k-button.k-button-icon')
      && (e.target.parentElement && !matches(e.target.parentElement,
        '.k-grid-add-command, .k-animation-container, .k-animation-container-show, k-popup k-list-container k-reset'))
      && (e.composedPath().filter(x => x.tagName === 'MODAL-DIALOG').length === 0 &&
        e.composedPath().filter(x => x.className === 'modal').length === 0)
      && !e.target.className.includes('swal')) {
      this.cancelHandler();
    }
  }

  filter() {
    this.predicate.Filter = new Array<Filter>();
    if (this.searchValue) {
      this.searchValue = this.searchValue ? this.searchValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.searchValue;
      this.predicate.Filter.push(new Filter(DocumentConstant.CODE_NAVIGATION, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(DocumentConstant.DESCRIPTION_NAVIGATION, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(DocumentConstant.ID_TIER_NAVIGATION_NAME, Operation.contains, this.searchValue, false, true));
      this.predicate.Filter.push(new Filter(DocumentConstant.MVT_QT, Operation.contains, this.searchValue, false, true));
    }
    this.getDataWithPaging();
  }
  onSelect($event) {
    var dataItem = this.formGroup.getRawValue();
    var item = dataItem != null ? $event.itemDataSource.find(x => x.Id == dataItem.IdItem) : null;
    if (item != null && item.IsDecomposable) {
      this.formGroup.controls['MvtQty']
        .setValidators([Validators.minLength(1),
        Validators.min(0),
        Validators.max(NumberConstant.MAX_QUANTITY),
        digitsAfterCommaCMD(item.DigitsAfterComma)]);
    } else if (item != null && !item.IsDecomposable) {
      this.formGroup.controls['MvtQty']
        .setValidators([Validators.minLength(1),
        Validators.min(0),
        Validators.max(NumberConstant.MAX_QUANTITY),
        CmdNotDecomposable()]);
     } 
    else if (item == null) {
      this.formGroup.controls['IdItem']
        .setValidators([Validators.required,Validators.minLength(1)]);
     }
  }
}
