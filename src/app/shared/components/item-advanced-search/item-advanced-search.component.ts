import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Filter, PredicateFormat, Relation } from '../../utils/predicate';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ItemService } from '../../../inventory/services/item/item.service';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { ItemFiltreListComponent } from './item-filtre-list/item-filtre-list.component';
import { TecdocService } from '../../../inventory/services/tecdoc/tecdoc.service';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { isNullOrUndefined } from 'util';
import { FilterSearchItem } from '../../../models/inventory/filter-search-item-model';

@Component({
  selector: 'app-item-advanced-search',
  templateUrl: './item-advanced-search.component.html',
  styleUrls: ['./item-advanced-search.component.scss']
})
export class ItemAdvancedSearchComponent implements OnInit {
  isSearchLoaded: boolean;
  @ViewChild(ItemFiltreListComponent) public itemFiltreListComponent: ItemFiltreListComponent;
  @Input() hasDefaultWarehouse: boolean;
  @Input() isForGarage: boolean;
  @Input() idWarehouse: number;
  @Input() isModal = false;
  @Input() listTiers;
  @Input() selectedWarehouseFromItemDropDown;
  @Input() filterFromTecDoc: boolean;
  @Output() public isVisibleAdvancedSearch = new EventEmitter<boolean>();
  @Output() public searchButtonClickEvent = new EventEmitter<PredicateFormat>();
  @Output() public resetButtonClickEvent = new EventEmitter<boolean>();
  @Output() public isTecdocSearchEvent = new EventEmitter<boolean>();
  @Output() public sendInitialPredicate = new EventEmitter<PredicateFormat>();
  @Output() public selectedWarehouseName = new EventEmitter<string>();
  @Output() public selectedNatureName = new EventEmitter<string>();
  @Output() public searchObjectEmit = new EventEmitter<any>();
  @Output() public clickTabItemsTecDoc = new EventEmitter<boolean>();
  public isContentVisible = false;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public fieldsetBorderStyle: string;
  public selectedWarehouseId: number;
  public filtreToSendToGrid: Filter;
  public resetFieldValue = false;
  public filtreFieldsInputs: FiltrePredicateModel[] = [];
  public predicateFormat: PredicateFormat;
  public resetClick = false;
  public filterSearchItem = new FilterSearchItem();
  isAutoVersion: boolean;
  public predicateWarehouse = true;

  /**
   *
   * @param companyService
   * @param itemService
   * @param tecdocService
   */
  constructor(private companyService: CompanyService, private itemService: ItemService, private tecdocService: TecdocService,
    private localStorageService : LocalStorageService) {
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
      this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

  }

  ngOnInit() {
    this.prepareFiltreList();
      this.predicateFormat = new PredicateFormat();
      if (this.hasDefaultWarehouse) {
          // if there is already warehouse selected by default so show the filters
          this.showContent();
      } else {
          this.hideContent();
      }

  }

  showContent() {
    if (!this.isSearchLoaded) {
      this.isSearchLoaded = true;
    }
    this.isContentVisible = true;
    this.fieldsetBorderStyle = this.fieldsetBorderShowed;
    this.isVisibleAdvancedSearch.emit(true);
  }

  hideContent() {
    this.isContentVisible = false;
    this.fieldsetBorderStyle = this.fieldsetBorderHidden;
    this.isVisibleAdvancedSearch.emit(false);
  }


  /**
   * on search click event
   */
  onSearchClick(searchEvent?: boolean) {
    this.filterFromTecDoc=  this.itemFiltreListComponent.isTecdocFiltre;
    this.clickTabItemsTecDoc.emit(this.filterFromTecDoc);
    if (this.itemFiltreListComponent && this.itemFiltreListComponent.isTecdocFiltre) {
      //send to list-product filter general and filter tecDoc mode
      this.tecdocService.filterSearchItem = this.filterSearchItem;
      this.tecdocService.searchTecDocLabel = this.itemFiltreListComponent.tecdocSearchModeLabel;
      this.tecdocService.tecdocSearchModeChange.next(this.itemFiltreListComponent.tecdocSearchModeLabel);
    } else {
      this.selectedWarehouseId = this.itemFiltreListComponent.selectedWarehouseId;
      this.simpleSearchClick();
    }
  }

  simpleSearchClick() {
    if (this.predicateFormat) {
      this.searchButtonClickEvent.emit(this.predicateFormat);
    }
  }

  /**
   * set the state of the resetFieldValue decorator
   */
  resetFieldValues(resetEvent?: boolean) {
    this.resetClick =!this.resetClick;
    if (this.itemFiltreListComponent.isTecdocFiltre) {
      this.tecdocService.tecdocSearchModeChange.next(ItemConstant.RESET_TECDOC_FIELDS);
    } else {
      this.itemFiltreListComponent.resetFiltre();
      this.resetButtonClickEvent.emit(true);
      this.sendInitialPredicate.emit(this.itemFiltreListComponent.predicate);
      this.showContent();
    }
  }

  private prepareFiltreList() {
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.SUPPLIER, null, ItemConstant.ID_TIERS, null , null, null,
      null, null, null, null, true));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.VEHICLE_BRAND, SharedConstant.EMPTY,
      ItemConstant.ID_VEHICLE_BRAND, false, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY,
      SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.PRODUCT_BAND, null, ItemConstant.ID_ITEM_BRAND_PRODUCT));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.FAMILY, null, ItemConstant.IdFamily));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.BARCODE, null, ItemConstant.BARCODE1D, null , null, null,
      null, null, null, null, true));
    if (this.isAutoVersion) {
      this.filtreFieldsInputs.push(new FiltrePredicateModel(ItemConstant.OEM, null, ItemConstant.OEM, null , null, null,
        null, null, null, null, true));
    }
  }


  getFiltrePredicate(filterItem: any) {
      this.filterSearchItem = filterItem;
      this.predicateFormat = new PredicateFormat();
      this.predicateFormat.Filter = this.predicateFormat.Filter.filter(filter => isNotNullOrUndefinedAndNotEmptyValue(filter.value));
  }
  getFilterSearchItem( filterItem : FilterSearchItem){
    this.filterSearchItem = filterItem;
  }

  handleTecdocSearchEvent(isTecdocSearch: boolean) {
    this.isTecdocSearchEvent.emit(isTecdocSearch);
  }
  handleWarehouseNameEvent(warehouseName: string) {
    this.selectedWarehouseName.emit(warehouseName);
  }
  handleNatureNameEvent(NatureName: string) {
    this.selectedNatureName.emit(NatureName);
  }
  handleSearchObject(searchObject) {
    this.searchObjectEmit.emit(searchObject);
  }
}
