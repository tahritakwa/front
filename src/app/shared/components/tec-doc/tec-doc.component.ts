import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TecDocMFA } from '../../../models/inventory/tec-doc-MFA.model';
import { ItemService } from '../../../inventory/services/item/item.service';
import { TecDocMseries } from '../../../models/inventory/tec-doc-mseries.model';
import { TecDocPcar } from '../../../models/inventory/tec-doc-pcar.model';
import { TecDocProductTree } from '../../../models/inventory/tec-doc-product-tree';
import { TecDocProduct } from '../../../models/inventory/tec-doc-product';
import { TecdocService } from '../../../inventory/services/tecdoc/tecdoc.service';
import { TecDocArticleModel } from '../../../models/inventory/tec-doc-article.model';
import { TeckDockWithWarehouseFilter } from '../../../models/inventory/teckDock-with-warehouse-filter';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { SearchItemSupplier, searchTypes } from '../../../models/sales/search-item-supplier.model';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { WebServices } from './mocks/ws1';
import { Subscription } from 'rxjs/Subscription';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { Router } from '@angular/router';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-tec-doc',
  templateUrl: './tec-doc.component.html',
  styleUrls: ['./tec-doc.component.scss']
})
export class TecDocComponent implements OnInit, OnDestroy {
  private subscription$: Subscription;
  @ViewChildren(ComboBoxComponent) comboBoxComponent: QueryList<ComboBoxComponent>;
  public isDisabledMFA = false;
  public isDisabledMS = true;
  public isDisabledPC = true;
  public isDisabledRoot = true;
  public isDisabledNode1 = true;
  public isDisabledNode2 = true;
  public isDisabledNode3 = true;
  public isDisabledProduct = true;


  public selectedPC1 = false;
  public isDisabledRoot1 = true;
  public isDisabledNode10 = true;
  public isDisabledNode20 = true;
  public isDisabledNode30 = true;
  public isDisabledProduct1 = true;

  public search = true;
  public tecDocMFADataSource: Array<TecDocMFA>;
  public tecDocMFAFiltredDataSource: Array<TecDocMFA>;

  public tecDocMSDataSource: Array<TecDocMseries>;
  public tecDocMSFiltredDataSource: Array<TecDocMseries>;

  public tecDocPCDataSource: Array<TecDocPcar>;
  public tecDocPCFiltredDataSource: Array<TecDocPcar>;

  public TecDocProductTree: Array<TecDocProductTree>;
  public TecDocProductTreeFiltred: Array<TecDocProductTree>;

  public TecDocNode1: Array<TecDocProductTree>;
  public TecDocNode2: Array<TecDocProductTree>;
  public TecDocNode3: Array<TecDocProductTree>;

  public TecDocNode10: Array<TecDocProductTree>;
  public TecDocNode20: Array<TecDocProductTree>;
  public TecDocNode30: Array<TecDocProductTree>;

  public TecDocProducts: Array<TecDocProduct>;
  public tecDocProductsFiltred: Array<TecDocProduct>;

  public TecDocArticles: Array<TecDocArticleModel>;
  public reference: string;
  public Id: number;
  public OemNumber: string;
  public VinNumber: Number;
  public selectedBrandForSearch: string;
  public GlobalSearchValue: string;
  @Input() mode = NumberConstant.TWO;
  @Input() openedFromGarageAddCar;
  @Input() BrandModelSubModel;
  @Output() SelectedtecDoc = new EventEmitter<boolean>();
  SelectedCar = {
    MFAID: null,
    MSID: null,
    PCID: null
  };

  grouplist = [];
  selectedGroup: any;
  selectedSubGroup: any;
  selectedVehicle: any;

  selectedMFA: TecDocMFA;
  selectedMS: TecDocMseries;
  selectedPC: TecDocPcar;
  selectedRoot: TecDocProductTree;
  selectedNode1: TecDocProductTree;
  selectedNode2: TecDocProductTree;
  selectedNode3: TecDocProductTree;
  selectedproduct: TecDocProduct;


