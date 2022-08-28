import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {DropDownComponent} from '../../shared/interfaces/drop-down-component.interface';
import {FormGroup} from '@angular/forms';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../shared/utils/predicate';
import {ReducedItem} from '../../models/inventory/reduced-item.model';
import {FiltersItemDropdown} from '../../models/shared/filters-item-dropdown.model';
import {Item} from '../../models/inventory/item.model';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {DropDownFooterComponent} from '../../shared/components/drop-down-footer/drop-down-footer.component';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {ItemService} from '../../inventory/services/item/item.service';
import {FormModalDialogService} from '../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SearchItemService} from '../../sales/services/search-item/search-item.service';
import {KeyboardConst} from '../../constant/keyboard/keyboard.constant';
import {SearchConstant} from '../../constant/search-item';
import {ItemConstant} from '../../constant/inventory/item.constant';
import {MediaConstant} from '../../constant/utility/Media.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../stark-permissions/utils/utils';
import {FetchProductsComponent} from '../../inventory/components/fetch-products/fetch-products.component';
import {SearchItemAddComponent} from '../../sales/search-item/search-item-add/search-item-add.component';
import {NomenclatureService} from '../service/nomenclature.service';
import {Operation as op} from '../../../COM/Models/operations';
import {GammeService} from '../service/gamme.service';
import {NatureService} from '../../shared/services/nature/nature.service';
import {NatureTypesEnum} from '../../models/shared/enum/natureTypes.enum';
import {FabricationArrangementConstant} from '../../constant/manufuctoring/fabricationArrangement.constant';
import {FabricationArrangementService} from '../service/fabrication-arrangement.service';
import {DetailOfService} from '../service/detail-of.service';

const Id_Item = 'IdItem';

@Component({
  selector: 'app-dropdown-product-items',
  templateUrl: './dropdown-product-items.component.html',
  styleUrls: ['./dropdown-product-items.component.scss']
})
export class DropdownProductItemsComponent implements OnInit, DropDownComponent, OnChanges, OnDestroy {

  total: number;
  // in / out puts
  @Input() allowCustom;
  @Input() itemForm: FormGroup;
  @Input() selectedItemId;
  @Input() SelectedValue: number;
  @Input() parentViewContainerRef: ViewContainerRef;
  @Input() public source: string;
  // in case if  we need to show only item related to a tiers (Array of tiers)
  @Input() public tiersAssociated: number[];
  @Input() warehouseAssociated: number;
  @Input() activeKeyPress: boolean;
  @Input() public hideSearch: boolean;
  @Input() isFromProvsionning: boolean;
  @Input() itemListToIgnore: Array<any>;
  @Input() isMultiselect = false;
  @Input() isMultiselectWithPaginiation = false;
  @Input() isForSales: boolean;
  @Input() isForPurchase: boolean;
  @Input() isForItemReplacement = false;
  @Input() isForGarage: boolean;
  @Input() hasDefaultWarehouse: boolean;
  @Input() IdItem = Id_Item;
  @Input() MovementQty = 'MovementQty';
  @Input() idItemToIgnore: number;
  @Input() ignoreCharges: boolean;
  @Input() removeFilter: boolean;
  @Input() showFilter = false;
  @Input() public selectedTiers: number;
  @Input() disabled: boolean;
  @Input() readonly;
  @Input() orderByDescription: true;
  @ViewChild('searchButton') searchButton: ElementRef;
  @ViewChild('Dropdown') private dropp;
  @Output() Selected = new EventEmitter<boolean>();
  @Output() SelectedItem = new EventEmitter<boolean>();
  @Output() OpenPrductList = new EventEmitter<boolean>();
  @Output() ClosePrductList = new EventEmitter<boolean>();

