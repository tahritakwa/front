import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemConstant } from '../../../../constant/inventory/item.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { TiersConstants } from '../../../../constant/purchase/tiers.constant';
import { ChangeContext, LabelType, Options } from 'ng5-slider';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { FiltersItemDropdown } from '../../../../models/shared/filters-item-dropdown.model';
import { Filter, Operation,PredicateFormat} from '../../../utils/predicate';
import { ModelOfItemComboBoxComponent } from '../../model-of-item-combo-box/model-of-item-combo-box.component';
import { SubModelComboBoxComponent } from '../../sub-model-combo-box/sub-model-combo-box.component';
import { SubFamilyComboBoxComponent } from '../../sub-family-combo-box/sub-family-combo-box.component';
import { BrandComboBoxComponent } from '../../brand-combo-box/brand-combo-box.component';
import { FamilyComboBoxComponent } from '../../family-combo-box/family-combo-box.component';
import { ItemService } from '../../../../inventory/services/item/item.service';
import { ProductDropdownComponent } from '../../product-dropdown/product-dropdown.component';
import { SupplierDropdownComponent } from '../../supplier-dropdown/supplier-dropdown.component';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { StyleConstant } from '../../../../constant/utility/style.constant';
import { FiltreInputComponent } from '../../advanced-search/filtre-input/filtre-input.component';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { ActivityAreaEnumerator } from '../../../../models/enumerators/activity-area.enum';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import { TecDocComponent } from '../../tec-doc/tec-doc.component';
import { SearchItemSupplier } from '../../../../models/sales/search-item-supplier.model';
import { FilterSearchItem } from '../../../../models/inventory/filter-search-item-model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-item-filtre-list',
  templateUrl: './item-filtre-list.component.html',
  styleUrls: ['./item-filtre-list.component.scss']
})
export class ItemFiltreListComponent implements OnInit, OnChanges {
  @Input() public filtreFieldsInputs;
  @Input() public resetClick;
  @Input() hasDefaultWarehouse: boolean;
  @Input() idWarehouse: number;
  @Input() listTiers ;
  @Input() selectedWarehouseFromItemDropDown;
  @Input() isForGarage: boolean;
  @Output() public sendPredicateEvent = new EventEmitter<any>();
  @Output() public isTecdocSearchEvent = new EventEmitter<boolean>();
  @Output() public selectedWarehouseName = new EventEmitter<string>();
  @Output() public sendResetFieldValues = new EventEmitter<boolean>();
  @Output() public sendFilterSearchItem = new EventEmitter<FilterSearchItem>();
  @Output() public isSearchItemEvent = new EventEmitter<boolean>();
  public selectedWarehouseId: number;
  @Output() public selectedNatureName = new EventEmitter<string>();
  public formGroupFilter: FormGroup;
  public listFiltreConfig: { 'label', 'prop', 'isChecked' }[] = [];
  public listFiltreConfigTecDoc: { 'label', 'prop', 'isChecked' }[] = [];
  public tecdocSearchMode = NumberConstant.TWO;
  public tecdocSearchModeLabel = ItemConstant.GENERAL_SEARCH;
  public isTecdocFiltre = false;
  public isWarehouseVisible = false;
  public isModelVisible = false;
  public isSubModelVisible = false;
  public isSubFamilyVisible = false;
  public companyCurrencyCode: string;
  public searchWithTecDoc = false;
  public SALES_PRICE_HT_MIN_VALUE = NumberConstant.ZERO;
  public SALES_PRICE_HT_MAX_VALUE = NumberConstant.ONE_HUNDRED_MILLION;
  // Sales Price Without Tax Slider Properties
  public options: Options = new Options();