  selectedRoot0: TecDocProductTree;
  selectedNode10: TecDocProductTree;
  selectedNode20: TecDocProductTree;
  selectedNode30: TecDocProductTree;
  selectedproduct0: TecDocProduct;

  searchModes = ['CATEGORY', 'REFERENCE', 'OEM'];//, 'VIN'];
  current = 1;
  @Input() tecDocFilter = true;
  @Input() ismodal = false;
  tecdocId: boolean;
  searchObject = new SearchItemSupplier();
  BrandList: any[]=[];
  selectedBrand: any;
  selectedRefBrand: any;
  BrandListFiltredDataSource;
  selectedOemBrand: any;
  listSupplier: any;
  selectedCategorySupplier: any;
  TecDocArticlesfiltered: TecDocArticleModel[];
  subgrouplist: any;
  VehiculeList: any[];
  showcombobox: boolean;
  TecDocProduct1Tree: any;
  TecDocProduct1TreeFiltred: TecDocProductTree[];
  TecDocProducts1: any[];
  tecDocProductsFiltred1: any[];
  DisableBrand: boolean;
  DisableCatBrand: boolean;
  public isVisibleTecdocSearchBtn = true;

  public selectedBrandFilter = null;
  public isExactSearch=false;

  /**
   *
   * @param itemService
   * @param tecdocService
   * @param searchItemService
   * @param translate
   * @param router
   * @param growlService
   */
  constructor(private itemService: ItemService,
    public tecdocService: TecdocService,
    private searchItemService: SearchItemService,
    private translate: TranslateService,
    private router: Router,
    private growlService: GrowlService,
              private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.isRouterFromAdvancedSearchComponent();
    this.initTecdocSearchModeFromItemAdvancedSearchComponent();
    this.tecdocService.IsOnlyTecdoc = this.ismodal;
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles);
    this.initDataSource();
    if (this.BrandModelSubModel) {
      if (this.BrandModelSubModel.IdVehicleBrand) {
        this.selectedMFA = new TecDocMFA();
        this.selectedMFA.ManuId = this.BrandModelSubModel.IdVehicleBrand;
        this.selectedMFA.ManuName = this.BrandModelSubModel.Brand;
        this.handleMFAChange(this.selectedMFA);
        this.selectedMS = new TecDocMseries(this.localStorageService);
        this.selectedMS.ModelId = this.BrandModelSubModel.IdModel;
        this.selectedMS.ModelName = this.BrandModelSubModel.Model;
        this.handleMSChange(this.selectedMS);
        this.selectedPC = new TecDocPcar();
        this.selectedPC.CarId = this.BrandModelSubModel.IdSubModel;
        this.selectedPC.CarName = this.BrandModelSubModel.SubModel;
        this.handlePCChange(this.selectedPC);
        this.isDisabledMFA = true;
        this.isDisabledMS = true;
        this.isDisabledPC = true;
      }
    }
  }

  initTecdocSearchModeFromItemAdvancedSearchComponent() {
    this.subscription$ = this.tecdocService.tecdocSearchModeChange.subscribe(resulat => {
      if (resulat && resulat === ItemConstant.RESET_TECDOC_FIELDS) {
        this.resetTecdocFieldsValues();
      } else {
        this.handleTecdocSearchClickFromAdvancedSearch(resulat);
      }
    });
  }

  private resetTecdocFieldsValues() {
    this.handleMFAChange(undefined);
    this.reference = SharedConstant.EMPTY;
    this.selectedBrandFilter = null;
    this.OemNumber = SharedConstant.EMPTY;
    this.GlobalSearchValue = SharedConstant.EMPTY;
  }

  private handleTecdocSearchClickFromAdvancedSearch(resulat: string) {
    switch (resulat) {
      case ItemConstant.TECDOC_REFERENCE_TYPE:
        this.getItemsByReference();
        break;
      case ItemConstant.TECDOC_CATEGORY_TYPE:
        break;
      case ItemConstant.TECDOC_OEM_TYPE:
        this.getItemsByOem();
        break;
      case ItemConstant.GENERAL_SEARCH:
          this.getItemsByGlobalSearchEnter();
        break;
    }
  }

  isRouterFromAdvancedSearchComponent() {
    this.isVisibleTecdocSearchBtn = this.router.url !== ItemConstant.LIST_ITEMS_PURCHASE_URL &&
      this.router.url !== ItemConstant.LIST_ITEMS_INVENTORY_URL && this.router.url !== SharedConstant.SEARCH_ITEM_ADD_URL &&
      !this.router.url.includes(ItemConstant.URL_SHOW_ITEM_FROM_LIST_PRODUCT);
  }
  initDataSource(): void {
    this.tecdocService.articleList = new Array<any>();
    const tecDocMFA = new TecDocMFA();
    this.itemService.GetMFAs().subscribe(data => {
      this.tecDocMFADataSource = data;
      this.tecDocMFAFiltredDataSource = this.tecDocMFADataSource.slice(0);
    });
    this.getItemsByBrand();

    // for VIN Fake
    this.itemService.GetProductTree(32836).subscribe(data => {
      this.TecDocProduct1Tree = data;
      this.TecDocProduct1TreeFiltred = this.TecDocProduct1Tree.slice(0);
      this.getVehiclesByVin();
      this.selectedVehicle = this.VehiculeList[0];
    });
  }

  handleMFAFilter(value: string): void {
    this.tecDocMFAFiltredDataSource = this.tecDocMFADataSource.filter((s) =>
      s.ManuName.toLowerCase().includes(value.toLowerCase()));
  }

  pressKeybordEnter(event) {
    if (event.charCode === NumberConstant.THIRTEEN || event.key === SharedConstant.TAB) {
      this.DisableBrand = false;
      this.getItemsByReference();
    } else {
      this.DisableBrand = true;
      this.selectedBrandFilter = null;
    }
  }

  pressKeybordIdEnter(event) {
    if (event.charCode === 13) {
      this.getItemsById();
    }
  }

  pressKeybordOemEnter(event) {
    if (event.charCode === NumberConstant.THIRTEEN || event.key === SharedConstant.TAB) {
      this.DisableBrand = false;
      this.getItemsByOem();
    } else {
      this.DisableBrand = true;
    }
  }

  pressKeybordVinEnter(event) {
    if (event.charCode === 13) {
      this.getItemsByVin();
    }
  }

  searchmode(mode: number) {
    /*
    modes:
    0:Category
    1:Reference
    2:Oem
    3:ID
    4:Brand
    5:Global
    */
    this.mode = mode;
  }


  public load() {
    const states = this.tecdocService.filterstorage;
    this.tecDocMFAFiltredDataSource = states.manufacturer.list;
    this.tecDocMSFiltredDataSource = states.model.list;
    this.tecDocPCFiltredDataSource = states.passangerCar.list;
    this.TecDocProductTreeFiltred = states.tree.root.list;
    this.TecDocNode1 = states.tree.node1.list;
    this.TecDocNode2 = states.tree.node2.list;
    this.TecDocNode3 = states.tree.node3.list;
    this.tecDocProductsFiltred = states.article.list;

    this.selectedMFA = states.manufacturer.selected;
    this.selectedMS = states.model.selected;
    this.selectedPC = states.passangerCar.selected;
    this.selectedRoot = states.tree.root.selected;
    this.selectedNode1 = states.tree.node1.selected;
    this.selectedNode2 = states.tree.node2.selected;
    this.selectedNode3 = states.tree.node3.selected;
    this.selectedproduct = states.article.selected;

    this.isDisabledMS = false;
    this.isDisabledPC = false;
    this.isDisabledRoot = (!states.tree.root.selected);
    this.isDisabledNode1 = (!states.tree.node1.selected);
    this.isDisabledNode2 = (!states.tree.node2.selected);
    this.isDisabledNode3 = (!states.tree.node3.selected);
    this.isDisabledProduct = false;

  }

  UnlockSearch(field: string, minlength = 3) {
    if ((field && field.length <= minlength) || field === '') {
      return true;
    } else {
      return false;
    }
  }

  getItemsByReference() {
    if (this.reference && this.reference.length > NumberConstant.THREE) {
      this.BrandList = [];
      const supplierId = this.selectedRefBrand ? this.selectedRefBrand.Id : NumberConstant.ZERO;
      const teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(NumberConstant.ZERO, NumberConstant.ZERO,
      this.localStorageService, null, false, supplierId, this.reference, false, null,null,null,this.tecdocService.filterSearchItem);
      this.itemService.getItemByRef(teckDockWithWarehouseFilter).subscribe(data => {
        data.forEach(element => {
          element.QuantityForDocumentLine = 1;
        });
        this.TecDocArticles = data;
        const SetSupplier = new Set(this.TecDocArticles.map(x => x.Supplier));
        SetSupplier.forEach(v => this.BrandList.push(v));
        this.BrandListFiltredDataSource = this.BrandList.slice(NumberConstant.ZERO);
          // get first picture
          if (this.TecDocArticles) {
          this.TecDocArticles.forEach(product => {
            if (product.ItemInDB && this.searchItemService.isFromSearchItem_supplierInetrface && this.searchItemService.idSupplier
              && this.reference && this.reference.trim()) {
              product.ItemInDB.QuantityForDocumentLine = NumberConstant.ONE;
            }
            product.Image = MediaConstant.PLACEHOLDER_PICTURE;
          });
          this.loadItemsPicture(this.TecDocArticles);
        }
        if (this.selectedBrandForSearch) {
          this.TecDocArticles = this.TecDocArticles.filter(x => x.Supplier === this.selectedBrandForSearch);
        }
        this.tecdocService.setarticles(this.TecDocArticles);
        this.searchAdd();
      });
    } else {
      this.tecdocService.setarticles(null);
      this.searchAdd();
      this.growlService.warningNotification(this.translate.instant('SEARCH_FIELD_LENGTH_REQUIRED'));
    }
  }


  getItemsById() {
    const teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(this.Id, 0, this.localStorageService);
    this.itemService.getItemById(teckDockWithWarehouseFilter).subscribe(data => {
      this.TecDocArticles = data;
      this.tecdocService.setarticles(this.TecDocArticles);
    });
  }

  getItemsByOem() {
    if (this.OemNumber && this.OemNumber.length < NumberConstant.FOUR) {
      this.growlService.warningNotification(this.translate.instant('SEARCH_FIELD_LENGTH_REQUIRED'));
    } else {
      this.searchByOEM();
      this.searchAdd();
    }
  }

  private searchByOEM() {
    this.BrandListFiltredDataSource = [];
    this.BrandList = [];
    const supplierId = this.selectedOemBrand ? this.selectedOemBrand.Id : NumberConstant.ZERO;
    const teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(NumberConstant.ZERO, NumberConstant.ZERO,
    this.localStorageService, null, false, supplierId, '', false, this.OemNumber,null,null,this.tecdocService.filterSearchItem);
    this.itemService.getItemByOem(teckDockWithWarehouseFilter).subscribe(data => {
      this.TecDocArticles = data;
      if (this.selectedBrandForSearch) {
        this.TecDocArticles = this.TecDocArticles.filter(x => x.Supplier === this.selectedBrandForSearch);
      }
      const SetSupplier = new Set(this.TecDocArticles.map(x => x.Supplier));
      SetSupplier.forEach(v => this.BrandList.push(v));
      this.BrandListFiltredDataSource = this.BrandList.slice(NumberConstant.ZERO);
      this.tecdocService.setarticles(this.TecDocArticles);
    });
  }
  handleMFAChange(value): void {
    this.TecDocArticles = [];
    this.selectedMFA = value;
    this.selectedMS = undefined;
    this.selectedPC = undefined;
    this.selectedRoot = undefined;
    this.selectedNode1 = undefined;
    this.selectedNode2 = undefined;
    this.selectedNode3 = undefined;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    if (value === undefined) {
      this.isDisabledMS = true;
    } else {
      this.isDisabledMS = false;
      this.initMSeries();
    }
    this.isDisabledPC = true;
    this.isDisabledRoot = true;
    this.isDisabledNode1 = true;
    this.isDisabledNode2 = true;
    this.isDisabledNode3 = true;
    this.isDisabledProduct = true;
    this.tecDocPCDataSource = [];
    this.tecDocPCFiltredDataSource = [];
    this.searchAdd();
  }

  // ModelSeries
  initMSeries() {
    this.itemService.GetModelSeriesByMFA(this.selectedMFA.ManuId).subscribe(data => {
      this.tecDocMSDataSource = data;
      this.tecDocMSFiltredDataSource = this.tecDocMSDataSource.slice(0);
    });
  }

  handleMSChange(value) {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    this.selectedMS = value;
    this.selectedPC = undefined;
    this.selectedRoot = undefined;
    this.selectedNode1 = undefined;
    this.selectedNode2 = undefined;
    this.selectedNode3 = undefined;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;

    if (value === undefined) {
      this.isDisabledPC = true;
      this.tecDocPCDataSource = [];
      this.tecDocPCFiltredDataSource = [];
    } else {
      this.isDisabledPC = false;
      this.initPCar();
    }
    this.isDisabledRoot = true;
    this.isDisabledNode1 = true;
    this.isDisabledNode2 = true;
    this.isDisabledNode3 = true;
    this.isDisabledProduct = true;
    this.searchAdd();
  }



  handleMSFilter(value: string): void {
    this.tecDocMSFiltredDataSource = this.tecDocMSDataSource.filter((s) =>
      s.ModelName.toLowerCase().includes(value.toLowerCase()));
  }


  // Passenger Car
  initPCar() {
    this.itemService.GetPassengerCars(this.selectedMFA.ManuId, this.selectedMS.ModelId).subscribe(data => {
      this.tecDocPCDataSource = data;
      this.tecDocPCFiltredDataSource = this.tecDocPCDataSource.slice(0);
    });
  }


  handlePCFilter(value: string): void {
    this.tecDocPCFiltredDataSource = this.tecDocPCDataSource.filter((s) =>
      s.CarName.toLowerCase().includes(value.toLowerCase()));
  }
  /**
   * on change
   * @param $event
   */
  handlePCChange(value): void {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    this.selectedPC = value;
    this.selectedRoot = undefined;
    this.selectedNode1 = undefined;
    this.selectedNode2 = undefined;
    this.selectedNode3 = undefined;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;
    if (value === undefined) {
      this.isDisabledRoot = true;
      this.TecDocProductTree = [];
      this.TecDocProductTreeFiltred = [];
      this.selectedPC = value;
    } else {
      this.isDisabledRoot = false;
      this.InitProductTree();
    }
    this.isDisabledNode1 = true;
    this.isDisabledNode2 = true;
    this.isDisabledNode3 = true;
    this.isDisabledProduct = true;
    this.searchAdd();
  }



  InitProductTree() {
    this.itemService.GetProductTree(this.selectedPC.CarId).subscribe(data => {
      this.TecDocProductTree = data;
      this.TecDocProductTreeFiltred = this.TecDocProductTree.slice(0);
    });
  }
  handleProductTreeFilter(value: string): void {
    this.TecDocProductTreeFiltred = this.TecDocProductTree.filter((s) =>
      s.NodeText.toLowerCase().includes(value.toLowerCase()));
  }
  handleProductTreeChange(value): void {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    this.selectedRoot = value;
    this.selectedNode1 = undefined;
    this.selectedNode2 = undefined;
    this.selectedNode3 = undefined;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;
    this.TecDocProductTreeFiltred = this.TecDocProductTree.slice(0);
    if (value) {
      this.selectedRoot = value;
      this.InitNode1Tree();
    } else {
      this.selectedRoot = null;
    }
    this.searchAdd();
  }


  InitNode1Tree() {
    if (this.selectedRoot.children != null) {
      this.TecDocProducts = [];
      this.tecDocProductsFiltred = [];
      this.isDisabledNode1 = false;
      this.isDisabledNode2 = true;
      this.isDisabledNode3 = true;
      this.isDisabledProduct = true;
      this.TecDocNode1 = this.selectedRoot.children;
    } else {
      this.TecDocNode1 = [];
      this.isDisabledProduct = false;
      this.initProduct(this.selectedRoot);
      this.isDisabledNode1 = true;
    }
  }
  handleNode1TreeChange(value): void {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    this.selectedNode1 = value;
    this.selectedNode2 = undefined;
    this.selectedNode3 = undefined;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;
    if (value) {
      this.selectedNode1 = value;
      this.InitNode2Tree();
    } else {
      this.selectedNode1 = null;
    }
    this.searchAdd();
  }
  InitNode2Tree(): any {
    if (this.selectedNode1.children != null) {
      this.TecDocProducts = [];
      this.tecDocProductsFiltred = [];
      this.isDisabledNode2 = false;
      this.isDisabledNode3 = true;
      this.isDisabledProduct = true;
      this.TecDocNode2 = this.selectedNode1.children;
    } else {
      this.TecDocNode2 = [];
      this.isDisabledProduct = false;
      this.initProduct(this.selectedNode1);
      this.isDisabledNode2 = true;
    }
  }


  handleNode2TreeChange(value): void {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    this.selectedNode2 = value;
    this.selectedNode3 = undefined;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;

    if (value) {
      this.selectedNode2 = value;
      this.InitNode3Tree();
    } else {
      this.selectedNode2 = null;
    }
  }

  InitNode3Tree(): any {
    if (this.selectedNode2.children != null) {
      this.TecDocProducts = [];
      this.tecDocProductsFiltred = [];
      this.isDisabledNode3 = false;
      this.isDisabledProduct = true;
      this.TecDocNode3 = this.selectedNode2.children;
    } else {
      this.TecDocNode3 = [];
      this.isDisabledProduct = false;
      this.initProduct(this.selectedNode2);
      this.isDisabledNode3 = true;
    }
  }
  handleNode3TreeChange(value): void {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, 0, 0);
    this.selectedNode3 = value;
    this.selectedproduct = undefined;
    this.selectedCategorySupplier = undefined;

    if (value) {
      this.selectedNode3 = value;
      this.isDisabledProduct = false;
      this.initProduct(this.selectedNode3);
    } else {
      this.selectedNode3 = null;
      this.isDisabledProduct = true;
    }
  }

  initProduct(node: TecDocProductTree) {
    this.itemService.GetProduct(this.selectedPC.CarId, node.IdNode).subscribe(data => {
      this.TecDocProducts = data;
      this.tecDocProductsFiltred = this.TecDocProducts.slice(0);
    });
  }

  handleProductChange(value): void {
    this.TecDocArticles = [];
    this.tecdocService.setarticles(this.TecDocArticles, NumberConstant.ZERO, NumberConstant.ZERO);
    this.selectedproduct = value;
    this.selectedCategorySupplier = undefined;
    if (value) {
      this.selectedproduct = value;
      this.DisableCatBrand = false;
      this.initArticle();
    } else {
      this.selectedproduct = null;
      this.DisableCatBrand = false;
    }
    this.searchAdd();
  }

  initArticle() {
    this.listSupplier = [];
    this.BrandListFiltredDataSource = [];
    const teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter
      (this.selectedPC.CarId, this.selectedproduct.GenericArticleId, this.localStorageService, null, false);
    this.itemService.GetArticles(teckDockWithWarehouseFilter).subscribe(data => {
      this.TecDocArticles = data;
      this.tecdocService.caracteristics = {
        marque: this.selectedMFA.ManuName,
        seriesModel: this.selectedMS.ModelName,
        passangerCar: this.selectedPC.CarName,
        category: this.fullcategory(),
        product: this.selectedproduct.Designation
      };
      let SetSupplier = new Set(this.TecDocArticles.map(x => x.Supplier));
      SetSupplier.forEach(v => this.BrandListFiltredDataSource.push(v));
      this.tecdocService.setarticles(this.TecDocArticles, this.selectedPC.CarId, this.selectedproduct.GenericArticleId);
    });
  }

  selectsupplier(event) {
    this.selectedCategorySupplier = event;
    if (this.selectedCategorySupplier) {
      this.TecDocArticlesfiltered = this.TecDocArticles.filter(x => x.Supplier === this.selectedCategorySupplier);
    } else {
      this.TecDocArticlesfiltered = this.TecDocArticles.slice(0);
    }
    this.tecdocService.setarticles(this.TecDocArticlesfiltered);
  }

  fullcategory() {
    let res = this.selectedRoot.NodeText;
    if (!this.selectedNode1) {
      return res;
    }
    res = res.concat(' > ', this.selectedNode1.NodeText);
    if (!this.selectedNode2) {
      return res;
    }
    res = res.concat(' > ', this.selectedNode2.NodeText);
    if (!this.selectedNode3) {
      return res;
    }
    res = res.concat(' > ', this.selectedNode3.NodeText);
    return res;
  }
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
    this.TecDocArticles = [];
    this.tecdocService = new TecdocService();
    this.tecdocService.setarticles(this.TecDocArticles);
  }

  getItemsByBrand() {
    this.itemService.getBrands().subscribe(data => {
      this.BrandList = data;

      this.BrandList = data;
      this.BrandListFiltredDataSource = this.BrandList.slice(0);

    });
  }

  handleBrandListFilter(value: string): void {
    this.BrandListFiltredDataSource = this.BrandList.slice(0);
    if (value) {
      this.BrandListFiltredDataSource = this.BrandList.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase()));
    }
  }

  handleBrandListChange(event) {
    this.selectedBrand = event;
    this.selectedBrandForSearch = event;
    let teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(0, 0, this.localStorageService, null, false, this.selectedBrand.Id, '', false, this.OemNumber);
    this.itemService.getTecDocItemsByBrand(teckDockWithWarehouseFilter).subscribe(data => {
      this.TecDocArticles = data;
      this.tecdocService.setarticles(this.TecDocArticles);

    });
  }
  handleBrandRefListChange(event) {
    this.selectedBrandForSearch = event;
    if (event) {
      this.TecDocArticlesfiltered = this.TecDocArticles.filter(x => x.Supplier === event);
    } else {
      this.TecDocArticlesfiltered = this.TecDocArticles.slice(NumberConstant.ZERO);
    }
    this.tecdocService.setarticles(this.TecDocArticlesfiltered);
    this.searchAdd();
  }

  handleBrandOemListChange(event) {
    let selectedSupplier = event;
    this.selectedBrandForSearch = event;
    if (selectedSupplier) {
      this.TecDocArticlesfiltered = this.TecDocArticles.filter(x => x.Supplier === selectedSupplier);
    } else {
      this.TecDocArticlesfiltered = this.TecDocArticles.slice(0);
    }
    this.tecdocService.setarticles(this.TecDocArticlesfiltered);
    this.searchAdd();
  }

  getItemsByVin() {
    this.showVin();
    this.getVehiclesByVin();
  }

  getVehiclesByVin() {
    let ws4 = WebServices._ws4;
    this.VehiculeList = ws4.cars;
  }

  selectGroup(event) {
    let ws2 = WebServices._ws2;
    this.subgrouplist = ws2.subgroupe.subgrps;
  }

  selectSubGroup(event) {
    let ws2 = WebServices._ws2;
    this.subgrouplist = ws2.subgroupe.subgrps;
  }

  selectVehicule(event) {
    this.selectedPC1 = true;
    let ws1 = WebServices._ws1;
    this.grouplist = Object.keys(ws1.group.groupe).map(i => ws1.group.groupe[i]);
  }

  HideVin() {
    this.showcombobox = false;
    this.selectedPC1 = false;
  }

  showVin() {
    this.showcombobox = true;
  }
  private loadItemsPicture(itemList: TecDocArticleModel[]) {
    var itemsPicturesUrls = [];
    itemList.forEach((item: TecDocArticleModel) => {
      if(item.ItemInDB && item.ItemInDB.UrlPicture){
      itemsPicturesUrls.push(item.ItemInDB.UrlPicture);
      }
    });
    if (itemsPicturesUrls.length > NumberConstant.ZERO) {
      this.itemService.getPictures(itemsPicturesUrls, false).subscribe(itemsPictures => {
        this.fillItemsPictures(itemList, itemsPictures);
      });
    }
  }

  private fillItemsPictures(itemList, itemsPictures) {
    itemList.map((item: TecDocArticleModel) => {
      if (item.ItemInDB &&  item.ItemInDB.UrlPicture) {
        let dataPicture = itemsPictures.objectData.find(value => value.FulPath === item.ItemInDB.UrlPicture);
        if (dataPicture) {
          item.Image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }

  searchAdd() {
    if (this.searchItemService.isFromSearchItem_supplierInetrface && this.searchItemService.idSupplier) {
        this.searchObject = new SearchItemSupplier();
        this.searchObject.Type = searchTypes.TEC_DOC;
        this.searchObject.Reference = this.reference;
        this.searchObject.Brand = this.selectedBrandFilter;
        this.searchObject.Manufacturer = this.selectedMFA ? this.selectedMFA.ManuName : null;
        this.searchObject.ModelSeries = this.selectedMS ? this.selectedMS.ModelName : null;
        this.searchObject.Car = this.selectedPC ? this.selectedPC.CarName : null;
        this.searchObject.Category = this.selectedRoot ? this.selectedRoot.NodeText : null;
        this.searchObject.SubCategory = this.selectedNode1 ? this.selectedNode1.NodeText : null;
        this.searchObject.Product = this.selectedproduct ? this.selectedproduct.Designation : null;
        this.searchObject.OemNumber = this.OemNumber;
        const serchRes = this.searchItemService.saveSearch(this.searchObject);
        this.searchItemService.addSearch(serchRes).subscribe(() => {});
    }
  }
  /**
   * Global search for tecdoc items 
   */
 getItemsByGlobalSearchEnter() {
  if (this.GlobalSearchValue && this.GlobalSearchValue.length > NumberConstant.THREE) {
  const supplierId = this.selectedRefBrand ? this.selectedRefBrand.Id : NumberConstant.ZERO;
    const teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(NumberConstant.ZERO, NumberConstant.ZERO,
      this.localStorageService, null, false, supplierId, null , false, null,this.GlobalSearchValue, this.isExactSearch,this.tecdocService.filterSearchItem);
      this.itemService.getArticlesByGlobalSearch(teckDockWithWarehouseFilter).subscribe(data => {
        data.forEach(element => {
          element.QuantityForDocumentLine = 1;
        });
        this.TecDocArticles = data;
  const SetSupplier = new Set(this.TecDocArticles.map(x => x.Supplier));
  SetSupplier.forEach(v => this.BrandList.push(v));
  this.BrandListFiltredDataSource = this.BrandList.slice(NumberConstant.ZERO);
  if (this.TecDocArticles) {
    this.TecDocArticles.forEach(product => {
      if (product.ItemInDB && this.searchItemService.isFromSearchItem_supplierInetrface && this.searchItemService.idSupplier) {
        product.ItemInDB.QuantityForDocumentLine = NumberConstant.ONE;
      }
      product.Image = MediaConstant.PLACEHOLDER_PICTURE;
    });
    this.loadItemsPicture(this.TecDocArticles);
  }
  this.tecdocService.setarticles(this.TecDocArticles);
  this.searchAdd();
});
}else {
  this.growlService.warningNotification(this.translate.instant('SEARCH_FIELD_LENGTH_REQUIRED'));
}
}

setEqualValue(){
  this.isExactSearch = !this.isExactSearch;
}
}