  @Output() FocusOut = new EventEmitter<boolean>();
  @Output() reload = new EventEmitter<boolean>();
  @Output() Focused = new EventEmitter<boolean>();
  @Output() addClicked = new EventEmitter<boolean>();
  @Input() fromEcommerce: boolean;
  @Input() isFroSerach: boolean;
  @Input() isRestaurn = false;
  @Input() isOnlyStockManaged;
  @Input() isForReappro: boolean;
  @Input() isForImprovement: boolean;
  @Input() idStockDocument: number;
  @Output() closeLine = new EventEmitter<any>();
  @Input() isForPos: boolean;
  @Input() isForStockMvt: boolean;
  @Input() idItemToCharge: number[];
  // @Input() idWarehouse ;
  dataOnCloseSearchFetchModal: number;
  index: number;
  isFocused: boolean;
  // predicate filter
  @Input() predicate: PredicateFormat;
  itemSelected: any;
  // data sources
  itemValue: string;
  api: string;
  IsItemTecdoc = false;
  public openModel: boolean;
  public itemDataSource: ReducedItem[];
  @Input() public itemFiltredDataSource: ReducedItem[];
  public listOfAllItemDataSource: ReducedItem[];
  public lisItem: number[] = [];
  @Input() public filtersItemDropdown = new FiltersItemDropdown();
  @Input() isFromStockDocument = false;
  @Input() public isFromProducts = false;
  @Input() public selectedItemInList: Item;
  @Output() onItemSelect = new EventEmitter<any>();
  @Input() onlySelectedItem: boolean;
  @Input() isSubFinal: boolean;
  @Input() isOnlyProductNature: boolean;
  keyAction;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  tecDocDataForSearch: any;
  @ViewChild(DropDownFooterComponent) dropDownFooterComponent: DropDownFooterComponent;
  @ViewChild(ComboBoxComponent) itemComponent: ComboBoxComponent;
  @Input() public placeholder = SharedConstant.EMPTY;

  public customisedDropDownData: ReducedItem[];
  public customisedFilteredDropDownData = [];
  @Input() public customizedGridState: DataSourceRequestState;
  @Input() public fromListPredicate: PredicateFormat = new PredicateFormat();
  @Input() public gridSettings: GridSettings;
  @Input() public idStorage;
  @Input() public hasTiers;
  @Input() public isForRC;
  @Input() fromPriceRequest = false;
  @Input() public isForTransfertMvt;
  @Input() public tierType = undefined;
  @Input() idSalesPrice: number;
  @Input() allowRelationSupplierItems: boolean;
  private articleListId = [];
  private typeSelected = 2;

  constructor(private itemService: ItemService,
              private nomenclatureService: NomenclatureService,
              private gammeService: GammeService,
              private natureService: NatureService,
              private detailOfService: DetailOfService,
              private formModalDialogService: FormModalDialogService,
              private modalService: ModalDialogInstanceService, private el: ElementRef,
              private searchItemService: SearchItemService) {

  }