  // filtre item dropdown to send to listProduct component
  public filtersItemDropdown: FiltersItemDropdown = new FiltersItemDropdown();
  public predicate: PredicateFormat = new PredicateFormat();
  public minPrice = 0;
  public maxPrice = NumberConstant.ONE_HUNDRED_MILLION;
  public options1: Options = {
    floor: 0,
    ceil: 500,
  };
  public fieldsetBorderStyle = StyleConstant.BORDER_SOLID;
  public filterSearchItem : FilterSearchItem =  new FilterSearchItem();
  @ViewChild(SupplierDropdownComponent) public supplierDropdownComponent: SupplierDropdownComponent;
  @ViewChild(FamilyComboBoxComponent) public familyComboBoxComponent: FamilyComboBoxComponent;
  @ViewChild(SubFamilyComboBoxComponent) public subFamilyComboBoxComponent: SubFamilyComboBoxComponent;
  @ViewChild(BrandComboBoxComponent) public brandComboBoxComponent: BrandComboBoxComponent;
  @ViewChild(ModelOfItemComboBoxComponent) public modelOfItemComboBoxComponent: ModelOfItemComboBoxComponent;
  @ViewChild(SubModelComboBoxComponent) public subModelComboBoxComponent: SubModelComboBoxComponent;
  @ViewChild(ProductDropdownComponent) public productDropdownComponent: ProductDropdownComponent;
  @ViewChild(FiltreInputComponent) public filtreInputComponent: FiltreInputComponent;
  @ViewChild('tecDocComponent') public tecDocComponent: TecDocComponent;
  public filtreFieldsTecDocInputs: FiltrePredicateModel[] = [];

  public salesPriceHtForm: FormGroup;
  public stockAvailableChecked = false;
  public tiers: number[];
  isAutoVersion: boolean;
  searchedObject = {NatureLabel : null, SupplierName : null, WarehouseName : null, BrandLabel : null, ModelLabel : null,
    SubModelLabel : null, FamilyLabel : null, SubFamilyLabel : null, ProductBrandLabel : null, BarCode: null, Oem: null,
    MinPrice: null, MaxPrice: null};
  @Output() public searchObjectEmitter = new EventEmitter<any>();

  /**
   *
   * @param itemService
   * @param viewContainerRef
   */
  constructor(public itemService: ItemService, public viewContainerRef: ViewContainerRef, private companyService: CompanyService,
    private localStorageService : LocalStorageService,public translate: TranslateService) {
    this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;
    if (this.isAutoVersion && this.listFiltreConfig) {
      this.listFiltreConfig.push({ label: ItemConstant.OEM, prop: ItemConstant.OEM, isChecked: true });
    }
    this.companyCurrencyCode = this.localStorageService.getCurrencyCode();
    this.prepareListConfigSimpleFiltre();
  }

  private prepareListConfigSimpleFiltre() {
    this.listFiltreConfig.push({ label: TiersConstants.SUPPLIER, prop: ItemConstant.ID_TIERS, isChecked: true });
    this.listFiltreConfig.push({ label: SharedConstant.VEHICLE_BRAND, prop: ItemConstant.ID_VEHICLE_BRAND, isChecked: false });
    this.listFiltreConfig.push({ label: SharedConstant.PRODUCT_BAND, prop: ItemConstant.ID_ITEM_BRAND_PRODUCT, isChecked: false });
    this.listFiltreConfig.push({ label: SharedConstant.FAMILY, prop: ItemConstant.IdFamily, isChecked: false });
    this.listFiltreConfig.push({ label: SharedConstant.BARCODE, prop: ItemConstant.BARCODE1D, isChecked: true });
    if (this.isAutoVersion) {
      this.listFiltreConfig.push({ label: ItemConstant.OEM, prop: ItemConstant.OEM, isChecked: true });
    }
  }

  private prepareListConfigTecDoc() {
    this.listFiltreConfigTecDoc.push({ label: ItemConstant.TECDOC_OEM_TYPE, prop: ItemConstant.TECDOC_OEM_TYPE, isChecked: false });
    this.listFiltreConfigTecDoc.push({ label: ItemConstant.TECDOC_REFERENCE_TYPE, prop: ItemConstant.TECDOC_REFERENCE_TYPE, isChecked: false });
    this.listFiltreConfigTecDoc.push({ label: ItemConstant.TECDOC_CATEGORY_TYPE, prop: ItemConstant.TECDOC_CATEGORY_TYPE, isChecked: false });
    this.listFiltreConfigTecDoc.push({ label: ItemConstant.GENERAL_SEARCH, prop: ItemConstant.GENERAL_SEARCH, isChecked: true });
  }

