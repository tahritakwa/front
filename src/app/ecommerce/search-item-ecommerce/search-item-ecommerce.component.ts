import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FamilyComboBoxComponent } from '../../shared/components/family-combo-box/family-combo-box.component';
import { SubModelComboBoxComponent } from '../../shared/components/sub-model-combo-box/sub-model-combo-box.component';
import { ModelOfItemComboBoxComponent } from '../../shared/components/model-of-item-combo-box/model-of-item-combo-box.component';
import { SubFamilyComboBoxComponent } from '../../shared/components/sub-family-combo-box/sub-family-combo-box.component';
import { FiltersItemDropdown } from '../../models/shared/filters-item-dropdown.model';
import { ItemService } from '../../inventory/services/item/item.service';
import { KeyboardConst } from '../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../constant/search-item';
import { Filter, Operator, Operation } from '../../shared/utils/predicate';
import { ItemConstant } from '../../constant/inventory/item.constant';
import { ProductEcommerceComponent } from '../product-ecommerce/product-ecommerce.component';
import { SearchItemSupplier, searchTypes } from '../../models/sales/search-item-supplier.model';
import { SearchItemService } from '../../sales/services/search-item/search-item.service';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../COM/Growl/growl.service';
import { BrandComboBoxComponent } from '../../shared/components/brand-combo-box/brand-combo-box.component';



@Component({
  selector: 'app-search-item-ecommerce',
  templateUrl: './search-item-ecommerce.component.html',
  styleUrls: ['./search-item-ecommerce.component.scss']
})
export class SearchItemEcommerceComponent implements OnInit, OnDestroy {
  @ViewChild(BrandComboBoxComponent) brandChild;
  @ViewChild(FamilyComboBoxComponent) familyChild;
  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;
  @ViewChild(SubModelComboBoxComponent) subModelChild;
  @ViewChild(SubFamilyComboBoxComponent) subFamilyChild;