  prepareFiltersItemDropdown(): void {
    if (this.isForPurchase) {
      this.filtersItemDropdown.isForPurchase = true;
      this.filtersItemDropdown.isForSale = false;
    }
    if (this.isForSales) {
      this.filtersItemDropdown.isForPurchase = false;
      this.filtersItemDropdown.isForSale = true;
    }
    if (this.tiersAssociated && this.tiersAssociated.length > 0) {
      this.filtersItemDropdown.idTiers = this.tiersAssociated;
    }
    if (this.warehouseAssociated && !this.isForGarage) {
      this.filtersItemDropdown.idWarehouse = this.warehouseAssociated;
    }
    if (this.isForItemReplacement || this.idItemToIgnore) {
      this.filtersItemDropdown.idItemToIgnore = this.idItemToIgnore;
    }
    if (this.idItemToCharge) {
      this.filtersItemDropdown.idItemToCharge = this.idItemToCharge;
    }
    this.filtersItemDropdown.isRestaurn = this.isRestaurn;
    this.filtersItemDropdown.skip = this.gridState.skip;
    this.filtersItemDropdown.take = this.gridState.take;
    this.filtersItemDropdown.valueToSearch = this.itemValue;
    this.filtersItemDropdown.ignoreCharges = this.ignoreCharges;
    this.filtersItemDropdown.isOnlyStockManaged = this.isOnlyStockManaged;
    this.filtersItemDropdown.isForReappro = this.isForReappro;
    if (this.fromEcommerce === true) {
      this.filtersItemDropdown.fromEcommerce = true;
    }
    this.filtersItemDropdown.idStorage = this.idStorage;
    if (this.onlySelectedItem && this.itemForm) {
      this.filtersItemDropdown.id = this.itemForm.controls[this.IdItem].value;
      this.onlySelectedItem = false;
    } else {
      this.filtersItemDropdown.id = null;
    }
    if (this.hasTiers) {
      this.filtersItemDropdown.hasTiers = true;
    }
    if (this.searchItemService && this.searchItemService.idSelectedSalesPrice) {
      this.filtersItemDropdown.idSalesPrice = this.searchItemService.idSelectedSalesPrice;
    }
    if (this.isSubFinal) {
      this.filtersItemDropdown.isSubFinal = this.isSubFinal;
    }
    if (this.isOnlyProductNature) {
      this.filtersItemDropdown.idNature = NumberConstant.ONE;
      this.filtersItemDropdown.isOnlyProductNature = this.isOnlyProductNature;
    }
  }