  private prepareListInputSimpleFiltre() {
    this.filtreFieldsInputs.push(new FiltrePredicateModel(TiersConstants.SUPPLIER, null, ItemConstant.ID_TIERS, null , null, null,
      null, null, null, null, true));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.VEHICLE_BRAND, SharedConstant.EMPTY,
      ItemConstant.ID_VEHICLE_BRAND, false, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY,
      SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY,false));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.PRODUCT_BAND, null, ItemConstant.ID_ITEM_BRAND_PRODUCT,null,null,null,null,null,null,null,false));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.FAMILY, null, ItemConstant.IdFamily, null,null,null,null,null,null,null,false));
    this.filtreFieldsInputs.push(new FiltrePredicateModel(SharedConstant.BARCODE, null, ItemConstant.BARCODE1D, null , null, null,
      null, null, null, null, true));
    if (this.isAutoVersion) {
      this.filtreFieldsInputs.push(new FiltrePredicateModel(ItemConstant.OEM, null, ItemConstant.OEM, null , null, null,
        null, null, null, null, true));
    }
    this.filtreFieldsInputs.sort((a, b) =>
    this.translate.instant(a.label.toUpperCase()).localeCompare(this.translate.instant(b.label.toUpperCase())));
    this.filtreInputComponent.fillCheckedInputs();
  }
  private prepareListInputTecdoc() {
    this.filtreFieldsTecDocInputs.push(new FiltrePredicateModel(ItemConstant.TECDOC_OEM_TYPE, null, ItemConstant.TECDOC_OEM_TYPE));
    this.filtreFieldsTecDocInputs.push(new FiltrePredicateModel(ItemConstant.TECDOC_REFERENCE_TYPE, null, ItemConstant.TECDOC_REFERENCE_TYPE,
      false, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY,
      SharedConstant.EMPTY, false));
    this.filtreFieldsTecDocInputs.push(new FiltrePredicateModel(ItemConstant.TECDOC_CATEGORY_TYPE, null, ItemConstant.TECDOC_CATEGORY_TYPE));
    this.filtreFieldsTecDocInputs.push(new FiltrePredicateModel(ItemConstant.GENERAL_SEARCH, null, ItemConstant.GENERAL_SEARCH,
      false, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY, SharedConstant.EMPTY,
      SharedConstant.EMPTY, true));
  }


  private createFiltreFormGroup() {
    this.formGroupFilter = new FormGroup({
      IdTiers: new FormControl(),
      IdItem: new FormControl(),
      LabelItem: new FormControl(),
      IdWarehouse: new FormControl(),
      IdNature: new FormControl(),
      IdFamily: new FormControl(),
      IdSubFamily: new FormControl(),
      IdProductItem: new FormControl(),
      IdVehicleBrand: new FormControl(),
      IdModel: new FormControl(),
      IdSubModel: new FormControl(),
      BarCode1D: new FormControl(),
      OEM: new FormControl()
    });
  }
  public resetSalesPriceForm() {
    this.salesPriceHtForm.reset({ range: [this.SALES_PRICE_HT_MIN_VALUE, this.SALES_PRICE_HT_MAX_VALUE] });
  }
  private initSliderOptionsConfig() {
    this.salesPriceHtForm = new FormGroup({
      range: new FormControl([this.SALES_PRICE_HT_MIN_VALUE, this.SALES_PRICE_HT_MAX_VALUE])
    });
    this.options = {
      floor: this.SALES_PRICE_HT_MIN_VALUE,
      ceil: this.SALES_PRICE_HT_MAX_VALUE,
      step: NumberConstant.ONE_HUNDRED,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
          case LabelType.High:
          default:
            return `${value} ${this.companyCurrencyCode}`;
        }
      }
    };
  }

  removeOldPropFilter(prop) {
    this.predicate.Filter = this.predicate.Filter.filter(filter => filter.prop !== prop);
  }

  getSelectedNature(selectedNature) {
    this.filterSearchItem.IdNature = NumberConstant.ZERO;
    let natureName;
    this.stockAvailableChecked = false;
    this.selectedWarehouseId = this.hasDefaultWarehouse?this.selectedWarehouseId:undefined;
    this.formGroupFilter.controls['IdWarehouse'].setValue(this.hasDefaultWarehouse?this.selectedWarehouseId:undefined);
    if (this.isWarehouseVisible) {
        this.filterSearchItem.AllAvailableQuantity= true;
    } else {
        this.filterSearchItem.AllAvailableQuantity= this.stockAvailableChecked;
    }
    if (selectedNature) {
      this.isWarehouseVisible = selectedNature.IsStockManaged;
      this.filterSearchItem.IdNature= selectedNature.Id;
      natureName = selectedNature.Label;
      this.selectedNatureName.emit(natureName);
    } else {
      this.isWarehouseVisible = false;
      this.onSwitchAvaibleQuantity(false);
      this.selectedNatureName.emit(natureName);
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    this.searchedObject.NatureLabel = natureName;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getWarehouseSelect(selectedWarehouse) {
    let warehouseName;
    this.selectedWarehouseId = undefined;
    if (selectedWarehouse.IdWarehouse.value) {
      warehouseName = selectedWarehouse.listOfAllWarehouseDataSource.find(x => x.Id === selectedWarehouse.IdWarehouse.value).WarehouseName;
      this.selectedWarehouseId = selectedWarehouse.IdWarehouse.value;
      this.selectedWarehouseName.emit(warehouseName);
      this.filterSearchItem.IdWarehouse = selectedWarehouse.IdWarehouse.value;
    } else {
      this.selectedWarehouseName.emit(warehouseName);
    }
    this.searchedObject.WarehouseName = warehouseName;
    this.searchObjectEmitter.emit(this.searchedObject);
    this.sendFilterSearchItem.emit(this.filterSearchItem);
  }

  onSwitchFiltreType(isTecdocSearch) {
    this.initFiltreParams();
    this.isTecdocSearchEvent.emit(this.isTecdocFiltre);
      this.prepareListConfigTecDoc();
      this.prepareListConfigSimpleFiltre();
      this.prepareListInputSimpleFiltre();
      this.prepareListInputTecdoc();
  }

  public initFiltreParams() {
    this.filterSearchItem = new FilterSearchItem();
    this.listFiltreConfig = [];
    this.filtreFieldsInputs = [];
    this.listFiltreConfigTecDoc = [];
    this.filtreFieldsTecDocInputs= [];
  }

  onSwitchAvaibleQuantity(isAvaibleQuantity) {
    if (isAvaibleQuantity) {
      this.stockAvailableChecked = true;
      this.filterSearchItem.AllAvailableQuantity = isAvaibleQuantity.target.checked;
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
  }

  getSearchedItem() {
    this.filterSearchItem.GlobalSearchItem = this.Labelitem.value;
    this.sendFilterSearchItem.emit(this.filterSearchItem);
  }

  getSearchedBarCode() {
    this.filterSearchItem.BarCodeD=this.BarCode.value;
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    this.searchedObject.BarCode = this.BarCode.value;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSearchedOem() {
    this.filterSearchItem.Oem = this.OEM.value;
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    this.searchedObject.Oem = this.OEM.value;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSelectedTiers(selectedTiers) {
    if (selectedTiers) {
      this.tiers = [];
      const idTiers = selectedTiers.IdTiers.value;
      if (idTiers) {
        this.tiers.push(idTiers);
        this.filterSearchItem.IdTiers = this.tiers;
        this.searchedObject.SupplierName = selectedTiers.supplierDataSource.filter(x => x.Id === idTiers)[NumberConstant.ZERO].Name;
      } else {
        this.searchedObject.SupplierName = null;
        this.filterSearchItem.IdTiers = idTiers;
      }
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSelectedVehicleBrand(selectedVehiclebrand) {
    if (selectedVehiclebrand) {
      this.isModelVisible = true;
      this.modelOfItemComboBoxComponent.initDataSource(selectedVehiclebrand);
        this.filterSearchItem.IdVehicleBrand = selectedVehiclebrand;
    } else {
      this.modelOfItemComboBoxComponent.modelItemComboBox.reset();
      this.isModelVisible = false;
      this.isSubModelVisible = false;
      this.filterSearchItem.IdVehicleBrand = selectedVehiclebrand;
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    const brand = this.brandComboBoxComponent.brandDataSource.filter(x => x.Id === selectedVehiclebrand);
    this.searchedObject.BrandLabel = brand && brand.length > NumberConstant.ZERO ?  brand[NumberConstant.ZERO].Label : null;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSelectedModel(selectedModel) {
    if (selectedModel) {
      this.isSubModelVisible = true;
      this.subModelComboBoxComponent.initDataSource(selectedModel);
      this.filterSearchItem.IdModel = selectedModel;
    } else {
      this.subModelComboBoxComponent.subModelComboBoxComponent.reset();
      this.isSubModelVisible = false;
      this.filterSearchItem.IdModel = selectedModel;
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    const model = this.modelOfItemComboBoxComponent.modelOfItemDataSource.filter(x => x.Id === selectedModel);
    this.searchedObject.ModelLabel = model && model.length > NumberConstant.ZERO ? model[NumberConstant.ZERO].Label : null;
    this.searchObjectEmitter.emit(this.searchedObject);
  }


  getSelectedSubModel(selectedSubModel) {
    if (selectedSubModel) {
      this.filterSearchItem.IdSubModel = selectedSubModel;
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    const subModel = this.subModelComboBoxComponent.subModelDataSource.filter(x => x.Id === selectedSubModel);
    this.searchedObject.SubModelLabel = subModel && subModel.length > NumberConstant.ZERO ? subModel[NumberConstant.ZERO].Label : null;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSelectedProductBrand(selectedProductBrand) {
      this.filterSearchItem.IdProductItem = selectedProductBrand;
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    const productBrand =  this.productDropdownComponent.productItemDataSource.filter(x => x.Id === selectedProductBrand);
    this.searchedObject.ProductBrandLabel = productBrand && productBrand.length > NumberConstant.ZERO
      ? productBrand[NumberConstant.ZERO].LabelProduct : null;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSelectedFamily(selectedFamily) {
    if (selectedFamily) {
      this.isSubFamilyVisible = true;
      this.subFamilyComboBoxComponent.initDataSource(selectedFamily);
      this.filterSearchItem.IdFamily = selectedFamily;
    } else {
      this.subFamilyComboBoxComponent.subfamilyComboBox.reset();
      this.isSubFamilyVisible = false;
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    const family = this.familyComboBoxComponent.familyDataSource.filter(x => x.Id === selectedFamily);
    this.searchedObject.FamilyLabel = family && family.length > NumberConstant.ZERO ? family[NumberConstant.ZERO].Label : null;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  getSelectedSubFamily(selectedSubFamily) {
    if (selectedSubFamily) {
      this.filterSearchItem.IdSubFamily = selectedSubFamily;
    }
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    const subFamily = this.subFamilyComboBoxComponent.subFamilyDataSource.filter(x => x.Id === selectedSubFamily);
    this.searchedObject.SubFamilyLabel = subFamily && subFamily.length > NumberConstant.ZERO ? subFamily[NumberConstant.ZERO].Label : null;
    this.searchObjectEmitter.emit(this.searchedObject);
  }

  salesPriceWithoutTaxChanged(salesPrice: ChangeContext) {
    this.minPrice = salesPrice.value;
    this.maxPrice = salesPrice.highValue;
    this.searchedObject.MinPrice = this.minPrice ? this.minPrice : null;
    this.searchedObject.MaxPrice = this.maxPrice ? this.maxPrice : null;
    this.filterSearchItem.MinUnitHtsalePrice = this.minPrice ? this.minPrice : 0;
    this.filterSearchItem.MaxUnitHtsalePrice = this.maxPrice ? this.maxPrice : null;
    this.searchObjectEmitter.emit(this.searchedObject);
    this.sendFilterSearchItem.emit(this.filterSearchItem);
  }

  getFiltreFieldsConfig(selectedInputFiltre) {
    this.removeOldFiltreFromInputList(selectedInputFiltre);
    this.listFiltreConfig.find(filtre => filtre.label === selectedInputFiltre.fieldInput.label).isChecked = selectedInputFiltre.isCheckedInput;
      this.handlePredicateChange();
  }

  getFiltreFieldsConfigTecDoc(selectedInputFiltre) {
    this.removeOldFiltreFromInputListTecDoc(selectedInputFiltre);
    this.listFiltreConfigTecDoc.find(filtre => filtre.label === selectedInputFiltre.fieldInput.label).isChecked = selectedInputFiltre.isCheckedInput;
    this.listFiltreConfigTecDoc.filter(filtre => filtre.label !== selectedInputFiltre.fieldInput.label).forEach(element => {
      element.isChecked = false;
    });
  this.changeTecdocSearchMode(selectedInputFiltre);
  }

  private handlePredicateChange() { 
    this.itemService.advancedSearchPredicateChange.next(this.predicate);
  }

  private changeTecdocSearchMode(selectedInputFiltre) {
    this.getCurrentTecdocSearchMode(selectedInputFiltre);
  }

  private getCurrentTecdocSearchMode(selectedInputFiltre) {
    if (this.tecdocSearchModeLabel !== selectedInputFiltre.fieldInput.label || !selectedInputFiltre.isCheckedInput ) {
      this.initializeTecDocFilters();
    }
    if(selectedInputFiltre.isCheckedInput){
    switch (selectedInputFiltre.fieldInput.label) {
      case ItemConstant.TECDOC_OEM_TYPE:
        this.tecdocSearchMode = NumberConstant.TWO;
        this.tecdocSearchModeLabel = ItemConstant.TECDOC_OEM_TYPE;
        break;
      case ItemConstant.TECDOC_REFERENCE_TYPE:
        this.tecdocSearchMode = NumberConstant.ONE;
        this.tecdocSearchModeLabel = ItemConstant.TECDOC_REFERENCE_TYPE;
        break;
      case ItemConstant.TECDOC_CATEGORY_TYPE:
        this.tecdocSearchMode = NumberConstant.ZERO;
        this.tecdocSearchModeLabel = ItemConstant.TECDOC_CATEGORY_TYPE;
        break;
        case ItemConstant.GENERAL_SEARCH:
          this.tecdocSearchMode = NumberConstant.FIVE;
          this.tecdocSearchModeLabel = ItemConstant.GENERAL_SEARCH;
          break;
      default:
        this.tecdocSearchMode = NumberConstant.ZERO;
        this.tecdocSearchModeLabel = SharedConstant.EMPTY;
        break;
    }
  }else {
    this.tecdocSearchMode = NumberConstant.FIVE;
    this.tecdocSearchModeLabel = SharedConstant.EMPTY;
  }
  }

  initializeTecDocFilters() {
    this.tecDocComponent.searchObject =  new SearchItemSupplier();
    this.tecDocComponent.reference = null;
    this.tecDocComponent.selectedBrandFilter = null;
    this.tecDocComponent.selectedMFA = null;
    this.tecDocComponent.selectedMS = null;
    this.tecDocComponent.selectedPC = null;
    this.tecDocComponent.selectedRoot = null;
    this.tecDocComponent.selectedNode1 = null;
    this.tecDocComponent.selectedproduct = null;
    this.tecDocComponent.OemNumber = null;
    this.tecDocComponent.TecDocArticles = [];
    this.tecDocComponent.BrandList = [];
    this.tecDocComponent.BrandListFiltredDataSource = [];
    this.tecDocComponent.GlobalSearchValue = null;
    this.tecDocComponent.tecdocService.setarticles(this.tecDocComponent.TecDocArticles);
    this.tecDocComponent.tecdocService.articleList = new Array<any>();
  }

  private removeOldFiltreFromInputList(selectedInputFiltre) {
    this.listFiltreConfig.forEach(field => {
      if (field.label === selectedInputFiltre.fieldInput.label && field.isChecked !== selectedInputFiltre.isCheckedInput && field.isChecked) {
        this.resetInputValues(field);
      }
    });
  }

  private removeOldFiltreFromInputListTecDoc(selectedInputFiltre) {
    this.listFiltreConfigTecDoc.forEach(field => {
      if (field.label === selectedInputFiltre.fieldInput.label && field.isChecked !== selectedInputFiltre.isCheckedInput && field.isChecked) {
        this.resetInputValuesTecDoc(field);
      }
    });
  }
  isVisibleFiltre(filtre: string) {
    const filterItem = this.listFiltreConfig.find(filtreSearched => filtreSearched.label === filtre);
    return filterItem ? filterItem.isChecked : false;
  }

  /**
   *
   * @param changes
   * @private
   */
  private resetButtonClickEvent(changes: SimpleChanges) {
    if (changes.resetClick && this.formGroupFilter) {
      this.formGroupFilter.reset();
      if (this.brandComboBoxComponent) {
        this.brandComboBoxComponent.resetAllBrandPictureBorders(NumberConstant.ZERO);
      }
      if (this.familyComboBoxComponent) {
        this.familyComboBoxComponent.resetAllFamiliesPictureBorders(NumberConstant.ZERO);
      }
    }
  }

  get IdModel(): FormControl {
    return this.formGroupFilter.get(ItemConstant.ID_MODEL) as FormControl;
  }

  get IdProductItem(): FormControl {
    return this.formGroupFilter.get(ItemConstant.ID_ITEM_BRAND_PRODUCT) as FormControl;
  }

  get IdTiers(): FormControl {
    return this.formGroupFilter.get(ItemConstant.ID_TIERS) as FormControl;
  }

  get Labelitem(): FormControl {
    return this.formGroupFilter.get(ItemConstant.LABEL_ITEM) as FormControl;
  }

  get BarCode(): FormControl {
    return this.formGroupFilter.get(ItemConstant.BARCODE1D) as FormControl;
  }

  get OEM(): FormControl {
    return this.formGroupFilter.get(ItemConstant.OEM) as FormControl;
  }

  /**
   * after check uncheck input from list input filtres --> reset field value
   * @param field
   * @private
   */
  private resetInputValues(field) {
    switch (field.label) {
      case ItemConstant.ITEM:
        this.Labelitem.reset();
        break;
      case TiersConstants.SUPPLIER:
        this.IdTiers.reset();
        this.supplierDropdownComponent.supplierComboBox.reset();
        this.filterSearchItem.IdTiers = [];
        break;
      case SharedConstant.VEHICLE_BRAND:
        this.brandComboBoxComponent.resetAllBrandPictureBorders(NumberConstant.ZERO);
        this.filterSearchItem.IdVehicleBrand = 0;
        break;
      case SharedConstant.PRODUCT_BAND:
        this.IdProductItem.reset();
        this.productDropdownComponent.productComboBoxComponent.reset();
        this.filterSearchItem.IdProductItem = 0;
        break;
      case SharedConstant.FAMILY:
        this.filterSearchItem.IdFamily = 0;
        break;
      case SharedConstant.BARCODE:
        this.BarCode.reset();
        this.filterSearchItem.BarCodeD = "";
        break;
      case ItemConstant.OEM:
        this.OEM.reset();
        this.filterSearchItem.Oem = "";
        break;
      default:
        break;
    }
  }
  /**
   * after check uncheck input from list input filtres --> reset field value
   * @param field
   * @private
   */
   private resetInputValuesTecDoc(field) {
    switch (field.label) {
      case ItemConstant.GENERAL_SEARCH:
        this.tecDocComponent.GlobalSearchValue ="";
        break;
      case ItemConstant.TECDOC_OEM_TYPE:
        this.tecDocComponent.OemNumber ="";
        break;
      case ItemConstant.TECDOC_REFERENCE_TYPE:
        this.tecDocComponent.reference = "";
        break;
      case ItemConstant.TECDOC_CATEGORY_TYPE:
        break;
      default:
        break;
    }
  }


  ngOnInit() {
    this.filterSearchItem = new FilterSearchItem();
    this.createFiltreFormGroup();
    this.initSliderOptionsConfig();
    this.onSwitchFiltreType(true);
    // tecdocSearchMode = 5 : Global search mode 
    this.tecdocSearchMode = 5;
  }

  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.resetButtonClickEvent(changes);
  }


  public resetFiltre() {
    this.filterSearchItem = new FilterSearchItem();
    this.sendFilterSearchItem.emit(this.filterSearchItem);
    this.stockAvailableChecked = false;
    this.resetSalesPriceForm();
    this.initFiltreParams();
    this.prepareListConfigSimpleFiltre();
    this.prepareListInputSimpleFiltre();
    this.filtreInputComponent.fillDefaultCheckedInputs();
    this.isModelVisible = false;
    this.isSubModelVisible = false;
  }
  public valueMinChange($event) {
    if ($event < this.options.floor) {
      this.minPrice = this.options.floor;
    } else {
      if ($event > this.maxPrice) {
      } else {
        this.minPrice = $event ? $event : 0;
      }
    }
    this.updateprice() 
  }
  public valueMaxChange($event = 0) {
    if ($event > this.options.ceil) {
      this.maxPrice = this.options.ceil;
    } else {
      if ($event < this.minPrice) {
      } else {
        this.maxPrice = $event ? $event : 0;
      }
    }
    this.updateprice()
  }
  updateprice() {
    this.filterSearchItem.MinUnitHtsalePrice = this.minPrice ? this.minPrice : 0;
    this.filterSearchItem.MaxUnitHtsalePrice = this.maxPrice ? this.maxPrice : null;
  }
  resetField(){
    this.sendResetFieldValues.emit(true);
  }
  searchItemClick(){
    if(this.tecDocComponent.OemNumber || this.tecDocComponent.GlobalSearchValue ||
      this.tecDocComponent.reference || this.tecDocComponent.GlobalSearchValue){
      this.isTecdocFiltre = true;
      this.isSearchItemEvent.emit(true);
      
    }else {
      this.isTecdocFiltre = false;
      this.isSearchItemEvent.emit(true);
    }  
  }
  

}