  family = false;
  marques = false;
  search = true;
  indexs = false;
  tecDoc = false;
  supplier = false;
  tecDocFilter = true;
  equals = false;
  searchModes = ['CATEGORY', 'REFERENCE', 'OEM'];
  current = 1;
  @Input()
  public isForWarehouseDetail = false;
  @Output() ShownTecDoc = new EventEmitter<boolean>();
  @Input() isEsnVersion: boolean;
  reference: string;
  indexSelected: string;
  idTiers: number;
  supplierstring: string;
  itemDesString: string;
  itemReferenceString: string;
  enterAction;
  filterTies: FiltersItemDropdown = new FiltersItemDropdown();
  searchObject = new SearchItemSupplier();
  public isInValidSearch = true;
  constructor(public productlist: ProductEcommerceComponent, public itemService: ItemService,
    public searchItemService: SearchItemService,
    private translate: TranslateService,
    private growlService: GrowlService) {
    this.enterAction = function (event) {
      const keyName = event.key;
      if (keyName === KeyboardConst.ENTER) {
        if (this.reference) {
          if (this.productlist.modalOptions.data) {
            this.filter(SearchConstant.PEER_CODE, this.productlist.modalOptions.data);
          } else {
            this.filter(SearchConstant.PEER_CODE);
          }
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.enterAction);
  }

  changecurrent() {
    this.current = (this.current + 1) % 3;
  }

  showTecDoc() {
    this.searchObject = new SearchItemSupplier();
    this.search = false;
    this.marques = false;
    this.family = false;
    this.indexs = false;
    this.tecDoc = true;
    this.supplier = false;
    this.productlist.filterArray = new Array<Filter>();
    // this.searchObject.selectedType = searchTypes.tecDoc_Ref;
    this.ShownTecDoc.emit(this.tecDoc);
  }
  showSearch() {
    this.searchObject = new SearchItemSupplier();
    this.search = true;
    this.marques = false;
    this.family = false;
    this.indexs = false;
    this.tecDoc = false;
    this.supplier = false;
    this.productlist.filterArray = new Array<Filter>();
    // this.searchObject.selectedType = searchTypes.ref;
    this.ShownTecDoc.emit(this.tecDoc);
  }
  showMarques() {
    this.searchObject = new SearchItemSupplier();
    this.search = false;
    this.marques = true;
    this.family = false;
    this.indexs = false;
    this.tecDoc = false;
    this.supplier = false;
    this.productlist.filterArray = new Array<Filter>();
    // this.searchObject.selectedType = searchTypes.modelofitem;
    this.ShownTecDoc.emit(this.tecDoc);
  }
  showFamily() {
    this.searchObject = new SearchItemSupplier();
    this.search = false;
    this.marques = false;
    this.family = true;
    this.indexs = false;
    this.tecDoc = false;
    this.supplier = false;
    this.productlist.filterArray = new Array<Filter>();
    // this.searchObject.selectedType = searchTypes.family;
    this.ShownTecDoc.emit(this.tecDoc);
  }
  indexSearch() {
    this.searchObject = new SearchItemSupplier();
    this.search = false;
    this.marques = false;
    this.family = false;
    this.indexs = true;
    this.tecDoc = false;
    this.supplier = false;
    this.productlist.filterArray = new Array<Filter>();
    this.ShownTecDoc.emit(this.tecDoc);
  }
  supplierSearch() {
    this.searchObject = new SearchItemSupplier();
    this.search = false;
    this.marques = false;
    this.family = false;
    this.indexs = false;
    this.tecDoc = false;
    this.supplier = true;
    this.productlist.filterArray = new Array<Filter>();
    // this.searchObject.selectedType = searchTypes.supplier;
    this.ShownTecDoc.emit(this.tecDoc);
  }
  private setDataPerBrand() {
    this.filterTies.idVehicleBrand = this.brandChild.selectedBrand;

    this.brandChild.selectedBandSource ? this.searchObject.Brand =
      this.brandChild.selectedBandSource.Label : this.searchObject.Brand = undefined;

    this.filterTies.idModel = this.modelOfItemChild.selectedModel;

    this.modelOfItemChild.selectedModelSource ? this.searchObject.BrandOfItem = this.modelOfItemChild.selectedModelSource.Label
      : this.searchObject.BrandOfItem = undefined;

    this.filterTies.idSubModel = this.subModelChild.selectedSubModel;

    this.subModelChild.selectedSubModelSource ? this.searchObject.SubModel = this.subModelChild.selectedSubModelSource.Label :
      this.searchObject.SubModel = undefined;

    if (!this.brandChild.selectedBrand && !this.modelOfItemChild.selectedModel && !this.subModelChild.selectedSubModel) {
      this.isInValidSearch = true;
    } else {
      this.isInValidSearch = false;
    }
  }

  private setDataPerFamily(filter: Array<Filter>) {
    filter.push(new Filter(ItemConstant.IdFamily, Operation.eq, this.familyChild.selectedFamily));
    filter.push(new Filter(ItemConstant.IdSubFamily, Operation.eq, this.subFamilyChild.selectedSubFamily));

    this.familyChild.selectedFamilySelected ? this.searchObject.Family = this.familyChild.selectedFamilySelected.Label :
      this.searchObject.Family = undefined;
    this.subFamilyChild.selectedSubFamilySource ? this.searchObject.SubFamily = this.subFamilyChild.selectedSubFamilySource.Label :
      this.searchObject.SubFamily = undefined;

    if (!this.familyChild.selectedFamily && !this.subFamilyChild.selectedSubFamily) {
      this.isInValidSearch = true;
    } else {
      this.isInValidSearch = false;
    }
  }
  filter(searchTheme: string, filters?) {
    this.isInValidSearch = true;
    const filter = new Array<Filter>();
    let operator = Operator.and;
    switch (searchTheme) {
      case ItemConstant.PerCode: {
        this.searchObject.Supplier = this.filterTies.tierSearch = this.supplierstring;
        // this.searchObject.reference = this.filterTies.referenceSearch = this.reference;
        this.searchObject.Description = this.filterTies.designationSearch = this.itemDesString;
        // this.filterTies.equals = this.equals;
        if (
          (this.supplierstring && this.supplierstring.trim())
          || (this.reference && this.reference.trim())
          || (this.itemDesString && this.itemDesString.trim())) {
          this.isInValidSearch = false;
        } else {
          this.isInValidSearch = true;
        }
        break;
      }
      case ItemConstant.PerBrand: {
        this.setDataPerBrand();
        break;
      }
      case ItemConstant.PerFamily: {
        this.setDataPerFamily(filter);
        break;
      }
      case ItemConstant.PerIndexe: {
        filter.push(new Filter(ItemConstant.CODE, Operation.contains, this.indexSelected));
        filter.push(new Filter(ItemConstant.DESCRIPTION, Operation.contains, this.indexSelected));
        filter.push(new Filter(ItemConstant.NOTE, Operation.contains, this.indexSelected));
        operator = Operator.or;
        break;
      }
      case ItemConstant.PerSupplier: {
        if (this.supplierstring && this.supplierstring.trim()) {
          filter.push(new Filter(ItemConstant.SUPPLIER_NAME, Operation.contains, this.supplierstring, false, true));
          filter.push(new Filter(ItemConstant.SUPPLIER_CODE, Operation.contains, this.supplierstring, false, true));
          this.searchObject.Supplier = this.supplierstring;
          this.isInValidSearch = false;
        } else {
          if (this.searchItemService.isFromSearchItem_supplierInetrface) {
            this.isInValidSearch = true;
          }
        }
        break;
      }
    }
    if (this.idTiers) {
      filter.push(new Filter(ItemConstant.ID_TIERS, Operation.eq, this.idTiers));
    }
    // if it is from search-item-supplier interfaces
    if (this.searchItemService.isFromSearchItem_supplierInetrface) {
      if (!this.isInValidSearch || !this.searchItemService.idSupplier) {
        // save search
        const serchRes = this.searchItemService.saveSearch(this.searchObject);
        this.searchItemService.addSearch(serchRes).subscribe(() => {
          this.searchItemService.disableFields = false;
          // filter list if the search is done successfly
          this.productlist.filter(filter, operator, this.filterTies);
        });
      } else {
        this.growlService.warningNotification(this.translate.instant('SEARCH_FIELD_REQUIRED'));
      }
    } else {
      this.productlist.filter(filter, operator, this.filterTies);
    }
  }

  /**
   * On change brand, receive the selected value
   * */
  receiveBrand($event) {
    this.modelOfItemChild.selectedModel = undefined;
    this.subModelChild.selectedSubModel = undefined;
    this.modelOfItemChild.initDataSource($event);
  }
  /**
   * On change model, receive the selected value
   * */
  receiveModel($event) {
    this.subModelChild.selectedSubModel = undefined;
    this.subModelChild.initDataSource($event);
  }
  /**
   * On change family, receive the selected value
   * */
  receiveFamily($event) {
    this.subFamilyChild.selectedSubFamily = undefined;
    this.subFamilyChild.initDataSource($event);
  }

  pressKeybordEnter(event) {
    if (event.charCode === 13 && this.search) {
      if (this.reference) {
        this.reference = this.reference.trim();
      }
      this.filter(SearchConstant.PEER_CODE);
    }
    if (event.charCode === 13 && this.supplier) {
      if (this.supplierstring) {
        this.supplierstring = this.supplierstring.trim();
        this.filter(SearchConstant.PEER_SUPPLIER);
      }
    }
  }

  ngOnInit() {
    this.itemService.TecDoc = false;
    if (this.productlist.modalOptions) {
      this.reference = this.productlist.modalOptions.data.valueToFind;
      this.filterTies = this.productlist.modalOptions.data.filtersItemDropdown;
      this.filter(SearchConstant.PEER_CODE);
      this.productlist.modalOptions.data.valueToFind = undefined;
    }
    if (this.searchItemService.isFromSearchItem_supplierInetrface) {
      // this.searchObject.selectedType = searchTypes.ref;
    } else {
      this.searchItemService.disableFields = false;
    }
  }
  setEqualValue() {
    this.equals = !this.equals;
  }
  ngOnDestroy(): void {
    document.removeEventListener(SearchConstant.KEY_DOWN, this.enterAction, false);
  }
}