  ngOnInit(): void {

    if (this.isFromProducts && this.gridSettings && this.gridSettings.gridData && !this.gridSettings.gridData.data) {
      this.initDataSource();
    } else if (this.isFromProducts && this.gridSettings && this.gridSettings.gridData && this.gridSettings.gridData.data) {
      this.customisedFilteredDropDownData = this.gridSettings.gridData.data;
      this.customisedDropDownData = this.gridSettings.gridData.data;
      this.total = this.gridSettings.gridData.total;
      this.initDropDownFooterComponent(this.gridSettings.state);
    } else if (!this.isFromProducts) {
      this.initDataSource();
    }
    this.keyAction = (event) => {
      const keyName = event.key;
      if (this.hideSearch !== true) {
        if (keyName === KeyboardConst.F2) {
          if (this.isFocused) {
            this.onSearchClicked();
          }
        }
        if (keyName === KeyboardConst.ESCAPE) {
          if (this.searchItemService.openedModalOptions) {
            this.searchItemService.openedModalOptions.onClose();
            this.searchItemService.openedModalOptions = undefined;
          }
          this.modalService.closeAnyExistingModalDialog();
          this.clearValueOfSearch();
          this.closeLine.emit();
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
    this.itemSelected = this.SelectedValue;
    if (this.filtersItemDropdown) {
      this.filtersItemDropdown.constaines = true;
    }
    this.Selected.emit(this.itemSelected);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes[ItemConstant.CUSTOMIZED_GRID_STATE]) {
      this.gridState = Object.assign({}, this.customizedGridState);
    }
    if (this.gridSettings && this.gridSettings.gridData) {
      this.customisedDropDownData = this.gridSettings.gridData.data;
    }
    this.customisedFilteredDropDownData = this.customisedDropDownData;

  }

  public initDataSource(paging?): void {
    let selectedValue;
    this.natureService.listdropdown().subscribe((data: any) => {
        selectedValue = data.listData.slice(0).filter((s) => s.Code === NatureTypesEnum.PRODUCT);
        if (selectedValue) {
          this.typeSelected = selectedValue[0].Id;
        }
      }
    );

    if (this.isFromProducts) {
      this.initDataSourceFromExistingPredicate();
    } else if (this.isMultiselectWithPaginiation) {
      this.isMultiSelectectWithPagination(paging);
    } else {
      this.getDeropDownData(paging);
    }
  }

  /**
   * To be used in case we pass filterItemDropDown as input
   */
  public initDataSourceFromExistingPredicate() {
    if (this.orderByDescription) {
      this.fromListPredicate = this.preparePredicate(this.fromListPredicate);
    }
    this.itemService.reloadServerSideDataWithListPredicate(this.gridState, [this.fromListPredicate],
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe((result) => {
      result.data.forEach(product => {
        product.image = MediaConstant.PLACEHOLDER_PICTURE;
        if (product.FilesInfos) {
          let firstImage: any;
          firstImage = product.FilesInfos.filter(fileinfo => fileinfo.Extension !== MediaConstant.DOT_MP4)[NumberConstant.ZERO];
          if (firstImage) {
            product.image = firstImage.FileData;
          }
        }
      });
      this.customisedDropDownData = result.data;
      this.customisedFilteredDropDownData = result.data;
      if (this.gridSettings) {
        this.gridSettings.gridData.data = result.data;
        this.gridSettings.gridData.total = result.total;
      }
      this.total = result.total;
      this.initDropDownFooterComponent();
    });
  }

  /**
   * @param paging
   *  case kendo-multi-select with paginiation
   *  check if case is add componenet mode or case is edit componenet
   */
  private isMultiSelectectWithPagination(paging) {
    this.prepareFiltersItemDropdown();
    if (paging || !this.itemSelected) {
      this.multiSelectWithPagerModeAdd();
    } else if (this.itemSelected.length > 0) {
      this.multiSelectWithPagerModeEdit();
    }
  }

  private multiSelectWithPagerModeAdd() {
    this.itemService.getItemDropDownList(this.filtersItemDropdown).subscribe(data => {
      this.initListItems(data);
      this.initDropDownFooterComponent();
    });
  }

  private multiSelectWithPagerModeEdit() {
    this.itemService.getItemsAfterFilter(this.itemSelected).subscribe(data => {
      this.initListItems(data);
      this.itemSelected = this.itemFiltredDataSource;
    });
  }

  private initListItems(data) {
    this.itemDataSource = data.listData;
    this.listOfAllItemDataSource = data.listData;
    this.itemFiltredDataSource = this.itemDataSource.slice(0);
    this.total = data.total;
  }

  private getDeropDownData(paging) {
    this.prepareFiltersItemDropdown();
    if (!this.isMultiselect) {
      this.notMultiSelectDropDown(paging);
    } else if (this.isMultiselect && this.lisItem.length > 0) {
      this.multiselect();
    }
  }

  private multiselect() {
    this.itemService.getItemsAfterFilter(this.lisItem).subscribe(data => {
      this.itemDataSource = data.listData;
      this.listOfAllItemDataSource = data.listData;
      this.itemFiltredDataSource = this.itemDataSource.slice(0);
      this.total = data.total;
    });
  }

  onValueMapper(event): void {
    const value = this.itemForm.controls[this.IdItem].value;
    if (value && value !== 0 && this.itemDataSource.filter(x => x.Id === value).length === 0) {
      this.valueMapper();
    } else {
      this.SelectedItem.emit(event);
      this.Selected.emit(event);
    }
  }

  async getArticlesListId() {
    switch (this.source) {
      case  'NOMENCLATURE':
        this.articleListId = [];
        break;
      case  'GAMME':
        await this.nomenclatureService.getJavaGenericService()
          .getEntityList('findListArticlesWithNomenclature')
          .toPromise().then(data => {
            this.articleListId = data.length === 0 ? [0] : data;
          });
        break;
      case 'OF' :
        await this.gammeService.getJavaGenericService()
          .getEntityList('findListArticlesWithGamme')
          .toPromise().then(data => {
            this.articleListId = data.length === 0 ? [0] : data;
          });
        break;
      case 'OF-ARTICLE-DROPDOWN' :
        await this.detailOfService.callService(op.GET, FabricationArrangementConstant.FABRICATION_GET_ALL_IDS_ARTICLES)
          .toPromise().then(data => {
            this.articleListId = data.length === 0 ? [0] : data;
          });
        break;
      default :
        this.articleListId = [];
    }
    if (this.selectedItemId) {
      if (this.articleListId && !this.articleListId.includes(this.selectedItemId)) {
        this.articleListId.push(this.selectedItemId);
      }
    }
  }


  private async notMultiSelectDropDown(paging) {
    await this.getArticlesListId().then(r => {
        if (this.gridState.skip >= 0) {
          this.filtersItemDropdown.idItemToCharge = this.articleListId;
          this.filtersItemDropdown.take = 10;
          this.filtersItemDropdown.idNature = this.typeSelected;
          this.itemService.getItemDropDownList(this.filtersItemDropdown).subscribe(data => {
            this.itemDataSource = data.listData;
            this.listOfAllItemDataSource = data.listData;
            this.itemFiltredDataSource = this.itemDataSource.slice(0);
            this.total = data.total;
            this.initDropDownFooterComponent();
            if (isNotNullOrUndefinedAndNotEmptyValue(this.itemForm)) {
              const value = this.itemForm.controls[this.IdItem].value;
              if (isNotNullOrUndefinedAndNotEmptyValue(value) && paging !== true) {
                this.onValueMapper(this);
              }
            }
          });
        } else if (this.isMultiselect && this.lisItem.length === 0) {
          this.itemService.getItemsAfterFilter(this.articleListId).subscribe(data => {
            this.itemDataSource = data.listData;
            this.listOfAllItemDataSource = data.listData;
            this.itemFiltredDataSource = this.itemDataSource.slice(0);
            this.total = data.total;
          });
        }
      }
    );
  }

  valueMapper(): void {
    const instance: any = this;
    let value;
    if (this.IsItemTecdoc) {
      value = this.tecDocDataForSearch.Id;
    } else {
      value = this.itemForm.controls[this.IdItem].value;
    }
    this.itemService.getDataSourcePredicateValueMapper(value, this.filtersItemDropdown).subscribe(data => {
      instance.gridState.skip = Math.floor((data.listData) / instance.gridState.take) * instance.gridState.take;
      instance.initDataSource((instance.gridState.skip / instance.gridState.take) >= 1);
      this.Selected.emit(instance);
    });
  }

  /**
   * @param event
   */
  public onSelect(event): void {
    this.addClicked.emit();
    if (this.gridState.filter.filters.length > 0) {
      this.gridState.filter.filters = [];
      this.initDataSource();
    } else {
      if (this.itemForm) {
        const Id = this.itemForm.controls[this.IdItem].value;
        let SelectedItem = this.itemFiltredDataSource.find(x => x.Id === Id);
        if (SelectedItem) {
          if (this.itemForm.controls['LabelItem']) {
            this.itemForm.controls['LabelItem'].setValue(SelectedItem.Code);
          }
          if (this.itemForm.controls['Designation']) {
            this.itemForm.controls['Designation'].setValue(SelectedItem.Description);
          }
        } else if (Id !== undefined) {
          SelectedItem = this.itemFiltredDataSource.find(x => x.Description.includes(Id));
          if (SelectedItem) {
            this.itemForm.controls[this.IdItem].setValue(SelectedItem.Id);
          }
        }
      }
      this.Selected.emit(event);
      this.SelectedItem.emit(event);
    }
  }

  /**
   * @param event
   */
  public onFocus(event): void {
    this.isFocused = true;
    this.Focused.emit(event);
  }


  public focusOut(event) {
    if ((typeof this.itemForm.controls[this.IdItem].value) === 'string') {
      this.itemForm.controls[this.IdItem].setValue(null);
      this.itemValue = null;
      this.ngOnInit();
    }
    if (this.onlySelectedItem) {
      this.filtersItemDropdown.id = null;
      this.initDataSource(true);
    }
    this.isFocused = false;
    this.FocusOut.emit(event);
  }

  /**
   * search with code/Description/Barecode1D
   * @param value
   */
  public handleFilter(value: string): void {
    if (value) {
      value = value.trim();
    }
    this.itemValue = value;
    if (this.isMultiselect) {
      this.itemFiltredDataSource = this.itemDataSource.filter((s) =>
        s.Code.toLowerCase().includes(value.toLowerCase()) || s.Description.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.gridState.skip = 0;
      this.gridState.take = 10;
      this.initDataSource(true);
    }
  }


  nextPage(sender): void {
    this.gridState.skip = ((sender.target.tabIndex) - 1) * this.gridState.take;
    if (this.gridSettings) {
      this.gridSettings.state.skip = this.gridState.skip;
    }
    this.initDataSource(true);
  }

  Pager(step): void {
    const pageNumber = Math.floor(this.gridState.skip / this.gridState.take);
    const pageNumberFrom = Math.floor(pageNumber / 10) * 10;
    this.gridState.skip = (pageNumberFrom + (step * 10)) * this.gridState.take;
    if (this.gridSettings) {
      this.gridSettings.state.skip = this.gridState.skip;
    }
    this.initDataSource(true);
  }

  /**
   * on surch button click
   * */
  onSearchClicked(): void {
    let filterObject;
    if (this.activeKeyPress) {
      filterObject = {
        filtersItemDropdown: this.filtersItemDropdown,
        valueToFind: this.itemValue,
        loadTier: true,
        import: true,
        ismodal: true,
        isForItemReplacement: this.isForItemReplacement,
        idItemToIgnore: this.idItemToIgnore,
        isPurchase: this.isForPurchase,
        isFroSerach: this.isFroSerach,
        isForGarage: this.isForGarage,
        hasDefaultWarehouse: this.hasDefaultWarehouse,
        idWarehouse: this.warehouseAssociated,
        isWharehouseFilterRequired: false,
        isForReappro: this.isForReappro,
        isForImprovement: this.isForImprovement,
        idStockDocument: this.idStockDocument,
        isOnlyStocKManaged: this.isOnlyStockManaged,
        isFromStockDocument: this.isFromStockDocument,
        isForRC: this.isForRC,
        isForTransfertMvt: this.isForTransfertMvt,
        tierType: this.tierType,
        isForPos: this.isForPos,
        idSalesPrice: this.searchItemService.idSelectedSalesPrice,
        isForStockMvt: this.isForStockMvt
      };
    }
    filterObject.filtersItemDropdown.skip = 0;
    if (this.isFroSerach) {
      filterObject.isWharehouseFilterRequired = true;
    }
    if (this.itemForm && this.itemForm.controls['IdDocument'] && this.itemForm.controls['IdDocument'].value
      && this.searchItemService && this.fromPriceRequest) {
      this.searchItemService.idDocument = this.itemForm.controls['IdDocument'].value;
    }
    this.openModel = true;
    // is for serach is used to open FetchProductsComponent and not serach item modal
    if (this.isForItemReplacement || this.isFroSerach || this.isFromProvsionning) {
      if (this.isFromProvsionning) {
        this.dataOnCloseSearchFetchModal = this.searchItemService.idProvision;
        this.searchItemService.idSupplier = this.tiersAssociated[0];
      }
      this.formModalDialogService.openDialog(null, FetchProductsComponent,
        this.parentViewContainerRef, this.onCloseSearchFetchModal.bind(this), filterObject, true, SharedConstant.MODAL_DIALOG_SIZE_L);
      this.OpenPrductList.emit(this.openModel);
    } else {
      this.searchItemService.isClosed = false;
      this.searchItemService.isForPurchase = this.isForPurchase;
      this.searchItemService.isInDocument = true;
      this.searchItemService.hideDocumentDetail = true;
      this.searchItemService.setIsFromSearchItem_supplierInetrface(true);
      if (this.selectedTiers) {
        filterObject.selectedTiers = this.selectedTiers;
      } else if (this.searchItemService && this.searchItemService.idSupplier) {
        filterObject.selectedTiers = this.searchItemService.idSupplier;
      }
      if (!this.isForSales) {
        filterObject.isFromAddDocumentLine = true;
      }
      filterObject.allowRelationSupplierItems = this.allowRelationSupplierItems;
      this.formModalDialogService.openDialog(null, SearchItemAddComponent,
        this.parentViewContainerRef, this.onCloseSearchItemAddModal.bind(this), filterObject, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }


  /**
   * on close search modal event
   * @param selectedDataItemId
   */
  onCloseSearchFetchModal(data): void {
    this.tecDocDataForSearch = data;
    this.IsItemTecdoc = this.tecDocDataForSearch.IsItemTecdoc;
    const idItem = data.Id ? data.Id : data;
    if (Number(idItem)) {
      if (this.itemForm) {
        this.itemForm.controls[this.IdItem].setValue(idItem);
        if (this.itemForm.controls['Designation'] && data.Description) {
          this.itemForm.controls['Designation'].setValue(data.Description);
        }
        if (this.itemForm.controls['LabelItem'] && data.Code) {
          this.itemForm.controls['LabelItem'].setValue(data.Code);
        }
      } else if (this.isFromProvsionning) {
        this.itemSelected = idItem;
      }
    }
    this.clearValueOfSearch();
    this.onValueMapper(this);
    this.openModel = false;
    this.ClosePrductList.emit(this.openModel);
    this.searchItemService.closeFetchProductsModalSubject.next(this.dataOnCloseSearchFetchModal);
  }

  onCloseSearchItemAddModal(data): void {
    this.openModel = false;
  }

  public getItemRelatedToWarehouse(idWarehouse) {
    if (idWarehouse) {
      this.initDataSource();
    } else {
      this.warehouseAssociated = null;
      this.itemFiltredDataSource = [];
    }
  }

  focusOnComboBox() {
    this.dropp.focus();
  }

  public getAllItems() {
    this.initDataSource();
  }

  public clearValueOfSearch() {
    this.itemValue = undefined;
    this.openModel = false;
  }

  ngOnDestroy(): void {
    this.itemValue = undefined;
    this.filtersItemDropdown.constaines = true;
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  addNew(): void {
  }

  selectFilter() {
    this.filtersItemDropdown.constaines = !this.filtersItemDropdown.constaines;
    this.initDataSource(true);
  }

  private initDropDownFooterComponent(gridStateParam?: DataSourceRequestState) {
    const gridState = gridStateParam ? gridStateParam : this.gridState;
    if (this.dropDownFooterComponent != null) {
      this.dropDownFooterComponent.skip = gridState.skip;
      this.dropDownFooterComponent.take = gridState.take;
      this.dropDownFooterComponent.total = this.total;
      this.dropDownFooterComponent.initPagerData();
    }
  }

  /**
   * search with code/Description/Barecode1D
   * @param value
   */
  public handleFilterWithPager(value: string): void {
    if (value) {
      value = value.trim();
    }
    this.itemValue = value;
    this.gridState.skip = 0;
    this.gridState.take = 10;
    this.initDataSource(true);
  }

  public selectItem(itemId: number) {
    const selectedItem = this.customisedFilteredDropDownData.find(item => item.Id === itemId);
    if (isNotNullOrUndefinedAndNotEmptyValue(selectedItem)) {
      this.onItemSelect.emit(selectedItem);
    }
  }

  public onCustomisedDataFilter(searchValue: string) {
    searchValue = searchValue.trim().toLowerCase();
    this.setFromListPredicate(searchValue);
    this.initDataSourceFromExistingPredicate();
  }

  private setFromListPredicate(filterValue?: string) {
    if (!this.fromListPredicate) {
      this.fromListPredicate = new PredicateFormat();
    }
    if (!this.fromListPredicate.Filter) {
      this.fromListPredicate.Filter = new Array<Filter>();
    }
    this.fromListPredicate.Filter.push(new Filter(ItemConstant.CODE, Operation.contains, filterValue, true, true));
    this.fromListPredicate.Filter.push(new Filter(ItemConstant.DESCRIPTION, Operation.contains, filterValue, true, true));
  }

  preparePredicate(predicate: PredicateFormat): PredicateFormat {
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(ItemConstant.DESCRIPTION, OrderByDirection.asc));
    return predicate;
  }
}
